import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';


import { CheckFilter, DateFilter, Filter, Option } from '../../models/queries';


/**
 * Displays the application's finder.
 */
@Component({
    selector: 'app-finder',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './finder.component.html',
    styleUrl: './finder.component.css'
})
export class FinderComponent {
    // Fields ---------------------------------------------------------------------
    data = input<Filter[]>();

    private termsSignal = signal<string[]>([]);
    readonly terms = this.termsSignal.asReadonly();

    private filtersSignal = signal<Filter[]|undefined>(undefined);
    readonly filters = this.filtersSignal.asReadonly();

    opened = signal(false);
    filterCount = computed(() => (this.filters() ?? []).reduce((sum, item) => item.type === 'check' ? sum + item.options.filter(element => element.active).length
                                                                                                    : sum + (item.from || item.to ? 1 : 0), 0));

    searched = output<string[]>();
    filtered = output<Filter[]>();

    // Constructors ---------------------------------------------------------------

    /**
     * Creates a new FinderComponent object.
     */
    constructor()
    {
        effect(() => {
            this.filtersSignal.set(structuredClone(this.data()));
        });
    }

    // Methods --------------------------------------------------------------------

    /**
     * Adds the search term.
     *
     * @param term - Term to add.
     */
    addTerm(term: string): void
    {
        const value = term.trim().toLowerCase();
        const terms = this.termsSignal();
        if (value && !terms.includes(value)) {
            const updated = [ ...terms, value ];
            this.termsSignal.set(updated);
            this.searched.emit(updated);
        }
    }

    /**
     * Removes the search term.
     *
     * @param index - Index of term to remove.
     */
    removeTerm(index: number): void
    {
        const updated = this.termsSignal().filter((_, i) => i !== index);
        this.termsSignal.set(updated);
        this.searched.emit(updated);
    }

    /**
     * Removes the last search term.
     */
    removeLastTerm(): void
    {
        const terms = this.termsSignal();
        if (terms.length > 0) {
            this.removeTerm(terms.length - 1);
        }
    }

    /**
     * Toggles the filter' option.
     *
     * @param filter - Filter to update.
     * @param option - Option to toggle.
     */
    toggleOption(filter: CheckFilter, option: Option): void
    {
        if (filter.unique) {
            filter.options.forEach(item => item.active = item === option ? !option.active : false);
        } else {
            option.active = !option.active;
        }
        this.applyFilters();
    }

    /**
     * Selects the date filter.
     *
     * @param filter - Filter to update.
     * @param type   - Type of date to update.
     * @param value  - Value to update to.
     */
    selectDate(filter: DateFilter, type: 'start'|'end', value: string): void
    {
        const formatted = new Date(value);
        const local = Date.UTC(formatted.getFullYear(), formatted.getMonth(), formatted.getDate(), formatted.getHours(), formatted.getMinutes());

        if (type === 'start') {
            filter.from = value;
            filter.startDate = value ? local : undefined;
        } else {
            filter.to = value;
            filter.endDate = value ? local : undefined;
        }
        this.applyFilters();
    }

    /**
     * Clears all filters.
     */
    clearFilters(): void
    {
        this.filtersSignal.set(structuredClone(this.data()));
        this.filtered.emit([]);
        this.opened.set(false);
    }

    // Helpers --------------------------------------------------------------------

    /**
     * Emits the current filters.
     */
    private applyFilters(): void
    {
        const filters = [ ...this.filtersSignal()! ];
        this.filtersSignal.set(filters);
        this.filtered.emit(filters);
    }
}
