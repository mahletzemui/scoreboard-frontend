import { ComponentFixture, TestBed } from '@angular/core/testing';


import { DonutChartComponent } from './donut-chart.component';

import { ToolBox } from '../../utils';


/**
 * Tests the DonutChartComponent class.
 */
describe('DonutChartComponent', () => {
    // Fields ---------------------------------------------------------------------
    let dom: HTMLElement;

    let component: DonutChartComponent;
    let fixture: ComponentFixture<DonutChartComponent>;

    const data = [
        ToolBox.createPartialSlice('Apple', 2, 'red'),
        ToolBox.createPartialSlice('Banana', 8, 'yellow'),
        ToolBox.createPartialSlice('Grape', 5, 'purple')
    ];

    // Setup ----------------------------------------------------------------------

    beforeEach(async () =>
    {
        await TestBed.configureTestingModule({ imports: [DonutChartComponent] }).compileComponents();
        fixture = TestBed.createComponent(DonutChartComponent);
        component = fixture.componentInstance;

        dom = fixture.nativeElement;
        fixture.componentRef.setInput('data', data);
        fixture.detectChanges();
    });

    // Tests ----------------------------------------------------------------------

    it('should create component', () =>
    {
        expect(component).toBeTruthy();
        expect(component.slices().length).toBe(3);
        expect(component.selected()).toBeFalsy();

        let angle = 0;
        let percentage = 0;
        component.slices().forEach(item => {
            expect(item.path).toBeTruthy();
            angle += item.angle.end - item.angle.start;
            percentage += item.percentage.value;
        });
        expect(angle).toBe(360);
        expect(Math.round(percentage)).toBe(100);

        expect(dom.querySelectorAll('.chart path').length).toBe(3);
        const labels = dom.querySelectorAll('.chart text');
        expect(labels.length).toBe(3);
        expect(labels[0].textContent).toBe('13.3%');
        expect(labels[1].textContent).toBe('53.3%');
        expect(labels[2].textContent).toBe('33.3%');

        expect(dom.querySelector('.tooltip')).toBeFalsy();
        const legend = dom.querySelectorAll('.legend li');
        expect(legend.length).toBe(3);
        expect(legend[0].textContent?.trim()).toBe('Apple');
        expect(legend[1].textContent?.trim()).toBe('Banana');
        expect(legend[2].textContent?.trim()).toBe('Grape');
    });


    it('should show and hide the tooltip on hover', () =>
    {
        (dom.querySelectorAll('.chart path')[1] as HTMLElement).dispatchEvent(new Event('mouseenter'));
        fixture.detectChanges();
        expect(component.selected()?.label).toBe('Banana');
        expect(dom.querySelector('.tooltip .label')?.textContent).toBe('Banana');
        expect(dom.querySelector('.tooltip .value')?.textContent).toBe('8 (53.3%)');

        (dom.querySelectorAll('.chart path')[1] as HTMLElement).dispatchEvent(new Event('mouseleave'));
        fixture.detectChanges();
        expect(component.selected()).toBeFalsy();
        expect(dom.querySelector('.tooltip')).toBeFalsy();

        (dom.querySelectorAll('.chart path')[2] as HTMLElement).dispatchEvent(new Event('mouseenter'));
        fixture.detectChanges();
        expect(component.selected()?.label).toBe('Grape');
        expect(dom.querySelector('.tooltip .label')?.textContent).toBe('Grape');
        expect(dom.querySelector('.tooltip .value')?.textContent).toBe('5 (33.3%)');
    });


    it('should rebuild the chart when the data changes', () =>
    {
        fixture.componentRef.setInput('data', [ToolBox.createPartialSlice('Apple', 10, 'red')]);
        fixture.detectChanges();
        expect(component.slices().length).toBe(1);
        expect(component.slices()[0].path).toBeTruthy();
        expect(component.slices()[0].angle.end - component.slices()[0].angle.start).toBe(360);
        expect(component.slices()[0].percentage.value).toBe(100);

        expect(dom.querySelectorAll('.chart path').length).toBe(1);
        const labels = dom.querySelectorAll('.chart text');
        expect(labels.length).toBe(1);
        expect(labels[0].textContent).toBe('100%');

        const legend = dom.querySelectorAll('.legend li');
        expect(legend.length).toBe(1);
        expect(legend[0].textContent?.trim()).toBe('Apple');
    });
});
