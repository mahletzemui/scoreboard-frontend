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
 * Represents group models.
 */
export interface Group
{
    id: number,
    organiser: string,
    name: string,
    description: string,
    member: number|null
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


/**
 * Represents task models.
 */
export interface Task
{
    id: number,
    seeker: string,
    action: string,
    reference: number,
    previous: string,
    current: string,
    verdict: string,
    reviewers: Vote[]
}

/**
 * Represents vote models.
 */
export interface Vote
{
    id: number,
    reporter: string,
    verdict: string
}
