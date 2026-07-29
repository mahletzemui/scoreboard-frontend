import { ComponentFixture, TestBed } from '@angular/core/testing';


import { FormModalComponent } from './form-modal.component';

import { createUpdatePinForm, createVerifyPlayerForm } from '../../../constants/prompts';


/**
 * Tests the FormModalComponent class.
 */
describe('FormModalComponent', () => {
    // Fields ---------------------------------------------------------------------
    let dom: HTMLElement;

    let component: FormModalComponent;
    let fixture: ComponentFixture<FormModalComponent>;

    // Setup ----------------------------------------------------------------------

    beforeEach(async () =>
    {
        await TestBed.configureTestingModule({ imports: [ FormModalComponent ] }).compileComponents();
        fixture = TestBed.createComponent(FormModalComponent);
        component = fixture.componentInstance;

        dom = fixture.nativeElement;
        vi.spyOn(console, 'error');
        vi.spyOn(component.submitted, 'emit');
        vi.spyOn(component.closed, 'emit');
    });

    // Tests ----------------------------------------------------------------------

    describe('With Icons', () => {
        const form = createUpdatePinForm();

        beforeEach(() =>
        {
            fixture.componentRef.setInput('type', 'updatePin');
            fixture.detectChanges();
            expect(console.error).not.toHaveBeenCalled();
        });

        // ------------------------------------------------------------------------

        it('should create component', () =>
        {
            expect(component).toBeTruthy();
            expect(component.model()?.title).toBe(form.title);
            expect(component.model()?.fields).toEqual(form.fields);
            expect(component.model()).not.toBe(form);

            expect(dom.querySelector('h4')?.textContent).toBe(form.title);
            expect(dom.querySelector('.error-text.general')?.textContent).toBeFalsy();
            expect(dom.querySelectorAll('.field').length).toBe(2);
            expect(dom.querySelectorAll('.field button.icon').length).toBe(2);
            expect((dom.querySelector('#pin') as HTMLInputElement).type).toBe('password');
            expect(dom.querySelectorAll('.error-text.input')[0]?.textContent).toBeFalsy();
            expect((dom.querySelector('#confirmPin') as HTMLInputElement).type).toBe('password');
            expect(dom.querySelectorAll('.error-text.input')[1]?.textContent).toBeFalsy();
            expect(dom.querySelector('.panel.form > button')?.textContent).toBe(form.title.split(' ')[0]);
        });


        it('should update the general error message on updates changes', () =>
        {
            fixture.componentRef.setInput('updates', 'Please try again later!');
            fixture.detectChanges();
            expect(component.model()?.error).toBe('Please try again later!');
            expect(dom.querySelector('.error-text.general')?.textContent).toBe('Please try again later!');
        });


        it('should toggle the password field visibility', () =>
        {
            const toggleButtons = dom.querySelectorAll('.field button.icon');
            (toggleButtons[0] as HTMLElement).click();
            fixture.detectChanges();
            expect(component.model()?.fields[0].visible).toBe(true);
            expect((dom.querySelector('#pin') as HTMLInputElement).type).toBe('text');

            (toggleButtons[0] as HTMLElement).click();
            fixture.detectChanges();
            expect(component.model()!.fields[0].visible).toBe(false);
            expect((dom.querySelector('#pin') as HTMLInputElement).type).toBe('password');
        });


        it('should update the field values on input', () =>
        {
            const input = dom.querySelector('#pin') as HTMLInputElement;
            input.value = '1234';
            input.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            expect(component.model()?.intake.get('pin')?.value).toBe('1234');
        });


        it('should validate the field values on blur', () =>
        {
            const input = dom.querySelector('#pin') as HTMLInputElement;
            input.value = 'invalid username';
            input.dispatchEvent(new Event('blur'));
            fixture.detectChanges();
            expect(component.model()?.fields[0].error).toBe('Must be 4 to 6 digits.');
            expect(dom.querySelectorAll('.error-text.input')[0]?.textContent).toContain('Must be 4 to 6 digits.');
        });


        it('should submit when all fields are valid', () =>
        {
            const pinInput = dom.querySelector('#pin') as HTMLInputElement;
            pinInput.value = '1234';
            pinInput.dispatchEvent(new Event('input'));

            const confirmInput = dom.querySelector('#confirmPin') as HTMLInputElement;
            confirmInput.value = '1234';
            confirmInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            (dom.querySelector('.panel.form > button') as HTMLElement).click();
            fixture.detectChanges();
            expect(component.submitted.emit).toHaveBeenCalledTimes(1);
            expect(component.submitted.emit).toHaveBeenCalledWith(component.model());
            expect(component.model()?.fields[0].error).toBeUndefined();
            expect(component.model()?.fields[1].error).toBeUndefined();
        });


        it('should not submit when fields are invalid', () =>
        {
            const pinInput = dom.querySelector('#pin') as HTMLInputElement;
            pinInput.value = '12';
            pinInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            (dom.querySelector('.panel.form > button') as HTMLElement).click();
            fixture.detectChanges();

            expect(component.submitted.emit).not.toHaveBeenCalled();
            expect(component.model()?.error).toBe('Please verify all field inputs.');
            expect(component.model()?.fields[0].error).toBeTruthy();
            expect(component.model()?.fields[1].error).toBeTruthy();

            expect(dom.querySelector('.error-text.general')?.textContent).toBe('Please verify all field inputs.');
            expect(dom.querySelectorAll('.error-text.input')[0]?.textContent).toBeTruthy();
            expect(dom.querySelectorAll('.error-text.input')[1]?.textContent).toBeTruthy();
        });


        it('should emit when the close button is clicked', () =>
        {
            (dom.querySelector('#modal-trigger') as HTMLElement).click();
            expect(component.closed.emit).toHaveBeenCalledTimes(1);
        });
    });


    it('should create component without icons', () =>
    {
        const form = createVerifyPlayerForm();
        fixture.componentRef.setInput('type', 'verifyPlayer');
        fixture.detectChanges();

        expect(console.error).not.toHaveBeenCalled();
        expect(component).toBeTruthy();
        expect(component.model()?.title).toBe(form.title);
        expect(component.model()?.fields).toEqual(form.fields);
        expect(component.model()).not.toBe(form);

        expect(dom.querySelector('h4')?.textContent).toBe(form.title);
        expect(dom.querySelector('.error-text.general')?.textContent).toBeFalsy();
        expect(dom.querySelectorAll('.field').length).toBe(2);
        expect(dom.querySelector('.field button.icon')).toBeFalsy();
        expect((dom.querySelector('#username') as HTMLInputElement).type).toBe('text');
        expect(dom.querySelectorAll('.error-text.input')[0]?.textContent).toBeFalsy();
        expect((dom.querySelector('#pin') as HTMLInputElement).type).toBe('password');
        expect(dom.querySelectorAll('.error-text.input')[1]?.textContent).toBeFalsy();
        expect(dom.querySelector('.panel.form > button')?.textContent).toBe(form.title.split(' ')[0]);
    });

    
    it('should log an error for an unrecognized form type', () =>
    {
        fixture.componentRef.setInput('type', 'unknown');
        fixture.detectChanges();

        expect(console.error).toHaveBeenCalledTimes(1);
        expect(component.model()).toBeUndefined();
        expect(dom.querySelector('h4')?.textContent).toBe('Well... This Is Awkward');
        expect(dom.querySelector('p')?.textContent).toBe("I don't know what to do with this, so I'm going to assume there's nothing to show.");

        (dom.querySelector('#modal-trigger') as HTMLElement).click();
        expect(component.closed.emit).toHaveBeenCalledTimes(1);
    });
});
