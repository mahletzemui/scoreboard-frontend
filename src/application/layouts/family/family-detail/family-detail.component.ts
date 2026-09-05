import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';


import { BaseLayout } from '../../base-layout.directive';

import { Player } from '../../../models/games';
import { Group, Standing } from '../../../models/responses';
import { Form } from '../../../models/prompts';
import { Slice } from '../../../models/queries';
import { createGamePicker } from '../../../constants/queries';
import { GAME_LABELS, GAME_POINTS } from '../../../constants/games';

import { ToolBox } from '../../../utils';
import { GroupService, LoaderService, NoticeService } from '../../../services';
import { DropdownComponent, FormModalComponent, LeaderboardComponent } from '../../../components';


/**
 * Represents the application's family detail page.
 */
@Component({
    selector: 'app-family-detail',
    imports: [ DropdownComponent, FormModalComponent, LeaderboardComponent ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './family-detail.component.html',
    styleUrl: './family-detail.component.css'
})
export class FamilyDetailComponent extends BaseLayout {
    // Fields ---------------------------------------------------------------------
    private route = inject(ActivatedRoute);
    private id = Number(this.route.snapshot.paramMap.get('id'));

    private server = inject(GroupService);
    username = localStorage.getItem('username')!;

    generalError = signal('');
    family = signal<Group|undefined>(undefined);

    gamePicker = computed(() => createGamePicker());
    selectedGame = signal<string|undefined>(undefined);
    
    standings = signal<Standing[]>([]);
    members = computed<Player[]>(() => {
        const gameId = this.selectedGame();
        return gameId ? this.standings().map(item => this.buildPlayer(gameId, item)) : [];
    });

    chartData = computed<Record<string, Slice[]>|undefined>(() => {
        const gameId = this.selectedGame();
        if (!gameId) {
            return undefined;
        }
        const labels = GAME_LABELS[gameId] ?? [];
        return Object.fromEntries(this.standings().map(item => [ item.player, this.buildSlices(item.standings, labels) ]));
    });

    private notice = inject(NoticeService);
    showEdit = signal(false);
    requestError = signal('');

    // Constructors ---------------------------------------------------------------

    /**
     * Creates a new FamilyDetailComponent object.
     *
     * @param loader - Loading status handler.
     */
    constructor(loader: LoaderService)
    {
        super(loader);
    }

    /**
     * Initializes all the necessary elements of the DOM component.
     */
    protected override prepareLayout(): Promise<void>
    {
        console.log(`Fetch Group ${this.id}: Initiated...`);

        return new Promise<void>(resolve => {
            this.server.fetchGroup(this.id).subscribe({
                next: (response) => {
                    const match = response.body;
                    if (!match) {
                        this.generalError.set('An unexpected error occurred. Please try again later.');
                        console.error(`Fetch Group ${this.id} (cont.): Details are not present despite a successful response.`);
                    } else {
                        this.family.set(match);
                    }
                    resolve();
                },
                error: (error) => {
                    const code = error.status;
                    if (code === 401) {
                        ToolBox.clearSession();
                    } else if (code === 406) {
                        // TODO : Find all other types of errors
                    } else {
                        this.generalError.set('An unexpected error occurred, try again later.');
                        console.error(`Fetch Group ${this.id} (cont.): Denied because of an unexpected error - '${code}': '${error.message}'.`);
                    }
                    resolve();
                }
            });
        });
    }

    // Methods --------------------------------------------------------------------

    /**
     * Opens the update family modal.
     */
    onEdit(): void
    {
        this.requestError.set('');
        this.showEdit.set(true);
    }

    /**
     * Processes standing requests for a game.
     *
     * @param event - Event with the selected game.
     */
    onGameSelection(event: string[]): void
    {
        const gameId = event[0];
        this.selectedGame.set(gameId);
        console.log(`Fetch Standings: Initiated...`);

        this.standings.set([]);
        this.server.fetchStandings(this.id, gameId).subscribe({
            next: (response) => {
                if (!response.body) {
                    this.generalError.set('An unexpected error occurred. Please try again later.');
                    console.error(`Fetch Group ${this.id} (cont.): Details are not present despite a successful response.`);
                } else {
                    this.standings.set(response.body);
                }
            },
            error: (error) => {
                const code = error.status;
                if (code === 401) {
                    ToolBox.clearSession();
                } else if (code === 406) {
                    // TODO : Find all other types of errors
                } else {
                    this.generalError.set('An unexpected error occurred, try again later.');
                    console.error(`Fetch Standings (cont.): Denied because of an unexpected error - '${code}': '${error.message}'.`);
                }
            }
        });
    }

    /**
     * Processes update group requests.
     *
     * @param event - Event with form to submit.
     */
    onUpdateGroup(event: Form): void
    {
        const { name, description } = event.intake.value;
        console.log(`Update Group ${this.id}: Initiated...`);

        this.server.updateGroup(this.id, { name, description }).subscribe({
            next: () => {
                this.family.update(current => ({ ...current!, name, description }));
                this.notice.showBanner('Success! Family has been updated.');
                this.showEdit.set(false);
            },
            error: (error) => {
                const code = error.status;
                if (code === 401) {
                    ToolBox.clearSession();
                } else if (code === 406) {
                        // TODO : Find all other types of errors
                } else if (code === 409) {
                    this.requestError.set('A family with that name already exists.');
                } else {
                    this.requestError.set('An unexpected error occurred, try again later.');
                    console.error(`Update Group ${this.id} (cont.): Denied because of an unexpected error - '${code}': '${error.message}'.`);
                }
            }
        });
    }

    // Helpers --------------------------------------------------------------------

    /**
     * Builds a player from their standings.
     *
     * @param gameId - Id of game to build for.
     * @param entry  - Standing to build from.
     *
     * @return the corresponding player.
     */
    private buildPlayer(gameId: string, entry: Standing): Player
    {
        const points = entry.standings.reduce((total, item) => total + (GAME_POINTS[gameId]?.[item] ?? 0), 0);
        // const summary = total === 0 ? 'No games played yet.' : `Won ${wins} of ${total} game${total === 1 ? '' : 's'} played.`;
        return { username: entry.player, points, summaries: [] };
    }

    /**
     * Builds chart slices from a player's standings.
     *
     * @param standings - Standings to tally.
     * @param labels    - Outcome labels to distribute across.
     *
     * @return the corresponding chart slices.
     */
    private buildSlices(standings: string[], labels: { label: string, value: string }[]): Slice[]
    {
        const counts: Record<string, number> = {};
        standings.forEach(item => counts[item] = (counts[item] ?? 0) + 1);
        return labels.map(item => ToolBox.createPartialSlice(item.label, counts[item.label] ?? 0, item.value));
    }
}
