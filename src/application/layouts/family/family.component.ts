import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';


import { BaseLayout } from '../base-layout.directive';

import { Group } from '../../models/responses';
import { Filter, Page } from '../../models/queries';
import { createFamilyFilter } from '../../constants/queries';
import { Form, Message } from '../../models/prompts';
import { createConfirmationMessage } from '../../constants/prompts';

import { ToolBox } from '../../utils';
import { GroupService, LoaderService, NoticeService } from '../../services';
import { FinderComponent, FormModalComponent, MessageModalComponent, PaginatorComponent } from '../../components';


/**
 * Represents the application's family page.
 */
@Component({
    selector: 'app-family',
    imports: [ FinderComponent, FormModalComponent, MessageModalComponent, PaginatorComponent ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './family.component.html',
    styleUrl: './family.component.css'
})
export class FamilyComponent extends BaseLayout {
    // Fields ---------------------------------------------------------------------
    private server = inject(GroupService);
    private notice = inject(NoticeService);
    
    private router = inject(Router);
    filters = computed(() => createFamilyFilter());
    private username = localStorage.getItem('username')!;

    generalError = signal('');
    overview = signal<Group[]>([]);
    total = computed(() => this.filtered().length);

    private terms = signal<string[]>([]);
    private criteria = signal<Filter[]>(this.filters());

    private searched = computed(() => {
        const terms = this.terms();
        return terms.length === 0 ? this.overview()
                                  : this.overview().filter(item => terms.some(term =>
                                        item.name.toLowerCase().includes(term) ||
                                        item.description.toLowerCase().includes(term) ||
                                        item.organiser.toLowerCase().includes(term)));
    });

    private filtered = computed(() => {
        const criteria = this.criteria();
        return criteria.length === 0 ? this.searched()
                                     : this.searched().filter(item => criteria.every(filter => this.matchesFilter(item, filter)));
    });

    readonly pageOptions = [ '10', '20', '30' ];
    private pageIndexSignal = signal(0);
    private pageSizeSignal = signal(ToolBox.parseNumber(this.pageOptions[0]));

    paged = computed(() => {
        const { start, end } = ToolBox.resolvePage(this.pageSizeSignal(), this.pageIndexSignal(), this.filtered().length);
        return this.filtered().slice(start, end);
    });

    requestError = signal('');
    showAdd = signal(false);
    showMessage = signal(false);
    message = signal<Message|undefined>(undefined);
    private pendingAction = signal<{ group: Group, kind: 'delete'|'join'|'leave' }|undefined>(undefined);

    // Constructors ---------------------------------------------------------------

    /**
     * Creates a new FamilyComponent object.
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
        console.log('Fetch Groups: Initiated...');

        return new Promise<void>(resolve => {
            this.server.fetchGroups().subscribe({
                next: (response) => {
                    if (!response.body) {
                        this.overview.set([]);
                        this.generalError.set('An unexpected error occurred. Please try again later.');
                        console.error('Fetch Groups (cont.): Details are not present despite a successful response.');
                    } else {
                        this.overview.set(response.body);
                    }
                    resolve();
                },
                error: (error) => {
                    const code = error.status;
                    if (code === 401) {
                        ToolBox.clearSession();
                    } else {
                        this.overview.set([]);
                        this.generalError.set('An unexpected error occurred, try again later.');
                        console.error(`Fetch Groups (cont.): Denied because of an unexpected error - '${code}': '${error.message}'.`);
                    }
                    resolve();
                }
            });
        });
    }

    // Methods --------------------------------------------------------------------

    /**
     * Updates the list of displayed groups.
     *
     * @param event - Event with terms to update with.
     */
    onSearch(event: string[]): void
    {
        this.terms.set(event);
    }

    /**
     * Updates the list of displayed groups.
     *
     * @param event - Event with criteria to update with.
     */
    onFilter(event: Filter[]): void
    {
        this.criteria.set(event);
    }

    /**
     * Updates the current page.
     *
     * @param event - Event with page to update to.
     */
    onPage(event: Page): void
    {
        this.pageSizeSignal.set(event.size);
        this.pageIndexSignal.set(event.index);
    }

    /**
     * Navigates to the group's detail page.
     *
     * @param group - Group to enter.
     */
    navigateToDetails(group: Group): void
    {
        this.router.navigate([ '/family', group.id ]);
    }

    /**
     * Checks whether the user can delete the group.
     *
     * @param group - Group to check.
     *
     * @return true if deletable, else false.
     */
    deletable(group: Group): boolean
    {
        return group.organiser === this.username;
    }

    /**
     * Takes the particular group action.
     * 
     * @param group - Group to take action on.
     * @param kind  - Action to take.
     */
    takeAction(group?: Group, kind?: 'delete'|'join'|'leave'): void
    {
        this.requestError.set('');
        if (!group || !kind) {
            this.showAdd.set(true);
            return;
        }

        this.pendingAction.set({ group, kind });
        const notices: Record<'delete'|'join'|'leave', string> = {
            delete: `You're about to delete the <b>${group.name}</b> family — restoring it will require administrative assistance.`,
            join: `You're about to request to join the <b>${group.name}</b> family — access will be available once your request is approved.`,
            leave: `You're about to leave the <b>${group.name}</b> family — rejoining later will require submitting a new request.`,
        };
        this.message.set({ ...createConfirmationMessage(), notice: notices[kind] });
        this.showMessage.set(true);
    }

    /**
     * Handles confirmation requests.
     */
    onConfirmAction(): void
    {
        const action = this.pendingAction()!;
        if (action.kind === 'delete') {
            this.onDeleteGroup(action.group);
        } else if (action.kind === 'join') {
            this.onJoinGroup(action.group);
        } else {
            this.onLeaveGroup(action.group);
        }
    }

    /**
     * Processes create group requests.
     *
     * @param event - Event with form to submit.
     */
    onCreateGroup(event: Form): void
    {
        const { name, description } = event.intake.value;
        console.log('Create Group: Initiated...');

        this.server.createFamily({ name, description }).subscribe({
            next: () => {
                // TODO : add the group in overview istead of calling the backend again
                this.notice.showBanner('Success! Family has been created.');
                this.showAdd.set(false);
            },
            error: (error) => {
                const code = error.status;
                if (code === 401) {
                    ToolBox.clearSession();
                } else if (code === 406) {
                    // TODO : Find all other types of errors
                } else if (code === 409) {
                    this.requestError.set('A family with that name already exists.');
                } else {
                    this.requestError.set('An unexpected error occurred, try again later.');
                    console.error(`Create Group (cont.): Denied because of an unexpected error - '${code}': '${error.message}'.`);
                }
            }
        });
    }

    // Helpers --------------------------------------------------------------------

    /**
     * Processes delete group requests.
     *
     * @param group - Group to delete.
     */
    private onDeleteGroup(group: Group): void
    {
        console.log('Delete Group: Initiated...');

        this.server.deleteGroup(group.id).subscribe({
            next: () => {
                this.overview.update(current => current.filter(item => item.id !== group.id));
                this.notice.showBanner('Success! Family has been deleted.');
                this.showMessage.set(false);
            },
            error: (error) => {
                const code = error.status;
                if (code === 401) {
                    ToolBox.clearSession();
                } else if (code === 406) {
                    // TODO : Find all other types of errors
                } else {
                    this.requestError.set('An unexpected error occurred, try again later.');
                    console.error(`Delete Group (cont.): Denied because of an unexpected error - '${code}': '${error.message}'.`);
                }
            }
        });
    }

    /**
     * Processes join family requests.
     *
     * @param group - Group to join.
     */
    private onJoinGroup(group: Group): void
    {
        console.log('Join Group: Initiated...');

        this.server.joinGroup(group.id).subscribe({
            next: () => {
                this.notice.showBanner('Success! Request to join family has been submitted.');
                this.showMessage.set(false);
            },
            error: (error) => {
                const code = error.status;
                if (code === 401) {
                    ToolBox.clearSession();
                } else if (code === 406) {
                    // TODO : Find all other types of errors
                } else {
                    this.requestError.set('An unexpected error occurred, try again later.');
                    console.error(`Join Group (cont.): Denied because of an unexpected error - '${code}': '${error.message}'.`);
                }
            }
        });
    }

    /**
     * Processes leave group requests.
     *
     * @param group - Group to leave.
     */
    private onLeaveGroup(group: Group): void
    {
        console.log('Leave Group: Initiated...');
        const membershipId = group.membershipId!;

        this.server.leaveGroup(membershipId).subscribe({
            next: () => {
                this.overview.update(current => current.map(item => item.id === group.id ? { ...item, membershipId: null } : item));
                this.notice.showBanner('Success! Request to leave family has been processed.');
                this.showMessage.set(false);
            },
            error: (error) => {
                const code = error.status;
                if (code === 401) {
                    ToolBox.clearSession();
                } else if (code === 406) {
                    // TODO : Find all other types of errors
                } else {
                    this.requestError.set('An unexpected error occurred, try again later.');
                    console.error(`Leave Group (cont.): Denied because of an unexpected error - '${code}': '${error.message}'.`);
                }
            }
        });
    }

    /**
     * Checks whether a group matches the filter.
     *
     * @param group  - Group to check.
     * @param filter - Filter to check against.
     *
     * @return true if it matches, else false.
     */
    private matchesFilter(group: Group, filter: Filter): boolean
    {
        if (filter.type !== 'check') {
            return true;
        }

        const active = filter.options.filter(item => item.active);
        if (active.length === 0) {
            return true;
        }

        if (filter.heading === 'Created By Me') {
            return active.some(item => (item.name === 'yes') === (group.organiser === this.username));
        }
        if (filter.heading === 'Part Of') {
            return active.some(item => (item.name === 'yes') === (group.membershipId !== null));
        }
        return true;
    }
}
