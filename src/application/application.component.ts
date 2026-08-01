import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';


import { BannerComponent } from './components';


/**
 * Defines the root component of the application.
 */
@Component({
    selector: 'app-root',
    imports: [ CommonModule, RouterOutlet, BannerComponent ],
    templateUrl: './application.component.html',
    styleUrl: './application.component.css'
})
export class ApplicationComponent implements OnInit {
    // Fields ---------------------------------------------------------------------
    bubbles = Array.from({ length: 10 });

    // Constructors ---------------------------------------------------------------

    /**
     * Creates a new ApplicationComponent object.
     *
     * @param loader - Loading status handler.
     * @param router - Routing handler.
     */
    // constructor(public loader: LoaderService, private router: Router) { }

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
