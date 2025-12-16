import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const DigitalTwin = ({ criticalComponent }) => {
    // Defines the full view of the car
    const defaultViewBox = "0 0 300 150";

    // Defines zoom targets for specific components
    // Format: "min-x min-y width height"
    // Smaller width/height = higher zoom level
    const zoomTargets = {
        "Cooling Pump": "200 40 60 40",  // Engine bay area
        "Battery": "30 40 50 40",       // Front/Battery area
        "Engine": "180 30 80 60",       // General engine block
        "Brakes": "40 90 40 40",        // Wheel area example
    };

    // Determine the current viewBox based on critical component
    const targetViewBox = useMemo(() => {
        if (!criticalComponent) return defaultViewBox;

        // Find a matching key in zoomTargets
        const targetKey = Object.keys(zoomTargets).find(key =>
            criticalComponent.toLowerCase().includes(key.toLowerCase())
        );

        return targetKey ? zoomTargets[targetKey] : defaultViewBox;
    }, [criticalComponent]);

    const isCritical = (partName) => {
        if (!criticalComponent) return false;
        return criticalComponent.toLowerCase().includes(partName.toLowerCase());
    };

    return (
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm overflow-hidden relative group">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-slate-200 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    Live Digital Twin
                </h3>
                {criticalComponent && (
                    <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded border border-red-500/30 font-mono animate-pulse">
                        FOCUS: {criticalComponent.toUpperCase()}
                    </span>
                )}
            </div>

            <div className="relative w-full aspect-[2/1] bg-slate-900/80 rounded-lg border border-slate-800/50 overflow-hidden shadow-inner">
                {/* HUD Overlay Lines */}
                <div className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(6, 182, 212, .3) 25%, rgba(6, 182, 212, .3) 26%, transparent 27%, transparent 74%, rgba(6, 182, 212, .3) 75%, rgba(6, 182, 212, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(6, 182, 212, .3) 25%, rgba(6, 182, 212, .3) 26%, transparent 27%, transparent 74%, rgba(6, 182, 212, .3) 75%, rgba(6, 182, 212, .3) 76%, transparent 77%, transparent)',
                        backgroundSize: '30px 30px'
                    }}>
                </div>

                <motion.svg
                    viewBox="0 0 300 150"
                    animate={{ viewBox: targetViewBox }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="w-full h-full"
                >
                    {/* --- Car Silhouette (Honda City Style Sedan) --- */}
                    <path d="M10,80 Q10,55 35,50 L80,45 L110,25 L190,25 L230,45 L280,50 Q295,55 295,80 L295,110 L260,110 Q260,90 230,90 Q200,90 200,110 L100,110 Q100,90 70,90 Q40,90 40,110 L10,110 Z"
                        fill="#0f172a" stroke="#475569" strokeWidth="2" />

                    {/* Windows */}
                    <path d="M85,45 L112,28 L188,28 L225,45 Z" fill="#1e293b" stroke="#334155" />
                    <line x1="150" y1="28" x2="150" y2="45" stroke="#334155" strokeWidth="1" />

                    {/* Wheels */}
                    <circle cx="55" cy="110" r="18" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
                    <circle cx="55" cy="110" r="8" fill="#334155" />

                    <circle cx="245" cy="110" r="18" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
                    <circle cx="245" cy="110" r="8" fill="#334155" />

                    {/* --- Internal Components --- */}

                    {/* Engine Block (Right Side / Front) */}
                    <g transform="translate(210, 50)">
                        <rect x="0" y="0" width="50" height="40" rx="4" fill="#1e293b" stroke="#475569" />
                        <path d="M10,0 L10,40 M20,0 L20,40 M30,0 L30,40 M40,0 L40,40" stroke="#334155" strokeWidth="1" />
                    </g>

                    {/* Cooling Pump (Inside Engine Area) */}
                    <motion.g
                        initial={false}
                        animate={isCritical("Cooling Pump") ? { scale: 1.1 } : { scale: 1 }}
                        transition={{ duration: 0.5, repeat: isCritical("Cooling Pump") ? Infinity : 0, repeatType: "reverse" }}
                    >
                        <circle cx="235" cy="65" r="8"
                            fill={isCritical("Cooling Pump") ? "#ef4444" : "#475569"}
                            stroke={isCritical("Cooling Pump") ? "#fecaca" : "#64748b"}
                            strokeWidth="2"
                        />
                        {/* Pump Impeller lines */}
                        <path d="M235 59 L235 71 M229 65 L241 65" stroke={isCritical("Cooling Pump") ? "#7f1d1d" : "#1e293b"} strokeWidth="1.5" />
                    </motion.g>

                    {/* Battery (Left Side / Rear - usually front but mimicking abstract layout or hybrid/EV rear batt) */}
                    {/* Let's place it near front firewall for realism in standard car, near x=180? OR Keep it separate visually. */}
                    {/* Let's put Battery near x=40 (Rear) just for visual separation as per previous mock, OR correctly at Front x=190. */}
                    {/* Moving Battery to expected Front-Left area (approx 190, 50) next to engine */}
                    <rect x="180" y="55" width="20" height="15" rx="2"
                        fill={isCritical("Battery") ? "#ef4444" : "#334155"}
                        stroke={isCritical("Battery") ? "#fecaca" : "#475569"}
                        className="transition-colors duration-500"
                    />
                    <text x="182" y="66" fontSize="5" fill="#94a3b8" fontWeight="bold">BAT</text>

                    {/* Transmission / Drivetrain Line */}
                    <line x1="210" y1="90" x2="55" y2="90" stroke="#334155" strokeWidth="4" strokeLinecap="round" opacity="0.5" />

                </motion.svg>

                {/* Scan Overlay Effect (When zooming) */}
                {criticalComponent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 pointer-events-none"
                    >
                        <div className="absolute top-4 right-4 text-[10px] font-mono text-cyan-400">
                            TARGET LOCKED: {criticalComponent.toUpperCase()} <br />
                            ZOOM: 3.5x
                        </div>
                        {/* Crosshairs */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-cyan-500/30 rounded-full animate-ping-slow"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-l border-t border-cyan-400"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-r border-b border-cyan-400"></div>
                    </motion.div>
                )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-500">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Critical</span>
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span> Normal</span>
                </div>
                <div className="font-mono opacity-50">VIN: HND-CTY-2022-X92</div>
            </div>
        </div>
    );
};

export default DigitalTwin;
