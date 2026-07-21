import { Injectable, signal } from '@angular/core';


/**
 * Manages the application's light/dark theme.
 */
@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    // Fields ---------------------------------------------------------------------
    private themeSignal = signal<'light'|'dark'>('light');
    readonly theme = this.themeSignal.asReadonly();

    // Methods --------------------------------------------------------------------

    /**
     * Initializes the current theme.
     */
    init(): void
    {
        const stored = localStorage.getItem('theme');
        if (stored === 'dark') {
            this.setTheme(stored, false);
        } else {
            this.setTheme('light', true);
        }
    }

    /**
     * Toggles the current theme back and forth.
     */
    toggleTheme(): void
    {
        const newTheme = this.themeSignal() === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme, true);
    }

    // Helpers --------------------------------------------------------------------

    /**
     * Sets the current theme.
     *
     * @param value - Theme to set to.
     * @param save  - Flag to persist theme.
     */
    private setTheme(value: 'light'|'dark', save: boolean): void
    {
        this.themeSignal.set(value);
        document.documentElement.setAttribute('data-theme', value);

        if (save) {
            localStorage.setItem('theme', value);
        }
    }
}
