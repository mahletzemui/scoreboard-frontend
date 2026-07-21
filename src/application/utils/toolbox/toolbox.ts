import { Entry } from "../../models/prompts";
import { Slice } from "../../models/queries";


/**
 * Manages the application's common helpers.
 */
export class ToolBox {
    // Methods --------------------------------------------------------------------

    /**
     * Parses strings into numbers.
     *
     * @param value - String to parse.
     * 
     * @return the corresponding number.
     */
    static parseNumber(value: string): number
    {
        const result = Number(value);
        if (Number.isNaN(result)) {
            console.error(`Helper: Number '${value}' is not parseable.`);
            return 0;
        }
        return result;
    }

    /**
     * Formats lists of strings with commas and/or an amperstand.
     * 
     * @param values - List to format.
     * 
     * @return the corresponding formatted list.
     */
    static formatList(values: string[]): string
    {
        if (values.length === 0) {
            return '';
        } else if (values.length === 1) {
            return values[0];
        }
        return `${values.slice(0, -1).join(', ')} & ${values.slice(-1)}`;
    }

    /**
     * Resolves a page's start and end indices.
     * 
     * @param size  - Size of each page.
     * @param index - Current page index.
     * @param total - Total number of items.
     * 
     * @return the corresponding indices.
     */
    static resolvePage(size: number, index: number, total: number): { start: number, end: number }
    {
        let start = index * size;
        if (start < 0) {
            start = 0;
            console.error(`Helper: Starting page for size '${size}' & index '${index}' is invalid.`);
        } else if (start >= total) {
            return { start: total, end: total };
        }

        let end = start + size;
        if (end < 0) {
            end = 0;
            console.error(`Helper: Ending page for size '${size}' & start '${index}' is invalid.`);
        } else if (end >= total) {
            end = total;
        }

        return { start, end };
    }

    /**
     * Maps score labels by players.
     * 
     * @param key    - Score of main player.
     * @param index  - Index of main player.
     * @param labels - Labels to map.
     * 
     * @return the corresponding score labels.
     */
    static mapScoreLabels(key: string, index: number, labels: Entry[]): Entry[]
    {
        if (key === '') {
            return labels.map(() => ({ label: '', value: [] }));
        } else if (key === 'draw') {
            return labels.map(() => ({ label: 'Draw', value: [key] }));
        } else {
            const formatted = key.split('-').map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(' ');
            return labels.map((_, i) => (index === i) ? ({ label: formatted, value: [key] })
                                                      : ({ label: 'Loss', value: ['loss'] }));
        }
    }

    /**
     * Creates a partial donut slice.
     *
     * @param label - Label of slice.
     * @param value - Value of slice.
     * @param color - Color of slice, if provided.
     * 
     * @return the corresponding partial slice.
     */
    static createPartialSlice(label: string, value: number, color?: string): Slice
    {
        if (!color) {
            color = 'transparent';
            console.error(`Helper: Slice '${label}' is not associated with a unique color.`);
        }
        return { label, value, color, percentage: { value: 0, xPos: 0, yPos: 0 }, angle: { start: 0, end: 0 }, path: '', };
    }

    /**
     * Clears all session details.
     */
    static clearSession(): void
    {
        localStorage.removeItem('name');
        localStorage.removeItem('username');
        window.location.reload();
    }
}
