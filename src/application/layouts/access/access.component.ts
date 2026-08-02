import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';


import { BaseLayout } from '../base-layout.directive';

import { Form } from '../../models/prompts';
import { createLoginForm, createRegisterForm } from '../../constants/prompts';

import { FormValidator } from '../../utils';
import { FormFieldComponent } from '../../components';
import { AuthenticationService, LoaderService } from '../../services';


/**
 * Represents the application's access page.
 */
@Component({
    selector: 'app-access',
    imports: [ FormFieldComponent ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './access.component.html',
    styleUrls: [ '../../../assets/styles/authentication.css', './access.component.css' ]
})
export class AccessComponent extends BaseLayout {
    // Fields ---------------------------------------------------------------------
    loginModel = signal<Form>(createLoginForm());
    registerModel = signal<Form>(createRegisterForm());
    private server = inject(AuthenticationService);

    private router = inject(Router);
    private location = inject(Location);

    private route = inject(ActivatedRoute);
    view = signal<'login'|'register'>(this.route.snapshot.data['view'] === 'register' ? 'register' : 'login');
    transitioning = signal(false);

    // Constructors ---------------------------------------------------------------

    /**
     * Creates a new AccessComponent object.
     *
     * @param loader - Loading status handler.
     */
    constructor(loader: LoaderService)
    {
        super(loader);
    }

    // Methods --------------------------------------------------------------------

    /**
     * Switches between the login and registration views.
     *
     * @param view - View to switch to.
     */
    switchView(view: 'login'|'register'): void
    {
        this.transitioning.set(true);
        this.view.set(view);
        this.location.go(view === 'login' ? '/login' : '/register');
        setTimeout(() => this.transitioning.set(false), 650);
    }

    /**
     * Navigates to the forgot password page.
     */
    navigateToForgotPassword(): void
    {
        this.router.navigate(['/forgot-password']);
    }

    /**
     * Processes login requests.
     */
    onLogin(): void
    {
        console.log('Login: Initiated...');

        const model = this.loginModel();
        if (model.intake.valid) {
            const { username, password } = model.intake.value;

            this.server.login({ username, password }).subscribe({
                next: () => {
                    this.router.navigate(['/dashboard']);
                },
                error: (error) => {
                    const code = error.status;
                    if (code === 401) {
                        this.loginModel.update(current => ({ ...current, error: 'The username and/or password are incorrect.' }));
                    } else {
                        console.error(`Login (cont.): Denied because of an unexpected error - '${code}': '${error.message}'.`);
                        this.loginModel.update(current => ({ ...current, error: 'An unexpected error occurred, try again later.' }));
                    }
                }
            });
        } else {
            this.loginModel.update(current => ({ ...current, error: 'The username and/or password are incorrect.' }));
        }
    }

    /**
     * Processes registration requests.
     */
    onRegister(): void
    {
        console.log('Registration: Initiated...');

        const model = this.registerModel();
        if (model.intake.valid) {
            const { pname, username, email, password, pin } = model.intake.value;

            this.server.register({ pname, username, email, password, pin }).subscribe({
                next: () => {
                    this.router.navigate(['/dashboard']);
                },
                error: (error) => {
                    const code = error.status;
                    if (code === 409) {
                        this.registerModel.update(current => ({ ...current, error: 'The username already exists.' }));
                    } else {
                        console.error(`Registration (cont.): Denied because of an unexpected error - '${code}': '${error.message}'.`);
                        this.registerModel.update(current => ({ ...current, error: 'An unexpected error occurred, try again later.' }));
                    }
                }
            });
        } else {
            const fields = model.fields.map(item => ({ ...item, error: FormValidator.retrieveErrorMessage(item.name, model.intake) }));
            this.registerModel.update(current => ({ ...current, fields, error: 'Please verify all field inputs.' }));
        }
    }
}
