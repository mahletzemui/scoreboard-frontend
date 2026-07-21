/**
 * Defines models to package the application's prompt data.
 */

import { FormGroup } from '@angular/forms';

// --------------------------------------------------------------------------------

/**
 * Represents entry models.
 */
export interface Entry
{
    label: string,
    value: any
}


/**
 * Represents field models.
 */
export interface Field
{
    name: string,
    label: string,
    error?: string
    type?: 'text'|'number'|'password',
    visible?: boolean,
    maxLength?: number,
    inputmode?: 'numeric',
    placeholder: string,
    default: string|number,
    autocomplete: string
}

/**
 * Represents form models.
 */
export interface Form
{
    title: string,
    error?: string,
    intake: FormGroup,
    fields: Field[]
}

/**
 * Represents message models.
 */
export interface Message
{
    title: string,
    error?: string,
    notice: string,
    actions: Entry[]
}
