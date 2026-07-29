import { ComponentFixture, TestBed } from '@angular/core/testing';


import { ModalComponent } from './modal.component';


/**
 * Tests the ModalComponent class.
 */
describe('ModalComponent', () => {
    // Fields ---------------------------------------------------------------------
    let dom: HTMLElement;

    let component: ModalComponent;
    let fixture: ComponentFixture<ModalComponent>;

    // Setup ----------------------------------------------------------------------

    beforeEach(async () =>
    {
        vi.useFakeTimers();

        await TestBed.configureTestingModule({ imports: [ModalComponent] }).compileComponents();
        fixture = TestBed.createComponent(ModalComponent);
        component = fixture.componentInstance;

        dom = fixture.nativeElement;
        vi.spyOn(component.closed, 'emit');
        fixture.detectChanges();
    });

    afterEach(() =>
    {
        document.body.style.overflow = '';
        vi.useRealTimers();
    });

    // Tests ----------------------------------------------------------------------

    it('should create component', () =>
    {
        expect(component).toBeTruthy();
        expect(component.activated()).toBe(false);
        expect(dom.querySelector('.backdrop')).toBeTruthy();
        expect(dom.querySelector('.wrapper.active')).toBeFalsy();
        expect(document.body.style.overflow).toBe('hidden');

        vi.advanceTimersByTime(150);
        fixture.detectChanges();
        expect(component.activated()).toBe(true);
        expect(dom.querySelector('.wrapper.active')).toBeTruthy();
    });


    it('should emit when the close button is clicked', () =>
    {
        (dom.querySelector('#modal-trigger') as HTMLElement).click();
        expect(component.closed.emit).toHaveBeenCalledTimes(1);
    });


    it('should lock body scroll while open, and restore once destroyed', () =>
    {
        fixture.destroy();
        expect(document.body.style.overflow).toBe('visible');
    });
});
