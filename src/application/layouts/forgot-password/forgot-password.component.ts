import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';


import { BaseLayout } from '../base-layout.directive';

import { Form } from '../../models/prompts';
import { createForgotPasswordForm } from '../../constants/prompts';

import { FormFieldComponent } from '../../components';
import { AuthenticationService, LoaderService } from '../../services';


/**
 * Represents the application's forgot password page.
 */
@Component({
    selector: 'app-forgot-password',
    imports: [ FormFieldComponent ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent extends BaseLayout {
    // Fields ---------------------------------------------------------------------
    model = signal<Form>(createForgotPasswordForm());
    submitted = signal(false);

    private router = inject(Router);
    private server = inject(AuthenticationService);

    // Constructors ---------------------------------------------------------------

    /**
     * Creates a new ForgotPasswordComponent object.
     *
     * @param loader - Loading status handler.
     */
    constructor(loader: LoaderService)
    {
        super(loader);
    }

    // Methods --------------------------------------------------------------------

    /**
     * Navigates to the login page.
     */
    navigateToLogin(): void
    {
        this.router.navigate(['/login']);
    }

    /**
     * Processes forgot password requests.
     */
    onForgotPassword(): void
    {
        console.log('Forgot Password: Initiated...');

        const model = this.model();
        if (model.intake.valid) {
            const { username } = model.intake.value;

            this.server.forgotPassword({ username }).subscribe({
                next: () => {
                    this.submitted.set(true);
                },
                error: (error) => {
                    console.error(`Forgot Password (cont.): Denied because of an unexpected error - '${error.status}': '${error.message}'.`);
                    this.model.update(current => ({ ...current, error: 'An unexpected error occurred, try again later.' }));
                }
            });
        } else {
            this.model.update(current => ({ ...current, error: 'Please enter a valid username.' }));
        }
    }
}
