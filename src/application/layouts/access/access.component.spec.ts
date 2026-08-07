import { of, throwError } from 'rxjs';
import { Location } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';


import { AccessComponent } from './access.component';
import { TestFactory } from '../../utils/test-factory';

import { AuthenticationService, LoaderService } from '../../services';


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
            expect(component.loginModel().title).toBe('Login');
            expect(component.registerModel().title).toBe('Register');
            expect(component.view()).toBe('login');
            expect(component.loginModel().error).toBeFalsy();
            expect(component.transitioning()).toBe(false);

            expect(dom.querySelector('.track.newbie')).toBeFalsy();
            expect(dom.querySelector('.track.transitioning')).toBeFalsy();
            expect(dom.querySelector('.error-text.general')?.textContent).toBeFalsy();
            expect(dom.querySelectorAll('.scene.login .wrapper').length).toBe(2);
            expect(dom.querySelectorAll('.scene.register .wrapper').length).toBe(8);
            expect(dom.querySelectorAll('.error-text.input')[0].textContent).toBeFalsy();
            expect(dom.querySelectorAll('.error-text.input')[1].textContent).toBeFalsy();
        });


        it('should mark content as loaded after view initialization', async() =>
        {
            await TestFactory.validateBaseLayout(component);
        });


        it('should switch to the register view', async () =>
        {
            vi.useFakeTimers();
            fixture.detectChanges();

            (dom.querySelector('.scene.login .panel button') as HTMLElement).click();
            fixture.detectChanges();
            expect(component.view()).toBe('register');
            expect(component.transitioning()).toBe(true);
            expect(dom.querySelector('.track.newbie')).toBeTruthy();
            expect(dom.querySelector('.track.transitioning')).toBeTruthy();
            expect(locationSpy.go).toHaveBeenCalledWith('/register');

            await vi.advanceTimersByTimeAsync(650);
            fixture.detectChanges();
            expect(component.transitioning()).toBe(false);
            expect(dom.querySelector('.track.newbie')).toBeTruthy();
            expect(dom.querySelector('.track.transitioning')).toBeFalsy();
            expect(locationSpy.go).toHaveBeenCalledWith('/register');

            vi.useRealTimers();
        });


        it('should update but not validate fields', () =>
        {
            fixture.detectChanges();
            TestFactory.fillForm(dom.querySelector('.form')!, fixture, { 'existing-username': '$' });
            expect(component.loginModel().intake.get('username')?.value).toBe('$');
            expect(component.loginModel().fields[0].error).toBeFalsy();
            expect(dom.querySelector('.error-text.general')?.textContent).toBeFalsy();
            expect(dom.querySelectorAll('.error-text.input')[0]?.textContent).toBeFalsy();
        });


        it('should navigate to the forgot password page', () =>
        {
            fixture.detectChanges();
            (dom.querySelector('.scene.login .form a') as HTMLElement).click();
            expect(routerSpy.navigate).toHaveBeenCalledWith(['/forgot-password']);
        });


        it('should redirect to the dashboard page on successful logins', () =>
        {
            fixture.detectChanges();
            vi.spyOn(serverSpy, 'login').mockReturnValue(of(new HttpResponse({ status: 200, body: 'Ok' })));

            TestFactory.fillForm(dom.querySelector('.form')!, fixture, { 'existing-username': 'johndoe', 'existing-password': 'j123456!' });
            (dom.querySelector('.scene.login .form > button') as HTMLElement).click();
            fixture.detectChanges();

            expect(serverSpy.login).toHaveBeenCalledWith({ username: 'johndoe', password: 'j123456!' });
            expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
        });


        it('should show an error message on invalid form logins', () =>
        {
            fixture.detectChanges();
            vi.spyOn(serverSpy, 'login');

            (dom.querySelector('.scene.login .form > button') as HTMLElement).click();
            fixture.detectChanges();

            expect(serverSpy.login).not.toHaveBeenCalled();
            expect(component.loginModel().error).toBe('The username and/or password are incorrect.');
            expect(dom.querySelector('.scene.login .error-text.general')?.textContent).toBe('The username and/or password are incorrect.');
            expect(dom.querySelectorAll('.error-text.input')[0]?.textContent).toBeFalsy();
            expect(dom.querySelectorAll('.error-text.input')[1]?.textContent).toBeFalsy();
        });


        it('should show an error message on invalid credential logins', () =>
        {
            fixture.detectChanges();
            vi.spyOn(serverSpy, 'login').mockReturnValue(throwError(() => ({ status: 401, statusText: 'Unauthorized' })));

            TestFactory.fillForm(dom.querySelector('.form')!, fixture, { 'existing-username': 'johndoe', 'existing-password': 'j123456!' });
            (dom.querySelector('.scene.login .form > button') as HTMLElement).click();
            fixture.detectChanges();

            expect(serverSpy.login).toHaveBeenCalled();
            expect(component.loginModel().error).toBe('The username and/or password are incorrect.');
            expect(dom.querySelector('.scene.login .error-text.general')?.textContent).toBe('The username and/or password are incorrect.');
            expect(dom.querySelectorAll('.error-text.input')[0]?.textContent).toBeFalsy();
            expect(dom.querySelectorAll('.error-text.input')[1]?.textContent).toBeFalsy();
        });


        it('should show an error message on unknown login API errors', () =>
        {
            fixture.detectChanges();
            vi.spyOn(serverSpy, 'login').mockReturnValue(throwError(() => ({ status: 500, statusText: 'Server Error' })));

            TestFactory.fillForm(dom.querySelector('.form')!, fixture, { 'existing-username': 'johndoe', 'existing-password': 'j123456!' });
            (dom.querySelector('.scene.login .form > button') as HTMLElement).click();
            fixture.detectChanges();

            expect(serverSpy.login).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalledTimes(1);
            expect(component.loginModel().error).toBe('An unexpected error occurred, try again later.');
            expect(dom.querySelector('.scene.login .error-text.general')?.textContent).toBe('An unexpected error occurred, try again later.');
            expect(dom.querySelectorAll('.error-text.input')[0]?.textContent).toBeFalsy();
            expect(dom.querySelectorAll('.error-text.input')[1]?.textContent).toBeFalsy();
        });
    });


    describe('Register', () => {
        const inputs = { 'new-pname': 'John', 'new-username': 'johndoe', 'new-email': 'johndoe@email.com', 'new-confirmEmail': 'johndoe@email.com', 'new-password': 'j123456!', 'new-confirmPassword': 'j123456!', 'new-pin': '1234', 'new-confirmPin': '1234' };

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

        it('should create component', () =>
        {
            fixture.detectChanges();

            expect(component).toBeTruthy();
            expect(component.loginModel().title).toBe('Login');
            expect(component.registerModel().title).toBe('Register');
            expect(component.view()).toBe('register');
            expect(component.registerModel().error).toBeFalsy();
            expect(component.transitioning()).toBe(false);

            expect(dom.querySelector('.track.newbie')).toBeTruthy();
            expect(dom.querySelector('.track.transitioning')).toBeFalsy();
            expect(dom.querySelector('.scene.register .error-text.general')?.textContent).toBeFalsy();
            expect(dom.querySelectorAll('.scene.login .wrapper').length).toBe(2);
            expect(dom.querySelectorAll('.scene.register .wrapper').length).toBe(8);
            (dom.querySelectorAll('.scene.register .error-text.input')).forEach(item => expect(item?.textContent).toBeFalsy())
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


        it('should switch to the login view', async () =>
        {
            vi.useFakeTimers();
            fixture.detectChanges();

            (dom.querySelector('.scene.register .panel button') as HTMLElement).click();
            fixture.detectChanges();
            expect(component.view()).toBe('login');
            expect(component.transitioning()).toBe(true);
            expect(dom.querySelector('.track.newbie')).toBeFalsy();
            expect(dom.querySelector('.track.transitioning')).toBeTruthy();
            expect(locationSpy.go).toHaveBeenCalledWith('/login');

            await vi.advanceTimersByTimeAsync(650);
            fixture.detectChanges();
            expect(component.transitioning()).toBe(false);
            expect(dom.querySelector('.track.newbie')).toBeFalsy();
            expect(dom.querySelector('.track.transitioning')).toBeFalsy();
            expect(locationSpy.go).toHaveBeenCalledWith('/login');

            vi.useRealTimers();
        });


        it('should update and validate fields', () =>
        {
            fixture.detectChanges();
            TestFactory.fillForm(dom.querySelector('.scene.register .form')!, fixture, { 'new-pname': '$' });
            (dom.querySelector('#new-pname') as HTMLElement).dispatchEvent(new Event('blur'));
            fixture.detectChanges();
            expect(component.registerModel().intake.get('pname')?.value).toBe('$');
            expect(component.registerModel().fields[0].error).toBeTruthy();
            expect(dom.querySelector('.scene.register .error-text.general')?.textContent).toBeFalsy();
            expect(dom.querySelectorAll('.scene.register .error-text.input')[0]?.textContent).toBeTruthy();
        });


        it('should redirect to the dashboard on successful registrations', () =>
        {
            fixture.detectChanges();
            vi.spyOn(serverSpy, 'register').mockReturnValue(of(new HttpResponse({ status: 201, body: 'Created' })));

            TestFactory.fillForm(dom, fixture, inputs);
            (dom.querySelector('.scene.register .form > button') as HTMLElement).click();
            fixture.detectChanges();

            expect(serverSpy.register).toHaveBeenCalledWith({ pname: 'John', username: 'johndoe', email: 'johndoe@email.com', password: 'j123456!', pin: '1234' });
            expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
        });


        it('should show error messages on invalid form registrations', () =>
        {
            fixture.detectChanges();
            vi.spyOn(serverSpy, 'register');

            (dom.querySelector('.scene.register .form > button') as HTMLElement).click();
            fixture.detectChanges();

            expect(serverSpy.register).not.toHaveBeenCalled();
            expect(component.registerModel().error).toBe('Please verify all field inputs.');
            expect(component.registerModel().fields[0].error).toBeTruthy();
            expect(component.registerModel().fields[1].error).toBeTruthy();
            expect(component.registerModel().fields[2].error).toBeTruthy();
            expect(component.registerModel().fields[4].error).toBeTruthy();
            expect(component.registerModel().fields[6].error).toBeTruthy();
            
            expect(dom.querySelector('.scene.register .error-text.general')?.textContent).toBe('Please verify all field inputs.');
            expect(dom.querySelectorAll('.scene.register .error-text.input')[0]?.textContent).toBeTruthy();
            expect(dom.querySelectorAll('.scene.register .error-text.input')[1]?.textContent).toBeTruthy();
            expect(dom.querySelectorAll('.scene.register .error-text.input')[2]?.textContent).toBeTruthy();
            expect(dom.querySelectorAll('.scene.register .error-text.input')[4]?.textContent).toBeTruthy();
            expect(dom.querySelectorAll('.scene.register .error-text.input')[6]?.textContent).toBeTruthy();
        });


        it('should show an error message on conflicting registrations', () =>
        {
            fixture.detectChanges();
            vi.spyOn(serverSpy, 'register').mockReturnValue(throwError(() => ({ status: 409, statusText: 'Conflict' })));

            TestFactory.fillForm(dom, fixture, inputs);
            (dom.querySelector('.scene.register .form > button') as HTMLElement).click();
            fixture.detectChanges();

            expect(serverSpy.register).toHaveBeenCalled();
            expect(component.registerModel().error).toBe('The username already exists.');
            (component.registerModel().fields).forEach(item => expect(item.error).toBeFalsy());
            expect(dom.querySelector('.scene.register .error-text.general')?.textContent).toBe('The username already exists.');
            (dom.querySelectorAll('.scene.register .error-text.input')).forEach(item => expect(item?.textContent).toBeFalsy())
        });


        it('should show an error message on unknown registration API errors', () =>
        {
            fixture.detectChanges();
            vi.spyOn(serverSpy, 'register').mockReturnValue(throwError(() => ({ status: 500, statusText: 'Server Error' })));

            TestFactory.fillForm(dom, fixture, inputs);
            (dom.querySelector('.scene.register .form > button') as HTMLElement).click();
            fixture.detectChanges();

            expect(console.error).toHaveBeenCalledTimes(1);
            expect(serverSpy.register).toHaveBeenCalled();
            expect(component.registerModel().error).toBe('An unexpected error occurred, try again later.');
            (component.registerModel().fields).forEach(item => expect(item.error).toBeFalsy());
            expect(dom.querySelector('.scene.register .error-text.general')?.textContent).toBe('An unexpected error occurred, try again later.');
            (dom.querySelectorAll('.scene.register .error-text.input')).forEach(item => expect(item?.textContent).toBeFalsy())
        });
    });
});
