/**
 * Defines models to package the application's game data.
 */

// --------------------------------------------------------------------------------

/**
 * Represents basic game models.
 */
export interface Teaser
{
    title: string,
    icon: string[],
    summary: string,
    baseUrl: string
}

/**
 * Represents detailed game models.
 */
export interface Playbook
{
    intro: string
    ruleset: string,
    scoreguide: string,
    notes?: string
}


/**
 * Represents player models.
 */
export interface Player
{
    username: string,
    points: number,
    summaries: string[]
}
