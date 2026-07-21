import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';


import { ThemeService } from './services/theme/theme.service';
import { requestInterceptor } from './services/interceptors/request.interceptor';

import { routes } from './application.routes';
const scrollConfiguration = withInMemoryScrolling({ scrollPositionRestoration: 'enabled' });


/**
 * Sets up the application's configurations.
 */
export const applicationConfiguration: ApplicationConfig = {
    providers: [
        provideZonelessChangeDetection(),
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes, scrollConfiguration),
        provideAppInitializer(() => inject(ThemeService).init()),
        provideHttpClient(withInterceptors([requestInterceptor]))
    ]
};
