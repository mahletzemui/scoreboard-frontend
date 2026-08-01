import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';


import { ResetPasswordComponent } from './reset-password.component';

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
            expect(dom.querySelectorAll('.field').length).toBe(2);
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


        it('should navigate to the login page when the change your mind button is clicked', () =>
        {
            fixture.detectChanges();
            (dom.querySelector('.form a') as HTMLElement).click();
            expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
        });


        it('should not submit and show errors when fields are invalid', () =>
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


        it('should show a banner and navigate to login on success', () =>
        {
            fixture.detectChanges();
            vi.spyOn(serverSpy, 'resetPassword').mockReturnValue(of(new HttpResponse({ status: 200, body: 'Ok' })));

            const passwordInput = dom.querySelector('#password') as HTMLInputElement;
            passwordInput.value = 'j123456!';
            passwordInput.dispatchEvent(new Event('input'));

            const confirmInput = dom.querySelector('#confirmPassword') as HTMLInputElement;
            confirmInput.value = 'j123456!';
            confirmInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            (dom.querySelector('.form > button') as HTMLElement).click();
            fixture.detectChanges();
            expect(serverSpy.resetPassword).toHaveBeenCalledWith('123-456-789', { password: 'j123456!' });
            expect(noticeSpy.showBanner).toHaveBeenCalledWith('Success! Please sign in with your new password.');
            expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
        });


        it('should show an error message on invalid tokens', () =>
        {
            fixture.detectChanges();
            vi.spyOn(serverSpy, 'resetPassword').mockReturnValue(throwError(() => ({ status: 403, statusText: 'Forbidden' })));

            const passwordInput = dom.querySelector('#password') as HTMLInputElement;
            passwordInput.value = 'j123456!';
            passwordInput.dispatchEvent(new Event('input'));
            const confirmInput = dom.querySelector('#confirmPassword') as HTMLInputElement;
            confirmInput.value = 'j123456!';
            confirmInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            (dom.querySelector('.form > button') as HTMLElement).click();
            fixture.detectChanges();
            expect(routerSpy.navigate).not.toHaveBeenCalled();
            expect(component.model().error).toBe('The provided link is invalid or has expired.');
            expect(dom.querySelectorAll('.error-text.input')[0]?.textContent).toBe('');
            expect(dom.querySelectorAll('.error-text.input')[0]?.textContent).toBe('');
            expect(dom.querySelector('.error-text.general')?.textContent).toBe('The provided link is invalid or has expired.');
        });


        it('should show an error message on unknown API errors', () =>
        {
            fixture.detectChanges();
            vi.spyOn(serverSpy, 'resetPassword').mockReturnValue(throwError(() => ({ status: 500, statusText: 'Server Error' })));

            const passwordInput = dom.querySelector('#password') as HTMLInputElement;
            passwordInput.value = 'j123456!';
            passwordInput.dispatchEvent(new Event('input'));
            const confirmInput = dom.querySelector('#confirmPassword') as HTMLInputElement;
            confirmInput.value = 'j123456!';
            confirmInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            (dom.querySelector('.form > button') as HTMLElement).click();
            fixture.detectChanges();
            expect(console.error).toHaveBeenCalledTimes(1);
            expect(component.model().error).toBe('An unexpected error occurred, try again later.');
            expect(dom.querySelectorAll('.error-text.input')[0]?.textContent).toBe('');
            expect(dom.querySelectorAll('.error-text.input')[0]?.textContent).toBe('');
            expect(dom.querySelector('.error-text.general')?.textContent).toBe('An unexpected error occurred, try again later.');
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
            expect(dom.querySelectorAll('.field').length).toBe(2);
        });
    });
});
