import React from 'react';
import { motion } from 'framer-motion';
import CarXRay3D from './CarXRay3D';
import { AlertCircle } from 'lucide-react';

const DiagnosticConsole = ({ criticalComponent }) => {
    const isCritical = criticalComponent === 'Cooling Pump';

    return (
        <div className="w-full h-96 bg-gray-950 rounded-xl border border-gray-800 relative overflow-hidden shadow-2xl">

            {/* GRID BACKGROUND */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            {/* HEADER UI: COMPACT MODE */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none w-full pr-8 flex justify-between items-start">

                {/* Left: Component Info */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900/80 rounded-lg border border-slate-800 backdrop-blur-sm flex items-center justify-center">
                        <motion.div
                            className={`w-2 h-2 rounded-full ${isCritical ? 'bg-red-500' : 'bg-cyan-400'}`}
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-sm tracking-tight drop-shadow-md">Diagnostic Engine</h2>
                        <p className="text-cyan-400/80 text-[10px] font-mono">Real-time Holographic View</p>
                    </div>
                </div>

                {/* Right: COMPACT ALERT BADGE (As Requested) */}
                {isCritical && (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-red-950/80 border border-red-500/50 rounded-md px-3 py-1.5 backdrop-blur-md flex items-center gap-2"
                    >
                        <AlertCircle size={14} className="text-red-500 animate-pulse" />
                        <div className="flex flex-col items-end leading-none">
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">CRITICAL</span>
                            <span className="text-[10px] font-mono text-red-300">COOLING PUMP</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* MAIN 3D VISUALIZATION */}
            <div className="w-full h-full relative z-10">
                <CarXRay3D criticalComponent={criticalComponent} />
            </div>

            {/* LOADING/ERROR HINT */}
            <div className="absolute bottom-2 right-4 text-[9px] text-slate-700 font-mono pointer-events-none">
                3D INTERACTIVE /// DRAG TO ROTATE
            </div>

        </div>
    );
};

export default DiagnosticConsole;
