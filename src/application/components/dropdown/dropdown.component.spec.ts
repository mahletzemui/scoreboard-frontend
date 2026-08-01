import { ComponentFixture, TestBed } from '@angular/core/testing';


import { DropdownComponent } from './dropdown.component';

import { Selector } from '../../models/queries';


/**
 * Tests the DropdownComponent class.
 */
describe('DropdownComponent', () => {
    // Fields ---------------------------------------------------------------------
    let dom: HTMLElement;

    let component: DropdownComponent;
    let fixture: ComponentFixture<DropdownComponent>;

    // Setup ----------------------------------------------------------------------

    beforeEach(async () =>
    {
        await TestBed.configureTestingModule({ imports: [DropdownComponent] }).compileComponents();
        fixture = TestBed.createComponent(DropdownComponent);
        component = fixture.componentInstance;

        dom = fixture.nativeElement;
        vi.spyOn(component.selected, 'emit');
    });

    // Tests ----------------------------------------------------------------------

    describe('With Heading', () => {
        const selector = {
            heading: 'Fruits',
            options: [
                { name: 'apple', label: 'Apple', active: false, icon: ['M0'] },
                {
                    name: 'citrus', label: 'Citrus', active: false,
                    additional: [
                        { name: 'lemon', label: 'Lemon', active: false },
                        { name: 'orange', label: 'Orange', active: false, icon: ['M1-1'] }
                    ]
                },
                { name: 'pear', label: 'Pear', active: false }
            ]
        };

        beforeEach(() =>
        {
            fixture.componentRef.setInput('data', selector);
            fixture.detectChanges();
        });

        // ------------------------------------------------------------------------

        it('should create component', () =>
        {
            expect(component).toBeTruthy();
            expect(component.caption()).toBe('Fruits');
            expect(component.options()).toEqual(selector.options);
            expect(component.value()).toBeFalsy();
            expect(component.floated()).toBe(false);
            expect(component.opened()).toBe(false);
            expect(component.expanded()).toBeFalsy();

            expect(dom.querySelector('.header.open')).toBeFalsy();
            expect(dom.querySelector('.caption')?.textContent).toBe('Fruits');
            expect(dom.querySelector('.caption.float')).toBeFalsy();
            expect(dom.querySelector('.value')).toBeFalsy();

            expect(dom.querySelectorAll('.badge').length).toBe(2);
            
            expect(dom.querySelector('.panel.visible')).toBeFalsy();
            expect(dom.querySelectorAll('.option').length).toBe(3);
            expect(dom.querySelector('.option.expand')).toBeFalsy();
            expect(dom.querySelector('ul.visible')).toBeFalsy();
            expect(dom.querySelectorAll('li').length).toBe(2);
        });


        it('should toggle the panel open and closed', () =>
        {
            (dom.querySelector('.header') as HTMLElement).click();
            fixture.detectChanges();
            expect(component.opened()).toBe(true);
            expect(dom.querySelector('.header.open')).toBeTruthy();
            expect(dom.querySelector('.panel.visible')).toBeTruthy();
            expect(dom.querySelector('.option.expand')).toBeFalsy();
            expect(dom.querySelector('ul.visible')).toBeFalsy();

            (dom.querySelector('.wrapper') as HTMLElement).dispatchEvent(new Event('mouseleave'));
            fixture.detectChanges();
            expect(component.opened()).toBe(false);
            expect(dom.querySelector('.header.open')).toBeFalsy();
            expect(dom.querySelector('.panel.visible')).toBeFalsy();
            expect(dom.querySelector('.option.expand')).toBeFalsy();
            expect(dom.querySelector('ul.visible')).toBeFalsy();
        });


        it('should toggle the nested options open and closed', () =>
        {
            component.opened.set(true);
            fixture.detectChanges();

            (dom.querySelectorAll('.option')[1] as HTMLElement).click();
            fixture.detectChanges();
            expect(component.expanded()).toBe(1);
            expect(dom.querySelector('.header.open')).toBeTruthy();
            expect(dom.querySelector('.option.expand')).toBeTruthy();
            expect(dom.querySelector('ul.visible')).toBeTruthy();

            (dom.querySelectorAll('.option')[1] as HTMLElement).click();
            fixture.detectChanges();
            expect(component.expanded()).toBeFalsy();
            expect(dom.querySelector('.header.open')).toBeTruthy();
            expect(dom.querySelector('.option.expand')).toBeFalsy();
            expect(dom.querySelector('ul.visible')).toBeFalsy();

            component.expanded.set(1);
            fixture.detectChanges();
            expect(dom.querySelector('.header.open')).toBeTruthy();
            expect(dom.querySelector('.option.expand')).toBeTruthy();
            expect(dom.querySelector('ul.visible')).toBeTruthy();

            (dom.querySelector('.wrapper') as HTMLElement).dispatchEvent(new Event('mouseleave'));
            fixture.detectChanges();
            expect(component.expanded()).toBeFalsy();
            expect(dom.querySelector('.header.open')).toBeFalsy();
            expect(dom.querySelector('.option.expand')).toBeFalsy();
            expect(dom.querySelector('ul.visible')).toBeFalsy();
        });


        it('should select an option and update the value', () =>
        {
            component.opened.set(true);
            fixture.detectChanges();
            expect(dom.querySelector('.header.open')).toBeTruthy();

            // when it's a non-nested selection
            (dom.querySelectorAll('.option')[2] as HTMLElement).click();
            fixture.detectChanges();
            expect(component.selected.emit).toHaveBeenCalledTimes(1);
            expect(component.selected.emit).toHaveBeenCalledWith(['pear']);
            expect(component.value()).toBe('Pear');
            expect(dom.querySelector('.header.open')).toBeFalsy();
            expect(dom.querySelector('.caption.float')).toBeTruthy();
            expect(dom.querySelector('.value')?.textContent).toBe('Pear');
            expect(dom.querySelector('.option.active')?.textContent).toBe('Pear');

            // when it's a nested selection
            component.opened.set(true);
            component.expanded.set(1);
            fixture.detectChanges();
            expect(dom.querySelector('.header.open')).toBeTruthy();
            expect(dom.querySelector('.option.expand')).toBeTruthy();

            (dom.querySelectorAll('li')[1] as HTMLElement).click();
            fixture.detectChanges();
            expect(component.selected.emit).toHaveBeenCalledTimes(2);
            expect(component.selected.emit).toHaveBeenCalledWith(['citrus', 'orange']);
            expect(component.value()).toBe('Citrus');
            expect(dom.querySelector('.header.open')).toBeFalsy();
            expect(dom.querySelector('.option.expand')).toBeFalsy();
            expect(dom.querySelector('.value')?.textContent).toBe('Citrus');
            expect(dom.querySelector('.option span.active')?.textContent).toBe('Citrus');
            expect(dom.querySelector('li.active span')?.textContent).toBe('Orange');
        });


        it('should update the value when the selector changes', () =>
        {
            fixture.componentRef.setInput('data', {
                heading: 'Vegetables',
                options: [ { name: 'carrot', label: 'Carrot', active: true } ]
            });
            fixture.detectChanges();

            expect(component.options()).toEqual([{ name: 'carrot', label: 'Carrot', active: true }]);
            expect(component.caption()).toBe('Vegetables');
            expect(component.value()).toBe('Carrot');
            expect(component.floated()).toBe(true);
            expect(dom.querySelector('.caption')?.textContent).toBe('Vegetables');
            expect(dom.querySelector('.caption.float')).toBeTruthy();
            expect(dom.querySelector('.value')?.textContent).toBe('Carrot');
            expect(dom.querySelectorAll('.option').length).toBe(1);
        });
    });


    describe('Without Heading', () => {
        const selector: Selector = {
            heading: '',
            options: [
                {
                    name: 'fruits', label: 'Fruits', active: false,
                    additional: [
                        { name: 'apple', label: 'Apple', active: false, icon: ['M0-0'] },
                        { name: 'pear', label: 'Pear', active: false }
                    ]
                },
                { name: 'pudding', label: 'Pudding', active: false, icon: ['M1'] },
                {
                    name: 'vegetables', label: 'Vegetables', active: false, icon: ['M2'],
                    additional: [
                        { name: 'carrot', label: 'Carrot', active: false },
                        { name: 'pepper', label: 'Pepper', active: false }
                    ]
                },
            ]
        };

        beforeEach(() =>
        {
            fixture.componentRef.setInput('data', selector);
            fixture.detectChanges();
        });

        // ------------------------------------------------------------------------

        it('should create component', () =>
        {
            expect(component).toBeTruthy();
            expect(component.caption()).toBe('Select an Option');
            expect(component.options()).toEqual(selector.options);
            expect(component.value()).toBeFalsy();
            expect(component.floated()).toBe(false);
            expect(component.opened()).toBe(false);
            expect(component.expanded()).toBeFalsy();

            expect(dom.querySelector('.header.open')).toBeFalsy();
            expect(dom.querySelector('.caption')?.textContent).toBe('Select an Option');
            expect(dom.querySelector('.caption.float')).toBeFalsy();
            expect(dom.querySelector('.value')).toBeFalsy();

            expect(dom.querySelectorAll('.badge').length).toBe(3);

            expect(dom.querySelector('.panel.visible')).toBeFalsy();
            expect(dom.querySelectorAll('.option').length).toBe(3);
            expect(dom.querySelector('.option.expand')).toBeFalsy();
            expect(dom.querySelector('ul.visible')).toBeFalsy();
            expect(dom.querySelectorAll('li').length).toBe(4);
        });


        it('should toggle the panel open and closed', () =>
        {
            (dom.querySelector('.header') as HTMLElement).click();
            fixture.detectChanges();
            expect(component.opened()).toBe(true);
            expect(dom.querySelector('.header.open')).toBeTruthy();
            expect(dom.querySelector('.panel.visible')).toBeTruthy();
            expect(dom.querySelector('.option.expand')).toBeFalsy();
            expect(dom.querySelector('ul.visible')).toBeFalsy();

            (dom.querySelector('.wrapper') as HTMLElement).dispatchEvent(new Event('mouseleave'));
            fixture.detectChanges();
            expect(component.opened()).toBe(false);
            expect(dom.querySelector('.header.open')).toBeFalsy();
            expect(dom.querySelector('.panel.visible')).toBeFalsy();
            expect(dom.querySelector('.option.expand')).toBeFalsy();
            expect(dom.querySelector('ul.visible')).toBeFalsy();
        });


        it('should toggle the nested options open and closed', () =>
        {
            component.opened.set(true);
            fixture.detectChanges();

            (dom.querySelectorAll('.option')[0] as HTMLElement).click();
            fixture.detectChanges();
            expect(component.expanded()).toBe(0);
            expect(dom.querySelector('.header.open')).toBeTruthy();
            expect(dom.querySelector('.option.expand')).toBeTruthy();
            expect(dom.querySelector('ul.visible')).toBeTruthy();

            (dom.querySelectorAll('.option')[0] as HTMLElement).click();
            fixture.detectChanges();
            expect(component.expanded()).toBeFalsy();
            expect(dom.querySelector('.header.open')).toBeTruthy();
            expect(dom.querySelector('.option.expand')).toBeFalsy();
            expect(dom.querySelector('ul.visible')).toBeFalsy();

            component.expanded.set(0);
            fixture.detectChanges();
            expect(dom.querySelector('.header.open')).toBeTruthy();
            expect(dom.querySelector('.option.expand')).toBeTruthy();
            expect(dom.querySelector('ul.visible')).toBeTruthy();

            (dom.querySelector('.wrapper') as HTMLElement).dispatchEvent(new Event('mouseleave'));
            fixture.detectChanges();
            expect(component.expanded()).toBeFalsy();
            expect(dom.querySelector('.header.open')).toBeFalsy();
            expect(dom.querySelector('.option.expand')).toBeFalsy();
            expect(dom.querySelector('ul.visible')).toBeFalsy();
        });


        it('should select an option and update the value', () =>
        {
            component.opened.set(true);
            fixture.detectChanges();
            expect(dom.querySelector('.header.open')).toBeTruthy();

            // when it's a non-nested selection
            (dom.querySelectorAll('.option')[1] as HTMLElement).click();
            fixture.detectChanges();
            expect(component.selected.emit).toHaveBeenCalledTimes(1);
            expect(component.selected.emit).toHaveBeenCalledWith(['pudding']);
            expect(component.value()).toBe('Pudding');
            expect(dom.querySelector('.header.open')).toBeFalsy();
            expect(dom.querySelector('.caption.float')).toBeTruthy();
            expect(dom.querySelector('.value')?.textContent).toBe('Pudding');
            expect(dom.querySelector('.option.active')?.textContent).toBe('Pudding');

            // when it's a nested selection
            component.opened.set(true);
            component.expanded.set(0);
            fixture.detectChanges();
            expect(dom.querySelector('.header.open')).toBeTruthy();
            expect(dom.querySelector('.option.expand')).toBeTruthy();

            (dom.querySelectorAll('li')[0] as HTMLElement).click();
            fixture.detectChanges();
            expect(component.selected.emit).toHaveBeenCalledTimes(2);
            expect(component.selected.emit).toHaveBeenCalledWith(['fruits', 'apple']);
            expect(component.value()).toBe('Fruits');
            expect(dom.querySelector('.header.open')).toBeFalsy();
            expect(dom.querySelector('.option.expand')).toBeFalsy();
            expect(dom.querySelector('.value')?.textContent).toBe('Fruits');
            expect(dom.querySelector('.option span.active')?.textContent).toBe('Fruits');
            expect(dom.querySelector('li.active span')?.textContent).toBe('Apple');
        });


        it('should update the value when the selector changes', () =>
        {
            fixture.componentRef.setInput('data', {
                heading: '',
                options: [ { name: 'logout', label: 'Logout', active: true } ]
            });
            fixture.detectChanges();

            expect(component.options()).toEqual([{ name: 'logout', label: 'Logout', active: true }]);
            expect(component.caption()).toBe('Select an Option');
            expect(component.value()).toBe('Logout');
            expect(component.floated()).toBe(true);
            expect(dom.querySelector('.caption')?.textContent).toBe('Select an Option');
            expect(dom.querySelector('.caption.float')).toBeTruthy();
            expect(dom.querySelector('.value')?.textContent).toBe('Logout');
            expect(dom.querySelectorAll('.option').length).toBe(1);
        });
    });
});
