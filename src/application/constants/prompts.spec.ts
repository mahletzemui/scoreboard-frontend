import { addFamilyForm, createConfirmationMessage, createForgotPasswordForm, createLoginForm, createRegisterForm, createSessionMessage, createUpdatePasswordForm, createUpdatePinForm, createUpdateProfileForm, createVerifyPlayerForm, FAMILY_FIELDS, FORM_STORE, IDENTITY_FIELDS, LOGIN_FIELDS, PASSWORD_FIELDS, PIN_FIELDS, PROFILE_FIELDS, REGISTER_FIELDS, updateFamilyForm, VERIFY_FIELDS } from './prompts';


/**
 * Tests the prompt constants.
 */
describe('Prompt Constants', () => {
    // Tests ----------------------------------------------------------------------

    it('should create the session message', () =>
    {
        expect(createSessionMessage()).toEqual({
            title: 'Hold up…',
            notice: 'Looks like your session has expired — you might have to sign in again.',
            actions: [ { label: 'Ok', value: false } ]
        });
    });


    it('should create a confirmation message', () =>
    {
        expect(createConfirmationMessage()).toEqual({
            title: 'Are You Sure?',
            notice: '',
            actions: [
                { label: 'Yes', value: true },
                { label: 'No', value: false }
            ]
        });
    });

    
    it('should create the login form', () =>
    {
        const form = createLoginForm();
        expect(form.title).toBe('Login');
        expect(form.fields).toEqual(LOGIN_FIELDS);
        expect(form.fields).not.toBe(LOGIN_FIELDS);

        form.intake.get('username')?.setValue('john@doe');
        expect(form.intake.get('username')?.invalid).toBe(true);

        form.intake.get('password')?.setValue('j1234567');
        expect(form.intake.get('password')?.invalid).toBe(true);
    });


    it('should create the register form', () =>
    {
        const form = createRegisterForm();
        expect(form.title).toBe('Register');
        expect(form.fields).toEqual(REGISTER_FIELDS);
        expect(form.fields).not.toBe(REGISTER_FIELDS);

        form.intake.get('pname')?.setValue('John1');
        expect(form.intake.get('pname')?.invalid).toBe(true);

        form.intake.get('username')?.setValue('john@doe');
        expect(form.intake.get('username')?.invalid).toBe(true);

        form.intake.get('email')?.setValue('johndoe');
        expect(form.intake.get('email')?.invalid).toBe(true);

        form.intake.get('confirmEmail')?.setValue('');
        expect(form.intake.get('confirmEmail')?.invalid).toBe(true);

        form.intake.get('password')?.setValue('j1234567');
        expect(form.intake.get('password')?.invalid).toBe(true);

        form.intake.get('confirmPassword')?.setValue('');
        expect(form.intake.get('confirmPassword')?.invalid).toBe(true);

        form.intake.get('pin')?.setValue('12a34');
        expect(form.intake.get('pin')?.invalid).toBe(true);

        form.intake.get('confirmPin')?.setValue('');
        expect(form.intake.get('confirmPin')?.invalid).toBe(true);

        expect(form.intake.hasError('match')).toBe(true);
    });


    it('should create the forgot password form', () =>
    {
        const form = createForgotPasswordForm();
        expect(form.title).toBe('Request Password Reset');
        expect(form.fields).toEqual(IDENTITY_FIELDS);
        expect(form.fields).not.toBe(IDENTITY_FIELDS);

        form.intake.get('username')?.setValue('john@doe');
        expect(form.intake.get('username')?.invalid).toBe(true);
    });


    it('should create the update profile form', () =>
    {
        const form = createUpdateProfileForm();
        expect(form.title).toBe('Update Profile');
        expect(form.fields).toEqual(PROFILE_FIELDS);
        expect(form.fields).not.toBe(PROFILE_FIELDS);

        form.intake.get('pname')?.setValue('John1');
        expect(form.intake.get('pname')?.invalid).toBe(true);

        form.intake.get('username')?.setValue('john@doe');
        expect(form.intake.get('username')?.invalid).toBe(true);

        form.intake.get('email')?.setValue('johndoe');
        expect(form.intake.get('email')?.invalid).toBe(true);

        form.intake.get('confirmEmail')?.setValue('');
        expect(form.intake.get('confirmEmail')?.invalid).toBe(true);
        expect(form.intake.hasError('match')).toBe(true);
    });


    it('should create the update password form', () =>
    {
        const form = createUpdatePasswordForm();
        expect(form.title).toBe('Update Password');
        expect(form.fields).toEqual(PASSWORD_FIELDS);
        expect(form.fields).not.toBe(PASSWORD_FIELDS);

        form.intake.get('password')?.setValue('j1234567');
        expect(form.intake.get('password')?.invalid).toBe(true);

        form.intake.get('confirmPassword')?.setValue('');
        expect(form.intake.get('confirmPassword')?.invalid).toBe(true);
        expect(form.intake.hasError('match')).toBe(true);
    });


    it('should create the update pin form', () =>
    {
        const form = createUpdatePinForm();
        expect(form.title).toBe('Update Pin');
        expect(form.fields).toEqual(PIN_FIELDS);
        expect(form.fields).not.toBe(PIN_FIELDS);

        form.intake.get('pin')?.setValue('12a34');
        expect(form.intake.get('pin')?.invalid).toBe(true);

        form.intake.get('confirmPin')?.setValue('');
        expect(form.intake.get('confirmPin')?.invalid).toBe(true);
        expect(form.intake.hasError('match')).toBe(true);
    });


    it('should create the verify player form', () =>
    {
        const form = createVerifyPlayerForm();
        expect(form.title).toBe('Verify Player');
        expect(form.fields).toEqual(VERIFY_FIELDS);
        expect(form.fields).not.toBe(VERIFY_FIELDS);

        form.intake.get('username')?.setValue('john@doe');
        expect(form.intake.get('username')?.invalid).toBe(true);

        form.intake.get('pin')?.setValue('12a34');
        expect(form.intake.get('pin')?.invalid).toBe(true);
    });


    it('should create the add family form', () =>
    {
        const form = addFamilyForm();
        expect(form.title).toBe('Create Family');
        expect(form.fields).toEqual(FAMILY_FIELDS);
        expect(form.fields).not.toBe(FAMILY_FIELDS);

        form.intake.get('name')?.setValue('Family #1!');
        expect(form.intake.get('name')?.invalid).toBe(true);

        form.intake.get('description')?.setValue('Invalid\nDescription');
        expect(form.intake.get('description')?.invalid).toBe(true);
    });


    it('should create the update family form', () =>
    {
        const form = updateFamilyForm();
        expect(form.title).toBe('Update Family');
        expect(form.fields).toEqual(FAMILY_FIELDS);
        expect(form.fields).not.toBe(FAMILY_FIELDS);

        form.intake.get('name')?.setValue('Family #1!');
        expect(form.intake.get('name')?.invalid).toBe(true);

        form.intake.get('description')?.setValue('Invalid\nDescription');
        expect(form.intake.get('description')?.invalid).toBe(true);
    });


    it('should map modal forms by name', () =>
    {
        expect(FORM_STORE['updateProfile']().title).toEqual('Update Profile');
        expect(FORM_STORE['updatePassword']().title).toEqual('Update Password');
        expect(FORM_STORE['updatePin']().title).toEqual('Update Pin');
        expect(FORM_STORE['verifyPlayer']().title).toEqual('Verify Player');
        expect(FORM_STORE['addFamily']().title).toEqual('Create Family');
        expect(FORM_STORE['updateFamily']().title).toEqual('Update Family');
    });
});
