import { ComponentFixture, TestBed } from '@angular/core/testing';


import { FinderComponent } from './finder.component';

import { CheckFilter, DateFilter } from '../../models/queries';
import { createGameFilter } from '../../constants/queries';


/**
 * Tests the FinderComponent class.
 */
describe('FinderComponent', () => {
    // Fields ---------------------------------------------------------------------
    let dom: HTMLElement;

    let component: FinderComponent;
    let fixture: ComponentFixture<FinderComponent>;

    // Setup ----------------------------------------------------------------------

    beforeEach(async () =>
    {
        await TestBed.configureTestingModule({ imports: [ FinderComponent ] }).compileComponents();
        fixture = TestBed.createComponent(FinderComponent);
        component = fixture.componentInstance;

        dom = fixture.nativeElement;
        vi.spyOn(console, 'error');
        vi.spyOn(component.searched, 'emit');
        vi.spyOn(component.filtered, 'emit');
    });

    // Tests ----------------------------------------------------------------------

    describe('Without Filter', () => {
        beforeEach(() =>
        {
            fixture.detectChanges();
            expect(console.error).not.toHaveBeenCalled();
        });

        // ------------------------------------------------------------------------

        it('should create component', () =>
        {
            expect(component).toBeTruthy();
            expect(component.terms()).toEqual([]);
            expect(component.opened()).toBe(false);
            expect(component.filterCount()).toBe(0);
            expect(component.filters()).toBeFalsy();

            expect(dom.querySelector('#keywords')).toBeTruthy();
            expect(dom.querySelectorAll('.chips span').length).toBe(0);
            expect(dom.querySelector('.divider')).toBeFalsy();
            expect(dom.querySelector('.icon')).toBeFalsy();
            expect(dom.querySelector('.popover')).toBeFalsy();
        });


        it('should add and remove search terms', () =>
        {
            const input = dom.querySelector('#keywords') as HTMLInputElement;

            // ignores backspaces when there are no terms to remove
            input.value = '';
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
            fixture.detectChanges();
            expect(component.terms()).toEqual([]);
            expect(component.searched.emit).not.toHaveBeenCalled();
            expect(dom.querySelectorAll('.chips span').length).toBe(0);

            // ignores blank terms
            input.value = '   ';
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
            fixture.detectChanges();
            expect(component.terms()).toEqual([]);
            expect(component.searched.emit).not.toHaveBeenCalled();
            expect(dom.querySelectorAll('.chips span').length).toBe(0);

            // adds a term
            input.value = 'Combo ';
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
            fixture.detectChanges();
            expect(component.terms()).toEqual(['combo']);
            expect(component.searched.emit).toHaveBeenCalledWith(['combo']);
            expect(dom.querySelectorAll('.chips span').length).toBe(1);
            expect(dom.querySelector('.chips span')?.textContent).toContain('combo');

            // adds a second term
            input.value = ' strEak ';
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
            fixture.detectChanges();
            expect(component.terms()).toEqual(['combo', 'streak']);
            expect(dom.querySelectorAll('.chips span').length).toBe(2);

            // ignores duplicate terms
            input.value = 'COMBO';
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
            fixture.detectChanges();
            expect(component.terms()).toEqual(['combo', 'streak']);
            expect(component.searched.emit).toHaveBeenCalledTimes(2);
            expect(dom.querySelectorAll('.chips span').length).toBe(2);

            // ignores backspaces while the input still has text
            input.value = 'partial';
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
            fixture.detectChanges();
            expect(component.terms()).toEqual(['combo', 'streak']);
            expect(dom.querySelectorAll('.chips span').length).toBe(2);

            // removes the last term on backspaces when the input is empty
            input.value = '';
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
            fixture.detectChanges();
            expect(component.terms()).toEqual(['combo']);
            expect(component.searched.emit).toHaveBeenCalledWith(['combo']);
            expect(dom.querySelectorAll('.chips span').length).toBe(1);

            // removes a term via its chip button
            (dom.querySelector('.chips button') as HTMLElement).click();
            fixture.detectChanges();
            expect(component.terms()).toEqual([]);
            expect(component.searched.emit).toHaveBeenCalledWith([]);
            expect(dom.querySelectorAll('.chips span').length).toBe(0);
        });
    });


    describe('With Filter', () => {
        beforeEach(() =>
        {
            fixture.componentRef.setInput('data', createGameFilter('connect4'));
            fixture.detectChanges();
            expect(console.error).not.toHaveBeenCalled();
        });

        // ------------------------------------------------------------------------

        it('should create component', () =>
        {
            expect(component).toBeTruthy();
            expect(component.filters()).toEqual(createGameFilter('connect4'));
            expect(component.opened()).toBe(false);
            expect(component.filterCount()).toBe(0);

            const trigger = dom.querySelector('.icon');
            expect(trigger).toBeTruthy();
            expect(trigger?.textContent).toContain('Filters');
            expect(trigger?.querySelector('span')).toBeFalsy();
            expect(dom.querySelector('.popover')).toBeFalsy();
        });


        it('should toggle the filter panel open and closed', () =>
        {
            (dom.querySelector('.icon') as HTMLElement).click();
            fixture.detectChanges();
            expect(component.opened()).toBe(true);
            expect(dom.querySelector('.icon.active')).toBeTruthy();
            expect(dom.querySelector('.popover')).toBeTruthy();
            expect(dom.querySelectorAll('.pills').length).toBe(2);
            expect(dom.querySelectorAll('.dates').length).toBe(1);

            (dom.querySelector('.wrapper') as HTMLElement).dispatchEvent(new Event('mouseleave'));
            fixture.detectChanges();
            expect(component.opened()).toBe(false);
            expect(dom.querySelector('.icon.active')).toBeFalsy();
            expect(dom.querySelector('.popover')).toBeFalsy();
        });


        it('should toggle check options', () =>
        {
            (dom.querySelector('.icon') as HTMLElement).click();
            fixture.detectChanges();
            expect(dom.querySelector('.icon span')).toBeFalsy();
            expect(dom.querySelector('.pills button.active')).toBeFalsy();

            const groups = dom.querySelectorAll('.group');
            const statusFilter = component.filters()![0] as CheckFilter;
            const statusPills = groups[0].querySelectorAll('.pills button');
            const organizerFilter = component.filters()![1] as CheckFilter;
            const organizerPills = groups[1].querySelectorAll('.pills button');
            const activeLabels = (): (string|undefined)[] => Array.from(dom.querySelectorAll('.pills button.active')).map(item => item.textContent?.trim());

            // toggles a non-unique option on
            (statusPills[0] as HTMLElement).click();
            fixture.detectChanges();
            expect(statusFilter.options[0].active).toBe(true);
            expect(component.filterCount()).toBe(1);
            expect(component.filtered.emit).toHaveBeenCalledTimes(1);
            expect(dom.querySelector('.icon span')?.textContent).toBe('1');
            expect(statusPills[0].classList.contains('active')).toBe(true);
            expect(activeLabels()).toEqual(['Loss']);

            // toggles another non-unique option on
            (statusPills[1] as HTMLElement).click();
            fixture.detectChanges();
            expect(statusFilter.options[0].active).toBe(true);
            expect(statusFilter.options[1].active).toBe(true);
            expect(component.filterCount()).toBe(2);
            expect(component.filtered.emit).toHaveBeenCalledTimes(2);
            expect(dom.querySelector('.icon span')?.textContent).toBe('2');
            expect(statusPills[1].classList.contains('active')).toBe(true);
            expect(activeLabels()).toEqual(['Loss', 'Win']);

            // selects a unique option
            (organizerPills[0] as HTMLElement).click();
            fixture.detectChanges();
            expect(organizerFilter.options[0].active).toBe(true);
            expect(organizerFilter.options[1].active).toBe(false);
            expect(component.filterCount()).toBe(3);
            expect(component.filtered.emit).toHaveBeenCalledTimes(3);
            expect(dom.querySelector('.icon span')?.textContent).toBe('3');
            expect(organizerPills[0].classList.contains('active')).toBe(true);
            expect(activeLabels()).toEqual(['Loss', 'Win', 'Yes']);

            // selects another unique option
            (organizerPills[1] as HTMLElement).click();
            fixture.detectChanges();
            expect(organizerFilter.options[0].active).toBe(false);
            expect(organizerFilter.options[1].active).toBe(true);
            expect(component.filterCount()).toBe(3);
            expect(component.filtered.emit).toHaveBeenCalledTimes(4);
            expect(dom.querySelector('.icon span')?.textContent).toBe('3');
            expect(organizerPills[0].classList.contains('active')).toBe(false);
            expect(organizerPills[1].classList.contains('active')).toBe(true);
            expect(activeLabels()).toEqual(['Loss', 'Win', 'No']);

            // toggles a non-unique option back off
            (statusPills[0] as HTMLElement).click();
            fixture.detectChanges();
            expect(statusFilter.options[0].active).toBe(false);
            expect(component.filterCount()).toBe(2);
            expect(component.filtered.emit).toHaveBeenCalledTimes(5);
            expect(dom.querySelector('.icon span')?.textContent).toBe('2');
            expect(statusPills[0].classList.contains('active')).toBe(false);
            expect(activeLabels()).toEqual(['Win', 'No']);
        });


        it('should update date filters', () =>
        {
            (dom.querySelector('.icon') as HTMLElement).click();
            fixture.detectChanges();
            expect(dom.querySelector('.icon span')).toBeFalsy();
            expect((dom.querySelector('#from-date') as HTMLInputElement).value).toBe('');
            expect((dom.querySelector('#end-date') as HTMLInputElement).value).toBe('');

            const dateFilter = component.filters()!.find(item => item.type === 'date') as DateFilter;

            const fromInput = dom.querySelector('#from-date') as HTMLInputElement;
            fromInput.value = '2024-01-15T10:30';
            fromInput.dispatchEvent(new Event('change'));
            fixture.detectChanges();
            expect(dateFilter.from).toBe('2024-01-15T10:30');
            expect(dateFilter.startDate).toBe(Date.UTC(2024, 0, 15, 10, 30));
            expect(component.filterCount()).toBe(1);
            expect(component.filtered.emit).toHaveBeenCalledWith(component.filters());
            expect(dom.querySelector('.icon span')?.textContent).toBe('1');
            expect(fromInput.value).toBe('2024-01-15T10:30');

            const toInput = dom.querySelector('#end-date') as HTMLInputElement;
            toInput.value = '2024-01-20T18:00';
            toInput.dispatchEvent(new Event('change'));
            fixture.detectChanges();
            expect(dateFilter.to).toBe('2024-01-20T18:00');
            expect(dateFilter.endDate).toBe(Date.UTC(2024, 0, 20, 18, 0));
            expect(component.filterCount()).toBe(1);
            expect(dom.querySelector('.icon span')?.textContent).toBe('1');
            expect(fromInput.value).toBe('2024-01-15T10:30');
            expect(toInput.value).toBe('2024-01-20T18:00');

            fromInput.value = '';
            fromInput.dispatchEvent(new Event('change'));
            fixture.detectChanges();
            expect(dateFilter.from).toBe('');
            expect(dateFilter.startDate).toBeFalsy();
            expect(component.filterCount()).toBe(1);
            expect(fromInput.value).toBe('');
            expect(toInput.value).toBe('2024-01-20T18:00');

            toInput.value = '';
            toInput.dispatchEvent(new Event('change'));
            fixture.detectChanges();
            expect(dateFilter.to).toBe('');
            expect(dateFilter.endDate).toBeFalsy();
            expect(component.filterCount()).toBe(0);
            expect(dom.querySelector('.icon span')).toBeFalsy();
            expect(fromInput.value).toBe('');
            expect(toInput.value).toBe('');
        });


        it('should clear all filters', () =>
        {
            (dom.querySelector('.icon') as HTMLElement).click();
            fixture.detectChanges();

            (dom.querySelectorAll('.pills button')[0] as HTMLElement).click();
            fixture.detectChanges();
            expect(component.filterCount()).toBe(1);
            (dom.querySelectorAll('.pills button')[3] as HTMLElement).click();
            fixture.detectChanges();
            expect(component.filterCount()).toBe(2);

            const fromInput = dom.querySelector('#from-date') as HTMLInputElement;
            fromInput.value = '2024-01-15T10:30';
            fromInput.dispatchEvent(new Event('change'));
            fixture.detectChanges();
            expect(component.filterCount()).toBe(3);

            (dom.querySelector('.popover > button') as HTMLElement).click();
            fixture.detectChanges();

            expect(component.filterCount()).toBe(0);
            expect(component.opened()).toBe(false);
            expect(component.filtered.emit).toHaveBeenCalledWith([]);
            expect(component.filters()).toEqual(createGameFilter('connect4'));
            expect(dom.querySelector('.popover')).toBeFalsy();
        });
    });
});
