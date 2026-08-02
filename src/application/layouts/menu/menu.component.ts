import { filter, map } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';


import { createConfirmationMessage } from '../../constants/prompts';
import { createAccountSelector, createGameSelector } from '../../constants/queries';

import { ToolBox } from '../../utils';
import { DropdownComponent, MessageModalComponent } from '../../components';
import { AuthenticationService, LoaderService, ThemeService } from '../../services';


/**
 * Represents the application's menu.
 */
@Component({
    selector: 'app-menu',
    imports: [ DropdownComponent, MessageModalComponent ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.css'
})
export class MenuComponent implements AfterViewInit {
    // Fields ---------------------------------------------------------------------
    private loader = inject(LoaderService);
    private server = inject(AuthenticationService);
    preferredName = this.server.preferredName;

    private theme = inject(ThemeService);
    lightMode = computed(() => this.theme.theme() === 'light');

    private router = inject(Router);
    path = toSignal(
        this.router.events.pipe(
            filter((event): event is NavigationEnd => event instanceof NavigationEnd),
            map(event => event.urlAfterRedirects.split('/').filter(Boolean))
        ),
        { initialValue: this.router.url.split('/').filter(Boolean) }
    );

    opened = signal(false);

    gameSelector = computed(() => {
        const path = this.path();
        const inGames = path[0] === 'games';
        return {
            ...createGameSelector(),
            options: createGameSelector().options.map(option => {
                const active = inGames && path[1] === option.name;
                return {
                    ...option,
                    active,
                    additional: option.additional?.map(nested => ({ ...nested, active: active && path[2] === nested.name }))
                };
            })
        };
    });

    accountSelector = computed(() => {
        const path = this.path();
        return {
            ...createAccountSelector(),
            heading: this.preferredName(),
            options: createAccountSelector().options.map(option => ({ ...option, active: path[0] === option.name }))
        };
    });

    initial = computed(() => this.preferredName().charAt(0));
    
    showLogoutMessage = signal(false);
    logoutMessage = { ...createConfirmationMessage(), notice: "You're about to log out — you'll need your credentials to sign back in." };
    logoutUpdate = signal('');

    // Constructors ---------------------------------------------------------------

    /**
     * Initializes all the necessary elements of the DOM component.
     */
    async ngAfterViewInit(): Promise<void>
    {
        await new Promise<void>(resolve => setTimeout(resolve, 500));
        this.loader.setLoadedHeader(true);
    }

    // Methods --------------------------------------------------------------------

    /**
     * Toggles the current theme back and forth.
     */
    toggleTheme(): void
    {
        this.theme.toggleTheme();
    }

    /**
     * Updates the current URL path.
     *
     * @param event - Event with path(s) to update to.
     */
    onNavigate(event: string[]): void
    {
        if (event.includes('logout')) {
            this.logoutUpdate.set('');
            this.showLogoutMessage.set(true);
            return;
        }

        const basePath = event.length === 1 ? '' : '/games';
        const fullPath = basePath + event.map(item => '/' + item).join('');
        if (this.router.url !== fullPath) {
            this.router.navigate([fullPath]);
        }
        this.opened.set(false);
    }

    /**
     * Processes logout requests.
     */
    onLogout(): void
    {
        console.log('Logout: Initiated...');

        this.server.logout().subscribe({
            next: () => ToolBox.clearSession(),
            error: (error) => {
                const code = error.status;
                if (code === 401) {
                    ToolBox.clearSession();
                } else {
                    console.error(`Logout (cont.): Denied because of an unexpected error - '${code}': '${error.message}'.`);
                    this.logoutUpdate.set('An unexpected error occurred, try again later.');
                }
            }
        });
    }
}
