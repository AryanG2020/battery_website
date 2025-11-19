import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { COMPARISON_DATA } from '../constants';

export const PerformanceCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Cost Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Cost Comparison</h3>
        <p className="text-sm text-slate-500 mb-4">Estimated production cost at scale ($/kWh)</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[COMPARISON_DATA[0]]} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" hide />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar 
                dataKey="LiIon" 
                name="Lithium-Ion (2021)" 
                fill="#94a3b8" 
                radius={[0, 4, 4, 0]} 
                barSize={30}
                label={{ position: 'right', fill: '#64748b', fontSize: 12 }}
              />
              <Bar dataKey="JES" name="JES Glass Battery" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-between text-sm">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                <span className="text-slate-600">Li-Ion ($101/kWh)</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-slate-900 font-medium">JES ($74/kWh)</span>
            </div>
        </div>
      </div>

      {/* Energy Density Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Energy Density</h3>
        <p className="text-sm text-slate-500 mb-4">Volumetric Density (Wh/l)</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[COMPARISON_DATA[1]]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="LiIon" name="Standard Li-Ion" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={60} />
              <Bar dataKey="JES" name="JES Glass Battery" fill="#f97316" radius={[4, 4, 0, 0]} barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-center gap-8 text-sm">
            <div className="text-center">
                <p className="text-slate-400">Li-Ion</p>
                <p className="font-semibold text-slate-600">~700 Wh/l</p>
            </div>
            <div className="text-center">
                <p className="text-orange-500">JES Glass</p>
                <p className="font-bold text-slate-900">&gt;1100 Wh/l</p>
            </div>
        </div>
      </div>
    </div>
  );
};