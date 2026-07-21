import { ToolBox } from './toolbox';


/**
 * Tests the ToolBox class.
 */
describe('ToolBox', () => {
    // Setup ----------------------------------------------------------------------

    beforeEach(() =>
    {
        vi.spyOn(console, 'error');
        vi.spyOn(Storage.prototype, 'removeItem');
    });

    // Tests ----------------------------------------------------------------------

    describe('Number Parser', () => {
        it('should parse numeric strings', () =>
        {
            expect(ToolBox.parseNumber('5')).toBe(5);
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should warn for non-numeric strings and return default value', () =>
        {
            expect(ToolBox.parseNumber('John')).toBe(0);
            expect(console.error).toHaveBeenCalledTimes(1);
        });
    });


    describe('List Formatter', () => {
        it('should format empty lists', () =>
        {
            expect(ToolBox.formatList([])).toEqual('');
        });

        it('should format single valued lists', () =>
        {
            expect(ToolBox.formatList(['John'])).toEqual('John');
        });

        it('should format multiple valued lists', () =>
        {
            expect(ToolBox.formatList(['John', 'Jane'])).toEqual('John & Jane');
            expect(ToolBox.formatList(['John', 'Jane', 'Maggie'])).toEqual('John, Jane & Maggie');
        });
    });


    describe('Page Resolver', () => {
        it('should resolve straightforward page indices', () =>
        {
            expect(ToolBox.resolvePage(2, 1, 6)).toEqual({ start: 2, end: 4 });
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should resolve cusp page indices', () =>
        {
            expect(ToolBox.resolvePage(7, 1, 6)).toEqual({ start: 6, end: 6 });
            expect(console.error).not.toHaveBeenCalled();

            expect(ToolBox.resolvePage(2, 2, 6)).toEqual({ start: 4, end: 6 });
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should warn for invalid indices and rely on default values', () =>
        {
            expect(ToolBox.resolvePage(-2, 1, 6)).toEqual({ start: 0, end: 0 });
            expect(console.error).toHaveBeenCalledTimes(2);
        });
    });


    describe('Score Mapper', () => {
        const scores = [ { label: 'Win', value: ['win'] }, { label: 'Loss', value: ['loss'] } ];

        it('should map empty keys', () =>
        {
            const result = ToolBox.mapScoreLabels('', 0, scores);
            expect(result).toEqual([
                { label: '', value: [] },
                { label: '', value: [] }
            ]);
        });

        it('should map draws', () =>
        {
            const result = ToolBox.mapScoreLabels('draw', 0, scores);
            expect(result).toEqual([
                { label: 'Draw', value: ['draw'] },
                { label: 'Draw', value: ['draw'] }
            ]);
        });

        it('should map other types of wins', () =>
        {
            const result = ToolBox.mapScoreLabels('bottom-draw-win', 1, scores);
            expect(result).toEqual([
                { label: 'Loss', value: ['loss'] },
                { label: 'Bottom Draw Win', value: ['bottom-draw-win'] }
            ]);
        });
    });


    describe('Slice Creator', () => {
        it('should create a slice with color', () =>
        {
            const slice = ToolBox.createPartialSlice('Apple', 5, 'red');
            expect(slice).toBeTruthy();
            expect(slice.label).toBe('Apple');
            expect(slice.value).toBe(5);
            expect(slice.color).toBe('red');
            expect(slice.percentage).toEqual({ value: 0, xPos: 0, yPos: 0 });
            expect(slice.angle).toEqual({ start: 0, end: 0 });
            expect(slice.path).toBe('');
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should create a slice without color', () =>
        {
            const slice = ToolBox.createPartialSlice('Apple', 5);
            expect(slice).toBeTruthy();
            expect(slice.label).toBe('Apple');
            expect(slice.value).toBe(5);
            expect(slice.color).toBe('transparent');
            expect(slice.percentage).toEqual({ value: 0, xPos: 0, yPos: 0 });
            expect(slice.angle).toEqual({ start: 0, end: 0 });
            expect(slice.path).toBe('');
            expect(console.error).toHaveBeenCalledTimes(1);
        });
    });


    it('should clear session', () =>
    {
        localStorage.setItem('name', 'John');
        localStorage.setItem('username', 'johndoe');

        const reload = vi.fn();
        vi.stubGlobal('location', { ...window.location, reload });
        localStorage.setItem('name', 'John');
        ToolBox.clearSession();

        expect(localStorage.removeItem).toHaveBeenCalledTimes(2);
        expect(localStorage.removeItem).toHaveBeenCalledWith('name');
        expect(localStorage.removeItem).toHaveBeenCalledWith('username');
        expect(reload).toHaveBeenCalledTimes(1);
    });
});
