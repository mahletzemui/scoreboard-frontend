import { createAccountSelector, createGameFilter, createGameSelector, createGameLabelSelector } from './queries';


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


    describe('Label Selector', () => {
        it('should create known games', () =>
        {
            // for connect4 games
            expect(createGameLabelSelector('connect4')).toEqual({
                heading: '',
                options: [
                    { name: '', label: 'None', active: false },
                    { name: 'win', label: 'Win', active: false },
                    { name: 'draw', label: 'Draw', active: false }
                ]
            });

            // for conquer games
            expect(createGameLabelSelector('conquer')).toEqual({
                heading: '',
                options: [
                    { name: '', label: 'None', active: false },
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
                    { name: '', label: 'None', active: false },
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
                }
            ]);
        });

        it('should return a default value for unrecognized games', () =>
        {
            expect(createGameFilter('test')).toEqual([]);
        });
    });
});
