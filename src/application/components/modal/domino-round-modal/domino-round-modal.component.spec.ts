import { ComponentFixture, TestBed } from '@angular/core/testing';


import { DominoRoundModalComponent } from './domino-round-modal.component';


/**
 * Tests the DominoRoundModalComponent class.
 */
describe('DominoRoundModalComponent', () => {
    // Fields ---------------------------------------------------------------------
    let dom: HTMLElement;

    let component: DominoRoundModalComponent;
    let fixture: ComponentFixture<DominoRoundModalComponent>;

    const players = [ 'johndoe', 'janesmith', 'maggiewells' ];

    // Setup ----------------------------------------------------------------------

    beforeEach(async () =>
    {
        await TestBed.configureTestingModule({ imports: [DominoRoundModalComponent] }).compileComponents();
        fixture = TestBed.createComponent(DominoRoundModalComponent);
        component = fixture.componentInstance;

        dom = fixture.nativeElement;
        vi.spyOn(console, 'error');
        vi.spyOn(component.closed, 'emit');
        vi.spyOn(component.submitted, 'emit');
    });

    // Tests ----------------------------------------------------------------------

    describe('With Data', () => {
        const round = [
            { gain: 0, total: 10, special: false },
            { gain: 45, total: 55, special: false },
            { gain: 45, total: 45, special: false }
        ];

        beforeEach(() =>
        {
            fixture.componentRef.setInput('data', round);
            fixture.componentRef.setInput('index', 1);
            fixture.componentRef.setInput('players', players);
            fixture.detectChanges();
        });

        // ------------------------------------------------------------------------

        it('should create component', () =>
        {
            expect(component.earned()).toBe(45);
            expect(component.winners()).toEqual([false, true, true]);
            expect(component.doubleZero()).toBe(false);
            expect(component.roundError()).toBeFalsy();

            expect(dom.querySelector('h4')?.textContent).toBe('Round 2');
            expect(dom.querySelector('.error-text.general')?.textContent).toBeFalsy();
            expect((dom.querySelector('.toggle input') as HTMLInputElement).checked).toBe(false);
            expect((dom.querySelector('#points') as HTMLInputElement).value).toBe('45');
            expect(dom.querySelectorAll('.criteria label')[0].textContent).toBe('johndoe');
            expect(dom.querySelectorAll('.criteria label')[1].textContent).toBe('janesmith');
            expect(dom.querySelectorAll('.criteria label')[2].textContent).toBe('maggiewells');
            expect(dom.querySelectorAll('.criteria input:checked').length).toBe(2);
            expect((dom.querySelector('.controls button') as HTMLButtonElement).disabled).toBe(false);
            expect(dom.querySelector('.controls button.secondary')).toBeTruthy();
        });


        it('should toggle the double zero status', () =>
        {
            (dom.querySelector('.toggle input') as HTMLElement).click();
            fixture.detectChanges();
            expect(component.earned()).toBe(100);
            expect(component.winners()).toEqual([false, false, false]);
            expect(component.doubleZero()).toBe(true);
            expect(component.roundError()).toBe('Please select a winner to award the points.');
            expect(dom.querySelector('.error-text.general')?.textContent).toBe('Please select a winner to award the points.');
            expect((dom.querySelector('#points') as HTMLInputElement).disabled).toBe(true);
            expect(dom.querySelector('.criteria input')?.getAttribute('type')).toBe('radio');
            expect((dom.querySelector('.controls button') as HTMLButtonElement).disabled).toBe(true);

            (dom.querySelector('.toggle input') as HTMLElement).click();
            fixture.detectChanges();
            expect(component.earned()).toBe(0);
            expect(component.winners()).toEqual([false, false, false]);
            expect(component.doubleZero()).toBe(false);
            expect(component.roundError()).toBe('Please enter valid points for this round.');
            expect(dom.querySelector('.error-text.general')?.textContent).toBe('Please enter valid points for this round.');
            expect((dom.querySelector('#points') as HTMLInputElement).disabled).toBe(false);
            expect(dom.querySelector('.criteria input')?.getAttribute('type')).toBe('checkbox');
            expect((dom.querySelector('.controls button') as HTMLButtonElement).disabled).toBe(true);
        });


        describe('With Double Zero', () => {
            beforeEach(() =>
            {
                (dom.querySelector('.toggle input') as HTMLElement).click();
                fixture.detectChanges();
            });

            // --------------------------------------------------------------------

            it('should reject points on input', () =>
            {
                const input = dom.querySelector('#points') as HTMLInputElement;
                input.value = '99';
                input.dispatchEvent(new Event('input'));
                fixture.detectChanges();
                expect(component.earned()).toBe(100);
                expect(component.roundError()).toBe('Please select a winner to award the points.');
                expect(dom.querySelector('.error-text.general')?.textContent).toBe('Please select a winner to award the points.');
            });


            it('should select a single winner', () =>
            {
                (dom.querySelectorAll('.criteria label')[0] as HTMLElement).click();
                fixture.detectChanges();
                expect(component.winners()).toEqual([true, false, false]);
                expect(component.roundError()).toBeFalsy();
                expect(dom.querySelector('.error-text.general')?.textContent).toBeFalsy();
                expect(dom.querySelectorAll('.criteria input:checked').length).toBe(1);
                expect((dom.querySelector('.controls button') as HTMLButtonElement).disabled).toBe(false);

                (dom.querySelectorAll('.criteria label')[2] as HTMLElement).click();
                fixture.detectChanges();
                expect(component.winners()).toEqual([false, false, true]);
                expect(component.roundError()).toBeFalsy();
                expect(dom.querySelector('.error-text.general')?.textContent).toBeFalsy();
                expect(dom.querySelectorAll('.criteria input:checked').length).toBe(1);
                expect((dom.querySelector('.controls button') as HTMLButtonElement).disabled).toBe(false);
            });


            it('should emit when the save button is clicked', () =>
            {
                (dom.querySelectorAll('.criteria label')[0] as HTMLElement).click();
                fixture.detectChanges();
                (dom.querySelector('.controls button') as HTMLElement).click();

                expect(component.submitted.emit).toHaveBeenCalledTimes(1);
                expect(component.submitted.emit).toHaveBeenCalledWith([
                    { gain: 100, total: 0, special: true },
                    { gain: 0, total: 0, special: true },
                    { gain: 0, total: 0, special: true }
               ]);
            });
        });


        describe('Without Double Zero', () => {
            it('should reject points outside the valid range', () =>
            {
                const input = dom.querySelector('#points') as HTMLInputElement;
                input.value = '150';
                input.dispatchEvent(new Event('input'));
                fixture.detectChanges();
                expect(component.earned()).toBe(150);
                expect(component.roundError()).toBe('Please enter valid points for this round.');
                expect(dom.querySelector('.error-text.general')?.textContent).toBe('Please enter valid points for this round.');

                input.value = '2';
                input.dispatchEvent(new Event('input'));
                fixture.detectChanges();
                expect(component.earned()).toBe(2);
                expect(component.roundError()).toBe('Please enter valid points for this round.');
                expect(dom.querySelector('.error-text.general')?.textContent).toBe('Please enter valid points for this round.');
            });


            it('should select at least one winner', () =>
            {
                (dom.querySelectorAll('.criteria label')[0] as HTMLElement).click();
                fixture.detectChanges();
                expect(component.winners()).toEqual([true, true, true]);
                expect(component.roundError()).toBeFalsy();
                expect(dom.querySelector('.error-text.general')?.textContent).toBeFalsy();
                expect(dom.querySelectorAll('.criteria input:checked').length).toBe(3);
                expect((dom.querySelector('.controls button') as HTMLButtonElement).disabled).toBe(false);

                (dom.querySelectorAll('.criteria label')[0] as HTMLElement).click();
                fixture.detectChanges();
                (dom.querySelectorAll('.criteria label')[1] as HTMLElement).click();
                fixture.detectChanges();
                (dom.querySelectorAll('.criteria label')[2] as HTMLElement).click();
                fixture.detectChanges();

                expect(component.winners()).toEqual([false, false, false]);
                expect(component.roundError()).toBe('Please select at least one winner to award the points.');
                expect(dom.querySelector('.error-text.general')?.textContent).toBe('Please select at least one winner to award the points.');
                expect(dom.querySelector('.criteria input:checked')).toBeFalsy();
                expect((dom.querySelector('.controls button') as HTMLButtonElement).disabled).toBe(true);
            });


            it('should emit when the save button is clicked', () =>
            {
                (dom.querySelector('.controls button') as HTMLElement).click();
                expect(component.submitted.emit).toHaveBeenCalledTimes(1);
                expect(component.submitted.emit).toHaveBeenCalledWith([
                    { gain: 0, total: 0, special: false },
                    { gain: 45, total: 0, special: false },
                    { gain: 45, total: 0, special: false }
               ]);
            });
        });


        it('should emit when the remove button is clicked', () =>
        {
            (dom.querySelector('.controls button.secondary') as HTMLElement).click();
            expect(component.submitted.emit).toHaveBeenCalledTimes(1);
            expect(component.submitted.emit).toHaveBeenCalledWith([]);
        });


        it('should emit when the close button is clicked', () =>
        {
            (dom.querySelector('#modal-trigger') as HTMLElement).click();
            expect(component.closed.emit).toHaveBeenCalledTimes(1);
        });
    });


    it('should create component without data', () =>
    {
        fixture.componentRef.setInput('index', 0);
        fixture.componentRef.setInput('players', players);
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(component.earned()).toBe(0);
        expect(component.winners()).toEqual([false, false, false]);
        expect(component.doubleZero()).toBe(false);
        expect(component.roundError()).toBe('Please enter valid points for this round.');

        expect(dom.querySelector('h4')?.textContent).toBe('Round 1');
        expect(dom.querySelector('.error-text.general')?.textContent).toBe('Please enter valid points for this round.');
        expect((dom.querySelector('.toggle input') as HTMLInputElement).checked).toBe(false);
        expect((dom.querySelector('#points') as HTMLInputElement).value).toBe('0');
        expect(dom.querySelectorAll('.criteria label').length).toBe(3);
        expect(dom.querySelector('.criteria input:checked')).toBeFalsy();
        expect((dom.querySelector('.controls button') as HTMLButtonElement).disabled).toBe(true);
        expect(dom.querySelector('.controls button.secondary')).toBeFalsy();
    });
});
