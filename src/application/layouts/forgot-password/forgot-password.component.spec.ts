import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';


import { ForgotPasswordComponent } from './forgot-password.component';
import { TestFactory } from '../../utils/test-factory';

import { AuthenticationService, LoaderService } from '../../services';


/**
 * Tests the ForgotPasswordComponent class.
 */
describe('ForgotPasswordComponent', () => {
    // Fields ---------------------------------------------------------------------
    let dom: HTMLElement;

    let component: ForgotPasswordComponent;
    let fixture: ComponentFixture<ForgotPasswordComponent>;

    let routerSpy: Router;
    let serverSpy: AuthenticationService;

    // Setup ----------------------------------------------------------------------

    beforeEach(async () =>
    {
        await TestBed.configureTestingModule({ imports: [ForgotPasswordComponent] }).compileComponents();
        routerSpy = TestBed.inject(Router);
        serverSpy = TestBed.inject(AuthenticationService);

        fixture = TestBed.createComponent(ForgotPasswordComponent);
        component = fixture.componentInstance;

        dom = fixture.nativeElement;
        vi.spyOn(console, 'error');
        vi.spyOn(routerSpy, 'navigate');
    });

    // Tests ----------------------------------------------------------------------

    it('should create component', () =>
    {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(component.model().title).toBe('Request Password Reset');
        expect(component.submitted()).toBe(false);
        expect(dom.querySelector('h3')?.textContent).toBe('Forgot your password?');
        expect(dom.querySelector('.error-text.general')?.textContent).toBeFalsy();
        expect(dom.querySelectorAll('.form .wrapper').length).toBe(1);
        expect(dom.querySelector('.error-text.input')?.textContent).toBeFalsy();
        expect(dom.querySelector('.message')).toBeFalsy();
    });


    it('should mark content as loaded after view initialization', async() =>
    {
        await TestFactory.validateBaseLayout(component);
    });


    it('should update but not validate fields', () =>
    {
        fixture.detectChanges();
        TestFactory.fillForm(dom.querySelector('.form')!, fixture, { 'username': '$' });
        expect(component.model().intake.get('username')?.value).toBe('$');
        expect(component.model().fields[0].error).toBeFalsy();
        expect(dom.querySelector('.error-text.general')?.textContent).toBeFalsy();
        expect(dom.querySelector('.error-text.input')?.textContent).toBeFalsy();
    });


    it('should navigate to the login page', () =>
    {
        fixture.detectChanges();
        (dom.querySelector('.form a') as HTMLElement).click();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });


    it('should show the success message on successful requests', () =>
    {
        fixture.detectChanges();
        vi.spyOn(serverSpy, 'forgotPassword').mockReturnValue(of(new HttpResponse({ status: 202, body: 'Accepted' })));

        TestFactory.fillForm(dom.querySelector('.form')!, fixture, { 'username': 'johndoe' });
        (dom.querySelector('.form > button') as HTMLElement).click();
        fixture.detectChanges();

        expect(serverSpy.forgotPassword).toHaveBeenCalledWith({ username: 'johndoe' });
        expect(component.submitted()).toBe(true);
        expect(dom.querySelector('.form')).toBeFalsy();
        expect(dom.querySelector('.message h3')?.textContent).toBe('Check your email');
    });


    it('should show an error message on invalid requests', () =>
    {
        fixture.detectChanges();
        vi.spyOn(serverSpy, 'forgotPassword');

        (dom.querySelector('.form > button') as HTMLElement).click();
        fixture.detectChanges();

        expect(serverSpy.forgotPassword).not.toHaveBeenCalled();
        expect(component.model().error).toBe('Please enter a valid username.');
        expect(dom.querySelector('.error-text.general')?.textContent).toBe('Please enter a valid username.');
        expect(dom.querySelector('.error-text.input')?.textContent).toBeFalsy();
    });


    it('should show an error message on unknown request API errors', () =>
    {
        fixture.detectChanges();
        vi.spyOn(serverSpy, 'forgotPassword').mockReturnValue(throwError(() => ({ status: 500, statusText: 'Server Error' })));

        TestFactory.fillForm(dom.querySelector('.form')!, fixture, { 'username': 'johndoe' });
        (dom.querySelector('.form > button') as HTMLElement).click();
        fixture.detectChanges();

        expect(console.error).toHaveBeenCalledTimes(1);
        expect(serverSpy.forgotPassword).toHaveBeenCalledWith({ username: 'johndoe' });
        expect(component.model().error).toBe('An unexpected error occurred, try again later.');
        expect(dom.querySelector('.error-text.general')?.textContent).toBe('An unexpected error occurred, try again later.');
        expect(dom.querySelector('.error-text.input')?.textContent).toBeFalsy();
    });
});
