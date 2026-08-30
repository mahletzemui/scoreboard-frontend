import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';


import { BaseLayout } from '../../base-layout.directive';
import { GameRecapComponent } from '../game-recap.component';

import { Vault } from '../../../models/responses';
import { GAME_STORE, createPlayers } from '../../../constants/games';

import { LoaderService } from '../../../services';


/**
 * Represents the application's domino recap page.
 */
@Component({
    selector: 'app-domino-recap',
    imports: [ GameRecapComponent, DatePipe ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './domino-recap.component.html',
    styleUrl: '../game-recap.css'
})
export class DominoRecapComponent extends BaseLayout {
    // Fields ---------------------------------------------------------------------
    readonly gameId = GAME_STORE['domino'].id;

    paged = signal<Vault[]>([]);
    private resolveFetch?: () => void;
    highlights = computed(() => (this.paged() ?? []).map(item => ({ vault: item, players: createPlayers(this.gameId, item.scores) })));

    trigger = signal<'editGame'|'deleteGame'|undefined>(undefined);
    currentVault = signal<Vault|undefined>(undefined);

    // Constructors ---------------------------------------------------------------

    /**
     * Creates a new DominoRecapComponent object.
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
        return new Promise<void>(resolve => {
            this.resolveFetch = resolve;
        });
    }

    // Methods --------------------------------------------------------------------

    /**
     * Updates the list of displayed games.
     *
     * @param event - Event with vaults to update to.
     */
    onLoaded(event: Vault[]): void
    {
        this.paged.set(event);
        this.resolveFetch?.();
    }

    /**
     * Takes a particular game action.
     *
     * @param action - Action to trigger.
     * @param vault  - Vault to trigger it against.
     */
    takeAction(action: 'editGame'|'deleteGame', vault: Vault): void
    {
        this.currentVault.set(vault);
        this.trigger.set(action);
    }

    /**
     * Resets actions.
     */
    onDelivered(): void
    {
        this.trigger.set(undefined);
        this.currentVault.set(undefined);
    }
}
