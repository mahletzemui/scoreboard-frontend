import { bootstrapApplication } from '@angular/platform-browser';


import { ApplicationComponent } from './application/application.component';
import { applicationConfiguration } from './application/application.configuration';


/**
 * Starts the application.
 */
bootstrapApplication(ApplicationComponent, applicationConfiguration).catch(
    (err) => console.error(err)
);
