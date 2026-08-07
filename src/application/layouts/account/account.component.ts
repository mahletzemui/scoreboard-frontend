import { catchError, map, of } from 'rxjs';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';


import { BaseLayout } from '../base-layout.directive';

import { Session } from '../../models/responses';
import { mapProfileFields } from '../../constants/general';
import { Entry, Form, Message } from '../../models/prompts';
import { createConfirmationMessage } from '../../constants/prompts';

import { ToolBox } from '../../utils';
import { FormModalComponent, MessageModalComponent } from '../../components';
import { AccountService, LoaderService, NoticeService } from '../../services';


/**
 * Represents the application's account page.
 */
@Component({
    selector: 'app-account',
    imports: [ FormModalComponent, MessageModalComponent ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './account.component.html',
    styleUrl: './account.component.css'
})
export class AccountComponent extends BaseLayout {
    // Fields ---------------------------------------------------------------------
    private server = inject(AccountService);
    profile = signal<Entry[]>([]);
    generalError = signal('');
    
    private notice = inject(NoticeService);
    requestError = signal('');
    initial = computed(() => {
        const value = this.profile()[0]?.value;
        return value && value !== '...' ? value.charAt(0).toUpperCase() : '?';
    });

    showMessage = signal(false);
    activeModal = signal<'updateProfile'|'updatePassword'|'updatePin'|undefined>(undefined);
    message = signal<Message|undefined>(undefined);

    // Constructors ---------------------------------------------------------------

    /**
     * Creates a new AccountComponent object.
     *
     * @param loader - Loading status handler.
     */
    constructor(loader: LoaderService)
    {
        super(loader);
    }

    /**
     * Initializes all the necessary elements of the DOM component.
     */
    protected override prepareLayout(): Promise<void>
    {
        console.log('Fetch Profile: Initiated...');

        return new Promise<void>(resolve => {
            this.server.fetchProfile().pipe(
                map(response => {
                    if (!response.body) {
                        this.generalError.set('An unexpected error occurred. Please try again later.');
                        console.error('Fetch Profile (cont.): Details are not present despite a successful response.');
                    }
                    return response.body ?? null;
                }),
                catchError(error => {
                    const code = error.status;
                    if (code === 401) {
                        this.showMessage.set(true);
                        this.generalError.set('Your session is invalid. Please log back in and try again.');
                    } else {
                        this.generalError.set('An unexpected error occurred. Please try again later.');
                        console.error(`Fetch Profile (cont.): Denied because of an unexpected error - '${code}': '${error.message}'.`);
                    }
                    return of(null);
                })
            ).subscribe(details => {
                this.profile.set(mapProfileFields(details));
                resolve();
            });
        });
    }

    // Methods --------------------------------------------------------------------

    /**
     * Opens the modal.
     *
     * @param type - Type of modal to open.
     */
    openModal(type?: 'updateProfile'|'updatePassword'|'updatePin'|'disableAccount'): void
    {
        this.requestError.set('');
        if (type === 'updateProfile'|| type === 'updatePassword' || type === 'updatePin') {
            this.activeModal.set(type);
        } else if (type === 'disableAccount') {
            this.message.set({ ...createConfirmationMessage(), notice: "You're about to revoke all access — you'll need administrative assistance to regain access." });
            this.showMessage.set(true);
        } else {
            this.message.set(undefined);
            this.showMessage.set(true);
        }
    }

    /**
     * Submits the form.
     *
     * @param model - Form to submit.
     */
    onFormSubmit(model: Form): void
    {
        switch (this.activeModal()) {
            case 'updateProfile': 
                this.onUpdateProfile(model);
                break;
            case 'updatePassword':
                this.onUpdatePassword(model);
                break;
            case 'updatePin': 
                this.onUpdatePin(model);
                break;
        }
    }

    /**
     * Processes disable account requests.
     */
    onDisableAccount(): void
    {
        console.log('Disable Account: Initiated...');

        this.server.disableAccount().subscribe({
            next: () => ToolBox.clearSession(),
            error: (error) => {
                const code = error.status;
                if (code === 401) {
                    this.openModal();
                } else {
                    this.requestError.set('An unexpected error occurred, try again later.');
                    console.error(`Disable Account (cont.): Denied because of an unexpected error - '${code}': '${error.message}'.`);
                }
            }
        });
    }

    // Helpers --------------------------------------------------------------------

    /**
     * Processes update profile requests.
     *
     * @param model - Form to submit.
     */
    private onUpdateProfile(model: Form): void
    {
        console.log('Update Profile: Initiated...');

        const { pname, username, email } = model.intake.value;
        if ([ pname, username, email ].every((item: string, i: number) => item.toLowerCase() === this.profile()[i]?.value.toLowerCase())) {
            this.activeModal.set(undefined);
            console.log('Update Profile (cont.): Skipped because there are no changes.');
            return;
        }

        this.server.updateProfile({ pname, username, email }).subscribe({
            next: (response) => {
                if (!response.body) {
                    console.error('Update Profile (cont.): Details are not present despite a successful response.');
                    ToolBox.clearSession();
                    return;
                }
                this.updateUserDetails(response.body, email.toLowerCase());
            },
            error: (error) => {
                const code = error.status;
                if (code === 401) {
                    this.activeModal.set(undefined);
                    this.openModal();
                } else if (code === 409) {
                    this.requestError.set('The username already exists.');
                } else {
                    this.requestError.set('An unexpected error occurred, try again later.');
                    console.error(`Update Profile (cont.): Denied because of an unexpected error - '${code}': '${error.message}'.`);
                }
            }
        });
    }

    /**
     * Processes update password requests.
     *
     * @param model - Form to submit.
     */
    private onUpdatePassword(model: Form): void
    {
        console.log('Update Password: Initiated...');
        const { password } = model.intake.value;

        this.server.updatePassword({ password }).subscribe({
            next: () => this.closeWithSuccess('Success! Password has been updated.'),
            error: (error) => {
                const code = error.status;
                if (code === 401) {
                    this.activeModal.set(undefined);
                    this.openModal();
                } else {
                    this.requestError.set('An unexpected error occurred, try again later.');
                    console.error(`Update Password (cont.): Denied because of an unexpected error - '${code}': '${error.message}'.`);
                }
            }
        });
    }

    /**
     * Processes update pin requests.
     *
     * @param model - Form to submit.
     */
    private onUpdatePin(model: Form): void
    {
        console.log('Update Pin: Initiated...');
        const { pin } = model.intake.value;

        this.server.updatePin({ pin }).subscribe({
            next: () => this.closeWithSuccess('Success! Pin has been updated.'),
            error: (error) => {
                const code = error.status;
                if (code === 401) {
                    this.activeModal.set(undefined);
                    this.openModal();
                } else {
                    this.requestError.set('An unexpected error occurred, try again later.');
                    console.error(`Update Pin (cont.): Denied because of an unexpected error - '${code}': '${error.message}'.`);
                }
            }
        });
    }

    /**
     * Updates profile/session details.
     *
     * @param session - Session details to update to.
     * @param email   - Formatted email to update to.
     */
    private updateUserDetails(session: Session, email: string): void
    {
        this.profile.set(mapProfileFields({ pname: session.name, username: session.username, email }));
        this.server.updateSession(session.name, session.username);
        this.closeWithSuccess('Success! Profile has been updated.');
    }

    /**
     * Closes form modals on success.
     *
     * @param success - Message to display.
     */
    private closeWithSuccess(success: string): void
    {
        this.notice.showBanner(success);
        this.activeModal.set(undefined);
    }
}
