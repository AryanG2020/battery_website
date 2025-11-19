
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Environment, Text, useCursor, ContactShadows, Instance, Instances, Html } from '@react-three/drei';
import * as THREE from 'three';
import { BatteryLayer } from '../types';
import { BATTERY_LAYERS } from '../constants';

// --- Materials & Geometries ---

interface LayerMeshProps {
  position: [number, number, number];
  layer: BatteryLayer;
  isSelected: boolean;
  isExploded: boolean;
  onClick: () => void;
}

const LayerMesh: React.FC<LayerMeshProps> = ({ 
  position, layer, isSelected, isExploded, onClick 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  useCursor(hovered);

  const isGlass = layer.id === 'separator';
  const isCathode = layer.id === 'cathode';
  const isMetal = layer.id === 'copper' || layer.id === 'aluminum' || layer.id === 'anode';

  useFrame((state) => {
    if (meshRef.current) {
      // Hover/Select Scale Effect
      const targetScale = isSelected ? 1.02 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      // Color Highlight
      if (meshRef.current.material instanceof THREE.MeshPhysicalMaterial) {
         const baseColor = new THREE.Color(layer.color);
         if (hovered && !isSelected) baseColor.offsetHSL(0, 0, 0.1);
         if (isSelected) baseColor.offsetHSL(0, 0, 0.05);
         meshRef.current.material.color.lerp(baseColor, 0.1);
      }
    }
  });

  // OPTIMIZED: Cathode Particle System using Instances for the Macro View
  const CathodeParticles = () => {
    const count = 400;
    const particleData = useMemo(() => {
        const temp = [];
        for(let i=0; i<count; i++) {
            const x = (Math.random() - 0.5) * 3.8;
            const y = (Math.random() - 0.5) * (layer.thicknessRatio * 0.8);
            const z = (Math.random() - 0.5) * 3.8;
            const scale = Math.random() * 0.1 + 0.05;
            temp.push({ position: [x,y,z], scale });
        }
        return temp;
    }, []);

    return (
        <group position={[0, 0, 0]}>
            <Instances range={count}>
                <dodecahedronGeometry />
                <meshStandardMaterial color="#0f172a" roughness={0.8} />
                {particleData.map((data, i) => (
                    <Instance 
                        key={i} 
                        position={data.position as [number,number,number]} 
                        scale={[data.scale, data.scale, data.scale]} 
                    />
                ))}
            </Instances>
        </group>
    )
  }

  return (
    <group position={position}>
      <mesh 
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <boxGeometry args={[4, layer.thicknessRatio, 4]} />
        <meshPhysicalMaterial 
          color={layer.color}
          transparent={isGlass}
          opacity={isGlass ? 0.4 : 1}
          metalness={isMetal ? 0.9 : 0.1}
          roughness={isMetal ? 0.2 : (isGlass ? 0.05 : 0.8)}
          transmission={isGlass ? 0.7 : 0}
          thickness={isGlass ? 1.5 : 0}
          clearcoat={isGlass || isMetal ? 1 : 0}
          clearcoatRoughness={0.1}
        />
        {isCathode && <CathodeParticles />}
      </mesh>
      
      {/* Label */}
      {(isSelected || isExploded) && (
        <group position={[2.2, 0, 0]}>
            <Text
            fontSize={0.2}
            color="#334155"
            anchorX="left"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
            >
            {layer.name}
            </Text>
            <mesh position={[-0.1, 0, 0]}>
                <sphereGeometry args={[0.03]} />
                <meshBasicMaterial color="#334155" />
            </mesh>
        </group>
      )}
    </group>
  );
};

// --- Micro Views ---

// 1. Anode: Interlayer Expansion
const GrapheneSheet: React.FC<{ position: [number, number, number], opacity: number }> = ({ position, opacity }) => {
    return (
        <group position={position}>
            <mesh rotation={[-Math.PI/2, 0, 0]}>
                <planeGeometry args={[8, 8]} />
                <meshBasicMaterial color="#94a3b8" wireframe transparent opacity={opacity * 0.3} />
            </mesh>
            <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -0.05, 0]}>
                 <planeGeometry args={[8, 8]} />
                 <meshBasicMaterial color="#cbd5e1" transparent opacity={opacity * 0.1} side={THREE.DoubleSide} />
            </mesh>
            
            {/* Atoms at vertices */}
            <Instances range={64}>
                <sphereGeometry args={[0.1]} />
                <meshStandardMaterial color="#334155" />
                {Array.from({length: 64}).map((_, i) => {
                     const x = (i % 8) - 3.5;
                     const z = Math.floor(i / 8) - 3.5;
                     return <Instance key={i} position={[x, 0, z]} />
                })}
            </Instances>
        </group>
    )
}

