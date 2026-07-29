import { ComponentFixture, TestBed } from '@angular/core/testing';


import { PlaybookModalComponent } from './playbook-modal.component';


/**
 * Tests the PlaybookModalComponent class.
 */
describe('PlaybookModalComponent', () => {
    // Fields ---------------------------------------------------------------------
    let dom: HTMLElement;

    let component: PlaybookModalComponent;
    let fixture: ComponentFixture<PlaybookModalComponent>;

    // Setup ----------------------------------------------------------------------

    beforeEach(async () =>
    {
        await TestBed.configureTestingModule({ imports: [PlaybookModalComponent] }).compileComponents();
        fixture = TestBed.createComponent(PlaybookModalComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('title', 'Test');

        dom = fixture.nativeElement;
        vi.spyOn(component.closed, 'emit');
    });

    // Tests ----------------------------------------------------------------------

    it('should create component without notes', () =>
    {
        const playbook = {
            intro: '<p>Overview of the testing process.</p>',
            ruleset: '<p>Rules for completing each test.</p>',
            scoreguide: '<p>How points are awarded per test.</p>',
        };
        fixture.componentRef.setInput('data', playbook);
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(dom.querySelector('h4')?.textContent).toBe('Test');
        expect(dom.querySelector('p')?.textContent).toBe(playbook.intro);
        expect(dom.querySelectorAll('hr').length).toBe(2);
        expect(dom.querySelectorAll('.details').length).toBe(2);
        expect(dom.querySelectorAll('.details')[0].innerHTML).toContain(playbook.ruleset);
        expect(dom.querySelectorAll('.details')[1].innerHTML).toContain(playbook.scoreguide);

        (dom.querySelector('#modal-trigger') as HTMLElement).click();
        expect(component.closed.emit).toHaveBeenCalledTimes(1);
    });


    it('should create component with notes', () =>
    {
        const playbook = {
            intro: '<p>Overview of the testing process.</p>',
            ruleset: '<p>Rules for completing each test.</p>',
            scoreguide: '<p>How points are awarded per test.</p>',
            notes: '<p>Additional tips and important test details.</p>',
        };
        fixture.componentRef.setInput('data', playbook);
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(dom.querySelector('h4')?.textContent).toBe('Test');
        expect(dom.querySelector('p')?.textContent).toBe(playbook.intro);
        expect(dom.querySelectorAll('hr').length).toBe(3);
        expect(dom.querySelectorAll('.details').length).toBe(3);
        expect(dom.querySelectorAll('.details')[0].innerHTML).toContain(playbook.ruleset);
        expect(dom.querySelectorAll('.details')[1].innerHTML).toContain(playbook.scoreguide);
        expect(dom.querySelectorAll('.details')[2].innerHTML).toContain(playbook.notes);

        (dom.querySelector('#modal-trigger') as HTMLElement).click();
        expect(component.closed.emit).toHaveBeenCalledTimes(1);
    });
});
