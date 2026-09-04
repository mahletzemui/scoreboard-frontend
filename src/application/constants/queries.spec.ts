import { createAccountSelector, createFamilyFilter, createGameFilter, createGamePicker, createGameSelector, createGameLabelSelector, createTaskFilter } from './queries';


/**
 * Tests the query constants.
 */
describe('Queries Constants', () => {
    // Tests ----------------------------------------------------------------------

    it('should create the game selector', () =>
    {
        expect(createGameSelector()).toEqual({
            heading: 'Games',
            options: [
                { name: 'connect4', label: 'Connect4', additional: [{ name: 'play', label: 'Play', active: false }, { name: 'recap', label: 'Recap', active: false }], active: false },
                { name: 'conquer', label: 'Conquer', additional: [{ name: 'play', label: 'Play', active: false }, { name: 'recap', label: 'Recap', active: false }], active: false },
                { name: 'domino', label: 'Domino', additional: [{ name: 'play', label: 'Play', active: false }, { name: 'recap', label: 'Recap', active: false }], active: false }
            ]
        });
    });


    it('should create the account selector', () =>
    {
        expect(createAccountSelector()).toEqual({
            heading: '',
            options: [
                { name: 'account', label: 'Account', active: false, icon: expect.any(Array) },
                { name: 'notifications', label: 'Notifications', active: false, icon: expect.any(Array) },
                { name: 'logout', label: 'Logout', active: false, icon: expect.any(Array) }
            ]
        });
    });


    it('should create the game picker', () =>
    {
        expect(createGamePicker()).toEqual({
            heading: '',
            options: [
                { name: 'connect4', label: 'Connect4', active: false },
                { name: 'conquer', label: 'Conquer', active: false },
                { name: 'domino', label: 'Domino', active: false }
            ]
        });
    });


    describe('Label Selector', () => {
        it('should create known games', () =>
        {
            // for connect4 games
            expect(createGameLabelSelector('connect4')).toEqual({
                heading: '',
                options: [
                    { name: 'loss', label: 'Loss', active: false },
                    { name: 'win', label: 'Win', active: false },
                    { name: 'draw', label: 'Draw', active: false }
                ]
            });

            // for conquer games
            expect(createGameLabelSelector('conquer')).toEqual({
                heading: '',
                options: [
                    { name: 'loss', label: 'Loss', active: false },
                    { name: 'regular-win', label: 'Regular Win', active: false },
                    { name: 'joker-drop-win', label: 'Joker Drop Win', active: false },
                    { name: 'bottom-draw-win', label: 'Bottom Draw Win', active: false },
                    { name: 'combo-win', label: 'Combo Win', active: false }
                ]
            });

            // for domino games
            expect(createGameLabelSelector('domino')).toEqual({
                heading: '',
                options: [
                    { name: 'loss', label: 'Loss', active: false },
                    { name: 'regular-win', label: 'Regular Win', active: false },
                    { name: 'double-zero-win', label: 'Double Zero Win', active: false }
                ]
            });
        });

        it('should return a default value for unrecognized games', () =>
        {
            expect(createGameLabelSelector('test')).toEqual({ heading: '', options: [] });
        });
    });


    describe('Game Filter', () => {
        it('should create filters for known games', () =>
        {
            // for connect4 games
            expect(createGameFilter('connect4')).toEqual([
                {
                    heading: 'Status',
                    unique: false,
                    type: 'check',
                    options: [
                        { name: 'loss', label: 'Loss', active: false },
                        { name: 'win', label: 'Win', active: false },
                        { name: 'draw', label: 'Draw', active: false }
                    ]
                },
                {
                    heading: 'Organized By Me',
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
                }
            ]);

            // for conquer games
            expect(createGameFilter('conquer')).toEqual([
                {
                    heading: 'Status',
                    unique: false,
                    type: 'check',
                    options: [
                        { name: 'loss', label: 'Loss', active: false },
                        { name: 'regular-win', label: 'Regular Win', active: false },
                        { name: 'joker-drop-win', label: 'Joker Drop Win', active: false },
                        { name: 'bottom-draw-win', label: 'Bottom Draw Win', active: false },
                        { name: 'combo-win', label: 'Combo Win', active: false }
                    ]
                },
                {
                    heading: 'Organized By Me',
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
                }
            ]);

            // for domino games
            expect(createGameFilter('domino')).toEqual([
                {
                    heading: 'Status',
                    unique: false,
                    type: 'check',
                    options: [
                        { name: 'loss', label: 'Loss', active: false },
                        { name: 'regular-win', label: 'Regular Win', active: false },
                        { name: 'double-zero-win', label: 'Double Zero Win', active: false }
                    ]
                },
                {
                    heading: 'Organized By Me',
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
                }
            ]);
        });

        it('should return a default value for unrecognized games', () =>
        {
            expect(createGameFilter('test')).toEqual([]);
        });
    });


    it('should create the task filter', () =>
    {
        expect(createTaskFilter()).toEqual([
            {
                heading: 'Awaiting My Response',
                unique: true,
                type: 'check',
                options: [
                    { name: 'yes', label: 'Yes', active: true },
                    { name: 'no', label: 'No', active: false }
                ]
            },
            {
                heading: 'Status',
                unique: false,
                type: 'check',
                options: [
                    { name: 'pending', label: 'Pending', active: false },
                    { name: 'approved', label: 'Approved', active: false },
                    { name: 'rejected', label: 'Rejected', active: false },
                    { name: 'cancelled', label: 'Cancelled', active: false }
                ]
            },
            {
                heading: 'Type',
                unique: false,
                type: 'check',
                options: [
                    { name: 'join-family', label: 'Join Family', active: false },
                    { name: 'update-game', label: 'Update Game', active: false },
                    { name: 'delete-game', label: 'Delete Game', active: false }
                ]
            },
            {
                heading: 'Requested By Me',
                unique: true,
                type: 'check',
                options: [
                    { name: 'yes', label: 'Yes', active: false },
                    { name: 'no', label: 'No', active: false }
                ]
            }
        ]);
    });


    it('should create the family filter', () =>
    {
        expect(createFamilyFilter()).toEqual([
            {
                heading: 'Created By Me',
                unique: true,
                type: 'check',
                options: [
                    { name: 'yes', label: 'Yes', active: false },
                    { name: 'no', label: 'No', active: false }
                ]
            },
            {
                heading: 'Part Of',
                unique: true,
                type: 'check',
                options: [
                    { name: 'yes', label: 'Yes', active: false },
                    { name: 'no', label: 'No', active: false }
                ]
            }
        ]);
    });
});
