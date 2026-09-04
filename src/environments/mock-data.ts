/**
 * Holds the application's local mocked data.
 */

import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';


import { BASE_API } from '../application/constants/general';
import { Group, Profile, Session, Task, Vault } from '../application/models/responses';

// --------------------------------------------------------------------------------

// Holds generic success messages.
export const MOCK_SUCCESS = 'Request has been successfully processed!';

// Holds session details.
export const MOCK_SESSION: Session =
{
    name: 'John',
    username: 'johndoe'
};

// Holds profile details.
export const MOCK_PROFILE: Profile =
{
    pname: 'John',
    username: 'johndoe',
    email: 'johndoe@example.com'
};

// Holds game vault details.
export const MOCK_VAULTS: Record<string, Vault[]> =
{
    connect4:
    [
        { id: 1, organiser: 'johndoe', standing: 'Win', scores: [ { username: 'johndoe', score: 'Win' }, { username: 'janesmith', score: 'Loss' } ], played: '2026-01-05T18:30:00Z', updated: '2026-01-12T20:15:00Z' },
        { id: 4, organiser: 'janesmith', standing: 'Loss', scores: [ { username: 'johndoe', score: 'Win' }, { username: 'janesmith', score: 'Loss' } ], played: '2026-01-12T20:15:00Z' },
        { id: 7, organiser: 'maggiewells', standing: 'Draw', scores: [ { username: 'maggiewells', score: 'Draw' }, { username: 'mikejohnson', score: 'Draw' } ], played: '2026-02-02T17:00:00Z', updated: '2026-02-03T09:10:00Z' },
        { id: 10, organiser: 'mikejohnson', standing: 'Win', scores: [ { username: 'mikejohnson', score: 'Win' }, { username: 'johndoe', score: 'Loss' } ], played: '2026-02-20T19:45:00Z' },
        { id: 13, organiser: 'janesmith', standing: 'Win', scores: [ { username: 'janesmith', score: 'Win' }, { username: 'maggiewells', score: 'Loss' } ], played: '2026-03-08T21:00:00Z', updated: '2026-03-09T08:30:00Z' },
        { id: 16, organiser: 'johndoe', standing: 'Loss', scores: [ { username: 'johndoe', score: 'Loss' }, { username: 'mikejohnson', score: 'Win' } ], played: '2026-03-15T16:20:00Z' }
    ],
    conquer:
    [
        { id: 2, organiser: 'johndoe', standing: 'Regular Win', scores: [ { username: 'johndoe', score: 'Regular Win' }, { username: 'janesmith', score: 'Loss' } ], played: '2026-01-08T14:00:00Z', updated: '2026-01-09T10:05:00Z' },
        { id: 5, organiser: 'maggiewells', standing: 'Joker Drop Win', scores: [ { username: 'maggiewells', score: 'Joker Drop Win' }, { username: 'mikejohnson', score: 'Loss' }, { username: 'johndoe', score: 'Loss' } ], played: '2026-01-20T16:30:00Z' },
        { id: 8, organiser: 'mikejohnson', standing: 'Combo Win', scores: [ { username: 'mikejohnson', score: 'Combo Win' }, { username: 'janesmith', score: 'Loss' }, { username: 'maggiewells', score: 'Loss' }, { username: 'johndoe', score: 'Loss' } ], played: '2026-02-10T11:15:00Z', updated: '2026-02-11T18:40:00Z' },
        { id: 11, organiser: 'janesmith', standing: 'Bottom Draw Win', scores: [ { username: 'janesmith', score: 'Bottom Draw Win' }, { username: 'mikejohnson', score: 'Loss' } ], played: '2026-02-25T19:00:00Z' },
        { id: 14, organiser: 'johndoe', standing: 'Loss', scores: [ { username: 'maggiewells', score: 'Regular Win' }, { username: 'johndoe', score: 'Loss' }, { username: 'janesmith', score: 'Loss' } ], played: '2026-03-05T13:45:00Z', updated: '2026-03-06T07:20:00Z' },
        { id: 17, organiser: 'mikejohnson', standing: 'Regular Win', scores: [ { username: 'mikejohnson', score: 'Regular Win' }, { username: 'maggiewells', score: 'Loss' }, { username: 'johndoe', score: 'Loss' }, { username: 'janesmith', score: 'Loss' } ], played: '2026-03-18T12:10:00Z' }
    ],
    domino:
    [
        { id: 3, organiser: 'johndoe', standing: 'Regular Win', scores: [
            { matches: [ { username: 'johndoe', score: 100 }, { username: 'janesmith', score: 62 }, { username: 'maggiewells', score: 48 } ], special: false }
        ], played: '2026-01-10T15:00:00Z', updated: '2026-01-11T09:00:00Z' },
        { id: 6, organiser: 'janesmith', standing: 'Double Zero Win', scores: [
            { matches: [ { username: 'janesmith', score: 100 }, { username: 'johndoe', score: 55 }, { username: 'maggiewells', score: 40 }, { username: 'mikejohnson', score: 20 } ], special: true }
        ], played: '2026-01-22T18:20:00Z' },
        { id: 9, organiser: 'maggiewells', standing: 'Regular Win', scores: [
            { matches: [ { username: 'maggiewells', score: 30 }, { username: 'johndoe', score: 25 }, { username: 'janesmith', score: 20 } ], special: false },
            { matches: [ { username: 'maggiewells', score: 65 }, { username: 'johndoe', score: 58 }, { username: 'janesmith', score: 50 } ], special: false },
            { matches: [ { username: 'maggiewells', score: 100 }, { username: 'johndoe', score: 80 }, { username: 'janesmith', score: 72 } ], special: false }
        ], played: '2026-02-12T12:00:00Z', updated: '2026-02-13T20:15:00Z' },
        { id: 12, organiser: 'mikejohnson', standing: 'Loss', scores: [
            { matches: [ { username: 'johndoe', score: 28 }, { username: 'janesmith', score: 22 }, { username: 'maggiewells', score: 31 }, { username: 'mikejohnson', score: 19 } ], special: false },
            { matches: [ { username: 'johndoe', score: 60 }, { username: 'janesmith', score: 55 }, { username: 'maggiewells', score: 68 }, { username: 'mikejohnson', score: 45 } ], special: false },
            { matches: [ { username: 'johndoe', score: 85 }, { username: 'janesmith', score: 79 }, { username: 'maggiewells', score: 100 }, { username: 'mikejohnson', score: 70 } ], special: false }
        ], played: '2026-03-01T20:10:00Z' },
        { id: 15, organiser: 'johndoe', standing: 'Double Zero Win', scores: [
            { matches: [ { username: 'johndoe', score: 100 }, { username: 'mikejohnson', score: 58 }, { username: 'janesmith', score: 44 } ], special: true }
        ], played: '2026-03-14T17:30:00Z', updated: '2026-03-15T11:45:00Z' },
        { id: 18, organiser: 'janesmith', standing: 'Loss', scores: [
            { matches: [ { username: 'mikejohnson', score: 100 }, { username: 'janesmith', score: 70 }, { username: 'johndoe', score: 65 }, { username: 'maggiewells', score: 52 } ], special: false }
        ], played: '2026-03-22T10:00:00Z' }
    ]
};

