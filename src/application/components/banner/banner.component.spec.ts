import { ComponentFixture, TestBed } from '@angular/core/testing';


import { BannerComponent } from './banner.component';

import { NoticeService } from '../../services/notice/notice.service';


/**
 * Tests the BannerComponent class.
 */
describe('BannerComponent', () => {
    // Fields ---------------------------------------------------------------------
    let dom: HTMLElement;

    let component: BannerComponent;
    let fixture: ComponentFixture<BannerComponent>;

    let service: NoticeService;

    // Setup ----------------------------------------------------------------------

    beforeEach(async () =>
    {
        await TestBed.configureTestingModule({ imports: [BannerComponent] }).compileComponents();
        service = TestBed.inject(NoticeService);

        fixture = TestBed.createComponent(BannerComponent);
        component = fixture.componentInstance;
        dom = fixture.nativeElement;
        fixture.detectChanges();
    });

    // Tests ----------------------------------------------------------------------

    it('should create component', () =>
    {
        expect(component).toBeTruthy();
        expect(component.notice()).toBe('');
        expect(component.active()).toBe(false);

        expect(dom.querySelector('.wrapper.active')).toBeFalsy();
        expect(dom.querySelector('p')?.textContent).toBe('');
    });


    it("should activate the banner when there's a notice to display", () =>
    {
        service.showBanner('Action taken successfully.');
        fixture.detectChanges();

        expect(component.notice()).toBe('Action taken successfully.');
        expect(component.active()).toBe(true);

        expect(dom.querySelector('.wrapper.active')).toBeTruthy();
        expect(dom.querySelector('p')?.textContent).toBe('Action taken successfully.');
    });


    it('should close the banner when the timer runs out', () =>
    {
        vi.useFakeTimers();

        service.showBanner('Action taken successfully.');
        fixture.detectChanges();

        vi.advanceTimersByTime(4999);
        fixture.detectChanges();
        expect(component.active()).toBe(true);
        expect(dom.querySelector('.wrapper.active')).toBeTruthy();

        vi.advanceTimersByTime(1);
        fixture.detectChanges();
        expect(component.active()).toBe(false);
        expect(dom.querySelector('.wrapper.active')).toBeFalsy();

        vi.useRealTimers();
    });


    it('should close the banner when the close button is clicked', () =>
    {
        service.showBanner('Action taken successfully.');
        fixture.detectChanges();

        (dom.querySelector('button') as HTMLElement).click();
        fixture.detectChanges();
        expect(component.active()).toBe(false);
        expect(dom.querySelector('.wrapper.active')).toBeFalsy();
    });
});
