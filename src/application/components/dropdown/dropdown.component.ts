import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';


import { Option, Selector } from '../../models/queries';


/**
 * Displays the application's dropdown.
 */
@Component({
    selector: 'app-dropdown',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './dropdown.component.html',
    styleUrl: './dropdown.component.css'
})
export class DropdownComponent {
    // Fields ---------------------------------------------------------------------
    data = input.required<Selector>();

    caption = computed(() => this.data().heading || 'Select an Option');
    options = signal<Option[]>([]);
    
    value = computed(() => this.findLabel(this.options()));
    floated = computed(() => this.value() !== undefined);

    opened = signal(false);
    expanded = signal<number|undefined>(undefined);

    selected = output<string[]>();

    // Constructors ---------------------------------------------------------------

    /**
     * Creates a new DropdownComponent object.
     */
    constructor()
    {
        effect(() => {
            this.options.set(structuredClone(this.data().options));
        });
    }

    // Methods --------------------------------------------------------------------

    /**
     * Toggles the panel.
     */
    togglePanel(): void
    {
        this.opened.update(item => !item);
    }

    /**
     * Toggles the main option.
     *
     * @param index - Index of option.
     */
    toggleOption(index: number): void
    {
        this.expanded.update(item => item === index ? undefined : index);
    }

    /**
     * Selects the option.
     *
     * @param mainIndex   - Index of main option.
     * @param nestedIndex - Index of nested option.
     */
    selectOption(mainIndex: number, nestedIndex?: number): void
    {
        const options = this.options();
        const path: string[] = [ options[mainIndex].name ];
        if (nestedIndex !== undefined) {
            path.push(options[mainIndex].additional![nestedIndex].name);
        }

        options.forEach((item, i) => {
            item.active = i === mainIndex;
            item.additional?.forEach((nested, j) => {
                nested.active = item.active && j === nestedIndex;
            });
        });

        this.options.set([ ...options ]);
        this.selected.emit(path);
        this.close();
    }

    /**
     * Closes the panel.
     */
    close(): void
    {
        this.opened.set(false);
        this.expanded.set(undefined);
    }

    // Helpers --------------------------------------------------------------------

    /**
     * Finds the active option's label.
     *
     * @param options - Options to look through.
     *
     * @return the corresponding label.
     */
    private findLabel(options: Option[]): string|undefined
    {
        for (const item of options) {
            if (item.active) {
                return item.label;
            }
        }
        return undefined;
    }
}
