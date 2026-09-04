import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';


import { BaseLayout } from '../../base-layout.directive';
import { GamePlayComponent } from '../game-play.component';

import { Entry } from '../../../models/prompts';
import { Match } from '../../../models/requests';
import { Selector } from '../../../models/queries';
import { GAME_STORE } from '../../../constants/games';
import { createGameLabelSelector } from '../../../constants/queries';

import { ToolBox } from '../../../utils';
import { LoaderService } from '../../../services';
import { DropdownComponent } from '../../../components';


/**
 * Represents the application's connect4 play page.
 */
@Component({
    selector: 'app-connect4-play',
    imports: [ GamePlayComponent, DropdownComponent ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './connect4-play.component.html',
    styleUrl: '../game-play.css'
})
export class Connect4PlayComponent extends BaseLayout {
    // Fields ---------------------------------------------------------------------
    readonly gameId = GAME_STORE['connect4'].id;

    action = signal<'verifyPlayer'|'removePlayer'|'submitGame'|undefined>(undefined);
    
    index = signal<number|undefined>(undefined);
    usernames = signal<string[]>([ '', '' ]);
    
    private statuses = signal<Entry[]>([ { label: '', value: [] }, { label: '', value: [] } ]);
    statusSelectors = computed<Selector[]>(() => this.statuses().map(item => {
        const selector = createGameLabelSelector(this.gameId);
        selector.options.forEach(otherItem => otherItem.active = otherItem.name === item.value[0]);
        return selector;
    }));

    submission = computed<Match[]>(() => this.usernames().map((username, i) => ({ username, score: this.statuses()[i].label })));
    submissionError = computed(() => {
        if (this.usernames().some(item => item === '')) {
            return 'Two unique players are required per game.';
        }
        if (this.statuses().some(item => item.value.length === 0)) {
            return 'A winning status needs to be selected.';
        }
        return '';
    });

    // Constructors ---------------------------------------------------------------

    /**
     * Creates a new Connect4PlayComponent object.
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
     * @param i    - Index of player, if needed.
     */
    takeAction(type: 'verifyPlayer'|'removePlayer'|'submitGame', i?: number): void
    {
        this.index.set(i);
        this.action.set(type);
    }

    /**
     * Updates the status of the player.
     *
     * @param event - Event with status to update to.
     * @param index - Index of player to update.
     */
    onStatusChange(event: string[], i: number): void
    {
        this.statuses.update(current => ToolBox.mapScoreLabels(event[0] ?? '', i, current));
    }

    /**
     * Updates the game's state.
     *
     * @param event - Event with username, if provided.
     *
     * @note that:
     * - 'remove' represents a player removal action to take,
     * - 'submitted' represents a successful score submission,
     * - other strings represent a successful player verification.
     */
    onDelivered(event?: string): void
    {
        const index = this.index();
        if (event === 'remove') {
            this.usernames.update(current => current.map((item, i) => i === index ? '' : item));
        } else if (event === 'submitted') {
            this.statuses.update(current => current.map(() => ({ label: '', value: [] })));
        } else if (event) {
            this.usernames.update(current => current.map((item, i) => i === index ? event : item));
        } 

        this.action.set(undefined);
    }
}
