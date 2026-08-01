import { ChangeDetectionStrategy, Component, computed, effect, input, output } from '@angular/core';


import { Form } from '../../../models/prompts';
import { FORM_STORE } from '../../../constants/prompts';

import { FormValidator } from '../../../utils';
import { ModalComponent } from '../modal.component';
import { FormFieldComponent } from '../../form-field/form-field.component';


/**
 * Displays the application's form modal.
 */
@Component({
    selector: 'app-form-modal',
    imports: [ ModalComponent, FormFieldComponent ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './form-modal.component.html',
    styleUrl: '../modal.css'
})
export class FormModalComponent {
    // Fields ---------------------------------------------------------------------
    type = input.required<string>();
    updates = input<string>('');

    model = computed<Form|undefined>(() => this.loadForm(this.type()));

    submitted = output<Form>();
    closed = output<void>();

    // Constructors ---------------------------------------------------------------

    /**
     * Creates a new FormModalComponent object.
     */
    constructor()
    {
        effect(() => {
            if (!this.model()) {
                console.error(`Helper: Form for '${this.type()}' does not exist.`);
            }
        });
        effect(() => {
            const model = this.model();
            if (model) {
                model.error = this.updates();
            }
        });
    }

    // Methods --------------------------------------------------------------------

    /**
     * Submits valid forms.
     */
    submit(): void
    {
        const model = this.model()!;
        if (model.intake.valid) {
            model.fields.forEach(item => item.error = undefined);
            this.submitted.emit(model);
        } else {
            model.error = 'Please verify all field inputs.';
            model.fields = model.fields.map(item => ({ ...item, error: FormValidator.retrieveErrorMessage(item.name, model.intake) }));
        }
    }

    // Helpers --------------------------------------------------------------------

    /**
     * Loads the form.
     *
     * @param name - Name of form to load.
     *
     * @return the corresponding form.
     */
    private loadForm(name: string): Form|undefined
    {
        if (name in FORM_STORE) {
            const model = FORM_STORE[name]();
            model.error = undefined;
            model.fields.forEach(item => item.error = undefined);
            return model;
        }
        return undefined;
    }
}
