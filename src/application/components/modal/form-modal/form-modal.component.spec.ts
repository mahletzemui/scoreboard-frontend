import { ComponentFixture, TestBed } from '@angular/core/testing';


import { FormModalComponent } from './form-modal.component';
import { TestFactory } from '../../../utils/test-factory';

import { createVerifyPlayerForm } from '../../../constants/prompts';


/**
 * Tests the FormModalComponent class.
 */
describe('FormModalComponent', () => {
    // Fields ---------------------------------------------------------------------
    let dom: HTMLElement;

    let component: FormModalComponent;
    let fixture: ComponentFixture<FormModalComponent>;

    const form = createVerifyPlayerForm();

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

    describe('With Form', () => {
        const form = createVerifyPlayerForm();

        beforeEach(() =>
        {
            fixture.componentRef.setInput('type', 'verifyPlayer');
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

            expect(dom.querySelector('h3')?.textContent).toBe(form.title);
            expect(dom.querySelector('.error-text.general')?.textContent).toBeFalsy();
            expect(dom.querySelectorAll('.form .wrapper').length).toBe(2);
            expect((dom.querySelector('#username') as HTMLInputElement).type).toBe('text');
            expect(dom.querySelectorAll('.error-text.input')[0]?.textContent).toBeFalsy();
            expect((dom.querySelector('#pin') as HTMLInputElement).type).toBe('password');
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


        it('should submit when all fields are valid', () =>
        {
            TestFactory.fillForm(dom.querySelector('.form')!, fixture, { username: 'johndoe', pin: '1234' });
            (dom.querySelector('.panel.form > button') as HTMLElement).click();
            fixture.detectChanges();

            expect(component.submitted.emit).toHaveBeenCalledTimes(1);
            expect(component.submitted.emit).toHaveBeenCalledWith(component.model());
            expect(component.model()?.fields[0].error).toBeFalsy();
            expect(component.model()?.fields[1].error).toBeFalsy();
        });


        it('should not submit when fields are invalid', () =>
        {
            TestFactory.fillForm(dom.querySelector('.form')!, fixture, { username: '$' });
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

    
    it('should log an error for an unrecognized form name', () =>
    {
        fixture.componentRef.setInput('type', 'unknown');
        fixture.detectChanges();

        expect(console.error).toHaveBeenCalledTimes(1);
        expect(component.model()).toBeFalsy();
        expect(dom.querySelector('h3')?.textContent).toBe('Well... This Is Awkward');
        expect(dom.querySelector('p')?.textContent).toBe("I don't know what to do with this, so I'm going to assume there's nothing to show.");

        (dom.querySelector('#modal-trigger') as HTMLElement).click();
        expect(component.closed.emit).toHaveBeenCalledTimes(1);
    });
});
