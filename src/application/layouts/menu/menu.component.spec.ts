import { Subject, of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { NavigationEnd, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';


import { MenuComponent } from './menu.component';
import { TestFactory } from '../../utils/test-factory';

import { ToolBox } from '../../utils';
import { AuthenticationService, LoaderService, ThemeService } from '../../services';


/**
 * Tests the MenuComponent class.
 */
describe('MenuComponent', () => {
    // Fields ---------------------------------------------------------------------
    let dom: HTMLElement;

    let component: MenuComponent;
    let fixture: ComponentFixture<MenuComponent>;

    let routerSpy: Router;
    let serverSpy: AuthenticationService;

    // Setup ----------------------------------------------------------------------

    beforeEach(async () =>
    {
        await TestBed.configureTestingModule({ imports: [MenuComponent] }).compileComponents();
        routerSpy = TestBed.inject(Router);
        serverSpy = TestBed.inject(AuthenticationService);

        fixture = TestBed.createComponent(MenuComponent);
        component = fixture.componentInstance;
        
        dom = fixture.nativeElement;
        vi.spyOn(routerSpy, 'navigate').mockImplementation(item => {
            const url = (item as string[]).join('/');
            (routerSpy.events as Subject<any>).next(new NavigationEnd(1, url, url));
            return Promise.resolve(true);
        });
    });

    // Tests ----------------------------------------------------------------------

    describe('Without Authentication', () => {
        beforeEach(() =>
        {
            fixture.detectChanges();
        });

        // ------------------------------------------------------------------------

        it('should create component', () =>
        {
            expect(component).toBeTruthy();
            expect(component.preferredName()).toBeFalsy();
            expect(component.lightMode()).toBe(true);
            expect(component.path()).toEqual([]);
            expect(component.showLogoutMessage()).toBe(false);
            expect(component.logoutUpdate()).toBe('');

            expect(dom.querySelector('.logo img')?.getAttribute('src')).toContain('assets/logos/light_logo.svg');
            expect(dom.querySelector('.links')).toBeFalsy();
            expect(dom.querySelectorAll('app-dropdown').length).toBe(0);
            expect(dom.querySelector('.icon.theme')).toBeTruthy();
            expect(dom.querySelector('.icon.hamburger')).toBeFalsy();
            expect(dom.querySelector('app-message-modal')).toBeFalsy();
        });


        it('should mark header as loaded after view initialization', async () =>
        {
            const loaderSpy = TestBed.inject(LoaderService);
            vi.spyOn(loaderSpy, 'setLoadedHeader');
            vi.useFakeTimers();

            component.ngAfterViewInit();
            expect(loaderSpy.setLoadedHeader).not.toHaveBeenCalled();
            await vi.advanceTimersByTimeAsync(500);
            expect(loaderSpy.setLoadedHeader).toHaveBeenCalledTimes(1);
            expect(loaderSpy.setLoadedHeader).toHaveBeenCalledWith(true);

            vi.useRealTimers();
        });


        it('should toggle theme', () =>
        {
            const themeSpy = TestBed.inject(ThemeService);
            vi.spyOn(themeSpy, 'toggleTheme');
            expect(component.lightMode()).toBe(true);
            expect(dom.querySelector('#light-theme')).toBeTruthy();
            expect(dom.querySelector('#dark-theme')).toBeFalsy();

            (dom.querySelector('.icon.theme') as HTMLElement).click();
            fixture.detectChanges();
            expect(component.lightMode()).toBe(false);
            expect(themeSpy.toggleTheme).toHaveBeenCalledTimes(1);
            expect(dom.querySelector('.logo img')?.getAttribute('src')).toContain('assets/logos/dark_logo.svg');
            expect(dom.querySelector('#light-theme')).toBeFalsy();
            expect(dom.querySelector('#dark-theme')).toBeTruthy();
        });
    });


    describe('With Authentication', () => {
        beforeEach(() =>
        {
            serverSpy.setSession('John', 'johndoe');
            fixture.detectChanges();
        });

        // ------------------------------------------------------------------------

        it('should create component', () =>
        {
            expect(component).toBeTruthy();
            expect(component.preferredName()).toBe('John');
            expect(component.lightMode()).toBe(true);
            expect(component.path()).toEqual([]);
            expect(component.showLogoutMessage()).toBe(false);
            expect(component.logoutUpdate()).toBe('');

            expect(dom.querySelector('.logo img')?.getAttribute('src')).toContain('assets/logos/light_logo.svg');
            expect(dom.querySelector('.links')).toBeTruthy();
            expect(dom.querySelectorAll('.links > .item').length).toBe(4);
            expect(dom.querySelectorAll('app-dropdown').length).toBe(2);
            expect(dom.querySelector('.item.active')).toBeFalsy();
            expect(dom.querySelector('.icon.theme')).toBeTruthy();
            expect(dom.querySelector('.icon.hamburger')).toBeTruthy();
            expect(dom.querySelector('app-message-modal')).toBeFalsy();
        });


        it('should toggle the hamburger menu open and closed', () =>
        {
            (dom.querySelector('.icon.hamburger') as HTMLElement).click();
            fixture.detectChanges();
            expect(component.opened()).toBe(true);
            expect(dom.querySelector('.icon.hamburger.active')).toBeTruthy();

            (dom.querySelector('.icon.hamburger') as HTMLElement).click();
            fixture.detectChanges();
            expect(component.opened()).toBe(false);
            expect(dom.querySelector('.icon.hamburger.active')).toBeFalsy();
        });


        it("should navigate to '/dashboard'", () =>
        {
            (dom.querySelectorAll('.links > .item')[0] as HTMLElement).click();
            fixture.detectChanges();

            expect(component.opened()).toBe(false);
            expect(component.path()).toEqual(['dashboard']);
            expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
            expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);

            const selection = dom.querySelectorAll('.item.active');
            expect(selection.length).toBe(1);
            expect(selection[0].textContent?.trim()).toBe('Dashboard');
        });


        it("should navigate to '/family'", () =>
        {
            (dom.querySelectorAll('.links > .item')[2] as HTMLElement).click();
            fixture.detectChanges();

            expect(component.opened()).toBe(false);
            expect(component.path()).toEqual(['family']);
            expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
            expect(routerSpy.navigate).toHaveBeenCalledWith(['/family']);

            const selection = dom.querySelectorAll('.item.active');
            expect(selection.length).toBe(1);
            expect(selection[0].textContent?.trim()).toBe('Family');
        });


        it('should navigate to a game link', () =>
        {
            expect(component.gameSelector().options.every(option => !option.active)).toBe(true);
            expect(dom.querySelector('.item.dropdown.active')).toBeFalsy();
            TestFactory.selectOption((dom.querySelectorAll('app-dropdown')[0] as HTMLElement).closest('.item') as HTMLElement, fixture, 0, 1);

            expect(component.opened()).toBe(false);
            expect(component.path()).toEqual(['games', 'connect4', 'recap']);
            expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
            expect(routerSpy.navigate).toHaveBeenCalledWith(['/games/connect4/recap']);

            const selector = component.gameSelector();
            const connect4 = selector.options.find(item => item.name === 'connect4');
            expect(connect4?.active).toBe(true);
            expect(connect4?.additional?.find(item => item.name === 'recap')?.active).toBe(true);
            expect(connect4?.additional?.find(item => item.name === 'play')?.active).toBe(false);
            expect(selector.options.filter(item => item.name !== 'connect4').every(item => !item.active)).toBe(true);
            expect(dom.querySelector('.item.dropdown.active')).toBeTruthy();
        });


        it("should navigate to an account link", () =>
        {
            expect(component.accountSelector().options.every(option => !option.active)).toBe(true);
            expect(dom.querySelector('.item.dropdown.active')).toBeFalsy();
            TestFactory.selectOption((dom.querySelectorAll('app-dropdown')[1] as HTMLElement).closest('.item') as HTMLElement, fixture, 1);

            expect(component.opened()).toBe(false);
            expect(component.path()).toEqual(['notifications']);
            expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
            expect(routerSpy.navigate).toHaveBeenCalledWith(['/notifications']);

            const selector = component.accountSelector();
            expect(selector.options.find(option => option.name === 'notifications')?.active).toBe(true);
            expect(selector.options.find(option => option.name === 'account')?.active).toBe(false);
            expect(dom.querySelectorAll('.item.dropdown.active').length).toBe(1);
        });


        it('should show the logout message', () =>
        {
            TestFactory.selectOption((dom.querySelectorAll('app-dropdown')[1] as HTMLElement).closest('.item') as HTMLElement, fixture, 2);
            expect(routerSpy.navigate).not.toHaveBeenCalled();
            expect(component.showLogoutMessage()).toBe(true);
            expect(component.logoutUpdate()).toBe('');
            expect(dom.querySelector('app-message-modal h4')?.textContent).toBe('Are You Sure?');
            expect(dom.querySelector('app-message-modal p')?.textContent).toBe("You're about to log out — you'll need your credentials to sign back in.");
        });


        describe('Logging Out', () => {
            beforeEach(() =>
            {
                vi.spyOn(console, 'error');
                vi.spyOn(ToolBox, 'clearSession').mockImplementation(() => {});
                TestFactory.selectOption((dom.querySelectorAll('app-dropdown')[1] as HTMLElement).closest('.item') as HTMLElement, fixture, 2);
            });

            // --------------------------------------------------------------------

            it('should clear the session on successful requests', () =>
            {
                vi.spyOn(serverSpy, 'logout').mockReturnValue(of(new HttpResponse({ status: 200, body: 'Ok' })));
                (dom.querySelectorAll('app-message-modal .controls button')[0] as HTMLElement).click();
                fixture.detectChanges();

                expect(serverSpy.logout).toHaveBeenCalledTimes(1);
                expect(ToolBox.clearSession).toHaveBeenCalledTimes(1);
            });


            it('should clear the session on unauthorized requests', async () =>
            {
                vi.spyOn(serverSpy, 'logout').mockReturnValue(throwError(() => ({ status: 401, statusText: 'Unauthorized' })));
                (dom.querySelectorAll('app-message-modal .controls button')[0] as HTMLElement).click();
                fixture.detectChanges();

                expect(serverSpy.logout).toHaveBeenCalledTimes(1);
                expect(ToolBox.clearSession).toHaveBeenCalledTimes(1);
            });


            it('should show an error message on unknown request API errors', async () =>
            {
                vi.spyOn(serverSpy, 'logout').mockReturnValue(throwError(() => ({ status: 500, statusText: 'Server Error' })));
                (dom.querySelectorAll('app-message-modal .controls button')[0] as HTMLElement).click();
                fixture.detectChanges();

                expect(console.error).toHaveBeenCalledTimes(1);
                expect(serverSpy.logout).toHaveBeenCalledTimes(1);
                expect(component.logoutUpdate()).toBe('An unexpected error occurred, try again later.');
                expect(component.showLogoutMessage()).toBe(true);
                expect(dom.querySelector('app-message-modal span')?.textContent).toBe(component.logoutUpdate());
            });


            it('should close the message without logging out', () =>
            {
                (dom.querySelectorAll('app-message-modal .controls button')[1] as HTMLElement).click();
                fixture.detectChanges();
                expect(component.showLogoutMessage()).toBe(false);
                expect(dom.querySelector('app-message-modal')).toBeFalsy();
            });
        });


        it('should reflect the selection when a path is updated manually', () =>
        {
            (routerSpy.events as Subject<any>).next(new NavigationEnd(1, '/games/conquer/play', '/games/conquer/play'));
            fixture.detectChanges();

            expect(component.path()).toEqual(['games', 'conquer', 'play']);
            const gameSelector = component.gameSelector();
            const conquer = gameSelector.options.find(option => option.name === 'conquer');
            expect(conquer?.active).toBe(true);
            expect(conquer?.additional?.find(item => item.name === 'play')?.active).toBe(true);
            expect(conquer?.additional?.find(item => item.name === 'recap')?.active).toBe(false);
            expect(gameSelector.options.filter(item => item.name !== 'conquer').every(item => !item.active)).toBe(true);

            const gamesWrapper = dom.querySelectorAll('.item.dropdown')[0];
            expect(gamesWrapper.classList.contains('active')).toBe(true);
            expect(gamesWrapper.querySelector('.option span.active')?.textContent).toBe('Conquer');
            expect(gamesWrapper.querySelector('li.active span')?.textContent).toBe('Play');
            
            const accountWrapper = dom.querySelectorAll('.item.dropdown')[1];
            expect(accountWrapper.classList.contains('active')).toBe(false);

            (routerSpy.events as Subject<any>).next(new NavigationEnd(1, '/account', '/account'));
            fixture.detectChanges();

            expect(component.path()).toEqual(['account']);
            const accountSelector = component.accountSelector();
            const account = accountSelector.options.find(item => item.name === 'account');
            expect(account?.active).toBe(true);
            expect(accountSelector.options.filter(item => item.name !== 'account').every(item => !item.active)).toBe(true);

            expect(gamesWrapper.classList.contains('active')).toBe(false);
            expect(accountWrapper.classList.contains('active')).toBe(true);
            expect(accountWrapper.querySelector('.option.active span')?.textContent).toBe('Account');
        });


        it('should prevent navigation to the same route', () =>
        {
            Object.defineProperty(routerSpy, 'url', { value: '/dashboard', configurable: true });
            (dom.querySelectorAll('.links > .item')[0] as HTMLElement).click();
            fixture.detectChanges();

            expect(component.opened()).toBe(false);
            expect(routerSpy.navigate).not.toHaveBeenCalled();
            expect(dom.querySelector('.item.active')).toBeFalsy();
        });
    });
});
