/**
 * Defines models to recieve from the application's backend server.
 */

import { Match, Heat } from "./requests"

// --------------------------------------------------------------------------------

/**
 * Represents session models.
 */
export interface Session
{
    name: string,
    username: string
}


/**
 * Represents profile models.
 */
export interface Profile
{
    pname: string,
    username: string,
    email: string
}


/**
 * Represents vault models.
 */
export interface Vault
{
    id: number,
    organiser: string,
    standing: string,
    scores: Match[]|Heat[],
    played: string,
    updated?: string
}
