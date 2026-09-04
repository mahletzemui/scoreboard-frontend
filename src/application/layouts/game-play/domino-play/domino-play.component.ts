import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';


import { BaseLayout } from '../../base-layout.directive';
import { GamePlayComponent } from '../game-play.component';

import { Heat } from '../../../models/requests';
import { DominoRound } from '../../../models/games';
import { GAME_STORE } from '../../../constants/games';

import { LoaderService } from '../../../services';
import { DominoRoundModalComponent } from '../../../components';


/**
 * Represents the application's domino play page.
 */
@Component({
    selector: 'app-domino-play',
    imports: [ GamePlayComponent, DominoRoundModalComponent ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './domino-play.component.html',
    styleUrl: '../game-play.css'
})
export class DominoPlayComponent extends BaseLayout {
    // Fields ---------------------------------------------------------------------
    readonly gameId = GAME_STORE['domino'].id;

    action = signal<'verifyPlayer'|'removePlayer'|'submitGame'|undefined>(undefined);

    index = signal<number|undefined>(undefined);
    usernames = signal<string[]>([]);

    showActiveRound = signal(false);
    private roundsSignal = signal<DominoRound[][]>([]);
    readonly rounds = this.roundsSignal.asReadonly();

    activeRoundIndex = signal<number|undefined>(undefined);
    activeRoundData = computed<DominoRound[]|undefined>(() => {
        const index = this.activeRoundIndex();
        return index === undefined ? undefined : this.rounds()[index];
    });

    totals = computed<number[]>(() => {
        const rounds = this.rounds();
        const last = rounds[rounds.length - 1];
        return last ? last.map(item => item.total) : this.usernames().map(() => 0);
    });
    gameEnded = computed(() => this.totals().some(item => item >= 100));

    submission = computed<Heat[]>(() => this.rounds().map(item => ({
        matches: this.usernames().map((entry, i) => ({ username: entry, score: item[i].total })),
        special: item[0]?.special
    })));

    submissionError = computed(() => {
        if (this.usernames().length < 3) {
            return 'At least 3 players are required per game.';
        }
        if (!this.gameEnded()) {
            return 'Add rounds until a player reaches 100 points.';
        }
        return '';
    });

    // Constructors ---------------------------------------------------------------

    /**
     * Creates a new DominoPlayComponent object.
     *
     * @param loader - Loading status handler.
     */
    constructor(loader: LoaderService)
    {
        super(loader);
    }

    // Methods --------------------------------------------------------------------

    /**
     * Takes the particular game action.
     *
     * @param type - Action to take.
     * @param i    - Index of player/round, if needed.
     */
    takeAction(type: 'verifyPlayer'|'updateRound'|'removePlayer'|'submitGame', i?: number): void
    {
        if (type === 'updateRound') {
            this.activeRoundIndex.set(i);
            this.showActiveRound.set(true);
        } else {
            this.index.set(i);
            this.action.set(type);
        }
    }

    /**
     * Closes the round modal.
     */
    closeActiveRound(): void
    {
        this.showActiveRound.set(false);
        this.activeRoundIndex.set(undefined);
    }

    /**
     * Updates a round's scores.
     *
     * @param event - Event with round details.
     * 
     * @note that an empty round means a removal.
     */
    onUpdateRound(event: DominoRound[]): void
    {
        const activeIndex = this.activeRoundIndex();
        if (event.length === 0) {
            this.roundsSignal.update(current => this.recalculateTotals(current.filter((_, i) => i !== activeIndex)));
            this.closeActiveRound();
            return;
        }

        const round = event.map(item => ({ ...item, total: 0 }));
        this.roundsSignal.update(current => {
            const updated = activeIndex === undefined ? [ ...current, round ]
                                                      : current.map((item, i) => i === activeIndex ? round : item);
            return this.recalculateTotals(updated);
        });
        this.closeActiveRound();
    }

    /**
     * Retrieves a player's share of points in a round.
     *
     * @param round - Round to retrieve for.
     * @param i     - Index of player to retrieve for.
     *
     * @return the corresponding share.
     */
    roundShare(round: DominoRound[], i: number): number
    {
        const gain = round[i].gain;
        if (gain <= 0) {
            return 0;
        }

        const winners = round.filter(item => item.gain > 0).length;
        return Math.floor(gain / winners);
    }

    /**
     * Updates the game's state.
     *
     * @param event - Event with username, if provided.
     *
     * @note that a string represents a successful player verification; when no
     * player is currently selected, it's appended as a new player instead of
     * replacing an existing one.
     */
    onDelivered(event?: string): void
    {
        const index = this.index();
        if (event === 'remove') {
            this.usernames.update(current => current.filter((_, i) => i !== index));
            this.roundsSignal.set([]);
        } else if (event === 'submitted') {
            this.usernames.set([]);
            this.roundsSignal.set([]);
        } else if (event && index !== undefined) {
            this.usernames.update(current => current.map((item, i) => i === index ? event : item));
        } else if (event) {
            this.usernames.update(current => [ ...current, event ]);
        }

        this.action.set(undefined);
    }

    // Helpers --------------------------------------------------------------------

    /**
     * Recalculates each round's running total, capping every player at 100 points.
     *
     * @param rounds - Rounds to recalculate for.
     *
     * @return the corresponding rounds.
     */
    private recalculateTotals(rounds: DominoRound[][]): DominoRound[][]
    {
        const running = this.usernames().map(() => 0);
        return rounds.map(item => item.map((entry, i) => {
            running[i] = Math.min(running[i] + this.roundShare(item, i), 100);
            return { ...entry, total: running[i] };
        }));
    }
}
