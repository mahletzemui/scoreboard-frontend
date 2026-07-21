import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';


/**
 * Manages the application's form validations.
 */
export class FormValidator {
    // Methods --------------------------------------------------------------------

    /**
     * Validates name formats (i.e., composed of 1 to 10 letters).
     *
     * @return a 'name' error tag if invalid, else null.
     */
    static name(): ValidatorFn
    {
        return (field: AbstractControl): ValidationErrors|null => {
            const value = field.value ?? '';
            const valid = /^[A-Za-z]{1,10}$/.test(value);
            return valid ? null : { 'name': true };
        }
    }

    /**
     * Validates username formats (i.e., composed of 1 to 20 characters including
     * letters, numbers and . _ -).
     *
     * @return a 'username' error tag if invalid, else null.
     */
    static username(): ValidatorFn
    {
        return (field: AbstractControl): ValidationErrors|null => {
            const value = field.value ?? '';
            const valid = /^[A-Za-z0-9._-]{1,20}$/.test(value);
            return valid ? null : { 'username': true };
        }
    }

    /**
     * Validates email formats.
     *
     * @return an 'email' error tag if invalid, else null.
     */
    static email(): ValidatorFn
    {
        return (field: AbstractControl): ValidationErrors|null => {
            const value = field.value ?? '';
            if (value.length > 100) {
                return { 'email': true };
            }

            const parts = value.split('@');
            const valid = parts.length === 2
                          && /^[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+)*$/.test(parts[0])
                          && /^[A-Za-z0-9!#$%&'*+\/=?^_`{|}~]+(?:-+[A-Za-z0-9!#$%&'*+\/=?^_`{|}~]+)*(?:\.[A-Za-z0-9!#$%&'*+\/=?^_`{|}~]+(?:-+[A-Za-z0-9!#$%&'*+\/=?^_`{|}~]+)*)*$/.test(parts[1]);
            return valid ? null : { 'email': true };
        }
    }

    /**
     * Validates password formats (i.e., composed of 8 characters or more, with a
     * letter, digit & special character).
     * 
     * @return a 'password' error tag if invalid, else null.
     */
    static password(): ValidatorFn
    {
        return (field: AbstractControl): ValidationErrors|null => {
            const value = field.value ?? '';
            const valid = value.length >= 8
                           && /[A-Za-z]+/.test(value)
                           && /[0-9]+/.test(value)
                           && /[?!@#$%^&*]+/.test(value);
            return valid ? null : { 'password': true };
        }
    }

    /**
     * Validates pin formats (i.e., composed of 4 to 6 digits).
     * 
     * @return a 'pin' error tag if invalid, else null.
     */
    static pin(): ValidatorFn
    {
        return (field: AbstractControl): ValidationErrors|null => {
            const value = field.value ?? '';
            const valid = /^[0-9]{4,6}$/.test(value);
            return valid ? null : { 'pin': true };
        }
    }

    /**
     * Validates matching fields.
     * 
     * @param actual   - Name of actual field.
     * @param expected - Name of expected field.
     * 
     * @return a 'match' error tag on mismatch, else null.
     */
    static match(actual: string, expected: string): ValidatorFn
    {
        return (form: AbstractControl): ValidationErrors|null => {
            const confirm = form.get(actual);
            const baseline = form.get(expected);
            
            if (!confirm || !baseline || confirm.value !== baseline.value) {
                confirm?.setErrors({ 'match': true });
                return { 'match': true };
            } else {
                confirm.setErrors(null);
                return null;
            }
        }
    }

    /**
     * Retrieves a form field's error message.
     * 
     * @param name - Name of field.
     * @param form - Form with field.
     * 
     * @return the corresponding error message.
     */
    static retrieveErrorMessage(name: string, form: FormGroup): string|undefined
    {
        const field = form.get(name);
        if (!field) {
            console.error(`Helper: Field '${name}' does not exist in form.`);
            return;
        }

        if (field.invalid) {
            if (field.hasError('name')) {
                return 'Must only contain 1 to 10 letters.';
            }
            else if (field.hasError('username')) {
                return 'Must only contain 1 to 20 characters including letters, numbers and/or special characters (i.e., .|_|-).';
            }
            else if (field.hasError('email')) {
                return 'Must be a valid email address.';
            }
            else if (field.hasError('password')) {
                return 'Must contain 8 characters or more, including at least 1 letter, 1 digit & 1 special character (i.e., ?|!|@|#|$|%|^|&|*).';
            }
            else if (field.hasError('pin')) {
                return 'Must be 4 to 6 digits.';
            }
            else if (field.hasError('match')) {
                return 'Must match.';
            }
            console.error(`Helper: Field '${name}' in form has an unrecognized error: '${JSON.stringify(field.errors)}'.`);
        }
        return;
    }

    /**
     * Validates a username against the current list of players (i.e., unique username).
     * 
     * @param username - Username to validate.
     * @param index    - Position of username.
     * @param players  - List of players.
     * 
     * @return true if invalid, else false.
     */
    static validatePlayer(username: string, index: number, players: string[]): boolean
    {
        const position = players.indexOf(username);
        return position !== -1 && position !== index;
    }
}