// Holds task details.
export const MOCK_TASKS: Task[] =
[
    { id: 1, seeker: 'johndoe', action: 'Delete Game', reference: 1, previous: 'Game #1 — johndoe finished with a Win.', current: '', verdict: 'Pending', reviewers: [
        { id: 1, reporter: 'johndoe', verdict: 'Pending' },
        { id: 2, reporter: 'janesmith', verdict: 'Pending' }
    ] },
    { id: 2, seeker: 'janesmith', action: 'Delete Game', reference: 4, previous: 'Game #4 — janesmith finished with a Joker Drop Win.', current: '', verdict: 'Pending', reviewers: [
        { id: 3, reporter: 'janesmith', verdict: 'Approved' },
        { id: 4, reporter: 'johndoe', verdict: 'Pending' }
    ] },
    { id: 3, seeker: 'mikejohnson', action: 'Join Family', reference: 1, previous: 'Family #1 — mikejohnson wants to join the family.', current: '', verdict: 'Approved', reviewers: [
        { id: 5, reporter: 'johndoe', verdict: 'Approved' }
    ] },
    { id: 4, seeker: 'johndoe', action: 'Join Family', reference: 2, previous: 'Family #2 — johndoe wants to join the family.', current: '', verdict: 'Rejected', reviewers: [
        { id: 6, reporter: 'janesmith', verdict: 'Rejected' }
    ] },
    { id: 5, seeker: 'johndoe', action: 'Delete Game', reference: 7, previous: 'Game #7 — maggiewells and mikejohnson finished in a Draw.', current: '', verdict: 'Cancelled', reviewers: [
        { id: 7, reporter: 'johndoe', verdict: 'Pending' },
        { id: 8, reporter: 'janesmith', verdict: 'Pending' }
    ] },
    { id: 6, seeker: 'janesmith', action: 'Delete Game', reference: 16, previous: 'Game #16 — mikejohnson finished with a Win.', current: '', verdict: 'Rejected', reviewers: [
        { id: 9, reporter: 'janesmith', verdict: 'Approved' },
        { id: 10, reporter: 'johndoe', verdict: 'Rejected' }
    ] },
    { id: 7, seeker: 'mikejohnson', action: 'Delete Game', reference: 17, previous: 'Game #17 — mikejohnson finished with a Regular Win.', current: '', verdict: 'Pending', reviewers: [
        { id: 11, reporter: 'mikejohnson', verdict: 'Pending' },
        { id: 12, reporter: 'johndoe', verdict: 'Approved' },
        { id: 13, reporter: 'maggiewells', verdict: 'Pending' }
    ] },
    { id: 8, seeker: 'johndoe', action: 'Join Family', reference: 2, previous: 'Family #2 — johndoe wants to join the family.', current: '', verdict: 'Pending', reviewers: [
        { id: 14, reporter: 'janesmith', verdict: 'Pending' }
    ] }
];

