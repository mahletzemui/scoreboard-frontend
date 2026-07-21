import { mapProfileFields } from "./general";


/**
 * Tests the general constants.
 */
describe('General Constants', () => {
    // Tests ----------------------------------------------------------------------

    it('should handle the mapping of profile fields', () =>
    {
        expect(mapProfileFields({ pname: 'John', username: 'johndoe', email: 'johndoe@email.com'})).toEqual([
            { label: 'Preferred Name', value: 'John' },
            { label: 'Username', value: 'johndoe' },
            { label: 'Email', value: 'johndoe@email.com' }
        ]);

        expect(mapProfileFields(null)).toEqual([
            { label: 'Preferred Name', value: '...' },
            { label: 'Username', value: '...' },
            { label: 'Email', value: '...' }
        ]);
    });
});
