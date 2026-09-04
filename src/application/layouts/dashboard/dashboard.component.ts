import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';


import { BaseLayout } from '../base-layout.directive';

import { Page } from '../../models/queries';
import { GAME_GUIDES, GAME_PREVIEWS } from '../../constants/games';

import { ToolBox } from '../../utils';
import { LoaderService } from '../../services';
import { FinderComponent, PaginatorComponent, PlaybookModalComponent } from '../../components';


/**
 * Represents the application's dashboard page.
 */
@Component({
    selector: 'app-dashboard',
    imports: [ FinderComponent, PaginatorComponent, PlaybookModalComponent ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent extends BaseLayout {
    // Fields ---------------------------------------------------------------------
    preferredName = localStorage.getItem('name')!;
    private router = inject(Router);

    selected?: string;
    playbooks = GAME_GUIDES;
    private terms = signal<string[]>([]);

    private searched = computed(() => {
        const terms = this.terms();
        return terms.length === 0 ? Object.values(GAME_PREVIEWS)
                                  : Object.values(GAME_PREVIEWS).filter(item => terms.some(term => item.title.toLowerCase().includes(term)));
    });

    total = computed(() => this.searched().length);

    readonly pageOptions = [ '2', '4', '8' ];
    private pageIndexSignal = signal(0);
    private pageSizeSignal = signal(ToolBox.parseNumber(this.pageOptions[0]));

    paged = computed(() => {
        const { start, end } = ToolBox.resolvePage(this.pageSizeSignal(), this.pageIndexSignal(), this.searched().length);
        return this.searched().slice(start, end);
    });

    // Constructors ---------------------------------------------------------------

    /**
     * Creates a new HomeComponent object with the given details.
     *
     * @param loader - Loading status handler.
     */
    constructor(loader: LoaderService)
    {
        super(loader);
    }

    // Methods --------------------------------------------------------------------

    /**
     * Updates the list of displayed games.
     *
     * @param event - Event with terms to update with.
     */
    onSearch(event: string[]): void
    {
        this.terms.set(event);
    }

    /**
     * Navigates to a game link.
     *
     * @param link - Link to navigate to.
     */
    navigateTo(link: string): void
    {
        this.router.navigate([link]);
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
    }
}
