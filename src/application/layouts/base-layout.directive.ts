import { AfterViewInit, Directive } from '@angular/core';


import { LoaderService } from '../services';


/**
 * Defines shared layout behaviors for the application's pages.
 */
@Directive()
export abstract class BaseLayout implements AfterViewInit {
    // Constructors ---------------------------------------------------------------
    
    /**
     * Creates a new BaseLayout object.
     * 
     * @param loader - Loading status handler.
     */
    constructor(protected loader: LoaderService) { }

    /**
     * Initializes all the necessary elements of the DOM component.
     */
    ngAfterViewInit(): void
    {
        this.resolveLayout();
    }

    // Methods --------------------------------------------------------------------

    /**
     * Resolves the layout.
     */
    private async resolveLayout(): Promise<void>
    {
        await this.prepareLayout();
        await new Promise<void>(resolve => setTimeout(resolve, 1000));
        this.loader.setLoadedContent(true);
    }

    /**
     * Performs specific preparations before resolving the layout.
     */
    protected prepareLayout(): void|Promise<void> {}
}
