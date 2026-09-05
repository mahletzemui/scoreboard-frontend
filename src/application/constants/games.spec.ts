import { createPlayers, createOutcomeMessage } from "./games";


/**
 * Tests the game constants.
 */
describe('Games Constants', () => {
    // Tests ----------------------------------------------------------------------

    describe('Connect4', () => {
        it('should create win scores', () =>
        {
            const participants = [
                { username: 'johndoe', score: 'Win' },
                { username: 'janesmith', score: 'Loss' }
            ];
            expect(createPlayers('connect4', participants)).toEqual([
                { username: 'johndoe', points: 1, summaries: ['Won against janesmith.'] },
                { username: 'janesmith', points: 0, summaries: ['Lost against johndoe.'] }
            ]);
            expect(createOutcomeMessage('connect4', participants)).toBe('As a result of their win, <b>johndoe</b> will be awarded <b>1 pt(s)</b>.');
        });


        it('should create draw scores', () =>
        {
            const participants = [
                { username: 'johndoe', score: 'Draw' },
                { username: 'janesmith', score: 'Draw' }
            ];
            expect(createPlayers('connect4', participants)).toEqual([
                { username: 'johndoe', points: 1, summaries: ['Drew against janesmith.'] },
                { username: 'janesmith', points: 1, summaries: ['Drew against johndoe.'] }
            ]);
            expect(createOutcomeMessage('connect4', participants)).toBe('As a result of their draw, <b>johndoe & janesmith</b> will each be awarded <b>1 pt(s)</b>.');
        });
    });

    describe('Conquer', () => {
        it('should create regular win scores', () =>
        {
            const participants = [
                { username: 'johndoe', score: 'Regular Win' },
                { username: 'janesmith', score: 'Loss' },
                { username: 'maggiewells', score: 'Loss' }
            ];
            expect(createPlayers('conquer', participants)).toEqual([
                { username: 'johndoe', points: 1, summaries: ['Won regularly against janesmith & maggiewells.'] },
                { username: 'janesmith', points: 0, summaries: ['Lost against johndoe.'] },
                { username: 'maggiewells', points: 0, summaries: ['Lost against johndoe.'] }
            ]);
            expect(createOutcomeMessage('conquer', participants)).toBe('As a result of their regular win, <b>johndoe</b> will be awarded <b>1 pt(s)</b>.');
        });


        it('should create joker drop win scores', () =>
        {
            const participants = [
                { username: 'johndoe', score: 'Loss' },
                { username: 'janesmith', score: 'Joker Drop Win' },
                { username: 'maggiewells', score: 'Loss' }
            ];
            expect(createPlayers('conquer', participants)).toEqual([
                { username: 'johndoe', points: 0, summaries: ['Lost against janesmith.'] },
                { username: 'janesmith', points: 2, summaries: ['Won with a joker drop against johndoe & maggiewells.'] },
                { username: 'maggiewells', points: 0, summaries: ['Lost against janesmith.'] }
            ]);
            expect(createOutcomeMessage('conquer', participants)).toBe('As a result of their joker drop win, <b>janesmith</b> will be awarded <b>2 pt(s)</b>.');
        });


        it('should create bottom draw win scores', () =>
        {
            const participants = [
                { username: 'johndoe', score: 'Loss' },
                { username: 'janesmith', score: 'Bottom Draw Win' },
                { username: 'maggiewells', score: 'Loss' }
            ];
            expect(createPlayers('conquer', participants)).toEqual([
                { username: 'johndoe', points: 0, summaries: ['Lost against janesmith.'] },
                { username: 'janesmith', points: 2, summaries: ['Won with a bottom draw against johndoe & maggiewells.'] },
                { username: 'maggiewells', points: 0, summaries: ['Lost against janesmith.'] }
            ]);
            expect(createOutcomeMessage('conquer', participants)).toBe('As a result of their bottom draw win, <b>janesmith</b> will be awarded <b>2 pt(s)</b>.');
        });


        it('should create combo win scores', () =>
        {
            const participants = [
                { username: 'johndoe', score: 'Loss' },
                { username: 'janesmith', score: 'Loss' },
                { username: 'maggiewells', score: 'Combo Win' }
            ];
            expect(createPlayers('conquer', participants)).toEqual([
                { username: 'johndoe', points: 0, summaries: ['Lost against maggiewells.'] },
                { username: 'janesmith', points: 0, summaries: ['Lost against maggiewells.'] },
                { username: 'maggiewells', points: 3, summaries: ['Won with a joker drop & bottom draw against johndoe & janesmith.'] }
            ]);
            expect(createOutcomeMessage('conquer', participants)).toBe('As a result of their combo win, <b>maggiewells</b> will be awarded <b>3 pt(s)</b>.');
        });
    });


    describe('Domino', () => {
        it('should create regular win scores', () =>
        {
            const rounds = [
                { special: false, matches: [{ username: 'johndoe', score: 50 }, { username: 'janesmith', score: 50 }, { username: 'maggiewells', score: 0 }] },
                { special: false, matches: [{ username: 'johndoe', score: 50 }, { username: 'janesmith', score: 100 }, { username: 'maggiewells', score: 50 }] }
            ];
            expect(createPlayers('domino', rounds)).toEqual([
                { username: 'johndoe', points: 0, summaries: ['Lost against janesmith.'] },
                { username: 'janesmith', points: 1, summaries: ['Won regularly against johndoe & maggiewells.'] },
                { username: 'maggiewells', points: 0, summaries: ['Lost against janesmith.'] }
            ]);
            expect(createOutcomeMessage('domino', rounds)).toBe('As a result of their regular win, <b>janesmith</b> will be awarded <b>1 pt(s)</b>.');
        });


        it('should create double zero win scores', () =>
        {
            const rounds = [ { special: true, matches: [{ username: 'johndoe', score: 0 }, { username: 'janesmith', score: 100 }, { username: 'maggiewells', score: 0 }] } ];
            expect(createPlayers('domino', rounds)).toEqual([
                { username: 'johndoe', points: 0, summaries: ['Lost against janesmith.'] },
                { username: 'janesmith', points: 2, summaries: ['Won with a double zero against johndoe & maggiewells.'] },
                { username: 'maggiewells', points: 0, summaries: ['Lost against janesmith.'] }
            ]);
            expect(createOutcomeMessage('domino', rounds)).toBe('As a result of their double zero win, <b>janesmith</b> will be awarded <b>2 pt(s)</b>.');
        });
    });


    it('should return a default value for unrecognized games', () =>
    {
        expect(createPlayers('test', [{ username: 'johndoe', score: 0 }])).toEqual([]);
        expect(createOutcomeMessage('test', [])).toBe('');
    });
});
