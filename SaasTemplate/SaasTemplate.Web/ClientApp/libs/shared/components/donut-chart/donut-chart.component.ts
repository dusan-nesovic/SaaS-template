// Angular modules
import { Component, Input, OnChanges } from '@angular/core';

export interface DonutSegment {
  // Stable identity of the category (enum value, language code). Its color follows it, never its rank.
  key: string;
  // Translation key, or plain text for a value without one.
  labelKey: string;
  value: number;
  // Categorical color slot, 1-6; 0 is the neutral "other".
  slot: number;
}

interface DonutArc extends DonutSegment {
  percent: number;
  dashArray: string;
  dashOffset: number;
}

// The ring's geometry, in the SVG's own 120 x 120 units.
const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
// Surface gap between neighbouring slices, so they read as separate marks.
const GAP = 2;

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss'],
})
export class DonutChartComponent implements OnChanges {
  @Input() segments: DonutSegment[] = [];
  // What the number in the middle counts, e.g. "users".
  @Input() caption = '';

  readonly radius = RADIUS;

  arcs: DonutArc[] = [];
  total = 0;
  hovered: DonutArc | null = null;

  ngOnChanges(): void {
    const visible = this.segments.filter(segment => segment.value > 0);
    this.total = visible.reduce((sum, segment) => sum + segment.value, 0);
    this.hovered = null;

    const gap = visible.length > 1 ? GAP : 0;
    let offset = 0;

    this.arcs = visible.map(segment => {
      const length = (segment.value / this.total) * CIRCUMFERENCE;
      const arc: DonutArc = {
        ...segment,
        percent: Math.round((segment.value / this.total) * 100),
        dashArray: `${Math.max(length - gap, 0.01)} ${CIRCUMFERENCE - Math.max(length - gap, 0.01)}`,
        dashOffset: -offset,
      };
      offset += length;
      return arc;
    });
  }

  public setHovered(arc: DonutArc | null): void {
    this.hovered = arc;
  }
}
