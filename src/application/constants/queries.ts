/**
 * Defines contants for the application's query data.
 */

import { Filter, Selector } from '../models/queries';

import { Entry } from '../models/prompts';
import { GAME_STORE, GAME_LABELS } from './games';

// --------------------------------------------------------------------------------

/**
 * Creates the game selector model.
 */
export function createGameSelector(): Selector
{
    return {
        heading: 'Games',
        options: Object.values(GAME_STORE).map(item => ({
            name: item.id,
            label: item.name,
            additional: [
                { name: 'play', label: 'Play', active: false },
                { name: 'recap', label: 'Recap', active: false }
            ],
            active: false
        }))
    };
}

/**
 * Creates the account selector model.
 */
export function createAccountSelector(): Selector
{
    return {
        heading: '',
        options: [
            { name: 'account', label: 'Account', active: false, icon: [`M240.92-268.31q51-37.84 111.12-59.77Q412.15-350 480-350t127.96 21.92q60.12 21.93 111.12 59.77 37.3-41 59.11-94.92Q800-417.15 800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 62.85 21.81 116.77 21.81 53.92 59.11 94.92Z
                                                                    M480.01-450q-54.78 0-92.39-37.6Q350-525.21 350-579.99t37.6-92.39Q425.21-710 479.99-710t92.39 37.6Q610-634.79 610-580.01t-37.6 92.39Q534.79-450 480.01-450Z
                                                                    M480-100q-79.15 0-148.5-29.77t-120.65-81.08q-51.31-51.3-81.08-120.65Q100-400.85 100-480t29.77-148.5q29.77-69.35 81.08-120.65 51.3-51.31 120.65-81.08Q400.85-860 480-860t148.5 29.77q69.35 29.77 120.65 81.08 51.31 51.3 81.08 120.65Q860-559.15 860-480t-29.77 148.5q-29.77 69.35-81.08 120.65-51.3 51.31-120.65 81.08Q559.15-100 480-100Z
                                                                    m0-60q54.15 0 104.42-17.42 50.27-17.43 89.27-48.73-39-30.16-88.11-47Q536.46-290 480-290t-105.77 16.65q-49.31 16.66-87.92 47.2 39 31.3 89.27 48.73Q425.85-160 480-160Z
                                                                    m0-350q29.85 0 49.92-20.08Q550-550.15 550-580t-20.08-49.92Q509.85-650 480-650t-49.92 20.08Q410-609.85 410-580t20.08 49.92Q450.15-510 480-510Z
                                                                    m0-70Z
                                                                    m0 355Z`] },
            { name: 'notifications', label: 'Notifications', active: false, icon: [`M210-204.62q-12.75 0-21.37-8.62-8.63-8.63-8.63-21.39 0-12.75 8.63-21.37 8.62-8.61 21.37-8.61h42.31v-298.47q0-80.69 49.81-142.69 49.8-62 127.88-79.31V-810q0-20.83 14.57-35.42Q459.14-860 479.95-860q20.82 0 35.43 14.58Q530-830.83 530-810v24.92q78.08 17.31 127.88 79.31 49.81 62 49.81 142.69v298.47H750q12.75 0 21.37 8.62 8.63 8.63 8.63 21.39 0 12.75-8.63 21.37-8.62 8.61-21.37 8.61H210Z
                                                                                m270-293.07Z
                                                                                m-.07 405.38q-29.85 0-51.04-21.24-21.2-21.24-21.2-51.07h144.62q0 29.93-21.26 51.12-21.26 21.19-51.12 21.19Zm-167.62-172.3h335.38v-298.47q0-69.46-49.11-118.57-49.12-49.12-118.58-49.12-69.46 0-118.58 49.12-49.11 49.11-49.11 118.57v298.47Z`] },                                                        
            { name: 'logout', label: 'Logout', active: false, icon: [`M212.31-140Q182-140 161-161q-21-21-21-51.31v-535.38Q140-778 161-799q21-21 51.31-21h268.07v60H212.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v535.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h268.07v60H212.31Z
                                                                m436.92-169.23-41.54-43.39L705.08-450H363.85v-60h341.23l-97.39-97.38 41.54-43.39L820-480 649.23-309.23Z`] }
        ]
    };
};


/**
 * Creates the game label selector model.
 * 
 * @param gameId - Id of game.
 */
export function createLabelSelector(gameId: string): Selector
{
    const legend: Entry[] = GAME_LABELS[gameId] ?? [];
    return {
        heading: '',
        options: legend.map(item => ({
            name: item.label === 'Loss' ? '' : item.label.toLowerCase().replace(/\s+/g, '-'),
            label: item.label === 'Loss' ? 'None' : item.label,
            active: false
        }))
    };
};


/**
 * Creates the game filter model.
 * 
 * @param gameId - Id of game.
 */
export function createGameFilter(gameId: string): Filter[]
{
    const legend: Entry[] = GAME_LABELS[gameId];
    return legend ? [{
                        heading: 'Status',
                        unique: false,
                        type: 'check',
                        options: legend.map(item => ({
                            name: item.label.toLowerCase().replace(/\s+/g, '-'),
                            label: item.label,
                            active: false
                        }))
                    },
                    {
                        heading: 'Organizer',
                        unique: true,
                        type: 'check',
                        options: [
                            { name: 'yes', label: 'Yes', active: false },
                            { name: 'no', label: 'No', active: false }
                        ]
                    },
                    {
                        heading: 'Date',
                        unique: false,
                        type: 'date',
                        from: '',
                        to: ''
                    }]
                  : [];
};


/**
 * Holds supported selectors.
 */
export const DROPDOWN_STORE: Record<string, () => Selector> =
{
    gameMenu: createGameSelector,
    accountMenu: createAccountSelector,
    ...Object.fromEntries(Object.values(GAME_STORE).map(item => [ item.id, () => createLabelSelector(item.id) ]))
};

/**
 * Holds supported filters.
 */
export const FILTER_STORE: Record<string, () => Filter[]> =
{
    ...Object.fromEntries(Object.values(GAME_STORE).map(item => [ item.id, () => createGameFilter(item.id) ]))
};
