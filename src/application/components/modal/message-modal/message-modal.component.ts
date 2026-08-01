import { ChangeDetectionStrategy, Component, computed, effect, input, output } from '@angular/core';


import { Message } from '../../../models/prompts';
import { createSessionMessage } from '../../../constants/prompts';

import { ToolBox } from '../../../utils';
import { ModalComponent } from '../modal.component';


/**
 * Displays the application's message modal.
 */
@Component({
    selector: 'app-message-modal',
    imports: [ ModalComponent ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './message-modal.component.html',
    styleUrl: '../modal.css'
})
export class MessageModalComponent {
    // Fields ---------------------------------------------------------------------
    data = input<Message>();
    updates = input<string>('');

    model = computed<Message>(() => structuredClone(this.data() ?? createSessionMessage()));

    closed = output<void>();
    submitted = output<void>();

    // Constructors ---------------------------------------------------------------

    /**
     * Creates a new MessageModalComponent object.
     */
    constructor()
    {
        effect(() => {
            this.model().error = this.updates();
        });
    }

    // Methods --------------------------------------------------------------------

    /**
     * Closes the modal.
     */
    close(): void
    {
        if (!this.data()) {
            ToolBox.clearSession();
        }
        this.closed.emit();
    }
}