// Holds family details.
export const MOCK_GROUPS: Group[] =
[
    { id: 1, organiser: 'johndoe', name: 'Does Group', description: 'A group for members of the Doe family to play and keep track of games together.', member: 1 },
    { id: 2, organiser: 'janesmith', name: 'Smiths Crew', description: "A crew for friends in Smiths circle to enjoy competitive Friday game nights together.", member: null },
    { id: 3, organiser: 'maggiewells', name: 'Wells Group', description: 'A group for members of the Wells family to play and keep track of games together.', member: 2 },
    { id: 4, organiser: 'mikejohnson', name: 'Johnsons Group', description: 'A group for members of the Johnson family to play and keep track of games together.', member: null }
];


/**
 * Resolves mock responses for HTTP requests.
 *
 * @param request - Request to resolve for.
 *
 * @return the mocked response.
 */
export function resolveMockResponse(request: HttpRequest<unknown>): HttpEvent<unknown>
{
    const { method, url } = request;
    console.debug(`Recieved call to '${url}' with action '${method}' ...`);

    if (url === `${BASE_API}/refresh`) {
        return new HttpResponse({ status: 200, body: MOCK_SESSION });
    }
    if (url === `${BASE_API}/register`) {
        return new HttpResponse({ status: 201, body: MOCK_SUCCESS });
    }
    if (url === `${BASE_API}/forgot-password`) {
        return new HttpResponse({ status: 202, body: MOCK_SUCCESS });
    }
    if (url === `${BASE_API}/account/profile` && method === 'GET') {
        return new HttpResponse({ status: 200, body: MOCK_PROFILE });
    }
    if (url === `${BASE_API}/account/profile` && method === 'PATCH') {
        return new HttpResponse({ status: 200, body: MOCK_SESSION });
    }
    if (url === `${BASE_API}/games` && method === 'POST') {
        return new HttpResponse({ status: 201, body: MOCK_SUCCESS });
    }
    if (url === `${BASE_API}/games` && method === 'GET') {
        const category = request.params.get('category') ?? '';
        return new HttpResponse({ status: 200, body: MOCK_VAULTS[category] ?? [] });
    }
    if (url === `${BASE_API}/tasks` && method === 'GET') {
        return new HttpResponse({ status: 200, body: MOCK_TASKS });
    }
    // if (url === `${BASE_API}/tasks?awaitingMe=Y` && method === 'GET') {
    //     const setOf = MOCK_TASKS.filter(item => item.verdict !== 'Cancelled' 
    //         && item.reviewers.some(entry => entry.reporter === MOCK_SESSION.username && entry.verdict === 'Pending'));
    //     return new HttpResponse({ status: 200, body: setOf });
    // }
    if (url === `${BASE_API}/tasks` && method === 'PATCH') {
        return new HttpResponse({ status: 200, body: resolveUpdatedTask(request) });
    }
    if (url === `${BASE_API}/groups` && method === 'GET') {
        const groupId = request.params.get('groupId');
        if (groupId) {
            const match = MOCK_GROUPS.find(item => item.id === Number(groupId));
            return new HttpResponse({ status: 200, body: match });
        }
        return new HttpResponse({ status: 200, body: MOCK_GROUPS });
    }
    return new HttpResponse({ status: 200, body: MOCK_SUCCESS });
}

/**
 * Resolves the task for a review update request.
 *
 * @param request - Request to resolve for.
 *
 * @return the corresponding updated task.
 */
function resolveUpdatedTask(request: HttpRequest<unknown>): Task|undefined
{
    const reviewId = Number(request.params.get('reviewId'));
    const status = request.params.get('status')!;
    
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    const task = MOCK_TASKS.find(item => item.reviewers.some(entry => entry.id === reviewId))!;

    const reviewers = task.reviewers.map(item => item.id === reviewId ? { ...item, verdict: label } : item);
    const verdict = reviewers.some(item => item.verdict === 'Rejected') ? 'Rejected'
                                                                        : reviewers.every(item => item.verdict === 'Approved') ? 'Approved'
                                                                                                                               : 'Pending';
    return { ...task, reviewers, verdict };
}
