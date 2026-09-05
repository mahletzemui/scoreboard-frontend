/**
 * Defines contants for the application's prompt data.
 */

import { FormBuilder } from '@angular/forms';


import { Field, Form, Message } from '../models/prompts';
import { FormValidator } from '../utils/form-validator/form-validator';


const builder = new FormBuilder();

// --------------------------------------------------------------------------------

/**
 * Creates the expired session message model.
 */
export function createSessionMessage(): Message
{
    return {
        title: 'Hold up…',
        notice: 'Looks like your session has expired — you might have to sign in again.',
        actions: [ { label: 'Ok', value: false } ]
    };
};

/**
 * Creates the confirmation message model.
 */
export function createConfirmationMessage(): Message
{
    return {
        title: 'Are You Sure?',
        notice: '',
        actions: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
        ]
    };
};


/**
 * Holds the login field models.
 */
export const LOGIN_FIELDS: Field[] =
[
    { name: 'username', label: 'Username', type: 'text', maxLength: 20, placeholder: 'Enter your username', default: '', autocomplete: 'username' },
    { name: 'password', label: 'Password', visible: false, placeholder: 'Enter your password', default: '', autocomplete: 'current-password' }
];

/**
 * Creates the login form model.
 */
export function createLoginForm(): Form
{
    return {
        title: 'Login',
        intake: builder.group({
            username: [ '', FormValidator.username() ],
            password: [ '', FormValidator.password() ]
        }),
        fields: LOGIN_FIELDS.map(item => ({...item}))
    };
};


/**
 * Holds the registration field models.
 */
export const REGISTER_FIELDS: Field[] =
[
    { name: 'pname', label: 'Preferred Name', type: 'text', maxLength: 10, placeholder: 'Enter your preferred name', default: '', autocomplete: 'given-name' },
    { name: 'username', label: 'Username', type: 'text', maxLength: 20, placeholder: 'Enter your username', default: '', autocomplete: 'username' },
    { name: 'email', label: 'Email', type: 'text', maxLength: 100, placeholder: 'Enter your email address', default: '', autocomplete: 'email' },
    { name: 'confirmEmail', label: 'Confirm Email', type: 'text', maxLength: 100, placeholder: 'Enter the same email address', default: '', autocomplete: 'off' },
    { name: 'password', label: 'Password', visible: false, placeholder: 'Enter a password', default: '', autocomplete: 'new-password' },
    { name: 'confirmPassword', label: 'Confirm Password', visible: false, placeholder: 'Enter the same password', default: '', autocomplete: 'off' },
    { name: 'pin', label: 'Pin', visible: false, inputmode: 'numeric', maxLength: 6, placeholder: 'Enter a pin', default: '', autocomplete: 'new-password' },
    { name: 'confirmPin', label: 'Confirm Pin', visible: false, inputmode: 'numeric', maxLength: 6, placeholder: 'Enter the same pin', default: '', autocomplete: 'off' }
];

/**
 * Creates the registration form model.
 */
export function createRegisterForm(): Form
{
    return {
        title: 'Register',
        intake: builder.group({
            pname: [ '', FormValidator.name() ],
            username: [ '', FormValidator.username() ],
            email: [ '', FormValidator.email() ],
            confirmEmail: '',
            password: [ '', FormValidator.password() ],
            confirmPassword: '',
            pin: [ '', FormValidator.pin() ],
            confirmPin: ''
        }, {
            validators: [
                FormValidator.match('confirmEmail', 'email'),
                FormValidator.match('confirmPassword', 'password'),
                FormValidator.match('confirmPin', 'pin')
            ]
        }),
        fields: REGISTER_FIELDS.map(item => ({...item}))
    };
};


/**
 * Holds the forgot password field models.
 */
export const IDENTITY_FIELDS: Field[] =
[
    { name: 'username', label: 'Username', type: 'text', maxLength: 20, placeholder: 'Enter your username', default: '', autocomplete: 'username' }
];

/**
 * Creates the forgot password form model.
 */
export function createForgotPasswordForm(): Form
{
    return {
        title: 'Request Password Reset',
        intake: builder.group({
            username: [ '', FormValidator.username() ]
        }),
        fields: IDENTITY_FIELDS.map(item => ({...item}))
    };
};


/**
 * Holds the update profile field models.
 */
export const PROFILE_FIELDS: Field[] =
[
    { name: 'pname', label: 'Preferred Name', type: 'text', maxLength: 10, placeholder: 'Enter a new preferred name', default: '', autocomplete: 'given-name' },
    { name: 'username', label: 'Username', type: 'text', maxLength: 20, placeholder: 'Enter a new username', default: '', autocomplete: 'username' },
    { name: 'email', label: 'Email', type: 'text', maxLength: 100, placeholder: 'Enter a new email address', default: '', autocomplete: 'email' },
    { name: 'confirmEmail', label: 'Confirm Email', type: 'text', maxLength: 100, placeholder: 'Enter the same new email address', default: '', autocomplete: 'off' }
];

