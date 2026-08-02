import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';


import { BannerComponent } from './components';
import { MenuComponent } from './layouts/menu/menu.component';

import { LoaderService } from './services';


/**
 * Defines the root component of the application.
 */
@Component({
    selector: 'app-root',
    imports: [ RouterOutlet, BannerComponent, MenuComponent ],
    templateUrl: './application.component.html',
    styleUrl: './application.component.css'
})
export class ApplicationComponent implements OnInit {
    // Fields ---------------------------------------------------------------------
    loader = inject(LoaderService);
    
    bubbles = Array.from({ length: 10 });

    // Constructors ---------------------------------------------------------------

    /**
     * Initializes all the necessary elements of the component.
     */
    ngOnInit(): void
    {
        // this.router.events.subscribe(async event => {
        //     if (event instanceof NavigationStart) {
        //         this.loader.setLoadedContent(false);
        //     }
        //     if (event instanceof NavigationCancel) {
        //         await delay(500);
        //         this.loader.setLoadedContent(true);
        //     }
        // });
    }
}
