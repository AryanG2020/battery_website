
export interface BatteryLayer {
  id: string;
  name: string;
  color: string;
  description: string;
  details: string[];
  thicknessRatio: number; // Relative height in 3D
  hasMicroView?: boolean; // Trigger for specific visualizations like Interlayer Expansion
}

export interface StatMetric {
  label: string;
  value: string;
  unit?: string;
  description: string;
}

export enum ViewState {
  Intro = 'INTRO',
  Exploded = 'EXPLODED',
  Micro = 'MICRO'
}
