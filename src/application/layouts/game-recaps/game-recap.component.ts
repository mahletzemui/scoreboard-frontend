import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';


import { Vault } from '../../models/responses';
import { Scorecard } from '../../models/requests';
import { GAME_GUIDES, GAME_LABELS, GAME_PREVIEWS, createOutcomeMessage, createPlayers } from '../../constants/games';
import { Message } from '../../models/prompts';
import { createConfirmationMessage } from '../../constants/prompts';
import { Filter, Page, Slice } from '../../models/queries';
import { createGameFilter } from '../../constants/queries';

import { ToolBox } from '../../utils';
import { GameService, NoticeService } from '../../services';
import { DonutChartComponent, FinderComponent, MessageModalComponent, PaginatorComponent, PlaybookModalComponent } from '../../components';


/**
 * Represents the application's general game recap shell.
 */
@Component({
    selector: 'app-game-recap',
    imports: [ DonutChartComponent, FinderComponent, MessageModalComponent, PaginatorComponent, PlaybookModalComponent ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './game-recap.component.html',
    styleUrl: './game-recap.css'
})
export class GameRecapComponent {
    // Fields ---------------------------------------------------------------------
    id = input.required<string>();
    private server = inject(GameService);

    private router = inject(Router);
    game = computed(() => GAME_PREVIEWS[this.id()]);
    guide = computed(() => GAME_GUIDES[this.game().title]);

    showPlaybook = signal(false);
    private username = localStorage.getItem('username')!;
    filters = computed(() => createGameFilter(this.id()));

    generalError = signal('');
    overview = signal<Vault[]>([]);

    total = computed(() => this.filtered().length);

    chartData = computed<Slice[]>(() => {
        const counts = new Map<string, number>();
        this.filtered().forEach(vault => counts.set(vault.standing, (counts.get(vault.standing) ?? 0) + 1));
        return (GAME_LABELS[this.id()]).filter(item => (counts.get(item.label) ?? 0) > 0)
                                       .map(item => ToolBox.createPartialSlice(item.label, counts.get(item.label)!, item.value));
    });

    private terms = signal<string[]>([]);
    private criteria = signal<Filter[]>([]);

    private searched = computed(() => {
        const terms = this.terms();
        if (terms.length === 0) {
            return this.overview();
        }

        const gameId = this.id();
        return this.overview().filter(item => {
            const usernames = createPlayers(gameId, item.scores).map(player => player.username);
            return terms.some(term => item.organiser.toLowerCase().includes(term) || usernames.some(entry => entry.toLowerCase().includes(term)));
        });
    });

    private filtered = computed(() => {
        const criteria = this.criteria();
        return criteria.length === 0 ? this.searched()
                                     : this.searched().filter(item => criteria.every(filter => this.matchesFilter(item, filter)));
    });

    readonly pageOptions = [ '5', '10', '15' ];
    private pageIndexSignal = signal(0);
    private pageSizeSignal = signal(ToolBox.parseNumber(this.pageOptions[0]));

    private notice = inject(NoticeService);
    trigger = input<'editGame'|'deleteGame'>();
    currentVault = input<Vault>();

    requestError = signal('');
    activeModal = signal<'edit'|'delete'|undefined>(undefined);
    message = computed<Message>(() => {
        const vault = this.currentVault();
        const notice = vault ? createOutcomeMessage(this.id(), vault.scores) : '';
        return { ...createConfirmationMessage(), notice };
    });

    loaded = output<Vault[]>();
    delivered = output<string|undefined>();

    // Constructors ---------------------------------------------------------------

    constructor()
    {
        effect(() => {
            const id = this.id();
            console.log('Fetch Games: Initiated...');

            this.server.fetchGames(id).subscribe({
                next: (response) => {
                    if (!response.body) {
                        this.overview.set([]);
                        this.generalError.set('An unexpected error occurred. Please try again later.');
                        console.error('Fetch Games (cont.): Details are not present despite a successful response.');
                    } else {
                        this.overview.set(response.body);
                    }
                    this.reloadPage();
                },
                error: (error) => {
                    const code = error.status;
                    if (code === 401) {
                        ToolBox.clearSession();
                    } else {
                        this.overview.set([]);
                        this.generalError.set('An unexpected error occurred. Please try again later.');
                        console.error(`Fetch Games (cont.): Denied because of an unexpected error - '${code}': '${error.message}'.`);
                        this.reloadPage();
                    }
                }
            });
        });

        effect(() => {
            const value = this.trigger();

            this.requestError.set('');
            if (value === 'editGame') {
                this.activeModal.set('edit');
            } else if (value === 'deleteGame') {
                this.activeModal.set('delete');
            } else {
                this.activeModal.set(undefined);
            }
        });
    }

    // Methods --------------------------------------------------------------------

    /**
     * Navigates to the game's play page.
     */
    navigateToPlay(): void
    {
        this.router.navigate([ this.game().baseUrl + '/play' ]);
    }

    /**
     * Updates the list of displayed games.
     *
     * @param event - Event with terms to update with.
     */
    onSearch(event: string[]): void
    {
        this.terms.set(event);
        this.reloadPage();
    }

    /**
     * Updates the list of displayed games.
     *
     * @param event - Event with criteria to update with.
     */
    onFilter(event: Filter[]): void
    {
        this.criteria.set(event);
        this.reloadPage();
    }

    /**
     * Updates the current page.
     *
     * @param event - Event with page to update to.
     */
    onPage(event: Page): void
    {
        this.pageSizeSignal.set(event.size);
        this.pageIndexSignal.set(event.index);
        this.reloadPage();
    }

    /**
     * Closes the active modal.
     */
    onCloseModal(): void
    {
        this.activeModal.set(undefined);
        this.delivered.emit(undefined);
    }

    /**
     * Processes edit game requests.
     *
     * @param event - Event with scores to update to.
     */
    onEditGame(event: Scorecard): void
    {
        // TODO: Game Update - Get back to this after backend implementation
        console.log('Edit Game: Initiated...');
        this.delivered.emit('edited');
        this.activeModal.set(undefined);
    }

    /**
     * Processes game deletion requests.
     */
    onDeleteGame(): void
    {
        console.log('Delete Game: Initiated...');
        const entryId = this.currentVault()?.id ?? -1;

        this.server.requestGameDeletion(entryId).subscribe({
            next: () => {
                this.notice.showBanner('Success! Request to delete game has been submitted.');
                this.delivered.emit('deleted');
                this.activeModal.set(undefined);
            },
            error: (error) => {
                const code = error.status;
                if (code === 401) {
                    ToolBox.clearSession();
                } else if (code === 406) {
                    // TODO : Find all other types of errors
                } else {
                    this.notice.showBanner('An unexpected error occurred, try again later.');
                    console.error(`Delete Game (cont.): Denied because of an unexpected error - '${code}': '${error.message}'.`);
                }
            }
        });
    }

    // Helpers --------------------------------------------------------------------

    /**
     * Checks whether a game matches the filter.
     *
     * @param vault  - Game to check.
     * @param filter - Filter to check against.
     *
     * @return true if it matches, else false.
     */
    private matchesFilter(vault: Vault, filter: Filter): boolean
    {
        if (filter.type === 'check') {
            const active = filter.options.filter(item => item.active);
            if (active.length === 0) {
                return true;
            }

            if (filter.heading === 'Organizer') {
                const isOrganiser = vault.organiser === this.username;
                return active.some(item => (item.name === 'yes') === isOrganiser);
            }

            const label = vault.standing.toLowerCase().replace(/\s+/g, '-');
            return active.some(item => item.name === label);
        }

        const played = new Date(vault.played).getTime();
        if (filter.startDate && played < filter.startDate) {
            return false;
        }
        if (filter.endDate && played > filter.endDate) {
            return false;
        }
        return true;
    }

    /**
     * Emits the displayed games.
     */
    private reloadPage(): void
    {
        const { start, end } = ToolBox.resolvePage(this.pageSizeSignal(), this.pageIndexSignal(), this.filtered().length);
        this.loaded.emit(this.filtered().slice(start, end));
    }
}
