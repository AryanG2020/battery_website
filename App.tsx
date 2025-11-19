
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Battery, Layers, Zap, ShieldCheck, Factory, ArrowRight, Beaker, Microscope, X, Network } from 'lucide-react';
import { BatteryScene } from './components/BatteryScene';
import { PerformanceCharts } from './components/Charts';
import { BATTERY_LAYERS, KEY_METRICS } from './constants';
import { ViewState } from './types';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.Intro);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  // Helper to find selected layer data
  const activeLayer = BATTERY_LAYERS.find(l => l.id === selectedLayerId);

  const handleLayerSelect = (id: string | null) => {
    if (viewState === ViewState.Micro && id === null) {
         return;
    }
    setSelectedLayerId(id);
    if (id && viewState === ViewState.Intro) {
      setViewState(ViewState.Exploded);
    }
  };

  const toggleMicroView = () => {
      if (viewState === ViewState.Micro) {
          setViewState(ViewState.Exploded);
      } else {
          setViewState(ViewState.Micro);
      }
  };

  // Content for Micro View based on selected layer
  const renderMicroViewContent = () => {
      if (selectedLayerId === 'anode') {
          return (
            <>
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Graphite Interlayer Expansion</h2>
                    <div className="w-12 h-1 mt-3 rounded-full bg-green-500"></div>
                </div>
                <p className="text-slate-600 leading-relaxed">
                    JES is developing modified graphite anodes where the interlayer spacing (d-spacing) is expanded beyond 3.36Å.
                </p>
                <div className="bg-green-50 rounded-xl border border-green-100 p-5 shadow-sm">
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                        <Microscope size={18} />
                        Mechanism of Action
                    </h4>
                    <p className="text-sm text-green-700 mb-3">
                        Expanding the carbon layers reduces diffusion resistance (R<sub>Diffusion</sub>), allowing Lithium ions to move freely.
                    </p>
                    <div className="flex items-center gap-3 text-sm font-medium text-green-800 bg-white p-3 rounded-lg border border-green-100">
                        <ArrowRight size={16} /> Accelerates Diffusion of Li+
                    </div>
                </div>
            </>
          );
      }
      if (selectedLayerId === 'cathode') {
        return (
          <>
              <div>
                  <h2 className="text-3xl font-bold text-slate-900">Glass-Infused Cathode</h2>
                  <div className="w-12 h-1 mt-3 rounded-full bg-blue-600"></div>
              </div>
              <p className="text-slate-600 leading-relaxed">
                  Interact with the slider to simulate the glass infusion process.
              </p>
              <div className="bg-blue-50 rounded-xl border border-blue-100 p-5 shadow-sm">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                      <Network size={18} />
                      Composite Structure
                  </h4>
                  <p className="text-sm text-blue-700 mb-3">
                      Molten Oxy-Sulfide glass fills the voids between NMC active material particles (dodecahedrons).
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                        <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
                        <span>Active Material (NMC)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>Solid Electrolyte (Glass)</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-sm font-medium text-blue-800 bg-white p-3 rounded-lg border border-blue-100">
                      <Zap size={16} /> Enables High Capacity & Speed
                  </div>
              </div>
          </>
        );
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100">
      
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-600/20">
              <Zap size={20} fill="currentColor" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none tracking-tight">Johnson Energy Storage</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-0.5">Glass Battery Tech</span>
            </div>
          </div>
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => { setViewState(ViewState.Intro); setSelectedLayerId(null); }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${viewState === ViewState.Intro ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => { setViewState(ViewState.Exploded); setSelectedLayerId(null); }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${viewState === ViewState.Exploded || viewState === ViewState.Micro ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Technology
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8">
        
        {/* Top Section: 3D Viewer & Context */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[650px] lg:h-[600px]">
          
          {/* Left: Contextual Info Panel */}
          <div className="lg:col-span-1 flex flex-col justify-center relative z-10">
            <AnimatePresence mode="wait">
              {/* MICRO VIEW STATE CONTENT */}
              {viewState === ViewState.Micro ? (
                  <motion.div 
                  key="micro-detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <button 
                    onClick={toggleMicroView}
                    className="text-sm text-slate-500 font-medium hover:text-slate-800 mb-2 flex items-center gap-2 group"
                  >
                    <div className="p-1 rounded-full bg-slate-200 group-hover:bg-slate-300 transition-colors">
                        <X size={14} />
                    </div>
                    Close Micro View
                  </button>
                  
                  {renderMicroViewContent()}

                </motion.div>
              ) : selectedLayerId ? (
                  /* SELECTED LAYER DETAIL CONTENT */
                <motion.div 
                  key="layer-detail"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <button 
                    onClick={() => setSelectedLayerId(null)}
                    className="text-sm text-blue-600 font-medium hover:underline mb-2 flex items-center gap-1"
                  >
                    ← Back to stack
                  </button>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">{activeLayer?.name}</h2>
                    <div className="w-12 h-1 mt-3 rounded-full" style={{ backgroundColor: activeLayer?.color }}></div>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {activeLayer?.description}
                  </p>
                  
                  {/* Special Feature: Micro View Button */}
                  {activeLayer?.hasMicroView && (
                      <div className="p-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
                        <button 
                            onClick={toggleMicroView}
                            className="w-full bg-white hover:bg-blue-50 transition-colors rounded-lg p-4 flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                                    <Microscope size={20} />
                                </div>
                                <div className="text-left">
                                    <span className="block font-semibold text-slate-800 text-sm">View R&D Detail</span>
                                    <span className="block text-xs text-slate-500">
                                        {selectedLayerId === 'cathode' ? 'Glass Infusion' : 'Interlayer Expansion'}
                                    </span>
                                </div>
                            </div>
                            <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                        </button>
                      </div>
                  )}

                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <ShieldCheck size={16} className="text-blue-500" />
                      Key Specifications
                    </h4>
                    <ul className="space-y-3">
                      {activeLayer?.details.map((detail, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 flex-shrink-0"></div>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ) : (
                 /* DEFAULT INTRO CONTENT */
                <motion.div 
                  key="intro"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wide border border-blue-100">
                    Solid-State Revolution
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                    Glass Electrolyte <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Batteries</span>
                  </h1>
                  <p className="text-lg text-slate-600 max-w-md leading-relaxed">
                    A breakthrough in energy storage replacing flammable liquids with dense, highly conductive oxy-sulfide glass.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => setViewState(ViewState.Exploded)}
                      className="px-6 py-3.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20"
                    >
                      Analyze Structure <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Center/Right: 3D Canvas */}
          <div className="lg:col-span-2 relative h-full bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden shadow-inner">
             <BatteryScene 
                selectedLayerId={selectedLayerId} 
                onSelectLayer={handleLayerSelect}
                viewState={viewState}
             />
             
             {/* 3D Controls Overlay */}
             <div className="absolute top-4 right-4 flex flex-col gap-2">
               <button 
                  onClick={() => setViewState(viewState === ViewState.Exploded ? ViewState.Intro : ViewState.Exploded)}
                  className={`backdrop-blur-md p-3 rounded-xl shadow-sm border transition-all text-slate-600 ${viewState === ViewState.Exploded ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white/80 border-slate-200 hover:bg-white'}`}
                  title="Exploded View"
                  disabled={viewState === ViewState.Micro}
                >
                  <Layers size={20} />
               </button>
             </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {KEY_METRICS.map((metric, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <p className="text-sm text-slate-500 font-medium mb-2 group-hover:text-blue-600 transition-colors">{metric.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">{metric.value}</span>
                {metric.unit && <span className="text-sm text-slate-400 font-medium">{metric.unit}</span>}
              </div>
              <p className="text-xs text-slate-400 mt-3 border-t border-slate-50 pt-3">
                {metric.description}
              </p>
            </div>
          ))}
        </div>

        {/* Deep Dive Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
               <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-orange-50 rounded-2xl text-orange-600">
                    <Factory size={28} />
                  </div>
                  <div>
                      <h3 className="text-xl font-bold text-slate-900">Manufacturing Advantages</h3>
                      <p className="text-slate-500 text-sm">Streamlined production process</p>
                  </div>
               </div>
               
               <div className="space-y-4">
                 <div className="flex gap-4 items-start">
                   <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600 mt-0.5">✓</div>
                   <div>
                     <span className="block font-semibold text-slate-800">No Anode Casting</span>
                     <span className="text-sm text-slate-500 leading-relaxed">Eliminates one of the most capital-intensive steps in traditional Li-Ion manufacturing.</span>
                   </div>
                 </div>
                 <div className="flex gap-4 items-start">
                   <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600 mt-0.5">✓</div>
                   <div>
                     <span className="block font-semibold text-slate-800">No Degassing or Aging</span>
                     <span className="text-sm text-slate-500 leading-relaxed">Removes bottlenecks that typically require weeks of inventory hold time.</span>
                   </div>
                 </div>
               </div>
            </div>
            
            <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 opacity-20 rounded-full blur-[80px] transform translate-x-10 -translate-y-10"></div>
               
               <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-white/10 backdrop-blur rounded-lg text-blue-300">
                            <Beaker size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Material Innovation</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <span className="block text-blue-400 font-bold text-lg mb-1">ExpGr</span>
                            <span className="text-slate-400 text-xs leading-tight block">Expanded Graphite Interlayers for sub-nano diffusion control.</span>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <span className="block text-purple-400 font-bold text-lg mb-1">RedGO</span>
                            <span className="text-slate-400 text-xs leading-tight block">Reduced Graphite Oxide tuned for oxygen content & capacity.</span>
                        </div>
                    </div>
               </div>
               
               <div className="relative z-10 pt-4 border-t border-white/10">
                    <p className="text-slate-400 text-sm">
                         Graphite is more stable than Li-metal. JES optimizes it for fast-charging while maintaining safety.
                    </p>
               </div>
            </div>
        </div>

        {/* Data Visualization Section */}
        <div className="pt-8 border-t border-slate-200">
           <div className="mb-8">
               <h3 className="text-2xl font-bold text-slate-900">Performance Benchmarks</h3>
               <p className="text-slate-500">Johnson Energy Storage vs. Conventional Li-Ion (2021 Baseline)</p>
           </div>
           <PerformanceCharts />
        </div>

      </main>
      
      <footer className="bg-slate-900 text-slate-400 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-medium text-slate-300 mb-2">Johnson Energy Storage Technology Explorer</p>
          <p className="text-xs opacity-60 max-w-2xl mx-auto">
            Visualization based on technical presentations regarding Oxy-Sulfide Glass Electrolytes. 
            Data sources: JES Glass Battery Seminar & Exhibit. 
            Comparisons are estimated based on scaled production projections.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
