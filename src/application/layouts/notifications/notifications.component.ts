import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';


import { BaseLayout } from '../base-layout.directive';

import { Task, Vote } from '../../models/responses';
import { Filter, Page } from '../../models/queries';
import { createTaskFilter } from '../../constants/queries';
import { Message } from '../../models/prompts';
import { createConfirmationMessage } from '../../constants/prompts';

import { ToolBox } from '../../utils';
import { TaskService, LoaderService, NoticeService } from '../../services';
import { FinderComponent, MessageModalComponent, PaginatorComponent } from '../../components';


/**
 * Represents the application's notifications page.
 */
@Component({
    selector: 'app-notifications',
    imports: [ FinderComponent, MessageModalComponent, PaginatorComponent ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './notifications.component.html',
    styleUrl: './notifications.component.css'
})
export class NotificationsComponent extends BaseLayout {
    // Fields ---------------------------------------------------------------------
    private server = inject(TaskService);
    private notice = inject(NoticeService);

    filters = computed(() => createTaskFilter());
    private username = localStorage.getItem('username')!;

    generalError = signal('');
    overview = signal<Task[]>([]);
    total = computed(() => this.filtered().length);

    private terms = signal<string[]>([]);
    private criteria = signal<Filter[]>(this.filters());

    private searched = computed(() => {
        const terms = this.terms();
        return terms.length === 0 ? this.overview()
                                  : this.overview().filter(item => terms.some(term =>
                                        item.seeker.toLowerCase().includes(term) ||
                                        item.reviewers.some(entry => entry.reporter.toLowerCase().includes(term))));
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
    showMessage = signal(false);
    message = signal<Message|undefined>(undefined);
    private pendingAction = signal<{ task: Task, status: 'approved'|'pending'|'rejected'|undefined }|undefined>(undefined);

    // Constructors ---------------------------------------------------------------

    /**
     * Creates a new NotificationsComponent object.
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
        console.log('Fetch Tasks: Initiated...');

        return new Promise<void>(resolve => {
            this.server.fetchTasks().subscribe({
                next: (response) => {
                    if (!response.body) {
                        this.overview.set([]);
                        this.generalError.set('An unexpected error occurred. Please try again later.');
                        console.error('Fetch Tasks (cont.): Details are not present despite a successful response.');
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
                        console.error(`Fetch Tasks (cont.): Denied because of an unexpected error - '${code}': '${error.message}'.`);
                    }
                    resolve();
                }
            });
        });
    }

    // Methods --------------------------------------------------------------------

    /**
     * Updates the list of displayed tasks.
     *
     * @param event - Event with terms to update with.
     */
    onSearch(event: string[]): void
    {
        this.terms.set(event);
    }

    /**
     * Updates the list of displayed tasks.
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
     * Extracts the user's own review for the task, if any.
     *
     * @param task - Task to extract from.
     *
     * @return the corresponding review.
     */
    extractReview(task: Task): Vote|undefined
    {
        return task.reviewers.find(item => item.reporter === this.username);
    }

    /**
     * Checks whether the user can vote on the task.
     *
     * @param task - Task to vote on.
     *
     * @return true if votable, else false.
     */
    voteable(task: Task): boolean
    {
        if (task.reviewers.find(item => item.reporter === this.username)) {
            return task.verdict === 'Pending' || task.verdict === 'Rejected';
        }
        return false;
    }

    /**
     * Checks whether the user can cancel the task.
     *
     * @param task - Task to cancel.
     *
     * @return true if cancellable, else false.
     */
    cancellable(task: Task): boolean
    {
        return task.seeker === this.username && task.verdict === 'Pending';
    }

    /**
     * Takes the particular task action.
     * 
     * @param task   - Task to take action on.
     * @param status - Action to take.
     */
    takeAction(task: Task, status?: 'approve'|'cancel'|'pending'|'reject'): void
    {
        let verb;
        let action: 'approved'|'pending'|'rejected'|undefined = undefined;
        
        verb = status;
        if (status === 'approve') {
            action = 'approved';
        } else if (status === 'pending') {
            verb = 'reset to pending';
            action = 'pending';
        } else if (status === 'reject') {
            action = 'rejected';
        }
        
        this.requestError.set('');
        this.pendingAction.set({ task, status: action });
        this.message.set({ ...createConfirmationMessage(), notice: `You're about to ${verb} the ${task.action} request for ${this.enrichAction(task)}.` });
        this.showMessage.set(true);
    }

    /**
     * Handles confirmation requests.
     */
    onConfirmAction(): void
    {
        const action = this.pendingAction()!;
        if (!action.status) {
            this.onCancelTask(action.task);
        } else {
            this.onReviewUpdate(action.task, action.status);
        }
    }

    // Helpers --------------------------------------------------------------------

    /**
     * Processes review update requests.
     *
     * @param task   - Task to update for.
     * @param status - Status to update to.
     */
    private onReviewUpdate(task: Task, status: 'approved'|'pending'|'rejected'): void
    {
        const review = this.extractReview(task)!;
        console.log('Update Review: Initiated...');

        this.server.updateVote(review.id, status).subscribe({
            next: (response) => {
                const updated = response.body;
                if (!updated) {
                    this.generalError.set('An unexpected error occurred. Please try again later.');
                    console.error('Update Review (cont.): Details are not present despite a successful response.');
                } else {
                    this.overview.update(current => current.map(item => item.id === task.id ? updated : item));
                    this.notice.showBanner('Success! Review has been updated.');
                }
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
                    console.error(`Update Review (cont.): Denied because of an unexpected error - '${code}': '${error.message}'.`);
                }
            }
        });
    }

    /**
     * Processes cancel task requests.
     *
     * @param task - Task to cancel.
     */
    private onCancelTask(task: Task): void
    {
        console.log('Cancel Task: Initiated...');

        this.server.cancelTask(task.id).subscribe({
            next: () => {
                this.notice.showBanner('Success! Task has been cancelled.');
                this.overview.update(current => current.map(item => item.id === task.id ? { ...item, verdict: 'Cancelled' } : item));
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
                    console.error(`Cancel Task (cont.): Denied because of an unexpected error - '${code}': '${error.message}'.`);
                }
            }
        });
    }

    /**
     * Enriches the task action details.
     *
     * @param task - Task to enrich for.
     *
     * @return the corresponding details.
     */
    private enrichAction(task: Task): string
    {
        if (task.previous && task.current) {
            return 'TODO: Game Update - Get back to this to show the transition from previous to current';
        }
        return task.previous || task.current;
    }

    /**
     * Checks whether a task matches the filter.
     *
     * @param task   - Task to check.
     * @param filter - Filter to check against.
     *
     * @return true if it matches, else false.
     */
    private matchesFilter(task: Task, filter: Filter): boolean
    {
        if (filter.type !== 'check') {
            return true;
        }

        const active = filter.options.filter(item => item.active);
        if (active.length === 0) {
            return true;
        }

        if (filter.heading === 'Awaiting My Response') {
            const isAwaiting = task.verdict !== 'Cancelled' && this.extractReview(task)?.verdict === 'Pending';
            return active.some(item => (item.name === 'yes') === isAwaiting);
        }
        if (filter.heading === 'Status') {
            return active.some(item => item.name === task.verdict.toLowerCase());
        }
        if (filter.heading === 'Type') {
            return active.some(item => item.name === task.action.toLowerCase().replace(/\s+/g, '-'));
        }
        if (filter.heading === 'Requested By Me') {
            const isMine = task.seeker === this.username;
            return active.some(item => (item.name === 'yes') === isMine);
        }
        return true;
    }
}
