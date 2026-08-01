/**
 * Defines models to send to the application's backend server.
 */

// --------------------------------------------------------------------------------

/**
 * Represents login models.
 */
export interface Login
{
    username: string,
    password: string
}

/**
 * Represents registration models.
 */
export interface Register
{
    pname: string,
    username: string,
    email: string,
    password: string,
    pin: string
}

/**
 * Represents identity models.
 */
export interface Identity
{
    username: string
}


/**
 * Represents password models.
 */
export interface Password
{
    password: string
}

/**
 * Represents pin models.
 */
export interface Pin
{
    pin: string
}


/**
 * Represents verification models.
 */
export interface Verification
{
    username: string,
    pin: string
}


/**
 * Represents match models.
 */
export interface Match
{
    username: string,
    score: string|number
}

/**
 * Represents heat models.
 */
export interface Heat
{
    matches: Match[],
    special: boolean
}

/**
 * Represents score submission models.
 */
export type Scorecard = Match[]|Heat[];
