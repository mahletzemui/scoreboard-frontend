import { ChangeDetectionStrategy, Component, computed, effect, input, OnInit, output, signal } from '@angular/core';


import { Option, Page, Selector } from '../../models/queries';

import { ToolBox } from '../../utils';
import { DropdownComponent } from '../dropdown/dropdown.component';


/**
 * Displays the application's paginator.
 */
@Component({
    selector: 'app-paginator',
    imports: [ DropdownComponent ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './paginator.component.html',
    styleUrl: './paginator.component.css'
})
export class PaginatorComponent implements OnInit {
    // Fields ---------------------------------------------------------------------
    total = input.required<number>();
    options = input.required<string[]>();

    private sizeSignal = signal<number>(0);
    readonly size = this.sizeSignal.asReadonly();

    private indexSignal = signal<number>(0);
    readonly index = this.indexSignal.asReadonly();

    selector = computed<Selector>(() => ({
        heading: '',
        options: this.options().map((item): Option => ({
            name: item,
            label: item,
            active: ToolBox.parseNumber(item) === this.size()
        }))
    }));

    range = computed(() => {
        const total = this.total();
        if (total === 0) {
            return '0 of 0';
        }

        const size = this.size();
        const index = this.index();
        const start = index * size + 1;
        const end = Math.min((index + 1) * size, total);
        return `${start} - ${end} of ${total}`;
    });

    nextPage = computed(() => this.index() < Math.ceil(this.total() / this.size()) - 1);

    paged = output<Page>();

    // Constructors ---------------------------------------------------------------

    /**
     * Creates a new PaginatorComponent object.
     */
    constructor()
    {
        effect(() => {
            this.total();
            this.indexSignal.set(0);
        });
    }

    /**
     * Initializes all the necessary elements of the component.
     */
    ngOnInit(): void
    {
        this.sizeSignal.set(ToolBox.parseNumber(this.options()[0]));
    }

    // Methods --------------------------------------------------------------------

    /**
     * Updates the size.
     *
     * @param event - Size to update to.
     */
    onResize(event: string[]): void
    {
        this.indexSignal.set(0);
        this.sizeSignal.set(ToolBox.parseNumber(event[0]));
        this.paged.emit({ size: this.size(), index: this.index() });
    }

    /**
     * Moves the current page forward or backward.
     *
     * @param forward - Flag to move forward.
     */
    movePage(forward: boolean): void
    {
        this.indexSignal.update(value => value + (forward ? 1 : -1));
        this.paged.emit({ size: this.size(), index: this.index() });
    }
}
