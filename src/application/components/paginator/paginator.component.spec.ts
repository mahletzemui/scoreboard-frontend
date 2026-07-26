import { ComponentFixture, TestBed } from '@angular/core/testing';


import { PaginatorComponent } from './paginator.component';
import { TestFactory } from '../../utils/test-factory';


/**
 * Tests the PaginatorComponent class.
 */
describe('PaginatorComponent', () => {
    // Fields ---------------------------------------------------------------------
    let dom: HTMLElement;

    let component: PaginatorComponent;
    let fixture: ComponentFixture<PaginatorComponent>;

    // Setup ----------------------------------------------------------------------

    beforeEach(async () =>
    {
        await TestBed.configureTestingModule({ imports: [PaginatorComponent] }).compileComponents();
        fixture = TestBed.createComponent(PaginatorComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('total', 5);
        fixture.componentRef.setInput('options', ['3', '6', '9']);

        dom = fixture.nativeElement;
        vi.spyOn(component.paged, 'emit');
        fixture.detectChanges();
    });

    // Tests ----------------------------------------------------------------------

    it('should create component', () =>
    {
        expect(component).toBeTruthy();
        expect(component.size()).toBe(3);
        expect(component.index()).toBe(0);
        expect(component.selector()).toEqual({
            heading: '',
            options: [
                { name: '3', label: '3', active: true },
                { name: '6', label: '6', active: false },
                { name: '9', label: '9', active: false }
            ]
        });
        expect(component.range()).toBe('1 - 3 of 5');
        expect(component.nextPage()).toBe(true);

        expect(dom.querySelector('app-dropdown .caption.float')?.textContent).toBe('Select an Option');
        expect(dom.querySelector('app-dropdown .value')?.textContent).toBe('3');
        expect(dom.querySelectorAll('.control')[1].querySelector('span')?.textContent).toBe('1 - 3 of 5');

        const buttons: NodeListOf<HTMLButtonElement> = dom.querySelectorAll('.icon');
        expect(buttons[0].disabled).toBe(true);
        expect(buttons[1].disabled).toBe(false);
    });


    it('should update the size when a new option is selected', () =>
    {
        TestFactory.selectOption(dom, fixture, 1);
        expect(component.paged.emit).toHaveBeenCalledTimes(1);
        expect(component.paged.emit).toHaveBeenCalledWith({ size: 6, index: 0 });
        expect(component.size()).toBe(6);
        expect(component.index()).toBe(0);
        expect(component.range()).toBe('1 - 5 of 5');
        expect(component.nextPage()).toBe(false);

        expect(dom.querySelector('app-dropdown .value')?.textContent).toBe('6');
        expect(dom.querySelectorAll('.control')[1].querySelector('span')?.textContent).toBe('1 - 5 of 5');
        let buttons: NodeListOf<HTMLButtonElement> = dom.querySelectorAll('.icon');
        expect(buttons[0].disabled).toBe(true);
        expect(buttons[1].disabled).toBe(true);
    });


    it('should move the page forward and backward', () =>
    {
        // when there's no previous page
        TestFactory.movePage(dom, fixture, false);
        expect(component.paged.emit).not.toHaveBeenCalled();

        // when there's a next page
        TestFactory.movePage(dom, fixture, true);
        expect(component.paged.emit).toHaveBeenCalledTimes(1);
        expect(component.paged.emit).toHaveBeenCalledWith({ size: 3, index: 1 });
        expect(component.index()).toBe(1);
        expect(component.nextPage()).toBe(false);
        expect(component.range()).toBe('4 - 5 of 5');

        expect(dom.querySelectorAll('.control')[1].querySelector('span')?.textContent).toBe('4 - 5 of 5');
        let buttons: NodeListOf<HTMLButtonElement> = dom.querySelectorAll('.icon');
        expect(buttons[0].disabled).toBe(false);
        expect(buttons[1].disabled).toBe(true);

        // when there's no next page
        TestFactory.movePage(dom, fixture, true);
        expect(component.paged.emit).toHaveBeenCalledTimes(1);

        // when there's a previous page
        TestFactory.movePage(dom, fixture, false);
        expect(component.paged.emit).toHaveBeenCalledTimes(2);
        expect(component.paged.emit).toHaveBeenCalledWith({ size: 3, index: 0 });
        expect(component.index()).toBe(0);
        expect(component.nextPage()).toBe(true);
        expect(component.range()).toBe('1 - 3 of 5');

        expect(dom.querySelectorAll('.control')[1].querySelector('span')?.textContent).toBe('1 - 3 of 5');
        buttons = dom.querySelectorAll('.icon');
        expect(buttons[0].disabled).toBe(true);
        expect(buttons[1].disabled).toBe(false);
    });


    it('should reset the index when the total changes', () =>
    {
        TestFactory.movePage(dom, fixture, true);
        expect(dom.querySelectorAll('.control')[1].querySelector('span')?.textContent).toBe('4 - 5 of 5');

        fixture.componentRef.setInput('total', 0);
        fixture.detectChanges();
        expect(component.size()).toBe(3);
        expect(component.range()).toBe('0 of 0');
        expect(component.nextPage()).toBe(false);

        expect(dom.querySelectorAll('.control')[1].querySelector('span')?.textContent).toBe('0 of 0');
        let buttons: NodeListOf<HTMLButtonElement> = dom.querySelectorAll('.icon');
        expect(buttons[0].disabled).toBe(true);
        expect(buttons[1].disabled).toBe(true);
    });
});
