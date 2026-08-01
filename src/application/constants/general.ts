/**
 * Defines contants for the application's general data.
 */

import { Entry } from "../models/prompts";
import { Profile } from "../models/responses";

// --------------------------------------------------------------------------------

/**
 * Holds the backend server's base api.
 */
export const BASE_API: string = '/api';


/**
 * Maps profile fields to entries.
 * 
 * @param profile - Profile to map.
 */
export function mapProfileFields(profile: Profile|null): Entry[]
{
    const vault = { pname: 'Preferred Name', username: 'Username', email: 'Email' };
    return Object.entries(vault).map(([key, label]) => {
        const field = profile?.[ key as keyof Profile ];
        return { label, value: field ? field : '...'  };
    });
};
