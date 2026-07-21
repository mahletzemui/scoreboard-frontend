import { TestBed } from '@angular/core/testing';


import { ThemeService } from './theme.service';


/**
 * Tests the ThemeService class.
 */
describe('ThemeService', () => {
    // Fields ---------------------------------------------------------------------
    let service: ThemeService;

    // Setup ----------------------------------------------------------------------

    beforeEach(() =>
    {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ThemeService);

        localStorage.clear();
        vi.spyOn(Storage.prototype, 'setItem');
        vi.spyOn(document.documentElement, 'setAttribute');
    });

    // Tests ----------------------------------------------------------------------

    it('should create service', () =>
    {
        expect(service).toBeTruthy();
        expect(service.theme()).toBe('light');
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);
        expect(document.documentElement.setAttribute).toHaveBeenCalledTimes(0);
    });


    it('should initialize the theme to light mode', () =>
    {
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('light');
        service.init();

        expect(service.theme()).toBe('light');
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
        expect(document.documentElement.setAttribute).toHaveBeenCalledTimes(1);
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');

        service.toggleTheme();
        expect(service.theme()).toBe('dark');
        expect(localStorage.setItem).toHaveBeenCalledTimes(2);
        expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
        expect(document.documentElement.setAttribute).toHaveBeenCalledTimes(2);
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    });


    it('should initialize the theme to dark mode', () =>
    {
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('dark');
        service.init();

        expect(service.theme()).toBe('dark');
        expect(localStorage.setItem).not.toHaveBeenCalled();
        expect(document.documentElement.setAttribute).toHaveBeenCalledTimes(1);
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');

        service.toggleTheme();
        expect(service.theme()).toBe('light');
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
        expect(document.documentElement.setAttribute).toHaveBeenCalledTimes(2);
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
    });


    it('should default the theme to light mode', () =>
    {
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
        service.init();

        expect(service.theme()).toBe('light');
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
        expect(document.documentElement.setAttribute).toHaveBeenCalledTimes(1);
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');

        service.toggleTheme();
        expect(service.theme()).toBe('dark');
        expect(localStorage.setItem).toHaveBeenCalledTimes(2);
        expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
        expect(document.documentElement.setAttribute).toHaveBeenCalledTimes(2);
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    });
});
