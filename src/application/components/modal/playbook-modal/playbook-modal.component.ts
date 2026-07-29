import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';


import { Playbook } from '../../../models/games';

import { ModalComponent } from '../modal.component';


/**
 * Displays the application's playbook modal.
 */
@Component({
    selector: 'app-playbook-modal',
    imports: [ ModalComponent ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './playbook-modal.component.html',
    styleUrls: [ '../modal.css', './playbook-modal.component.css' ]
})
export class PlaybookModalComponent {
    // Fields ---------------------------------------------------------------------
    title = input.required<string>();
    data = input.required<Playbook>();

    closed = output<void>();
}
