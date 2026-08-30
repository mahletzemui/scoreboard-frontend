import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';


import { BaseLayout } from '../base-layout.directive';

import { Form } from '../../models/prompts';
import { createUpdatePasswordForm } from '../../constants/prompts';

import { FormValidator } from '../../utils';
import { FormFieldComponent } from '../../components';
import { AuthenticationService, LoaderService, NoticeService } from '../../services';


/**
 * Represents the application's reset password page.
 */
@Component({
    selector: 'app-reset-password',
    imports: [ FormFieldComponent ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent extends BaseLayout implements OnInit {
    // Fields ---------------------------------------------------------------------
    token: string = '';
    model = signal<Form>(createUpdatePasswordForm());

    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private server = inject(AuthenticationService);
    private notice = inject(NoticeService);

    // Constructors ---------------------------------------------------------------

    /**
     * Creates a new ResetPasswordComponent object.
     *
     * @param loader - Loading status handler.
     */
    constructor(loader: LoaderService)
    {
        super(loader);
    }

    /**
     * Initializes all the necessary elements of the component.
     */
    ngOnInit(): void
    {
        const path = this.route.snapshot.queryParamMap.get('token');
        if (path) {
            this.token = path;
        } else {
            console.error('Helper: Unable to extract token for password reset.');
        }
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
     * Processes reset password requests.
     */
    onResetPassword(): void
    {
        console.log('Reset Password: Initiated...');

        const model = this.model();
        if (model.intake.valid) {
            const { password } = model.intake.value;

            this.server.resetPassword(this.token, { password }).subscribe({
                next: () => {
                    this.notice.showBanner('Success! Please sign in with your new password.');
                    this.router.navigate(['/login']);
                },
                error: (error) => {
                    const code = error.status;
                    if (code === 403) {
                        this.model.update(current => ({ ...current, error: 'The provided link is invalid or has expired.' }));
                    } else {
                        console.error(`Reset Password (cont.): Denied because of an unexpected error - '${code}': '${error.message}'.`);
                        this.model.update(current => ({ ...current, error: 'An unexpected error occurred, try again later.' }));
                    }
                }
            });
        } else {
            const fields = model.fields.map(item => ({ ...item, error: FormValidator.retrieveErrorMessage(item.name, model.intake) }));
            this.model.update(current => ({ ...current, fields, error: 'Please verify all field inputs.' }));
        }
    }
}
