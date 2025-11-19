
import { BatteryLayer, StatMetric } from './types';

export const BATTERY_LAYERS: BatteryLayer[] = [
  {
    id: 'copper',
    name: 'Copper Foil',
    color: '#B87333',
    description: 'Current collector for the anode side. Provides electrical connection to the external circuit.',
    details: ['Material: Copper', 'Role: Negative Current Collector'],
    thicknessRatio: 0.2
  },
  {
    id: 'anode',
    name: 'Li-Metal / Graphite Anode',
    color: '#E5E7EB',
    description: 'Advanced anode technology. Primary design uses Lithium Metal for max density. Research tracks include improved Graphite with Interlayer Expansion.',
    details: [
      'Primary: Li-Metal (No casting needed)',
      'R&D: Graphite with Interlayer Expansion',
      'Target: High Capacity & Fast Charging'
    ],
    thicknessRatio: 0.8,
    hasMicroView: true
  },
  {
    id: 'separator',
    name: 'Glass Separator',
    color: '#3B82F6',
    description: 'The core Oxy-Sulfide Glass electrolyte. Dense, non-flammable, and creates a perfect solid-solid interface.',
    details: [
      'Thickness: ~35 μm',
      'Conductivity: 1 x 10⁻³ S/cm',
      'Prevents dendrites'
    ],
    thicknessRatio: 0.6
  },
  {
    id: 'cathode',
    name: 'Glass-Infused Cathode',
    color: '#172554',
    description: 'NMC Cathode active material infused with molten OS Glass for maximum surface contact and ionic conductivity.',
    details: [
      'Composition: NMC811 + OS Glass',
      'Structure: High surface area contact',
      'Voltage: 4.3V operational'
    ],
    thicknessRatio: 2.0,
    hasMicroView: true
  },
  {
    id: 'aluminum',
    name: 'Aluminum Foil',
    color: '#9CA3AF',
    description: 'Current collector for the cathode side.',
    details: ['Material: Aluminum', 'Role: Positive Current Collector'],
    thicknessRatio: 0.2
  }
];

export const COMPARISON_DATA = [
  { name: 'Manufacturing Cost', LiIon: 101, JES: 74, unit: '$/kWh' },
  { name: 'Energy Density (Volumetric)', LiIon: 700, JES: 1100, unit: 'Wh/l' }, 
  { name: 'Process Steps', LiIon: 100, JES: 66, unit: '%' },
];

export const KEY_METRICS: StatMetric[] = [
  { label: 'Cost Reduction', value: '27%', description: 'Lower BoM & OpEx' },
  { label: 'Energy Density', value: '>1100', unit: 'Wh/l', description: 'Volumetric Density' },
  { label: 'Stability', value: '>5V', description: 'Vs. Lithium' },
  { label: 'Timeline', value: '30mo', description: 'To scaled prototype' },
];
