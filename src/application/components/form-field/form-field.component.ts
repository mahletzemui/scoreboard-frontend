import { FormGroup } from '@angular/forms';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';


import { Field } from '../../models/prompts';
import { FormValidator } from '../../utils';


/**
 * Displays the application's form field.
 */
@Component({
    selector: 'app-form-field',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './form-field.component.html',
    styleUrl: './form-field.component.css'
})
export class FormFieldComponent {
    // Fields ---------------------------------------------------------------------
    field = input.required<Field>();
    intake = input.required<FormGroup>();
    
    prefix = input('');
    validate = input(false);

    // Methods --------------------------------------------------------------------

    /**
     * Updates the field's input.
     *
     * @param event - Event with input to update to.
     */
    updateField(event: Event): void
    {
        const value = (event.target as HTMLInputElement).value;
        this.intake().get(this.field().name)?.setValue(value);
    }

    /**
     * Validates the field's input as needed.
     */
    validateField(): void
    {
        if (this.validate()) {
            this.field().error = FormValidator.retrieveErrorMessage(this.field().name, this.intake());
        }
    }
}