/**
 * Creates the update profile form model.
 */
export function createUpdateProfileForm(): Form
{
    return {
        title: 'Update Profile',
        intake: builder.group({
            pname: [ '', FormValidator.name() ],
            username: [ '', FormValidator.username() ],
            email: [ '', FormValidator.email() ],
            confirmEmail: ''
        }, {
            validators: [ FormValidator.match('confirmEmail', 'email') ]
        }),
        fields: PROFILE_FIELDS.map(item => ({...item}))
    };
};


/**
 * Holds the update password field models.
 */
export const PASSWORD_FIELDS: Field[] =
[
    { name: 'password', label: 'New Password', visible: false, placeholder: 'Enter a new password', default: '', autocomplete: 'new-password' },
    { name: 'confirmPassword', label: 'Confirm Password', visible: false, placeholder: 'Enter the same new password', default: '', autocomplete: 'off' },
];

/**
 * Creates the update password form model.
 */
export function createUpdatePasswordForm(): Form
{
    return {
        title: 'Update Password',
        intake: builder.group({
            password: [ '', FormValidator.password() ],
            confirmPassword: ''
        }, {
            validators: [ FormValidator.match('confirmPassword', 'password') ]
        }),
        fields: PASSWORD_FIELDS.map(item => ({...item}))
    };
};


/**
 * Holds the update pin field models.
 */
export const PIN_FIELDS: Field[] =
[
    { name: 'pin', label: 'New Pin', visible: false, inputmode: 'numeric', maxLength: 6, placeholder: 'Enter a new pin', default: '', autocomplete: 'new-password' },
    { name: 'confirmPin', label: 'Confirm Pin', visible: false, inputmode: 'numeric', maxLength: 6, placeholder: 'Enter the same new pin', default: '', autocomplete: 'off' }
];

/**
 * Creates the update pin form model.
 */
export function createUpdatePinForm(): Form
{
    return {
        title: 'Update Pin',
        intake: builder.group({
            pin: [ '', FormValidator.pin() ],
            confirmPin: ''
        }, {
            validators: [ FormValidator.match('confirmPin', 'pin') ]
        }),
        fields: PIN_FIELDS.map(item => ({...item}))
    };
};


/**
 * Holds the player verification field models.
 */
export const VERIFY_FIELDS: Field[] =
[
    { name: 'username', label: 'Username', type: 'text', maxLength: 20, placeholder: 'Let players enter their username', default: '', autocomplete: 'off' },
    { name: 'pin', label: 'Pin', type: 'password', inputmode: 'numeric', maxLength: 6, placeholder: 'Let players enter their pin', default: '', autocomplete: 'off' }
];

/**
 * Creates the player verification form model.
 */
export function createVerifyPlayerForm(): Form
{
    return {
        title: 'Verify Player',
        intake: builder.group({
            username: [ '', FormValidator.username() ],
            pin: [ '', FormValidator.pin() ]
        }),
        fields: VERIFY_FIELDS.map(item => ({...item}))
    };
};


/**
 * Holds the family field models.
 */
export const FAMILY_FIELDS: Field[] =
[
    { name: 'name', label: 'Name', type: 'text', maxLength: 30, placeholder: 'Enter a family name', default: '', autocomplete: 'off' },
    { name: 'description', label: 'Description', type: 'text', maxLength: 255, placeholder: 'Enter a family description', default: '', autocomplete: 'off' }
];

/**
 * Creates the add family form model.
 */
export function addFamilyForm(): Form
{
    return {
        title: 'Create Family',
        intake: builder.group({
            name: [ '', FormValidator.heading() ],
            description: [ '', FormValidator.description() ]
        }),
        fields: FAMILY_FIELDS.map(item => ({...item}))
    };
};

/**
 * Creates the update family form model.
 */
export function updateFamilyForm(): Form
{
    return {
        title: 'Update Family',
        intake: builder.group({
            name: [ '', FormValidator.heading() ],
            description: [ '', FormValidator.description() ]
        }),
        fields: FAMILY_FIELDS.map(item => ({...item}))
    };
};


/**
 * Holds supported modal forms.
 */
export const FORM_STORE: Record<string, () => Form> =
{
    updateProfile: createUpdateProfileForm,
    updatePassword: createUpdatePasswordForm,
    updatePin: createUpdatePinForm,
    verifyPlayer: createVerifyPlayerForm,
    addFamily: addFamilyForm,
    updateFamily: updateFamilyForm
};
