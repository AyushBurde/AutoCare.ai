import React, { useState, useEffect } from 'react';

const DiagnosticConsole = ({ criticalComponent }) => {
    // criticalComponent could be "Cooling Pump", "Battery", or null
    const [isZoomed, setIsZoomed] = useState(false);

    // Trigger the zoom effect when a failure is detected
    useEffect(() => {
        if (criticalComponent) {
            // Small delay to let the user see the full car first, then zoom
            const timer = setTimeout(() => setIsZoomed(true), 800);
            return () => clearTimeout(timer);
        } else {
            setIsZoomed(false);
        }
    }, [criticalComponent]);

    return (
        <div className="w-full h-96 bg-gray-900 rounded-xl border border-gray-700 relative overflow-hidden shadow-2xl group">

            {/* 1. Background Grid (Cyberpunk look) */}
            <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            {/* 2. Header / HUD Status */}
            <div className="absolute top-4 left-4 z-10">
                <h3 className="text-gray-400 text-xs uppercase tracking-widest">System Diagnostic</h3>
                <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${criticalComponent ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                    <span className={`text-lg font-bold font-mono ${criticalComponent ? 'text-red-500' : 'text-green-500'}`}>
                        {criticalComponent ? 'CRITICAL FAILURE DETECTED' : 'SYSTEM NORMAL'}
                    </span>
                </div>
            </div>

            {/* 3. The Interactive Car Container */}
            {/* This div handles the ZOOM logic. 
          transform-origin-bottom-left ensures we zoom into the Engine area (Front of car) */}
            <div
                className={`w-full h-full flex items-center justify-center transition-transform duration-[1500ms] ease-in-out ${isZoomed ? 'scale-[2.5] translate-x-[20%] translate-y-[10%]' : 'scale-100'
                    }`}
            >
                {/* THE CAR SVG */}
                <svg viewBox="0 0 400 200" className="w-[80%] drop-shadow-lg">

                    {/* A. Car Outline (Sedan Shape) */}
                    <path
                        d="M 10,130 L 40,130 C 40,110 55,95 80,95 C 105,95 120,110 120,130 L 260,130 C 260,110 275,95 300,95 C 325,95 340,110 340,130 L 380,130 C 390,130 395,120 390,100 L 350,60 L 250,30 L 120,30 L 60,60 L 10,80 Z"
                        fill="none"
                        stroke="#4b5563"
                        strokeWidth="2"
                        className="opacity-50"
                    />
                    {/* Wheels (Visual Context) */}
                    <circle cx="80" cy="130" r="25" stroke="#4b5563" strokeWidth="2" fill="transparent" className="opacity-30" />
                    <circle cx="300" cy="130" r="25" stroke="#4b5563" strokeWidth="2" fill="transparent" className="opacity-30" />

                    {/* B. The Engine Block (Context) */}
                    <path d="M 60,65 L 130,65 L 130,110 L 60,110 Z" fill="none" stroke="cyan" strokeWidth="1" opacity="0.4" />

                    {/* C. THE CRITICAL PART: COOLING PUMP */}
                    {/* Located near front engine. Only visible/highlighted if it fails */}
                    <g className={criticalComponent === 'Cooling Pump' ? 'visible' : 'opacity-20'}>

                        {/* The Part Shape */}
                        <path
                            id="cooling-pump"
                            d="M 90,80 A 10,10 0 0,1 110,80 L 110,95 A 10,10 0 0,1 90,95 Z"
                            fill={criticalComponent === 'Cooling Pump' ? '#ef4444' : '#374151'}
                            stroke={criticalComponent === 'Cooling Pump' ? '#ff0000' : 'none'}
                            strokeWidth="2"
                            className={criticalComponent === 'Cooling Pump' ? 'animate-pulse' : ''}
                        />

                        {/* The "Blinking" Glow Effect (Always show if critical so user sees label) */}
                        {criticalComponent === 'Cooling Pump' && (
                            <>
                                {/* Expanding Ring Animation */}
                                <circle cx="100" cy="87" r="15" stroke="red" strokeWidth="1" fill="none">
                                    <animate attributeName="r" from="10" to="30" dur="1s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" from="1" to="0" dur="1s" repeatCount="indefinite" />
                                </circle>

                                {/* Pointer Line & Label */}
                                <line x1="110" y1="87" x2="160" y2="50" stroke="red" strokeWidth="1" />
                                <rect x="160" y="35" width="120" height="25" fill="rgba(20,0,0,0.8)" stroke="red" rx="4" />
                                <text x="165" y="52" fill="white" fontSize="10" fontFamily="monospace" fontWeight="bold">
                                    ⚠ COOLING PUMP
                                </text>
                            </>
                        )}
                    </g>

                </svg>
            </div>

            {/* 4. Scanning Overlay (Optional Cool Effect) */}
            {!isZoomed && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-[20%] animate-scan pointer-events-none"></div>
            )}
        </div>
    );
};

export default DiagnosticConsole;
