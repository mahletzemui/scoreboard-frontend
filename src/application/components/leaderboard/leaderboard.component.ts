import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';


import { Player } from '../../models/games';
import { Slice } from '../../models/queries';

import { DonutChartComponent } from '../donut-chart/donut-chart.component';


/**
 * Represents a leaderboard entry.
 */
interface Rank { rank: number, player: Player }


/**
 * Displays the application's leaderboard.
 */
@Component({
    selector: 'app-leaderboard',
    imports: [ DonutChartComponent ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './leaderboard.component.html',
    styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent {
    // Fields ---------------------------------------------------------------------
    players = input.required<Player[]>();
    data = input<Record<string, Slice[]>>();

    ranked = computed<Rank[]>(() => this.rankPlayers(this.players()));
    expanded = signal<string|undefined>(undefined);

    // Methods --------------------------------------------------------------------

    /**
     * Toggles a player's expanded state.
     *
     * @param username - Username of player to toggle.
     */
    toggle(username: string): void
    {
        this.expanded.update(current => current === username ? undefined : username);
    }

    /**
     * Resolves a rank's medal class.
     *
     * @param rank - Rank to resolve for.
     *
     * @return the corresponding medal class.
     */
    medal(rank: number): 'gold'|'silver'|'bronze'|'default'
    {
        if (rank === 1) {
            return 'gold';
        }
        if (rank === 2) {
            return 'silver';
        }
        if (rank === 3) {
            return 'bronze';
        }
        return 'default';
    }

    // Helpers --------------------------------------------------------------------

    /**
     * Ranks the players by points.
     *
     * @param players - Players to rank.
     *
     * @return the corresponding ranked entries.
     */
    private rankPlayers(players: Player[]): Rank[]
    {
        const sorted = [ ...players ].sort((a, b) => b.points - a.points);

        let rank = 0;
        let previous: number|undefined = undefined;
        return sorted.map((player, index) => {
            if (player.points !== previous) {
                rank = index + 1;
                previous = player.points;
            }
            return { player, rank };
        });
    }
}
