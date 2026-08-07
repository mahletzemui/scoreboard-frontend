import { ComponentFixture } from '@angular/core/testing';


import { LoaderService } from '../services';
import { BaseLayout } from '../layouts/base-layout.directive';


/**
 * Manages the test suite's common helpers.
 */
export class TestFactory {
    // Methods --------------------------------------------------------------------

    /**
     * Selects a dropdown option.
     *
     * @param dom         - Root element with dropdown.
     * @param fixture     - Fixture to detect changes with.
     * @param mainIndex   - Index of main option to select.
     * @param nestedIndex - Index of nested option to select.
     */
    static selectOption(dom: HTMLElement, fixture: ComponentFixture<unknown>, mainIndex: number, nestedIndex?: number): void
    {
        const dropdown = dom.querySelector('app-dropdown') as HTMLElement;
        (dropdown.querySelector('.header') as HTMLElement).click();
        fixture.detectChanges();

        (dropdown.querySelectorAll('.option')[mainIndex] as HTMLElement).click();
        fixture.detectChanges();

        if (nestedIndex) {
            (dropdown.querySelectorAll('li')[nestedIndex] as HTMLElement).click();
            fixture.detectChanges();
        }
    }

    /**
     * Changes the paginator's index.
     *
     * @param dom     - Root element with paginator.
     * @param fixture - Fixture to detect changes with.
     * @param forward - Flag to move forward.
     */
    static changePage(dom: HTMLElement, fixture: ComponentFixture<unknown>, forward: boolean): void
    {
        const buttons = dom.querySelectorAll('.icon');
        (buttons[forward ? 1 : 0] as HTMLElement).click();
        fixture.detectChanges();
    }

    /**
     * Updates search terms for a finder.
     *
     * @param dom     - Root element with finder.
     * @param fixture - Fixture to detect changes with.
     * @param terms   - Terms to search with.
     */
    static searchTerms(dom: HTMLElement, fixture: ComponentFixture<unknown>, terms?: string[]|number): void
    {
        const input = dom.querySelector('#keywords') as HTMLInputElement;
        if (Array.isArray(terms)) {
            terms.forEach(item => {
                input.value = item;
                input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
                fixture.detectChanges();
            });
        } else if (typeof terms === 'number') {
            (dom.querySelectorAll('app-finder .chips button')[terms] as HTMLElement).click();
            fixture.detectChanges();
        } else {
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
            fixture.detectChanges();
        }
    }

    /**
     * Fills a form's field inputs.
     *
     * @param dom     - Root element with form.
     * @param fixture - Fixture to detect changes with.
     * @param pairs   - Key/Value pairs to fill with.
     */
    static fillForm(dom: HTMLElement, fixture: ComponentFixture<unknown>, pairs: Record<string, string>): void
    {
        Object.entries(pairs).forEach(([key, value]) => {
            const input = dom.querySelector(`#${key}`) as HTMLInputElement;
            input.value = value;
            input.dispatchEvent(new Event('input'));
        });
        fixture.detectChanges();
    }

    /**
     * Validates a base layout's resolution behavior.
     *
     * @param component - Component to validate.
     */
    static async validateBaseLayout(component: BaseLayout): Promise<void>
    {
        const spy = vi.spyOn(LoaderService.prototype, 'setLoadedContent');
        vi.useFakeTimers();

        component.ngAfterViewInit();
        expect(spy).not.toHaveBeenCalled();
        await vi.advanceTimersByTimeAsync(1000);
        expect(spy).toHaveBeenCalledWith(true);

        vi.useRealTimers();
    }
}
