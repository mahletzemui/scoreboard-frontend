import { ComponentFixture } from '@angular/core/testing';


/**
 * Manages the test suite's common helpers.
 */
export class TestFactory {
    // Methods --------------------------------------------------------------------

    /**
     * Selects one of the main dropdown options.
     *
     * @param dom     - Root element with dropdown.
     * @param fixture - Fixture to detect changes with.
     * @param index   - Index of option to select.
     */
    static selectOption(dom: HTMLElement, fixture: ComponentFixture<unknown>, index: number): void
    {
        const dropdown = TestFactory.openDropdown(dom, fixture);
        (dropdown.querySelectorAll('.option')[index] as HTMLElement).click();
        fixture.detectChanges();
    }

    // /**
    //  * Selects one of the nested dropdown options.
    //  *
    //  * @param dom         - Root element with dropdown.
    //  * @param fixture     - Fixture to detect changes with.
    //  * @param index       - Index of option to expand.
    //  * @param nestedIndex - Index of nested option to select.
    //  */
    // static selectNestedOption(dom: HTMLElement, fixture: ComponentFixture<unknown>, index: number, nestedIndex: number): void
    // {
    //     const dropdown = TestFactory.openDropdown(dom, fixture);
    //     (dropdown.querySelectorAll('.option')[index] as HTMLElement).click();
    //     fixture.detectChanges();

    //     (dropdown.querySelectorAll('li')[nestedIndex] as HTMLElement).click();
    //     fixture.detectChanges();
    // }

    /**
     * Moves the paginator forward or backward.
     *
     * @param dom     - Root element with paginator.
     * @param fixture - Fixture to detect changes with.
     * @param forward - Flag to move forward.
     */
    static movePage(dom: HTMLElement, fixture: ComponentFixture<unknown>, forward: boolean): void
    {
        const buttons = dom.querySelectorAll('.icon');
        (buttons[forward ? 1 : 0] as HTMLElement).click();
        fixture.detectChanges();
    }

    /**
     * Fills a form's fields with the given values.
     *
     * @param dom     - Root element with form.
     * @param fixture - Fixture to detect changes with.
     * @param values  - Values to fill, keyed by field name.
     * @param prefix  - Prefix applied to each field's id.
     */
    static fillForm(dom: HTMLElement, fixture: ComponentFixture<unknown>, values: Record<string, string>, prefix = ''): void
    {
        Object.entries(values).forEach(([name, value]) => {
            const input = dom.querySelector(`#${prefix}${name}`) as HTMLInputElement;
            input.value = value;
            input.dispatchEvent(new Event('input'));
        });
        fixture.detectChanges();
    }

    // Helpers --------------------------------------------------------------------

    /**
     * Opens the dropdown's panel.
     *
     * @param dom     - Root element with dropdown.
     * @param fixture - Fixture to detect changes with.
     */
    private static openDropdown(dom: HTMLElement, fixture: ComponentFixture<unknown>): HTMLElement
    {
        const dropdown = dom.querySelector('app-dropdown') as HTMLElement;
        (dropdown.querySelector('.header') as HTMLElement).click();
        fixture.detectChanges();
        return dropdown;
    }
}
