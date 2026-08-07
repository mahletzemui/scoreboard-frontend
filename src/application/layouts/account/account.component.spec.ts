import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';


import { AccountComponent } from './account.component';
import { TestFactory } from '../../utils/test-factory';

import { ToolBox } from '../../utils';
import { Profile, Session } from '../../models/responses';
import { mapProfileFields } from '../../constants/general';
import { AccountService, NoticeService } from '../../services';


/**
 * Tests the AccountComponent class.
 */
describe('AccountComponent', () => {
    // Fields ---------------------------------------------------------------------
    let dom: HTMLElement;

    let component: AccountComponent;
    let fixture: ComponentFixture<AccountComponent>;

    let serverSpy: AccountService;
    let noticeSpy: NoticeService;

    // Setup ----------------------------------------------------------------------

    beforeEach(async () =>
    {
        await TestBed.configureTestingModule({ imports: [AccountComponent] }).compileComponents();
        serverSpy = TestBed.inject(AccountService);
        noticeSpy = TestBed.inject(NoticeService);

        fixture = TestBed.createComponent(AccountComponent);
        component = fixture.componentInstance;

        dom = fixture.nativeElement;
        vi.spyOn(console, 'error');
        vi.spyOn(noticeSpy, 'showBanner');
    });

    // Tests ----------------------------------------------------------------------

    describe('With Profile', () => {
        const profile = { pname: 'John', username: 'johndoe', email: 'johndoe@email.com' };

        beforeEach(async () =>
        {
            fixture = TestBed.createComponent(AccountComponent);
            component = fixture.componentInstance;
            
            dom = fixture.nativeElement;
            vi.spyOn(serverSpy, 'fetchProfile').mockReturnValue(of(new HttpResponse({ status: 200, body: profile })));
            fixture.detectChanges();
        });

        // ------------------------------------------------------------------------

        it('should create component', () =>
        {
            expect(component).toBeTruthy();
            expect(component.profile()).toEqual(mapProfileFields(profile));
            expect(component.generalError()).toBeFalsy();
            expect(component.requestError()).toBeFalsy();
            expect(component.initial()).toBe('J');
            expect(component.showMessage()).toBe(false);
            expect(component.activeModal()).toBeFalsy();
            expect(component.message()).toBeFalsy();

            expect(dom.querySelectorAll('.panel').length).toBe(3);
            expect(dom.querySelector('.error-text.general')?.textContent).toBeFalsy();
            expect(dom.querySelector('.layout.muted')).toBeFalsy();
            expect(dom.querySelector('.initial')?.textContent).toBe('J');
            expect(dom.querySelectorAll('.layout .row').length).toBe(3);
            component.profile().forEach((item, i) => {
                expect(dom.querySelectorAll('.panel dt')[i]?.textContent).toBe(item.label);
                expect(dom.querySelectorAll('.panel dd')[i]?.textContent).toBe(item.value);
            });
            expect(Array.from(dom.querySelectorAll('button')).filter(item => item.disabled).length).toBe(0);

            expect(dom.querySelector('app-form-modal')).toBeFalsy();
            expect(dom.querySelector('app-message-modal')).toBeFalsy();
        });


        describe('Profile Update', () => {
            beforeEach(() =>
            {
                (dom.querySelector('.panel button') as HTMLElement).click();
                fixture.detectChanges();
                expect(component.activeModal()).toBe('updateProfile');
                expect(dom.querySelector('app-form-modal h3')?.textContent).toBe('Update Profile');
                expect(dom.querySelector('app-form-modal span')?.textContent).toBeFalsy();
                expect(dom.querySelector('app-message-modal')).toBeFalsy();
            });

            // ------------------------------------------------------------------------

            it('should update the profile', () =>
            {
                vi.spyOn(serverSpy, 'updateProfile').mockReturnValue(of(new HttpResponse({ status: 200, body: { name: 'Jane', username: 'janedoe' } })));
                TestFactory.fillForm(dom, fixture, { pname: 'Jane', username: 'janedoe', email: 'janedoe@email.com', confirmEmail: 'janedoe@email.com' });
                (dom.querySelector('app-form-modal .form > button') as HTMLElement).click();
                fixture.detectChanges();

                expect(serverSpy.updateProfile).toHaveBeenCalledWith({ pname: 'Jane', username: 'janedoe', email: 'janedoe@email.com' });
                expect(component.profile()).toEqual(mapProfileFields({ pname: 'Jane', username: 'janedoe', email: 'janedoe@email.com' }));
                expect(component.activeModal()).toBeFalsy();
                expect(noticeSpy.showBanner).toHaveBeenCalledWith('Success! Profile has been updated.');
                expect(dom.querySelector('app-form-modal')).toBeFalsy();
                expect(dom.querySelector('app-message-modal')).toBeFalsy();
            });


            it('should skip the request when nothing has changed', () =>
            {
                vi.spyOn(serverSpy, 'updateProfile');
                TestFactory.fillForm(dom, fixture, { pname: 'John', username: 'johndoe', email: 'johndoe@email.com', confirmEmail: 'johndoe@email.com' });
                (dom.querySelector('app-form-modal .form > button') as HTMLElement).click();
                fixture.detectChanges();

                expect(component.activeModal()).toBeFalsy();
                expect(serverSpy.updateProfile).not.toHaveBeenCalled();
                expect(dom.querySelector('app-form-modal')).toBeFalsy();
                expect(dom.querySelector('app-message-modal')).toBeFalsy();
            });


            it('should show an error message on absent profile fields', async () =>
            {
                vi.spyOn(ToolBox, 'clearSession').mockImplementation(() => {});
                vi.spyOn(serverSpy, 'updateProfile').mockReturnValue(of(new HttpResponse<Session>({ status: 204, body: null })));
                
                TestFactory.fillForm(dom, fixture, { pname: 'Jane', username: 'janedoe', email: 'janedoe@email.com', confirmEmail: 'janedoe@email.com' });
                (dom.querySelector('app-form-modal .form > button') as HTMLElement).click();
                fixture.detectChanges();

                expect(console.error).toHaveBeenCalled();
                expect(ToolBox.clearSession).toHaveBeenCalledTimes(1);
            });


            it('should show the expired session message on unauthorized updates', () =>
            {
                vi.spyOn(serverSpy, 'updateProfile').mockReturnValue(throwError(() => ({ status: 401, statusText: 'Unauthorized' })));
                TestFactory.fillForm(dom, fixture, { pname: 'Jane', username: 'janedoe', email: 'janedoe@email.com', confirmEmail: 'janedoe@email.com' });
                (dom.querySelector('app-form-modal .form > button') as HTMLElement).click();
                fixture.detectChanges();

                expect(serverSpy.updateProfile).toHaveBeenCalled();
                expect(component.activeModal()).toBeFalsy();
                expect(component.message()).toBeUndefined();
                expect(component.showMessage()).toBe(true);
                expect(dom.querySelector('app-message-modal h3')?.textContent).toBe('Hold up…');
                expect(dom.querySelector('app-message-modal span')?.textContent).toBeFalsy();
                expect(dom.querySelector('app-message-modal p')?.textContent).toBe('Looks like your session has expired — you might have to sign in again.');
            });


            it('should show an error message on conflicting updates', () =>
            {
                vi.spyOn(serverSpy, 'updateProfile').mockReturnValue(throwError(() => ({ status: 409, statusText: 'Conflict' })));
                TestFactory.fillForm(dom, fixture, { pname: 'Jane', username: 'janedoe', email: 'janedoe@email.com', confirmEmail: 'janedoe@email.com' });
                (dom.querySelector('app-form-modal .form > button') as HTMLElement).click();
                fixture.detectChanges();

                expect(serverSpy.updateProfile).toHaveBeenCalled();
                expect(component.requestError()).toBe('The username already exists.');
                expect(dom.querySelector('app-form-modal span')?.textContent).toBeTruthy();
            });


            it('should show an error message on unexpected API errors', () =>
            {
                vi.spyOn(serverSpy, 'updateProfile').mockReturnValue(throwError(() => ({ status: 500, statusText: 'Server Error' })));
                TestFactory.fillForm(dom, fixture, { pname: 'Jane', username: 'janedoe', email: 'janedoe@email.com', confirmEmail: 'janedoe@email.com' });
                (dom.querySelector('app-form-modal .form > button') as HTMLElement).click();
                fixture.detectChanges();

                expect(console.error).toHaveBeenCalled();
                expect(component.requestError()).toBe('An unexpected error occurred, try again later.');
                expect(dom.querySelector('app-form-modal span')?.textContent).toBeTruthy();
            });


            it('should close the form modal', () =>
            {
                (dom.querySelector('app-form-modal #modal-trigger') as HTMLElement).click();
                fixture.detectChanges();

                expect(component.activeModal()).toBeFalsy();
                expect(dom.querySelector('app-form-modal')).toBeFalsy();
                expect(dom.querySelector('app-message-modal')).toBeFalsy();
            });
        });


        describe('Password Update', () => {
            beforeEach(() =>
            {
                (dom.querySelectorAll('.panel .controls button')[0] as HTMLElement).click();
                fixture.detectChanges();
                expect(component.activeModal()).toBe('updatePassword');
                expect(dom.querySelector('app-form-modal h3')?.textContent).toBe('Update Password');
                expect(dom.querySelector('app-form-modal span')?.textContent).toBeFalsy();
                expect(dom.querySelector('app-message-modal')).toBeFalsy();
            });

            // ------------------------------------------------------------------------

            it('should update the password', () =>
            {
                vi.spyOn(serverSpy, 'updatePassword').mockReturnValue(of(new HttpResponse({ status: 200, body: 'Ok' })));
                TestFactory.fillForm(dom, fixture, { password: 'j123456!', confirmPassword: 'j123456!' });
                (dom.querySelector('app-form-modal .form > button') as HTMLElement).click();
                fixture.detectChanges();

                expect(serverSpy.updatePassword).toHaveBeenCalledWith({ password: 'j123456!' });
                expect(component.activeModal()).toBeFalsy();
                expect(noticeSpy.showBanner).toHaveBeenCalledWith('Success! Password has been updated.');
                expect(dom.querySelector('app-form-modal')).toBeFalsy();
                expect(dom.querySelector('app-message-modal')).toBeFalsy();
            });


            it('should show the expired session message on unauthorized updates', () =>
            {
                vi.spyOn(serverSpy, 'updatePassword').mockReturnValue(throwError(() => ({ status: 401, statusText: 'Unauthorized' })));
                TestFactory.fillForm(dom, fixture, { password: 'j123456!', confirmPassword: 'j123456!' });
                (dom.querySelector('app-form-modal .form > button') as HTMLElement).click();
                fixture.detectChanges();

                expect(serverSpy.updatePassword).toHaveBeenCalled();
                expect(component.activeModal()).toBeFalsy();
                expect(component.message()).toBeUndefined();
                expect(component.showMessage()).toBe(true);
                expect(dom.querySelector('app-message-modal h3')?.textContent).toBe('Hold up…');
                expect(dom.querySelector('app-message-modal span')?.textContent).toBeFalsy();
                expect(dom.querySelector('app-message-modal p')?.textContent).toBe('Looks like your session has expired — you might have to sign in again.');
            });


            it('should show an error message on unexpected API errors', () =>
            {
                vi.spyOn(serverSpy, 'updatePassword').mockReturnValue(throwError(() => ({ status: 500, statusText: 'Server Error' })));
                TestFactory.fillForm(dom, fixture, { password: 'j123456!', confirmPassword: 'j123456!' });
                (dom.querySelector('app-form-modal .form > button') as HTMLElement).click();
                fixture.detectChanges();

                expect(console.error).toHaveBeenCalled();
                expect(component.requestError()).toBe('An unexpected error occurred, try again later.');
                expect(dom.querySelector('app-form-modal span')?.textContent).toBeTruthy();
            });


            it('should close the form modal', () =>
            {
                (dom.querySelector('app-form-modal #modal-trigger') as HTMLElement).click();
                fixture.detectChanges();

                expect(component.activeModal()).toBeFalsy();
                expect(dom.querySelector('app-form-modal')).toBeFalsy();
                expect(dom.querySelector('app-message-modal')).toBeFalsy();
            });
        });


        describe('Pin Update', () => {
            beforeEach(() =>
            {
                (dom.querySelectorAll('.panel .controls button')[1] as HTMLElement).click();
                fixture.detectChanges();
                expect(component.activeModal()).toBe('updatePin');
                expect(dom.querySelector('app-form-modal h3')?.textContent).toBe('Update Pin');
                expect(dom.querySelector('app-form-modal span')?.textContent).toBeFalsy();
                expect(dom.querySelector('app-message-modal')).toBeFalsy();
            });

            // ------------------------------------------------------------------------

            it('should update the pin', () =>
            {
                vi.spyOn(serverSpy, 'updatePin').mockReturnValue(of(new HttpResponse({ status: 200, body: 'Ok' })));
                TestFactory.fillForm(dom, fixture, { pin: '4321', confirmPin: '4321' });
                (dom.querySelector('app-form-modal .form > button') as HTMLElement).click();
                fixture.detectChanges();

                expect(serverSpy.updatePin).toHaveBeenCalledWith({ pin: '4321' });
                expect(component.activeModal()).toBeFalsy();
                expect(noticeSpy.showBanner).toHaveBeenCalledWith('Success! Pin has been updated.');
                expect(dom.querySelector('app-form-modal')).toBeFalsy();
                expect(dom.querySelector('app-message-modal')).toBeFalsy();
            });


            it('should show the expired session message on unauthorized updates', () =>
            {
                vi.spyOn(serverSpy, 'updatePin').mockReturnValue(throwError(() => ({ status: 401, statusText: 'Unauthorized' })));
                TestFactory.fillForm(dom, fixture, { pin: '4321', confirmPin: '4321' });
                (dom.querySelector('app-form-modal .form > button') as HTMLElement).click();
                fixture.detectChanges();

                expect(serverSpy.updatePin).toHaveBeenCalled();
                expect(component.activeModal()).toBeFalsy();
                expect(component.message()).toBeUndefined();
                expect(component.showMessage()).toBe(true);
                expect(dom.querySelector('app-message-modal h3')?.textContent).toBe('Hold up…');
                expect(dom.querySelector('app-message-modal span')?.textContent).toBeFalsy();
                expect(dom.querySelector('app-message-modal p')?.textContent).toBe('Looks like your session has expired — you might have to sign in again.');
            });


            it('should show an error message on unexpected API errors', () =>
            {
                vi.spyOn(serverSpy, 'updatePin').mockReturnValue(throwError(() => ({ status: 500, statusText: 'Server Error' })));
                TestFactory.fillForm(dom, fixture, { pin: '4321', confirmPin: '4321' });
                (dom.querySelector('app-form-modal .form > button') as HTMLElement).click();
                fixture.detectChanges();

                expect(console.error).toHaveBeenCalled();
                expect(component.requestError()).toBe('An unexpected error occurred, try again later.');
                expect(dom.querySelector('app-form-modal span')?.textContent).toBeTruthy();
            });


            it('should close the form modal', () =>
            {
                (dom.querySelector('app-form-modal #modal-trigger') as HTMLElement).click();
                fixture.detectChanges();

                expect(component.activeModal()).toBeFalsy();
                expect(dom.querySelector('app-form-modal')).toBeFalsy();
                expect(dom.querySelector('app-message-modal')).toBeFalsy();
            });
        });


        describe('Disable Account', () => {
            beforeEach(() =>
            {
                (dom.querySelector('.panel.danger button') as HTMLElement).click();
                fixture.detectChanges();
                expect(component.showMessage()).toBe(true);
                expect(component.message()?.notice).toBe("You're about to revoke all access — you'll need administrative assistance to regain access.");
                expect(dom.querySelector('app-message-modal h3')?.textContent).toBe('Are You Sure?');
                expect(dom.querySelector('app-message-modal span')?.textContent).toBeFalsy();
                expect(dom.querySelector('app-message-modal p')?.textContent).toBe(component.message()?.notice);
                expect(dom.querySelector('app-form-modal')).toBeFalsy();
            });

            // ------------------------------------------------------------------------

            it('should disable the account', () =>
            {
                vi.spyOn(ToolBox, 'clearSession').mockImplementation(() => {});
                vi.spyOn(serverSpy, 'disableAccount').mockReturnValue(of(new HttpResponse({ status: 200, body: 'Ok' })));
                (dom.querySelectorAll('app-message-modal .controls button')[0] as HTMLElement).click();
                fixture.detectChanges();

                expect(serverSpy.disableAccount).toHaveBeenCalledTimes(1);
                expect(ToolBox.clearSession).toHaveBeenCalledTimes(1);
            });


            it('should show the expired session message on unauthorized updates', () =>
            {
                vi.spyOn(serverSpy, 'disableAccount').mockReturnValue(throwError(() => ({ status: 401, statusText: 'Unauthorized' })));
                (dom.querySelectorAll('app-message-modal .controls button')[0] as HTMLElement).click();
                fixture.detectChanges();

                expect(serverSpy.disableAccount).toHaveBeenCalled();
                expect(component.message()).toBeUndefined();
                expect(component.showMessage()).toBe(true);
                expect(dom.querySelector('app-message-modal h3')?.textContent).toBe('Hold up…');
                expect(dom.querySelector('app-message-modal span')?.textContent).toBeFalsy();
                expect(dom.querySelector('app-message-modal p')?.textContent).toBe('Looks like your session has expired — you might have to sign in again.');
            });


            it('should show an error message on unexpected API errors', () =>
            {
                vi.spyOn(serverSpy, 'disableAccount').mockReturnValue(throwError(() => ({ status: 500, statusText: 'Server Error' })));
                (dom.querySelectorAll('app-message-modal .controls button')[0] as HTMLElement).click();
                fixture.detectChanges();

                expect(console.error).toHaveBeenCalled();
                expect(component.requestError()).toBe('An unexpected error occurred, try again later.');
                expect(dom.querySelector('app-message-modal span')?.textContent).toBeTruthy();
            });


            it('should close the message modal', () =>
            {
                (dom.querySelectorAll('app-message-modal .controls button')[1] as HTMLElement).click();
                fixture.detectChanges();

                expect(component.showMessage()).toBe(false);
                expect(dom.querySelector('app-message-modal')).toBeFalsy();
            });
        });
    });


    it('should mark content as loaded after view initialization', async() =>
    {
        await TestFactory.validateBaseLayout(component);
    });


    it('should show an error message on absent profile fields', async () =>
    {
        vi.spyOn(serverSpy, 'fetchProfile').mockReturnValue(of(new HttpResponse<Profile>({ status: 204, body: null })));
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(component.profile()).toEqual(mapProfileFields(null));
        expect(component.generalError()).toBe('An unexpected error occurred. Please try again later.');
        expect(component.requestError()).toBeFalsy();
        expect(component.initial()).toBe('?');
        expect(component.showMessage()).toBe(false);
        expect(component.activeModal()).toBeFalsy();
        expect(component.message()).toBeFalsy();

        expect(dom.querySelectorAll('.panel').length).toBe(3);
        expect(dom.querySelector('.error-text.general')?.textContent).toBeTruthy();
        expect(dom.querySelector('.initial')?.textContent).toBe('?');
        expect(dom.querySelector('.layout.muted')).toBeTruthy();
        expect(dom.querySelectorAll('.layout .row').length).toBe(3);
        component.profile().forEach((item, i) => {
            expect(dom.querySelectorAll('.panel dt')[i]?.textContent).toBe(item.label);
            expect(dom.querySelectorAll('.panel dd')[i]?.textContent).toBe(item.value);
        });
        expect(Array.from(dom.querySelectorAll('button')).filter(item => item.disabled).length).toBe(4);

        expect(dom.querySelector('app-form-modal')).toBeFalsy();
        expect(dom.querySelector('app-message-modal')).toBeFalsy();
    });


    it('should show the expired session message on unauthenticated requests', async () =>
    {
        vi.spyOn(serverSpy, 'fetchProfile').mockReturnValue(throwError(() => ({ status: 401, statusText: 'Unauthorized' })));
        fixture.detectChanges();
        
        expect(component).toBeTruthy();
        expect(component.profile()).toEqual(mapProfileFields(null));
        expect(component.generalError()).toBe('Your session is invalid. Please log back in and try again.');
        expect(component.requestError()).toBeFalsy();
        expect(component.initial()).toBe('?');
        expect(component.showMessage()).toBe(true);
        expect(component.activeModal()).toBeFalsy();
        expect(component.message()).toBeFalsy();

        expect(dom.querySelectorAll('.section .panel').length).toBe(3);
        expect(dom.querySelector('.error-text.general')?.textContent).toBeTruthy();
        expect(dom.querySelector('.initial')?.textContent).toBe('?');
        expect(dom.querySelector('.layout.muted')).toBeTruthy();
        expect(dom.querySelectorAll('.layout .row').length).toBe(3);
        component.profile().forEach((item, i) => {
            expect(dom.querySelectorAll('.panel dt')[i]?.textContent).toBe(item.label);
            expect(dom.querySelectorAll('.panel dd')[i]?.textContent).toBe(item.value);
        });
        expect(Array.from(dom.querySelectorAll('button')).filter(item => item.disabled).length).toBe(4);
        expect(dom.querySelector('app-form-modal')).toBeFalsy();
    });


    it('should show an error message on unknown API errors', async () =>
    {
        vi.spyOn(serverSpy, 'fetchProfile').mockReturnValue(throwError(() => ({ status: 500, statusText: 'Server Error' })));
        fixture.detectChanges();
        expect(console.error).toHaveBeenCalledTimes(1);

        expect(component).toBeTruthy();
        expect(component.profile()).toEqual(mapProfileFields(null));
        expect(component.generalError()).toBe('An unexpected error occurred. Please try again later.');
        expect(component.requestError()).toBeFalsy();
        expect(component.initial()).toBe('?');
        expect(component.showMessage()).toBe(false);
        expect(component.activeModal()).toBeFalsy();
        expect(component.message()).toBeFalsy();

        expect(dom.querySelectorAll('.section .panel').length).toBe(3);
        expect(dom.querySelector('.error-text.general')?.textContent).toBeTruthy();
        expect(dom.querySelector('.initial')?.textContent).toBe('?');
        expect(dom.querySelector('.layout.muted')).toBeTruthy();
        expect(dom.querySelectorAll('.layout .row').length).toBe(3);
        component.profile().forEach((item, i) => {
            expect(dom.querySelectorAll('.panel dt')[i]?.textContent).toBe(item.label);
            expect(dom.querySelectorAll('.panel dd')[i]?.textContent).toBe(item.value);
        });
        expect(Array.from(dom.querySelectorAll('button')).filter(item => item.disabled).length).toBe(4);

        expect(dom.querySelector('app-form-modal')).toBeFalsy();
        expect(dom.querySelector('app-message-modal')).toBeFalsy();
    });
});
