import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';


import { BaseLayout } from '../../base-layout.directive';

import { Group } from '../../../models/responses';
import { Form } from '../../../models/prompts';
import { createGamePicker } from '../../../constants/queries';

import { ToolBox } from '../../../utils';
import { GroupService, LoaderService, NoticeService } from '../../../services';
import { DropdownComponent, FormModalComponent } from '../../../components';


/**
 * Represents the application's family detail page.
 */
@Component({
    selector: 'app-family-detail',
    imports: [ DropdownComponent, FormModalComponent ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './family-detail.component.html',
    styleUrl: './family-detail.component.css'
})
export class FamilyDetailComponent extends BaseLayout {
    // Fields ---------------------------------------------------------------------
    private route = inject(ActivatedRoute);
    private id = Number(this.route.snapshot.paramMap.get('id'));

    private server = inject(GroupService);
    username = localStorage.getItem('username')!;

    generalError = signal('');
    family = signal<Group|undefined>(undefined);

    gamePicker = computed(() => createGamePicker());
    // selectedGame = signal<string|undefined>(undefined);

    // TODO : Replace with a real members endpoint once one exists.
    private readonly players: { username: string, points: number }[] =
    [
        { username: 'johndoe', points: 18 },
        { username: 'janesmith', points: 24 },
        { username: 'maggiewells', points: 9 },
        { username: 'mikejohnson', points: 15 }
    ];
    members = this.players;
    leaderboard = computed(() => [ ...this.players ].sort((a, b) => b.points - a.points));
    overview = signal<string[]>([]);

    private notice = inject(NoticeService);
    showEdit = signal(false);
    requestError = signal('');

    // Constructors ---------------------------------------------------------------

    /**
     * Creates a new FamilyDetailComponent object.
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
        console.log(`Fetch Group ${this.id}: Initiated...`);

        return new Promise<void>(resolve => {
            this.server.fetchGroup(this.id).subscribe({
                next: (response) => {
                    const match = response.body;
                    if (!match) {
                        this.generalError.set('An unexpected error occurred. Please try again later.');
                        console.error(`Fetch Group ${this.id} (cont.): Details are not present despite a successful response.`);
                    } else {
                        this.family.set(match);
                    }
                    resolve();
                },
                error: (error) => {
                    const code = error.status;
                    if (code === 401) {
                        ToolBox.clearSession();
                    } else if (code === 406) {
                        // TODO : Find all other types of errors
                    } else {
                        this.generalError.set('An unexpected error occurred, try again later.');
                        console.error(`Fetch Group ${this.id} (cont.): Denied because of an unexpected error - '${code}': '${error.message}'.`);
                    }
                    resolve();
                }
            });
        });
    }

    // Methods --------------------------------------------------------------------

    /**
     * Opens the update family modal.
     */
    onEdit(): void
    {
        this.requestError.set('');
        this.showEdit.set(true);
    }

    // /**
    //  * Updates the selected game.
    //  *
    //  * @param event - Event with the selected game.
    //  */
    // onGameSelection(event: string[]): void
    // {
    //     this.selectedGame.set(event[0]);
    // }

    /**
     * Processes update group requests.
     *
     * @param event - Event with form to submit.
     */
    onUpdateGroup(event: Form): void
    {
        const { name, description } = event.intake.value;
        console.log(`Update Group ${this.id}: Initiated...`);

        this.server.updateGroup(this.id, { name, description }).subscribe({
            next: () => {
                this.family.update(current => ({ ...current!, name, description }));
                this.notice.showBanner('Success! Family has been updated.');
                this.showEdit.set(false);
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
                    console.error(`Update Group ${this.id} (cont.): Denied because of an unexpected error - '${code}': '${error.message}'.`);
                }
            }
        });
    }
}
