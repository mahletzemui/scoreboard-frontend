import { FormControl, FormGroup } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';


import { FormFieldComponent } from './form-field.component';

import { Field } from '../../models/prompts';
import { FormValidator } from '../../utils';


/**
 * Tests the FormFieldComponent class.
 */
describe('FormFieldComponent', () => {
    // Fields ---------------------------------------------------------------------
    let dom: HTMLElement;

    let component: FormFieldComponent;
    let fixture: ComponentFixture<FormFieldComponent>;

    // Setup ----------------------------------------------------------------------

    beforeEach(async () =>
    {
        await TestBed.configureTestingModule({ imports: [FormFieldComponent] }).compileComponents();
        fixture = TestBed.createComponent(FormFieldComponent);
        component = fixture.componentInstance;
        dom = fixture.nativeElement;
    });

    // Tests ----------------------------------------------------------------------

    describe('General', () => {
        let field: Field;
        let intake: FormGroup;

        beforeEach(() =>
        {
            field = { name: 'username', label: 'Username', type: 'text', placeholder: 'Enter your username', default: '', autocomplete: 'username' };
            intake = new FormGroup({ username: new FormControl('', FormValidator.username()) });

            fixture.componentRef.setInput('field', field);
            fixture.componentRef.setInput('intake', intake);
            fixture.componentRef.setInput('prefix', 'existing-');
            fixture.componentRef.setInput('validate', true);
            fixture.detectChanges();
        });

        // ------------------------------------------------------------------------

        it('should create component', () =>
        {
            expect(component).toBeTruthy();
            expect(field.error).toBeFalsy();
            expect(dom.querySelector('label')?.textContent).toBe('Username');
            expect(dom.querySelector('label')?.getAttribute('for')).toBe('existing-username');

            const input = dom.querySelector('input') as HTMLInputElement;
            expect(input.id).toBe('existing-username');
            expect(input.type).toBe('text');
            expect(input.placeholder).toBe('Enter your username');
            expect(dom.querySelector('button.icon')).toBeFalsy();
            expect(dom.querySelector('.error-text.input')?.textContent).toBe('');
        });


        it('should update the field with an input', () =>
        {
            const input = dom.querySelector('input') as HTMLInputElement;
            input.value = 'johndoe';
            input.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            expect(field.error).toBeFalsy();
            expect(intake.get('username')?.value).toBe('johndoe');
            expect(dom.querySelector('.error-text.input')?.textContent).toBe('');
        });


        it('should validate the field on blur', () =>
        {
            (dom.querySelector('input') as HTMLInputElement).dispatchEvent(new Event('blur'));
            fixture.detectChanges();
            expect(field.error).toBe('Must only contain 1 to 20 characters including letters, numbers and/or special characters (i.e., .|_|-).');
            expect(dom.querySelector('.error-text.input')?.textContent).toBe('Must only contain 1 to 20 characters including letters, numbers and/or special characters (i.e., .|_|-).');
        });
    });


    describe('Password', () => {
        let field: Field;
        let intake: FormGroup;

        beforeEach(() =>
        {
            field = { name: 'password', label: 'Password', visible: false, placeholder: 'Enter your password', default: '', autocomplete: 'current-password' };
            intake = new FormGroup({ password: new FormControl('', FormValidator.password()) });

            fixture.componentRef.setInput('field', field);
            fixture.componentRef.setInput('intake', intake);
            fixture.detectChanges();
        });

        // ------------------------------------------------------------------------

        it('should create component', () =>
        {
            expect(component).toBeTruthy();
            expect(field.error).toBeFalsy();
            expect(dom.querySelector('label')?.textContent).toBe('Password');
            expect(dom.querySelector('label')?.getAttribute('for')).toBe('password');

            const input = dom.querySelector('input') as HTMLInputElement;
            expect(input.id).toBe('password');
            expect(input.type).toBe('password');
            expect(input.placeholder).toBe('Enter your password');
            expect(dom.querySelector('button.icon')).toBeTruthy();
            expect(dom.querySelector('.error-text.input')).toBeFalsy();
        });


        it('should toggle field visibility', () =>
        {
            (dom.querySelector('button.icon') as HTMLElement).click();
            fixture.detectChanges();
            expect(field.visible).toBe(true);
            expect((dom.querySelector('input') as HTMLInputElement).type).toBe('text');

            (dom.querySelector('button.icon') as HTMLElement).click();
            fixture.detectChanges();
            expect(field.visible).toBe(false);
            expect((dom.querySelector('input') as HTMLInputElement).type).toBe('password');
        });

        
        it('should update the field with an input', () =>
        {
            const input = dom.querySelector('input') as HTMLInputElement;
            input.value = 'j123456!';
            input.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            expect(field.error).toBeFalsy();
            expect(intake.get('password')?.value).toBe('j123456!');
            expect(dom.querySelector('.error-text.input')).toBeFalsy();
        });


        it('should not validate the field on blur', () =>
        {
            (dom.querySelector('input') as HTMLInputElement).dispatchEvent(new Event('blur'));
            fixture.detectChanges();
            expect(field.error).toBeFalsy();
            expect(dom.querySelector('.error-text.input')).toBeFalsy();
        });
    });
});
