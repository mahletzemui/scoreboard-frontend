import { ChangeDetectionStrategy, Component, computed, effect, input, output } from '@angular/core';


import { Field, Form } from '../../../models/prompts';
import { FORM_STORE } from '../../../constants/prompts';

import { FormValidator } from '../../../utils';
import { ModalComponent } from '../modal.component';


/**
 * Displays the application's form modal.
 */
@Component({
    selector: 'app-form-modal',
    imports: [ ModalComponent ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './form-modal.component.html',
    styleUrl: '../modal.css'
})
export class FormModalComponent {
    // Fields ---------------------------------------------------------------------
    type = input.required<string>();
    updates = input<string>();

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
     * Updates the field's input.
     *
     * @param field - Field to update.
     * @param event - Input to update to.
     */
    updateField(field: Field, event: Event): void
    {
        const value = (event.target as HTMLInputElement).value;
        this.model()!.intake.get(field.name)?.setValue(value);
    }

    /**
     * Validates the field's input.
     *
     * @param field - Field to validate.
     */
    validateField(field: Field): void
    {
        field.error = FormValidator.retrieveErrorMessage(field.name, this.model()!.intake);
    }

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
            model.fields.forEach(item => this.validateField(item));
        }
    }

    // Helpers --------------------------------------------------------------------

    /**
     * Loads the form.
     *
     * @param type - Type of form to load.
     *
     * @return the corresponding form.
     */
    private loadForm(type: string): Form|undefined
    {
        if (type in FORM_STORE) {
            const model = FORM_STORE[type]();
            model.error = undefined;
            model.fields.forEach(item => item.error = undefined);
            return model;
        }
        return undefined;
    }
}
