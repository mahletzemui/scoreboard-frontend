import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';


import { ResetPasswordComponent } from './reset-password.component';
import { TestFactory } from '../../utils/test-factory';

import { AuthenticationService, LoaderService, NoticeService } from '../../services';


/**
 * Tests the ResetPasswordComponent class.
 */
describe('ResetPasswordComponent', () => {
    // Fields ---------------------------------------------------------------------
    let dom: HTMLElement;

    let component: ResetPasswordComponent;
    let fixture: ComponentFixture<ResetPasswordComponent>;

    let routerSpy: Router;
    let serverSpy: AuthenticationService;
    let noticeSpy: NoticeService;

    // Tests ----------------------------------------------------------------------

    describe('With Token', () => {
        beforeEach(async () =>
        {
            await TestBed.configureTestingModule({
                imports: [ResetPasswordComponent],
                providers: [{ provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap({ token: '123-456-789' }) } } }]
            }).compileComponents();
            routerSpy = TestBed.inject(Router);
            serverSpy = TestBed.inject(AuthenticationService);
            noticeSpy = TestBed.inject(NoticeService);

            fixture = TestBed.createComponent(ResetPasswordComponent);
            component = fixture.componentInstance;

            dom = fixture.nativeElement;
            vi.spyOn(console, 'error');
            vi.spyOn(routerSpy, 'navigate');
            vi.spyOn(noticeSpy, 'showBanner');
        });

        // ------------------------------------------------------------------------

        it('should create component', () =>
        {
            fixture.detectChanges();
            expect(console.error).not.toHaveBeenCalled();

            expect(component).toBeTruthy();
            expect(component.token).toBe('123-456-789');
            expect(component.model().title).toBe('Update Password');
            expect(dom.querySelector('h4')?.textContent).toBe('Choose a new password');
            expect(dom.querySelector('.error-text.general')?.textContent).toBeFalsy();
            expect(dom.querySelectorAll('.form .wrapper').length).toBe(2);
            expect(dom.querySelectorAll('.error-text.input')[0].textContent).toBeFalsy();
            expect(dom.querySelectorAll('.error-text.input')[1].textContent).toBeFalsy();
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


        it('should update and validate fields', () =>
        {
            fixture.detectChanges();
            TestFactory.fillForm(dom.querySelector('.form')!, fixture, { password: 'j123456' });
            (dom.querySelector('#password') as HTMLElement).dispatchEvent(new Event('blur'));
            fixture.detectChanges();
            expect(component.model().intake.get('password')?.value).toBe('j123456');
            expect(component.model().fields[0].error).toBeTruthy();
            expect(dom.querySelector('.error-text.general')?.textContent).toBeFalsy();
            expect(dom.querySelectorAll('.error-text.input')[0].textContent).toBeTruthy();
            expect(dom.querySelectorAll('.error-text.input')[1].textContent).toBeFalsy();
        });


        it('should navigate to the login page', () =>
        {
            fixture.detectChanges();
            (dom.querySelector('.form a') as HTMLElement).click();
            expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
        });


        it('should show the banner on successful requests', () =>
        {
            fixture.detectChanges();
            vi.spyOn(serverSpy, 'resetPassword').mockReturnValue(of(new HttpResponse({ status: 200, body: 'Ok' })));

            TestFactory.fillForm(dom.querySelector('.form')!, fixture, { password: 'j123456!', confirmPassword: 'j123456!' });
            (dom.querySelector('.form > button') as HTMLElement).click();
            fixture.detectChanges();

            expect(serverSpy.resetPassword).toHaveBeenCalledWith('123-456-789', { password: 'j123456!' });
            expect(noticeSpy.showBanner).toHaveBeenCalledWith('Success! Please sign in with your new password.');
            expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
        });


        it('should show an error message on invalid request forms', () =>
        {
            fixture.detectChanges();
            vi.spyOn(serverSpy, 'resetPassword');
            
            (dom.querySelector('.form > button') as HTMLElement).click();
            fixture.detectChanges();

            expect(serverSpy.resetPassword).not.toHaveBeenCalled();
            expect(component.model().error).toBe('Please verify all field inputs.');
            expect(component.model().fields[0].error).toBeTruthy();
            expect(dom.querySelector('.error-text.general')?.textContent).toBe('Please verify all field inputs.');
            expect(dom.querySelectorAll('.error-text.input')[0]?.textContent).toBeTruthy();
        });


        it('should show an error message on invalid request tokens', () =>
        {
            fixture.detectChanges();
            vi.spyOn(serverSpy, 'resetPassword').mockReturnValue(throwError(() => ({ status: 403, statusText: 'Forbidden' })));

            TestFactory.fillForm(dom.querySelector('.form')!, fixture, { password: 'j123456!', confirmPassword: 'j123456!' });
            (dom.querySelector('.form > button') as HTMLElement).click();
            fixture.detectChanges();

            expect(serverSpy.resetPassword).toHaveBeenCalled();
            expect(component.model().error).toBe('The provided link is invalid or has expired.');
            expect(dom.querySelector('.error-text.general')?.textContent).toBe('The provided link is invalid or has expired.');
            expect(dom.querySelectorAll('.error-text.input')[0]?.textContent).toBeFalsy();
            expect(dom.querySelectorAll('.error-text.input')[1]?.textContent).toBeFalsy();
        });


        it('should show an error message on unknown request API errors', () =>
        {
            fixture.detectChanges();
            vi.spyOn(serverSpy, 'resetPassword').mockReturnValue(throwError(() => ({ status: 500, statusText: 'Server Error' })));

            TestFactory.fillForm(dom.querySelector('.form')!, fixture, { password: 'j123456!', confirmPassword: 'j123456!' });
            (dom.querySelector('.form > button') as HTMLElement).click();
            fixture.detectChanges();

            expect(console.error).toHaveBeenCalledTimes(1);
            expect(component.model().error).toBe('An unexpected error occurred, try again later.');
            expect(dom.querySelector('.error-text.general')?.textContent).toBe('An unexpected error occurred, try again later.');
            expect(dom.querySelectorAll('.error-text.input')[0]?.textContent).toBe('');
            expect(dom.querySelectorAll('.error-text.input')[0]?.textContent).toBe('');
        });
    });


    describe('Without Token', () => {
        beforeEach(async () =>
        {
            await TestBed.configureTestingModule({
                imports: [ResetPasswordComponent],
                providers: [{ provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap({}) } } }]
            }).compileComponents();
            fixture = TestBed.createComponent(ResetPasswordComponent);
            component = fixture.componentInstance;

            dom = fixture.nativeElement;
            vi.spyOn(console, 'error');

            fixture.detectChanges();
            expect(console.error).toHaveBeenCalledTimes(1);
        });

        // ------------------------------------------------------------------------

        it('should create component', () =>
        {
            expect(component).toBeTruthy();
            expect(component.token).toBe('');
            expect(component.model().title).toBe('Update Password');
            expect(dom.querySelector('h4')?.textContent).toBe('Choose a new password');
            expect(dom.querySelector('.error-text.general')?.textContent).toBeFalsy();
            expect(dom.querySelectorAll('.form .wrapper').length).toBe(2);
            expect(dom.querySelectorAll('.error-text.input')[0].textContent).toBeFalsy();
            expect(dom.querySelectorAll('.error-text.input')[1].textContent).toBeFalsy();
        });
    });
});
