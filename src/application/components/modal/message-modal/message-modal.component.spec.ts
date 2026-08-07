import { ComponentFixture, TestBed } from '@angular/core/testing';


import { MessageModalComponent } from './message-modal.component';

import { ToolBox } from '../../../utils';
import { createSessionMessage } from '../../../constants/prompts';


/**
 * Tests the MessageModalComponent class.
 */
describe('MessageModalComponent', () => {
    // Fields ---------------------------------------------------------------------
    let dom: HTMLElement;

    let component: MessageModalComponent;
    let fixture: ComponentFixture<MessageModalComponent>;

    // Setup ----------------------------------------------------------------------

    beforeEach(async () =>
    {
        await TestBed.configureTestingModule({ imports: [MessageModalComponent] }).compileComponents();
        fixture = TestBed.createComponent(MessageModalComponent);
        component = fixture.componentInstance;

        dom = fixture.nativeElement;
        vi.spyOn(component.closed, 'emit');
        vi.spyOn(component.submitted, 'emit');
        vi.spyOn(ToolBox, 'clearSession').mockImplementation(() => {});
    });

    // Tests ----------------------------------------------------------------------

    describe('With Data', () => {
        const message = {
            title: 'Are You Sure?',
            notice: 'This action is permanent.',
            actions: [ { label: 'Yes', value: true }, { label: 'No', value: false } ]
        };

        beforeEach(() =>
        {
            fixture.componentRef.setInput('data', message);
            fixture.detectChanges();
        });

        // ------------------------------------------------------------------------

        it('should create component', () =>
        {
            expect(component).toBeTruthy();
            expect(component.model()).toEqual({ ...message, error: '' });
            expect(component.model()).not.toBe(message);

            expect(dom.querySelector('h3')?.textContent).toBe('Are You Sure?');
            expect(dom.querySelector('.error-text.general')?.textContent).toBeFalsy();
            expect(dom.querySelector('p')?.textContent).toBe('This action is permanent.');
            expect(dom.querySelectorAll('.controls button').length).toBe(2);
            expect(dom.querySelectorAll('.controls button')[0].classList.contains('secondary')).toBe(false);
            expect(dom.querySelectorAll('.controls button')[1].classList.contains('secondary')).toBe(true);
        });


        it('should update the error message on updates change', () =>
        {
            fixture.componentRef.setInput('updates', 'Please try again later!');
            fixture.detectChanges();
            expect(component.model().error).toBe('Please try again later!');
            expect(dom.querySelector('.error-text.general')?.textContent).toBe('Please try again later!');
        });


        it('should emit when the submit button is clicked', () =>
        {
            (dom.querySelectorAll('.controls button')[0] as HTMLElement).click();
            fixture.detectChanges();
            expect(component.submitted.emit).toHaveBeenCalledTimes(1);
        });


        it('should emit without clearing session when the close button is clicked', () =>
        {
            (dom.querySelector('#modal-trigger') as HTMLElement).click();
            fixture.detectChanges();
            expect(component.closed.emit).toHaveBeenCalledTimes(1);
            expect(ToolBox.clearSession).not.toHaveBeenCalled();

            (dom.querySelectorAll('.controls button')[1] as HTMLElement).click();
            fixture.detectChanges();
            expect(component.closed.emit).toHaveBeenCalledTimes(2);
            expect(ToolBox.clearSession).not.toHaveBeenCalled();
        });
    });


    describe('Without Data', () => {
        const message = createSessionMessage();

        beforeEach(() =>
        {
            fixture.detectChanges();
        });

        // ------------------------------------------------------------------------

        it('should create component', () =>
        {
            expect(component).toBeTruthy();
            expect(component.model()).toEqual({ ...message, error: '' });
            expect(component.model()).not.toBe(message);

            expect(dom.querySelector('h3')?.textContent).toBe(message.title);
            expect(dom.querySelector('.error-text.general')?.textContent).toBeFalsy();
            expect(dom.querySelector('p')?.textContent).toBe(message.notice);
            expect(dom.querySelectorAll('.controls button').length).toBe(1);
            expect(dom.querySelector('.controls button')?.textContent).toBe(message.actions[0].label);
            expect(dom.querySelector('.controls button')?.classList.contains('secondary')).toBe(true);
        });


        it('should clear the session and emit when the close button is clicked', () =>
        {
            (dom.querySelector('.controls button') as HTMLElement).click();
            fixture.detectChanges();
            expect(component.closed.emit).toHaveBeenCalledTimes(1);
            expect(ToolBox.clearSession).toHaveBeenCalledTimes(1);
        });
    });
});
