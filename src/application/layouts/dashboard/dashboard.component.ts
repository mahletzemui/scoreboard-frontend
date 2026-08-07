import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';


import { BaseLayout } from '../base-layout.directive';

import { Teaser } from '../../models/games';
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
    preferredName: string;
    private router = inject(Router);

    private searchedSignal = signal<Teaser[]>(Object.values(GAME_PREVIEWS));
    readonly searched = this.searchedSignal.asReadonly();

    selected?: string;
    playbooks = GAME_GUIDES;

    pageOptions = [ '2', '4', '8' ];
    private pageIndexSignal = signal(0);
    private pageSizeSignal = signal(ToolBox.parseNumber(this.pageOptions[0]));

    paged = computed(() => {
        const { start, end } = ToolBox.resolvePage(this.pageSizeSignal(), this.pageIndexSignal(), this.searchedSignal().length);
        return this.searchedSignal().slice(start, end);
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
        this.preferredName = localStorage.getItem('name')!;
    }

    // Methods --------------------------------------------------------------------

    /**
     * Updates the list of displayed games.
     *
     * @param event - Terms to update with.
     */
    onSearch(event: string[]): void
    {
        this.searchedSignal.set(event.length !== 0 ? Object.values(GAME_PREVIEWS).filter(item => event.some(term => item.title.toLowerCase().includes(term)))
                                                   : Object.values(GAME_PREVIEWS));
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
     * @param event - Page to update to.
     */
    onPage(event: Page): void
    {
        this.pageSizeSignal.set(event.size);
        this.pageIndexSignal.set(event.index);
    }
}
