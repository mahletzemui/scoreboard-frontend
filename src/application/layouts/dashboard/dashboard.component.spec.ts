import { Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';


import { DashboardComponent } from './dashboard.component';
import { TestFactory } from '../../utils/test-factory';

import { GAME_PREVIEWS } from '../../constants/games';


/**
 * Tests the DashboardComponent class.
 */
describe('DashboardComponent', () => {
    // Fields ---------------------------------------------------------------------
    const games = Object.values(GAME_PREVIEWS);

    let dom: HTMLElement;
    let routerSpy: Router;

    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;

    // Setup ----------------------------------------------------------------------

    beforeEach(async () =>
    {
        localStorage.setItem('name', 'John');
        await TestBed.configureTestingModule({ imports: [DashboardComponent] }).compileComponents();
        routerSpy = TestBed.inject(Router);

        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;

        dom = fixture.nativeElement;
        vi.spyOn(component, 'navigateTo');
        vi.spyOn(routerSpy, 'navigate').mockResolvedValue(true);

        fixture.detectChanges();
    });

    // Tests ----------------------------------------------------------------------

    it('should create component', () =>
    {
        expect(component).toBeTruthy();
        expect(component.preferredName).toBe('John');
        expect(component.searched()).toEqual(games);
        expect(component.paged()).toEqual(component.searched().slice(0, 2));
        expect(component.selected).toBeFalsy();

        expect(dom.querySelector('.section.intro h1')?.textContent).toBe('Welcome Back, John');
        expect(dom.querySelector('app-finder')).toBeTruthy();
        expect(dom.querySelector('.empty-grid')).toBeFalsy();
        expect(dom.querySelectorAll('.card').length).toBe(2);
        const buttons = dom.querySelectorAll('.card .controls button');
        expect(buttons.length).toBe(4);
        expect(dom.querySelectorAll('app-paginator .control')[1]?.querySelector('span')?.textContent).toBe('1 - 2 of 3');
        expect(dom.querySelector('app-playbook-modal')).toBeFalsy();
    });


    it('should mark content as loaded after view initialization', async() =>
    {
        await TestFactory.validateBaseLayout(component);
    });


    it('should toggle playbook', () =>
    {
        (dom.querySelectorAll('.card')[0] as HTMLElement).click();
        fixture.detectChanges();
        expect(component.selected).toBe('Connect4');
        expect(dom.querySelector('app-playbook-modal .panel h3')?.textContent).toBe('Connect4');

        (dom.querySelector('app-playbook-modal #modal-trigger') as HTMLElement).click();
        fixture.detectChanges();
        expect(component.selected).toBeFalsy();
        expect(dom.querySelector('app-playbook-modal')).toBeFalsy();

        (dom.querySelectorAll('.card')[1] as HTMLElement).click();
        fixture.detectChanges();
        expect(component.selected).toBe('Conquer');
        expect(dom.querySelector('app-playbook-modal .panel h3')?.textContent).toBe('Conquer');
    });


    it('should navigate to game links', () =>
    {
        (dom.querySelectorAll('.card .controls button')[1] as HTMLElement).click();
        fixture.detectChanges();
        expect(component.selected).toBeFalsy();
        expect(component.navigateTo).toHaveBeenCalledTimes(1);
        expect(component.navigateTo).toHaveBeenCalledWith('/games/connect4/recap');
        expect(dom.querySelector('app-playbook-modal')).toBeFalsy();

        (dom.querySelectorAll('.card .controls button')[2] as HTMLElement).click();
        fixture.detectChanges();
        expect(component.selected).toBeFalsy();
        expect(component.navigateTo).toHaveBeenCalledTimes(2);
        expect(component.navigateTo).toHaveBeenCalledWith('/games/conquer/play');
        expect(dom.querySelector('app-playbook-modal')).toBeFalsy();
    });


    it('should render cards based on search/page', () =>
    {
        // when changing page index
        TestFactory.changePage(dom, fixture, true);
        expect(component.paged()).toEqual(component.searched().slice(2, 3));

        let cards = dom.querySelectorAll('.card');
        expect(cards.length).toBe(1);
        expect(cards[0].querySelector('h4')?.textContent).toBe('Domino');
        expect(dom.querySelectorAll('app-paginator .control')[1]?.querySelector('span')?.textContent).toBe('3 - 3 of 3');

        // when searching with an existing term
        TestFactory.searchTerms(dom, fixture, ['o']);
        expect(component.searched()).toEqual(games);
        expect(component.paged()).toEqual(component.searched().slice(2, 3));

        cards = dom.querySelectorAll('.card');
        expect(cards.length).toBe(1);
        expect(cards[0].querySelector('h4')?.textContent).toBe('Domino');
        expect(dom.querySelectorAll('app-paginator .control')[1]?.querySelector('span')?.textContent).toBe('3 - 3 of 3');

        // when changing page size
        TestFactory.selectOption(dom.querySelector('app-paginator')!, fixture, 1);
        expect(component.paged()).toEqual(component.searched());

        cards = dom.querySelectorAll('.card');
        expect(cards.length).toBe(3);
        expect(cards[0].querySelector('h4')?.textContent).toBe('Connect4');
        expect(cards[1].querySelector('h4')?.textContent).toBe('Conquer');
        expect(cards[2].querySelector('h4')?.textContent).toBe('Domino');
        expect(dom.querySelectorAll('app-paginator .control')[1]?.querySelector('span')?.textContent).toBe('1 - 3 of 3');

        // when removing search terms
        TestFactory.searchTerms(dom, fixture);
        expect(component.searched()).toEqual(games);
        expect(component.paged()).toEqual(component.searched());

        cards = dom.querySelectorAll('.card');
        expect(cards.length).toBe(3);
        expect(cards[0].querySelector('h4')?.textContent).toBe('Connect4');
        expect(cards[1].querySelector('h4')?.textContent).toBe('Conquer');
        expect(cards[2].querySelector('h4')?.textContent).toBe('Domino');
        expect(dom.querySelectorAll('app-paginator .control')[1]?.querySelector('span')?.textContent).toBe('1 - 3 of 3');

        // when searching with multiple search terms
        TestFactory.searchTerms(dom, fixture, ['qu', 'test']);
        expect(component.searched()).toEqual(games.slice(1, 2));
        expect(component.paged()).toEqual(component.searched());

        cards = dom.querySelectorAll('.card');
        expect(cards.length).toBe(1);
        expect(cards[0].querySelector('h4')?.textContent).toBe('Conquer');
        expect(dom.querySelectorAll('app-paginator .control')[1]?.querySelector('span')?.textContent).toBe('1 - 1 of 1');

        // when searching with a missing term
        TestFactory.searchTerms(dom, fixture, 0);
        expect(component.searched()).toEqual([]);
        expect(component.paged()).toEqual([]);

        expect(dom.querySelector('.empty-grid')).toBeTruthy();
        expect(dom.querySelector('.card')).toBeFalsy();
        expect(dom.querySelector('.empty-grid p')?.textContent).toBe('Nothing here matches your search. Try different keywords.');
        expect(dom.querySelectorAll('app-paginator .control')[1]?.querySelector('span')?.textContent).toBe('0 of 0');
    });
});