const MovingIon: React.FC<{ 
    speed: number, 
    yRange: [number, number], 
    bounds?: [number, number, number], // x, y, z box size
    color?: string 
}> = ({ speed, yRange, bounds = [6, 0, 6], color="#ef4444" }) => {
    const ref = useRef<THREE.Group>(null);
    const xOffset = useMemo(() => (Math.random() - 0.5) * bounds[0], [bounds]);
    const zOffset = useMemo(() => (Math.random() - 0.5) * bounds[2], [bounds]);
    const timeOffset = useMemo(() => Math.random() * 100, []);
    
    useFrame((state) => {
        if(ref.current) {
            if (speed <= 0) {
                ref.current.visible = false;
                return;
            }
            ref.current.visible = true;
            
            // Move across
            const t = state.clock.elapsedTime + timeOffset;
            ref.current.position.x = ((t * speed + xOffset) % bounds[0]) - bounds[0]/2;
            // Bob up and down slightly
            ref.current.position.y = THREE.MathUtils.lerp(yRange[0], yRange[1], 0.5) + Math.sin(t * 5) * 0.1;
        }
    });

    return (
        <group ref={ref} position={[xOffset, 0, zOffset]}>
            <mesh>
                <sphereGeometry args={[0.12]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
            </mesh>
            <mesh position={[-0.2, 0, 0]} scale={[0.6, 0.6, 0.6]}>
                <sphereGeometry args={[0.1]} />
                <meshStandardMaterial color={color} transparent opacity={0.4} />
            </mesh>
        </group>
    )
}

const AnodeMicroStructure: React.FC = () => {
    const [expanded, setExpanded] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setExpanded(true), 1000);
        return () => clearTimeout(t);
    }, []);
    const spacing = useRef(0.5);
    useFrame((state, delta) => {
        const targetSpacing = expanded ? 1.8 : 0.5;
        spacing.current = THREE.MathUtils.lerp(spacing.current, targetSpacing, delta * 2);
    });
    return (
        <group>
            <mesh position={[0, 2, 0]}><GrapheneSheet position={[0, spacing.current, 0]} opacity={1} /></mesh>
            <mesh position={[0, -2, 0]}><GrapheneSheet position={[0, -spacing.current, 0]} opacity={1} /></mesh>
            <GrapheneSheet position={[0, 0, 0]} opacity={0.5} />
            {Array.from({length: 15}).map((_, i) => (
                <MovingIon key={i} speed={expanded ? 3 : 0.5} yRange={[-spacing.current + 0.5, spacing.current - 0.5]} />
            ))}
        </group>
    );
}

