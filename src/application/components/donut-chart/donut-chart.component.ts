import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';


import { Slice } from '../../models/queries';


/**
 * Displays the application's donut chart.
 */
@Component({
    selector: 'app-donut-chart',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './donut-chart.component.html',
    styleUrl: './donut-chart.component.css'
})
export class DonutChartComponent {
    // Fields ---------------------------------------------------------------------
    data = input.required<Slice[]>();

    displayed = computed<Slice[]>(() => this.buildChart());
    
    private readonly CENTER = 150;
    private readonly INNER_RADIUS = 50;
    private readonly OUTER_RADIUS = 100;

    selected = signal<Slice|undefined>(undefined);

    // Methods --------------------------------------------------------------------

    /**
     * Builds the chart's slices.
     *
     * @return the corresponding displayed slices.
     */
    private buildChart(): Slice[]
    {
        let position = 0;
        const data = this.data();
        const total = data.reduce((sum, item) => sum + item.value, 0);

        return data.map(item => {
            const curve = (item.value / total) * 360;
            const angle = { start: position, end: position + curve };

            const { x, y } = this.polarToCartesian((this.OUTER_RADIUS + this.INNER_RADIUS) / 2, (angle.start + angle.end) / 2);
            const percentage = { value: Number(((item.value / total) * 100).toFixed(1)), xPos: x, yPos: y };

            const path = this.generatePath(angle.start, angle.end);

            position += curve;
            return { ...item, angle, path, percentage };
        });
    }

    // Helpers --------------------------------------------------------------------

    /**
     * Generates a slice's svg path.
     *
     * @param start - Starting angle.
     * @param end   - Ending angle.
     *
     * @return the corresponding slice's path.
     */
    private generatePath(start: number, end: number): string
    {
        if (end - start >= 360) {
            const outerStart = this.polarToCartesian(this.OUTER_RADIUS, 0);
            const outerMid = this.polarToCartesian(this.OUTER_RADIUS, 180);
            const innerMid = this.polarToCartesian(this.INNER_RADIUS, 180);
            const innerEnd = this.polarToCartesian(this.INNER_RADIUS, 0);

            return `M ${outerStart.x} ${outerStart.y}
                    A ${this.OUTER_RADIUS} ${this.OUTER_RADIUS} 0 1 1 ${outerMid.x} ${outerMid.y}
                    A ${this.OUTER_RADIUS} ${this.OUTER_RADIUS} 0 1 1 ${outerStart.x} ${outerStart.y}
                    L ${innerMid.x} ${innerMid.y}
                    A ${this.INNER_RADIUS} ${this.INNER_RADIUS} 0 1 0 ${innerEnd.x} ${innerEnd.y}
                    A ${this.INNER_RADIUS} ${this.INNER_RADIUS} 0 1 0 ${innerMid.x} ${innerMid.y}Z`;
        }

        const outerStart = this.polarToCartesian(this.OUTER_RADIUS, start);
        const outerEnd = this.polarToCartesian(this.OUTER_RADIUS, end);
        const innerStart = this.polarToCartesian(this.INNER_RADIUS, end);
        const innerEnd = this.polarToCartesian(this.INNER_RADIUS, start);

        const arcFlag = end - start > 180 ? 1 : 0;
        return `M ${outerStart.x} ${outerStart.y}
                A ${this.OUTER_RADIUS} ${this.OUTER_RADIUS} 0 ${arcFlag} 1 ${outerEnd.x} ${outerEnd.y}
                L ${innerStart.x} ${innerStart.y}
                A ${this.INNER_RADIUS} ${this.INNER_RADIUS} 0 ${arcFlag} 0 ${innerEnd.x} ${innerEnd.y}Z`;
    }

    /**
     * Converts polar coordinates into cartesian coordinates.
     *
     * @param radius - Distance from center.
     * @param angle  - Angle in degrees.
     *
     * @return the corresponding x and y coordinates.
     */
    private polarToCartesian(radius: number, angle: number): { x: number, y: number }
    {
        const radians = (angle - 90) * Math.PI / 180;
        return { x: this.CENTER + radius * Math.cos(radians), y: this.CENTER + radius * Math.sin(radians) };
    }
}
