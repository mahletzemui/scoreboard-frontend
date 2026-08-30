import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';


import { Scorecard } from '../../models/requests';
import { Form, Message } from '../../models/prompts';
import { createConfirmationMessage } from '../../constants/prompts';
import { GAME_GUIDES, GAME_PREVIEWS, GAME_STEPS, createOutcomeMessage } from '../../constants/games';

import { ToolBox, FormValidator } from '../../utils';
import { GameService, NoticeService } from '../../services';
import { FormModalComponent, MessageModalComponent, PlaybookModalComponent } from '../../components';


/**
 * Represents the application's general game play shell.
 */
@Component({
    selector: 'app-game-play',
    imports: [ FormModalComponent, MessageModalComponent, PlaybookModalComponent ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './game-play.component.html',
    styleUrl: './game-play.css'
})
export class GamePlayComponent {
    // Fields ---------------------------------------------------------------------
    id = input.required<string>();
    private server = inject(GameService);

    private router = inject(Router);
    game = computed(() => GAME_PREVIEWS[this.id()]);
    steps = computed(() => GAME_STEPS[this.id()] ?? []);
    guide = computed(() => GAME_GUIDES[this.game().title]);

    trigger = input<'verifyPlayer'|'removePlayer'|'submitGame'>();
    private notice = inject(NoticeService);

    players = input<string[]>([]);
    currentPlayer = input<number>();
    scores = input<Scorecard>([]);

    showSteps = signal(false);
    showPlaybook = signal(false);

    requestError = signal('');
    activeModal = signal<'add'|'verify'|'remove'|'submit'|undefined>(undefined);
    private pendingUsername = signal<string|undefined>(undefined);

    message = computed<Message>(() => {
        const step = this.activeModal();
        if (step === 'add') {
            return { ...createConfirmationMessage(), notice: `Adding <b>${this.pendingUsername()}</b> to the current game will adjust scores for the remaining players.` };
        }
        if (step === 'remove') {
            const name = this.players()[this.currentPlayer() ?? -1] ?? 'a player';
            return { ...createConfirmationMessage(), notice: `Removing <b>${name}</b> from the current game will adjust scores for the remaining players.` };
        }
        return { ...createConfirmationMessage(), notice: createOutcomeMessage(this.id(), this.scores()) };
    });

    delivered = output<string|undefined>();

    // Constructors ---------------------------------------------------------------

    /**
     * Creates a new GamePlayComponent object.
     */
    constructor()
    {
        effect(() => {
            const value = this.trigger();

            this.requestError.set('');
            if (value === 'verifyPlayer') {
                this.activeModal.set('verify');
            } else if (value === 'removePlayer') {
                this.activeModal.set('remove');
            } else if (value === 'submitGame') {
                this.activeModal.set('submit');
            } else {
                this.activeModal.set(undefined);
            }
        });
    }

    // Methods --------------------------------------------------------------------

    /**
     * Navigates to the game's recap page.
     */
    navigateToRecap(): void
    {
        this.router.navigate([ this.game().baseUrl + '/recap' ]);
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
     * Processes verify player requests.
     *
     * @param model - Form to submit.
     */
    onVerify(model: Form): void
    {
        console.log('Verify Player: Initiated...');
        const { username, pin } = model.intake.value;

        if (FormValidator.validatePlayer(username, this.currentPlayer() ?? -1, this.players())) {
            this.requestError.set('The player is already included in the game.');
            return;
        }

        this.server.verifyPlayer({ username, pin }).subscribe({
            next: () => {
                if (this.players().includes(username)) {
                    this.notice.showBanner(`Success! Player has been verified.`);
                    this.delivered.emit(username);
                    this.activeModal.set(undefined);
                } else {
                    this.pendingUsername.set(username);
                    this.activeModal.set('add');
                }
            },
            error: (error) => {
                const code = error.status;
                if (code === 401) {
                    ToolBox.clearSession();
                } else if (code === 403) {
                    this.requestError.set('The username and/or pin are incorrect.');
                } else {
                    this.requestError.set('An unexpected error occurred, try again later.');
                    console.error(`Verify Player (cont.): Denied because of an unexpected error - '${code}': '${error.message}'.`);
                }
            }
        });
    }

    /**
     * Processes confirmation requests.
     */
    onConfirm(): void
    {
        const modal = this.activeModal();
        if (modal === 'add') {
            this.notice.showBanner(`Success! Player has been added.`);
            this.delivered.emit(this.pendingUsername());
            this.activeModal.set(undefined);
        } else if (modal === 'remove') {
            this.notice.showBanner(`Success! Player has been removed.`);
            this.delivered.emit('remove');
            this.activeModal.set(undefined);
        } else {
            this.onSubmitGame();
        }
    }

    // Helpers --------------------------------------------------------------------

    /**
     * Processes submit game requests.
     */
    private onSubmitGame(): void
    {
        console.log('Submit Game: Initiated...');

        this.server.submitGame(this.id(), this.scores()).subscribe({
            next: () => {
                this.notice.showBanner('Success! Scores have been submitted.');
                this.delivered.emit('submitted');
                this.activeModal.set(undefined);
            },
            error: (error) => {
                const code = error.status;
                if (code === 401) {
                    ToolBox.clearSession();
                } else if (code === 406) {
                    this.requestError.set('Please verify all players once more before submitting.');
                } else {
                    this.requestError.set('An unexpected error occurred, try again later.');
                    console.error(`Submit Game (cont.): Denied because of an unexpected error - '${code}': '${error.message}'.`);
                }
            }
        });
    }
}