// 2. Cathode: Interactive Glass Infusion
const NMCNode: React.FC<{ position: [number,number,number], scale: number, active: boolean }> = ({ position, scale, active }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    
    useFrame((state) => {
        if (meshRef.current) {
            // Pulse effect when active (receiving ions)
            if (active) {
                const s = scale + Math.sin(state.clock.elapsedTime * 10) * 0.03;
                meshRef.current.scale.set(s, s, s);
                (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.2 + Math.sin(state.clock.elapsedTime * 5) * 0.1;
            } else {
                meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
                (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
            }
        }
    });

    return (
        <mesh ref={meshRef} position={position}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial 
                color="#1e293b" 
                roughness={0.7} 
                metalness={0.4}
                emissive="#3b82f6"
                emissiveIntensity={0}
            />
        </mesh>
    )
}

const CathodeMicroStructure: React.FC = () => {
    const [glassInfusion, setGlassInfusion] = useState(0.6); // 0 to 1
    
    // Generate structured packing (crystalline lattice with defects)
    const particles = useMemo(() => {
        const pos: { position: [number,number,number], scale: number }[] = [];
        const spacing = 2.2; // Proper spacing
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    // Jitter slightly but maintain separation
                    const jitter = 0.2;
                    pos.push({
                        position: [
                            x * spacing + (Math.random()-0.5)*jitter, 
                            y * spacing + (Math.random()-0.5)*jitter, 
                            z * spacing + (Math.random()-0.5)*jitter
                        ],
                        scale: 0.8 + Math.random() * 0.2
                    })
                }
            }
        }
        return pos;
    }, []);

    return (
        <group>
            {/* Interactive UI attached to 3D scene */}
            <Html position={[0, -4, 0]} center zIndexRange={[100, 0]}>
                <div className="w-64 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-blue-100 text-center select-none">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Molten Glass Infusion
                    </label>
                    <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        value={glassInfusion} 
                        onChange={(e) => setGlassInfusion(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                        <span>Unfilled (Dry)</span>
                        <span>Filled (Active)</span>
                    </div>
                    <div className="mt-2 text-xs text-blue-600 font-semibold">
                        {glassInfusion < 0.3 ? "Low Surface Contact" : "High Ionic Conductivity"}
                    </div>
                </div>
            </Html>

            {/* NMC Particles */}
            <group>
                {particles.map((p, i) => (
                    <NMCNode 
                        key={i} 
                        position={p.position as [number,number,number]} 
                        scale={p.scale} 
                        active={glassInfusion > 0.5} // Activate when glass is present
                    />
                ))}
            </group>

            {/* Glass Electrolyte Volume */}
            <group visible={glassInfusion > 0.05}>
                 <mesh scale={[glassInfusion * 4.5, glassInfusion * 4.5, glassInfusion * 4.5]}>
                     <boxGeometry args={[1.5, 1.5, 1.5]} /> {/* Cube encompassing the particles */}
                     <meshPhysicalMaterial 
                        color="#60a5fa"
                        transparent
                        opacity={glassInfusion * 0.25} // Max opacity 0.25
                        roughness={0.2}
                        metalness={0.1}
                        transmission={0.6}
                        thickness={2}
                        side={THREE.DoubleSide}
                        depthWrite={false} // Helps with transparency sorting
                     />
                 </mesh>
                 {/* Add some "flow" visuals inside the glass */}
                 {glassInfusion > 0.2 && (
                     <mesh>
                         <sphereGeometry args={[4, 32, 32]} />
                         <meshBasicMaterial color="#60a5fa" wireframe transparent opacity={0.05} />
                     </mesh>
                 )}
            </group>

            {/* Moving Ions - only visible when glass is present */}
            {glassInfusion > 0.1 && Array.from({length: Math.floor(30 * glassInfusion)}).map((_, i) => (
                 <MovingIon 
                    key={`ion-${i}`} 
                    speed={2 + glassInfusion * 2} 
                    yRange={[-2, 2]} 
                    bounds={[5, 5, 5]}
                    color="#fca5a5" // Ligher red
                />
            ))}
            
            {/* Text Labels in 3D Space */}
            <Text 
                position={[-3, 2, 0]} 
                fontSize={0.3} 
                color="#1e293b" 
                anchorX="right"
                maxWidth={2}
            >
                NMC Cathode Particles
            </Text>
            <Text 
                position={[3, -2, 0]} 
                fontSize={0.3} 
                color="#3b82f6" 
                anchorX="left"
                fillOpacity={glassInfusion} // Fade label with glass
            >
                Oxy-Sulfide Glass Electrolyte
            </Text>
        </group>
    )
}

// --- Camera Controller ---

const CameraController: React.FC<{ 
    selectedLayerId: string | null, 
    isExploded: boolean,
    viewState: 'INTRO' | 'EXPLODED' | 'MICRO'
}> = ({ selectedLayerId, isExploded, viewState }) => {
  const { controls } = useThree();
  
  // Smoothly adjust the LookAt target, but DO NOT override camera position (zoom)
  useFrame((state, delta) => {
    if (controls) {
        let targetY = 0;
        if (viewState === 'MICRO') {
             targetY = 0;
        } else if (selectedLayerId && isExploded) {
             const layerIndex = BATTERY_LAYERS.findIndex(l => l.id === selectedLayerId);
             targetY = (2 - layerIndex) * 1.5; // Focus on the expanded layer height
        } else if (isExploded) {
             targetY = 0;
        }

        const currentTarget = (controls as any).target;
        const desiredTarget = new THREE.Vector3(0, targetY, 0);
        
        // Smooth pan to target
        currentTarget.lerp(desiredTarget, delta * 3);
        (controls as any).update();
    }
  });

  return null;
};

// --- Main Scene Component ---

interface BatterySceneProps {
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  viewState: 'INTRO' | 'EXPLODED' | 'MICRO';
}

export const BatteryScene: React.FC<BatterySceneProps> = ({ selectedLayerId, onSelectLayer, viewState }) => {
  const isExploded = viewState === 'EXPLODED' || (!!selectedLayerId && viewState !== 'MICRO');
  const isMicro = viewState === 'MICRO';

  return (
    <div className="w-full h-full relative bg-gradient-to-b from-slate-50 to-slate-100 rounded-3xl overflow-hidden shadow-inner border border-slate-200">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [6, 4, 6], fov: 45 }}>
        <CameraController selectedLayerId={selectedLayerId} isExploded={isExploded} viewState={viewState} />
        
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={1.5} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#3b82f6" />
        
        <Environment preset="city" />
        
        {!isMicro ? (
            <Float 
                speed={selectedLayerId ? 0 : 2} 
                rotationIntensity={selectedLayerId ? 0 : 0.5} 
                floatIntensity={selectedLayerId ? 0 : 0.5}
            >
                <group 
                    rotation={[0, Math.PI / 4, 0]} 
                    onClick={(e) => { if(e.eventObject === e.object) onSelectLayer(null); }}
                >
                    {BATTERY_LAYERS.map((layer, index) => {
                        // Stacking Logic
                        const yOffsetExploded = (2 - index) * 1.5;
                        const yOffsetStacked = (2 - index) * 0.5;
                        const yPos = isExploded ? yOffsetExploded : yOffsetStacked;

                        return (
                            <LayerMesh
                                key={layer.id}
                                position={[0, yPos, 0]}
                                layer={layer}
                                isSelected={selectedLayerId === layer.id}
                                isExploded={isExploded}
                                onClick={() => onSelectLayer(layer.id)}
                            />
                        );
                    })}
                </group>
            </Float>
        ) : (
            <group>
                {selectedLayerId === 'anode' && <AnodeMicroStructure />}
                {selectedLayerId === 'cathode' && <CathodeMicroStructure />}
            </group>
        )}

        <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          minDistance={2}
          maxDistance={20}
          dampingFactor={0.05}
        />
      </Canvas>
      
      <div className="absolute bottom-4 left-4 right-4 pointer-events-none flex justify-center">
        <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-slate-600 text-xs font-medium uppercase tracking-widest shadow-sm border border-white/50">
          {isMicro 
            ? (selectedLayerId === 'cathode' ? 'Cathode-Electrolyte Interface' : 'Graphite Anode Micro-Structure') 
            : isExploded 
                ? 'Interactive Exploded Assembly' 
                : 'Solid State Cell Stack'}
        </div>
      </div>
    </div>
  );
};
