import { FormGroup, FormBuilder } from '@angular/forms';


import { FormValidator } from './form-validator';


/**
 * Tests the FormValidator class.
 */
describe('FormValidator', () => {
    // Fields ---------------------------------------------------------------------
    let form: FormGroup;
    const builder = new FormBuilder();

    // Setup ----------------------------------------------------------------------

    beforeEach(() =>
    {
        vi.spyOn(console, 'error');
    });

    // Tests ----------------------------------------------------------------------

    describe('Names', () => {
        beforeEach(() =>
        {
            form = builder.group({ name: [null, FormValidator.name()] });
        });

        // ------------------------------------------------------------------------

        it('should accept valid names', () =>
        {
            form.get('name')?.setValue('John');
            expect(form.get('name')?.valid).toBe(true);
            expect(FormValidator.retrieveErrorMessage('name', form)).toBeUndefined();
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should reject null names', () =>
        {
            expect(form.get('name')?.hasError('name')).toBe(true);
            expect(FormValidator.retrieveErrorMessage('name', form)).toBe('Must only contain 1 to 10 letters.');
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should reject empty names', () =>
        {
            form.get('name')?.setValue('');
            expect(form.get('name')?.hasError('name')).toBe(true);
            expect(FormValidator.retrieveErrorMessage('name', form)).toBe('Must only contain 1 to 10 letters.');
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should reject names with invalid characters', () =>
        {
            form.get('name')?.setValue('John1');
            expect(form.get('name')?.hasError('name')).toBe(true);
            expect(FormValidator.retrieveErrorMessage('name', form)).toBe('Must only contain 1 to 10 letters.');
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should reject names longer than 10 letters', () =>
        {
            form.get('name')?.setValue('J'.repeat(11));
            expect(form.get('name')?.hasError('name')).toBe(true);
            expect(FormValidator.retrieveErrorMessage('name', form)).toBe('Must only contain 1 to 10 letters.');
            expect(console.error).not.toHaveBeenCalled();
        });
    });


    describe('Usernames', () => {
        beforeEach(() =>
        {
            form = builder.group({ username: [ null, FormValidator.username() ] });
        });

        // ------------------------------------------------------------------------

        it('should accept valid usernames', () =>
        {
            form.get('username')?.setValue('johndoe');
            expect(form.get('username')?.valid).toBe(true);
            expect(FormValidator.retrieveErrorMessage('username', form)).toBeUndefined();
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should accept valid usernames pt 2', () =>
        {
            form.get('username')?.setValue('john_doe.the-first');
            expect(form.get('username')?.valid).toBe(true);
            expect(FormValidator.retrieveErrorMessage('username', form)).toBeUndefined();
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should reject null usernames', () =>
        {
            expect(form.get('username')?.hasError('username')).toBe(true);
            expect(FormValidator.retrieveErrorMessage('username', form)).toBe('Must only contain 1 to 20 characters including letters, numbers and/or special characters (i.e., .|_|-).');
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should reject empty usernames', () =>
        {
            form.get('username')?.setValue('');
            expect(form.get('username')?.hasError('username')).toBe(true);
            expect(FormValidator.retrieveErrorMessage('username', form)).toBe('Must only contain 1 to 20 characters including letters, numbers and/or special characters (i.e., .|_|-).');
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should reject usernames with invalid characters', () =>
        {
            form.get('username')?.setValue('john@doe');
            expect(form.get('username')?.hasError('username')).toBe(true);
            expect(FormValidator.retrieveErrorMessage('username', form)).toBe('Must only contain 1 to 20 characters including letters, numbers and/or special characters (i.e., .|_|-).');
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should reject usernames longer than 20 characters', () =>
        {
            form.get('username')?.setValue('j'.repeat(21));
            expect(form.get('username')?.hasError('username')).toBe(true);
            expect(FormValidator.retrieveErrorMessage('username', form)).toBe('Must only contain 1 to 20 characters including letters, numbers and/or special characters (i.e., .|_|-).');
            expect(console.error).not.toHaveBeenCalled();
        });
    });


    describe('Emails', () => {
        beforeEach(() =>
        {
            form = builder.group({ email: [ null, FormValidator.email() ] });
        });

        // ------------------------------------------------------------------------

        it('should accept valid emails', () =>
        {
            form.get('email')?.setValue('johndoe@email.com');
            expect(form.get('email')?.valid).toBe(true);
            expect(FormValidator.retrieveErrorMessage('email', form)).toBeUndefined();
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should accept valid emails pt 2', () =>
        {
            form.get('email')?.setValue('johndoe@email');
            expect(form.get('email')?.valid).toBe(true);
            expect(FormValidator.retrieveErrorMessage('email', form)).toBeUndefined();
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should reject null emails', () =>
        {
            expect(form.get('email')?.hasError('email')).toBe(true);
            expect(FormValidator.retrieveErrorMessage('email', form)).toBe('Must be a valid email address.');
            expect(console.error).not.toHaveBeenCalled();
        });

        it("should reject emails without an '@'", () =>
        {
            form.get('email')?.setValue('johndoe');
            expect(form.get('email')?.hasError('email')).toBe(true);
            expect(FormValidator.retrieveErrorMessage('email', form)).toBe('Must be a valid email address.');
            expect(console.error).not.toHaveBeenCalled();
        });

        it("should reject emails with more than one '@'", () =>
        {
            form.get('email')?.setValue('johndoe@@email.com');
            expect(form.get('email')?.hasError('email')).toBe(true);
            expect(FormValidator.retrieveErrorMessage('email', form)).toBe('Must be a valid email address.');
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should reject emails with an invalid domain', () =>
        {
            form.get('email')?.setValue('johndoe@-email.com');
            expect(form.get('email')?.hasError('email')).toBe(true);
            expect(FormValidator.retrieveErrorMessage('email', form)).toBe('Must be a valid email address.');
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should reject emails longer than 100 characters', () =>
        {
            form.get('email')?.setValue(`${'j'.repeat(101)}`);
            expect(form.get('email')?.hasError('email')).toBe(true);
            expect(FormValidator.retrieveErrorMessage('email', form)).toBe('Must be a valid email address.');
            expect(console.error).not.toHaveBeenCalled();
        });
    });


    describe('Passwords', () => {
        beforeEach(() =>
        {
            form = builder.group({ password: [ null, FormValidator.password() ] });
        });

        // ------------------------------------------------------------------------

        it('should accept valid passwords', () =>
        {
            form.get('password')?.setValue('j123456!');
            expect(form.get('password')?.valid).toBe(true);
            expect(FormValidator.retrieveErrorMessage('password', form)).toBeUndefined();
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should reject null passwords', () =>
        {
            expect(form.get('password')?.hasError('password')).toBe(true);
            expect(FormValidator.retrieveErrorMessage('password', form)).toBe('Must contain 8 characters or more, including at least 1 letter, 1 digit & 1 special character (i.e., ?|!|@|#|$|%|^|&|*).');
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should reject short passwords', () =>
        {
            form.get('password')?.setValue('j12345!');
            expect(form.get('password')?.hasError('password')).toBe(true);
            expect(FormValidator.retrieveErrorMessage('password', form)).toBe('Must contain 8 characters or more, including at least 1 letter, 1 digit & 1 special character (i.e., ?|!|@|#|$|%|^|&|*).');
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should reject passwords without letters', () =>
        {
            form.get('password')?.setValue('1234567!');
            expect(form.get('password')?.hasError('password')).toBe(true);
            expect(FormValidator.retrieveErrorMessage('password', form)).toBe('Must contain 8 characters or more, including at least 1 letter, 1 digit & 1 special character (i.e., ?|!|@|#|$|%|^|&|*).');
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should reject passwords without digits', () =>
        {
            form.get('password')?.setValue('johndoe!');
            expect(form.get('password')?.hasError('password')).toBe(true);
            expect(FormValidator.retrieveErrorMessage('password', form)).toBe('Must contain 8 characters or more, including at least 1 letter, 1 digit & 1 special character (i.e., ?|!|@|#|$|%|^|&|*).');
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should reject passwords without special characters', () =>
        {
            form.get('password')?.setValue('j1234567');
            expect(form.get('password')?.hasError('password')).toBe(true);
            expect(FormValidator.retrieveErrorMessage('password', form)).toBe('Must contain 8 characters or more, including at least 1 letter, 1 digit & 1 special character (i.e., ?|!|@|#|$|%|^|&|*).');
            expect(console.error).not.toHaveBeenCalled();
        });
    });


    describe('Pins', () => {
        beforeEach(() =>
        {
            form = builder.group({ pin: [ null, FormValidator.pin() ] });
        });

        // ------------------------------------------------------------------------

        it('should accept valid pins', () =>
        {
            form.get('pin')?.setValue('1234');
            expect(form.get('pin')?.valid).toBe(true);
            expect(FormValidator.retrieveErrorMessage('pin', form)).toBeUndefined();
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should reject null pins', () =>
        {
            expect(form.get('pin')?.hasError('pin')).toBe(true);
            expect(FormValidator.retrieveErrorMessage('pin', form)).toBe('Must be 4 to 6 digits.');
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should reject short pins', () =>
        {
            form.get('pin')?.setValue('123');
            expect(form.get('pin')?.hasError('pin')).toBe(true);
            expect(FormValidator.retrieveErrorMessage('pin', form)).toBe('Must be 4 to 6 digits.');
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should reject long pins', () =>
        {
            form.get('pin')?.setValue('1234567');
            expect(form.get('pin')?.hasError('pin')).toBe(true);
            expect(FormValidator.retrieveErrorMessage('pin', form)).toBe('Must be 4 to 6 digits.');
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should reject pins with invalid characters', () =>
        {
            form.get('pin')?.setValue('12a34');
            expect(form.get('pin')?.hasError('pin')).toBe(true);
            expect(FormValidator.retrieveErrorMessage('pin', form)).toBe('Must be 4 to 6 digits.');
            expect(console.error).not.toHaveBeenCalled();
        });
    });


    describe('Matches', () => {
        it('should accept matching fields', () =>
        {
            form = builder.group({ actual: 'matches', expected: 'matches' },
                                 { validators: [FormValidator.match('actual', 'expected')] });
            expect(form.hasError('match')).toBe(false);
            expect(form.get('actual')?.hasError('match')).toBe(false);
            expect(FormValidator.retrieveErrorMessage('actual', form)).toBeUndefined();
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should reject mismatched fields', () =>
        {
            form = builder.group({ actual: 'match', expected: 'matches' },
                                 { validators: [FormValidator.match('actual', 'expected')] });
            expect(form.hasError('match')).toBe(true);
            expect(form.get('actual')?.hasError('match')).toBe(true);
            expect(FormValidator.retrieveErrorMessage('actual', form)).toBe('Must match.');
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should reject missing confirmation fields', () =>
        {
            form = builder.group({ expected: 'matches' },
                                 { validators: [FormValidator.match('actual', 'expected')] });
            expect(form.hasError('match')).toBe(true);
            expect(form.get('actual')?.hasError('match')).toBeFalsy();
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should reject missing baseline fields', () =>
        {
            form = builder.group({ actual: 'matches' },
                                 { validators: [FormValidator.match('actual', 'expected')] });
            expect(form.hasError('match')).toBe(true);
            expect(form.get('actual')?.hasError('match')).toBe(true);
            expect(console.error).not.toHaveBeenCalled();
        });
    });


    describe('Other Error Messages', () => {
        beforeEach(() =>
        {
            form = builder.group({ field: '' });
        });

        // ------------------------------------------------------------------------

        it('should warn for unknown fields and return default value', () =>
        {
            expect(FormValidator.retrieveErrorMessage('unknown', form)).toBeUndefined();
            expect(console.error).toHaveBeenCalledTimes(1);
            expect(console.error).toHaveBeenCalledWith("Helper: Field 'unknown' does not exist in form.");
        });

        it('should warn for unknown errors and return default value', () =>
        {
            form.get('field')?.setErrors({ unknown: true });
            expect(FormValidator.retrieveErrorMessage('field', form)).toBeUndefined();
            expect(console.error).toHaveBeenCalledTimes(1);
            expect(console.error).toHaveBeenCalledWith(`Helper: Field 'field' in form has an unrecognized error: '{"unknown":true}'.`);
        });
    });


    describe('Players', () => {
        it('should accept new & unique usernames', () =>
        {
            expect(FormValidator.validatePlayer('johndoe', 0, [])).toBe(false);
        });

        it('should accept existing usernames in the correct position', () =>
        {
            expect(FormValidator.validatePlayer('johndoe', 0, ['johndoe'])).toBe(false);
        });

        it('should reject existing usernames in the wrong position', () =>
        {
            expect(FormValidator.validatePlayer('janesmith', 0, ['johndoe', 'janesmith'])).toBe(true);
        });
    });
});
