import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, afterNextRender, output, signal } from '@angular/core';


/**
 * Displays the application's general modal.
 */
@Component({
    selector: 'app-modal',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './modal.component.html',
    styleUrl: './modal.css'
})
export class ModalComponent implements OnInit, OnDestroy {
    // Fields ---------------------------------------------------------------------
    activated = signal(false);

    closed = output<void>();

    // Constructors ---------------------------------------------------------------

    /**
     * Creates a new ModalComponent object.
     */
    constructor()
    {
        afterNextRender(() => {
            setTimeout(() => this.activated.set(true), 150);
        });
    }

    /**
     * Initializes all the necessary elements of the component.
     */
    ngOnInit(): void
    {
        document.body.style.overflow = 'hidden';
    }

    /**
     * Cleans up all the necessary elements of the component.
     */
    ngOnDestroy(): void
    {
        document.body.style.overflow = 'visible';
    }
}
