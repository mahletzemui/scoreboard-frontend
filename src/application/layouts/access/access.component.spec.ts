import { of, throwError } from 'rxjs';
import { Location } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';


import { AccessComponent } from './access.component';

import { AuthenticationService, LoaderService } from '../../services';
import { TestFactory } from '../../utils/test-factory';


/**
 * Tests the AccessComponent class.
 */
describe('AccessComponent', () => {
    // Fields ---------------------------------------------------------------------
    let dom: HTMLElement;

    let routerSpy: Router;
    let locationSpy: Location;
    let serverSpy: AuthenticationService;

    let component: AccessComponent;
    let fixture: ComponentFixture<AccessComponent>;

    const validRegisterInput: Record<string, string> = {
        pname: 'John', username: 'johndoe', email: 'johndoe@email.com', confirmEmail: 'johndoe@email.com',
        password: 'j123456!', confirmPassword: 'j123456!', pin: '1234', confirmPin: '1234'
    };

    // Tests ----------------------------------------------------------------------

    describe('Login', () => {
        beforeEach(async () =>
        {
            await TestBed.configureTestingModule({
                imports: [AccessComponent],
                providers: [{ provide: ActivatedRoute, useValue: { snapshot: { data: { view: 'login' } } } }]
            }).compileComponents();
            routerSpy = TestBed.inject(Router);
            locationSpy = TestBed.inject(Location);
            serverSpy = TestBed.inject(AuthenticationService);
            fixture = TestBed.createComponent(AccessComponent);
            component = fixture.componentInstance;

            dom = fixture.nativeElement;
            vi.spyOn(console, 'error');
            vi.spyOn(routerSpy, 'navigate');
            vi.spyOn(locationSpy, 'go').mockImplementation(() => {});
        });

        // ------------------------------------------------------------------------

        it('should create component', () =>
        {
            fixture.detectChanges();

            expect(component).toBeTruthy();
            expect(component.view()).toBe('login');
            expect(component.loginModel().title).toBe('Login');
            expect(component.registerModel().title).toBe('Register');
            expect(component.transitioning()).toBe(false);

            expect(dom.querySelector('.track.newbie')).toBeFalsy();
            expect(dom.querySelector('.track.transitioning')).toBeFalsy();
            expect(dom.querySelector('.error-text.general')?.textContent).toBe('');
            expect(dom.querySelectorAll('.scene.login .field').length).toBe(2);
            expect(dom.querySelectorAll('.scene.register .field').length).toBe(8);
            expect(dom.querySelector('.error-text.input')?.textContent).toBe('');
        });


        it('should mark content as loaded after view initialization', async () =>
        {
            const loaderSpy = TestBed.inject(LoaderService);
            vi.spyOn(loaderSpy, 'setLoadedContent');
            vi.useFakeTimers();

            fixture.detectChanges();
            expect(loaderSpy.setLoadedContent).not.toHaveBeenCalled();

            await vi.advanceTimersByTimeAsync(1000);
            expect(loaderSpy.setLoadedContent).toHaveBeenCalledWith(true);

            vi.useRealTimers();
        });


        it('should navigate to the forgot password page', () =>
        {
            fixture.detectChanges();

            (dom.querySelector('.scene.login .form a') as HTMLElement).click();
            expect(routerSpy.navigate).toHaveBeenCalledWith(['/forgot-password']);
        });


        it('should switch to the register view  and disarm the transition after switching views', async () =>
        {
            vi.useFakeTimers();
            fixture.detectChanges();

            (dom.querySelector('.scene.login .panel button') as HTMLElement).click();
            fixture.detectChanges();
            expect(component.view()).toBe('register');
            expect(component.transitioning()).toBe(true);
            expect(dom.querySelector('.track')?.classList.contains('newbie')).toBe(true);
            expect(dom.querySelector('.track')?.classList.contains('transitioning')).toBe(true);
            expect(locationSpy.go).toHaveBeenCalledWith('/register');

            await vi.advanceTimersByTimeAsync(650);
            fixture.detectChanges();
            expect(component.transitioning()).toBe(false);
            expect(dom.querySelector('.track')?.classList.contains('newbie')).toBe(true);
            expect(dom.querySelector('.track')?.classList.contains('transitioning')).toBe(false);
            expect(locationSpy.go).toHaveBeenCalledWith('/register');

            vi.useRealTimers();
        });


        it('should redirect to the dashboard on successful login', () =>
        {
            fixture.detectChanges();
            vi.spyOn(serverSpy, 'login').mockReturnValue(of(new HttpResponse({ status: 200, body: 'Ok' })));

            const usernameInput = dom.querySelector('#existing-username') as HTMLInputElement;
            usernameInput.value = 'johndoe';
            usernameInput.dispatchEvent(new Event('input'));
            const passwordInput = dom.querySelector('#existing-password') as HTMLInputElement;
            passwordInput.value = 'j123456!';
            passwordInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            (dom.querySelector('.scene.login .form > button') as HTMLElement).click();
            fixture.detectChanges();

            expect(serverSpy.login).toHaveBeenCalledWith({ username: 'johndoe', password: 'j123456!' });
            expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
        });


        it('should show an error message on invalid forms', () =>
        {
            fixture.detectChanges();
            vi.spyOn(serverSpy, 'login');

            (dom.querySelector('.scene.login .form > button') as HTMLElement).click();
            fixture.detectChanges();

            expect(serverSpy.login).not.toHaveBeenCalled();
            expect(dom.querySelector('.scene.login .error-text.general')?.textContent).toBe('The username and/or password are incorrect.');
        });


        it('should show an error message on invalid credentials', () =>
        {
            fixture.detectChanges();
            vi.spyOn(serverSpy, 'login').mockReturnValue(throwError(() => ({ status: 401, statusText: 'Unauthorized' })));

            const usernameInput = dom.querySelector('#existing-username') as HTMLInputElement;
            usernameInput.value = 'johndoe';
            usernameInput.dispatchEvent(new Event('input'));
            const passwordInput = dom.querySelector('#existing-password') as HTMLInputElement;
            passwordInput.value = 'wrong!23A';
            passwordInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            (dom.querySelector('.scene.login .form > button') as HTMLElement).click();
            fixture.detectChanges();

            expect(dom.querySelector('.scene.login .error-text.general')?.textContent).toBe('The username and/or password are incorrect.');
        });


        it('should show an error message on unknown API errors', () =>
        {
            fixture.detectChanges();
            vi.spyOn(serverSpy, 'login').mockReturnValue(throwError(() => ({ status: 500, statusText: 'Server Error' })));

            const usernameInput = dom.querySelector('#existing-username') as HTMLInputElement;
            usernameInput.value = 'johndoe';
            usernameInput.dispatchEvent(new Event('input'));
            const passwordInput = dom.querySelector('#existing-password') as HTMLInputElement;
            passwordInput.value = 'j123456!';
            passwordInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            (dom.querySelector('.scene.login .form > button') as HTMLElement).click();
            fixture.detectChanges();

            expect(console.error).toHaveBeenCalledTimes(1);
            expect(dom.querySelector('.scene.login .error-text.general')?.textContent).toBe('An unexpected error occurred, try again later.');
        });
    });


    describe('Register', () => {
        beforeEach(async () =>
        {
            await TestBed.configureTestingModule({
                imports: [AccessComponent],
                providers: [{ provide: ActivatedRoute, useValue: { snapshot: { data: { view: 'register' } } } }]
            }).compileComponents();
            serverSpy = TestBed.inject(AuthenticationService);
            routerSpy = TestBed.inject(Router);
            locationSpy = TestBed.inject(Location);
            fixture = TestBed.createComponent(AccessComponent);
            component = fixture.componentInstance;

            dom = fixture.nativeElement;
            vi.spyOn(console, 'error');
            vi.spyOn(routerSpy, 'navigate');
            vi.spyOn(locationSpy, 'go').mockImplementation(() => {});
        });

        // ------------------------------------------------------------------------

        it('should create component starting on the register view', () =>
        {
            fixture.detectChanges();

            expect(component).toBeTruthy();
            expect(component.view()).toBe('register');
            expect(component.loginModel().title).toBe('Login');
            expect(component.registerModel().title).toBe('Register');
            expect(component.transitioning()).toBe(false);

            expect(dom.querySelector('.track.newbie')).toBeTruthy();
            expect(dom.querySelector('.track.transitioning')).toBeFalsy();
            expect(dom.querySelector('.scene.register .error-text.general')?.textContent).toBe('');
            expect(dom.querySelectorAll('.scene.login .field').length).toBe(2);
            expect(dom.querySelectorAll('.scene.register .field').length).toBe(8);
            expect(dom.querySelectorAll('.scene.register .error-text.input')[0]?.textContent).toBe('');
        });


        it('should mark content as loaded after view initialization', async () =>
        {
            const loaderSpy = TestBed.inject(LoaderService);
            vi.spyOn(loaderSpy, 'setLoadedContent');
            vi.useFakeTimers();

            fixture.detectChanges();
            expect(loaderSpy.setLoadedContent).not.toHaveBeenCalled();

            await vi.advanceTimersByTimeAsync(1000);
            expect(loaderSpy.setLoadedContent).toHaveBeenCalledWith(true);

            vi.useRealTimers();
        });


        it('should update and validate a register field', () =>
        {
            fixture.detectChanges();

            const emailInput = dom.querySelector('#new-email') as HTMLInputElement;
            emailInput.value = 'bad-email';
            emailInput.dispatchEvent(new Event('input'));
            emailInput.dispatchEvent(new Event('blur'));
            fixture.detectChanges();

            expect(component.registerModel().intake.get('email')?.value).toBe('bad-email');
            expect(component.registerModel().fields[2].error).toBe('Must be a valid email address.');
            expect(dom.querySelectorAll('.scene.register .error-text.input')[2]?.textContent).toContain('Must be a valid email address.');
        });


        it('should toggle a register field visibility', () =>
        {
            fixture.detectChanges();

            const toggleButtons = dom.querySelectorAll('.scene.register .field button.icon');
            expect(toggleButtons.length).toBe(4);

            (toggleButtons[0] as HTMLElement).click();
            fixture.detectChanges();
            expect(component.registerModel().fields[4].visible).toBe(true);
            expect((dom.querySelector('#new-password') as HTMLInputElement).type).toBe('text');
        });


        it('should redirect to the dashboard on successful registration', () =>
        {
            fixture.detectChanges();
            vi.spyOn(serverSpy, 'register').mockReturnValue(of(new HttpResponse({ status: 201, body: 'Created' })));

            TestFactory.fillForm(dom, fixture, validRegisterInput, 'new-');
            (dom.querySelector('.scene.register .form > button') as HTMLElement).click();
            fixture.detectChanges();

            expect(serverSpy.register).toHaveBeenCalledWith({ pname: 'John', username: 'johndoe', email: 'johndoe@email.com', password: 'j123456!', pin: '1234' });
            expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
        });


        it('should not submit and show errors when fields are invalid', () =>
        {
            fixture.detectChanges();
            vi.spyOn(serverSpy, 'register');

            (dom.querySelector('.scene.register .form > button') as HTMLElement).click();
            fixture.detectChanges();

            expect(serverSpy.register).not.toHaveBeenCalled();
            expect(component.registerModel().error).toBe('Please verify all field inputs.');
            expect(component.registerModel().fields[0].error).toBeTruthy();
            expect(dom.querySelector('.scene.register .error-text.general')?.textContent).toBe('Please verify all field inputs.');
            expect(dom.querySelectorAll('.scene.register .error-text.input')[0]?.textContent).toBeTruthy();
        });


        it('should show an error message on existing usernames', () =>
        {
            fixture.detectChanges();
            vi.spyOn(serverSpy, 'register').mockReturnValue(throwError(() => ({ status: 409, statusText: 'Conflict' })));

            TestFactory.fillForm(dom, fixture, validRegisterInput, 'new-');
            (dom.querySelector('.scene.register .form > button') as HTMLElement).click();
            fixture.detectChanges();

            expect(routerSpy.navigate).not.toHaveBeenCalledWith(['/dashboard']);
            expect(dom.querySelector('.scene.register .error-text.general')?.textContent).toBe('The username already exists.');
        });


        it('should show an error message on unknown API errors', () =>
        {
            fixture.detectChanges();
            vi.spyOn(serverSpy, 'register').mockReturnValue(throwError(() => ({ status: 500, statusText: 'Server Error' })));

            TestFactory.fillForm(dom, fixture, validRegisterInput, 'new-');
            (dom.querySelector('.scene.register .form > button') as HTMLElement).click();
            fixture.detectChanges();

            expect(console.error).toHaveBeenCalledTimes(1);
            expect(dom.querySelector('.scene.register .error-text.general')?.textContent).toBe('An unexpected error occurred, try again later.');
        });


        it('should switch to the login view and disarm the transition after switching views', async () =>
        {
            vi.useFakeTimers();
            fixture.detectChanges();

            (dom.querySelector('.scene.register .panel button') as HTMLElement).click();
            fixture.detectChanges();
            expect(component.view()).toBe('login');
            expect(component.transitioning()).toBe(true);
            expect(dom.querySelector('.track')?.classList.contains('newbie')).toBe(false);
            expect(dom.querySelector('.track')?.classList.contains('transitioning')).toBe(true);
            expect(locationSpy.go).toHaveBeenCalledWith('/login');

            await vi.advanceTimersByTimeAsync(650);
            fixture.detectChanges();
            expect(component.transitioning()).toBe(false);
            expect(dom.querySelector('.track')?.classList.contains('newbie')).toBe(false);
            expect(dom.querySelector('.track')?.classList.contains('transitioning')).toBe(false);
            expect(locationSpy.go).toHaveBeenCalledWith('/login');

            vi.useRealTimers();
        });
    });
});
