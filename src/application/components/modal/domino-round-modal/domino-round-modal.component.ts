import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';


import { DominoRound } from '../../../models/games';

import { ToolBox } from '../../../utils';
import { ModalComponent } from '../modal.component';


/**
 * Displays the application's domino round modal.
 */
@Component({
    selector: 'app-domino-round-modal',
    imports: [ ModalComponent ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './domino-round-modal.component.html',
    styleUrl: '../modal.css'
})
export class DominoRoundModalComponent {
    // Fields ---------------------------------------------------------------------
    index = input.required<number>();
    players = input.required<string[]>();

    data = input<DominoRound[]>();

    private earnedSignal = signal(0);
    readonly earned = this.earnedSignal.asReadonly();

    private winnersSignal = signal<boolean[]>([]);
    readonly winners = this.winnersSignal.asReadonly();

    private doubleZeroSignal = signal(false);
    readonly doubleZero = this.doubleZeroSignal.asReadonly();

    roundError = computed(() => {
        const earned = this.earnedSignal();
        if (earned < 3 || earned > 100) {
            return 'Please enter valid points for this round.';
        }
        if (this.winnersSignal().every(item => !item)) {
            return this.doubleZeroSignal() ? 'Please select a winner to award the points.'
                                           : 'Please select at least one winner to award the points.';
        }
        return undefined;
    });

    closed = output<void>();
    submitted = output<DominoRound[]>();

    // Constructors ---------------------------------------------------------------

    /**
     * Creates a new DominoRoundModalComponent object.
     */
    constructor()
    {
        effect(() => {
            const players = this.players();
            const scores = this.data() ?? [];

            this.winnersSignal.set(players.map(() => false));
            this.earnedSignal.set(0);
            this.doubleZeroSignal.set(false);

            scores.forEach((item, i) => {
                if (item.gain !== 0) {
                    this.earnedSignal.set(item.gain);
                    this.winnersSignal.update(current => current.map((item, j) => j === i ? true : item));
                    this.doubleZeroSignal.set(item.special);
                }
            });
        });
    }

    // Methods --------------------------------------------------------------------

    /**
     * Toggles the win type.
     */
    toggleWinType(): void
    {
        const doubleZero = !this.doubleZeroSignal();
        this.doubleZeroSignal.set(doubleZero);
        this.earnedSignal.set(doubleZero ? 100 : 0);
        this.winnersSignal.set(this.winnersSignal().map(() => false));
    }

    /**
     * Updates the number of points as needed.
     *
     * @param event - Event with input to update to.
     */
    updatePoints(event: Event): void
    {
        if (!this.doubleZeroSignal()) {
            this.earnedSignal.set(ToolBox.parseNumber((event.target as HTMLInputElement).value));
        }
    }

    /**
     * Toggles the winning player.
     *
     * @param index - Index of winner to toggle.
     */
    toggleWinner(index: number): void
    {
        if (this.doubleZeroSignal()) {
            this.winnersSignal.set(this.winnersSignal().map((item, i) => i === index ? !item : false));
        } else {
            this.winnersSignal.update(current => current.map((item, i) => i === index ? !item : item));
        }
    }

    /**
     * Finalizes round scores.
     *
     * @param save - Flag to persist scores.
     */
    finalize(save: boolean): void
    {
        if (save) {
            const scores = this.winnersSignal().map(item => ({ gain: item ? this.earnedSignal() : 0, total: 0, special: this.doubleZeroSignal() }));
            this.submitted.emit(scores);
        } else {
            this.submitted.emit([]);
        }
    }
}
