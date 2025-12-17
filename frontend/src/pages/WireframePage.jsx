import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Database, Layout, Smartphone, Activity, Server, Cpu, ArrowDown } from 'lucide-react';

const FlowCard = ({ title, icon: Icon, description, color, items }) => (
    <div className={`p-6 rounded-xl border ${color} bg-slate-900/80 backdrop-blur-sm relative min-w-[280px]`}>
        {/* Connector Node */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-700 rounded-full border-2 border-slate-500 z-10"></div>

        <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-lg bg-opacity-20 ${color.replace('border-', 'bg-')}`}>
                <Icon size={24} className={color.replace('border-', 'text-')} />
            </div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
        <p className="text-slate-400 text-sm mb-4 leading-relaxed">{description}</p>

        <div className="space-y-2">
            {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-800/50 p-2 rounded">
                    <div className={`w-1.5 h-1.5 rounded-full ${color.replace('border-', 'bg-')}`}></div>
                    {item}
                </div>
            ))}
        </div>
    </div>
);

const Connector = () => (
    <div className="flex flex-col items-center justify-center py-4 text-slate-500">
        <ArrowDown size={32} strokeWidth={1.5} />
    </div>
);

const WireframePage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 md:p-16 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            {/* Header */}
            <div className="relative z-10 mb-16 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    System Architecture & User Flow
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    A visual blueprint of the AutoCare.ai platform, illustrating the data lifecycle from ingestion to interface.
                </p>

            </div>

            {/* MAIN FLOW CONTAINER */}
            <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-start justify-center">

                {/* COLUMN 1: DATA LAYER */}
                <div className="flex flex-col gap-6 w-full md:w-1/3">
                    <div className="text-center font-mono text-cyan-500/50 mb-2 uppercase tracking-widest text-sm">Data Ingestion Layer</div>

                    <FlowCard
                        title="Vehicle Telemetry"
                        icon={Server}
                        color="border-indigo-500"
                        description="Raw sensor streams from fleet vehicles (OBD-II)."
                        items={["Engine Data (RPM, Temp)", "Vibration Sensors", "Location Stream"]}
                    />
                    <Connector />
                    <FlowCard
                        title="AI Predicting Engine"
                        icon={Cpu}
                        color="border-violet-500"
                        description="Backend Python processing for anomaly detection."
                        items={["RUL Calculation", "Failure Prediction", "Risk Scoring"]}
                    />
                </div>

                {/* MIDDLE ARROW (Desktop only) */}
                <div className="hidden md:flex flex-col justify-center h-[500px] text-slate-600">
                    <ArrowRight size={48} strokeWidth={1} />
                </div>

                {/* COLUMN 2: APPLICATION UI */}
                <div className="flex flex-col gap-6 w-full md:w-1/3">
                    <div className="text-center font-mono text-cyan-500/50 mb-2 uppercase tracking-widest text-sm">Client Application</div>

                    <FlowCard
                        title="Fleet Dashboard"
                        icon={Layout}
                        color="border-cyan-500"
                        description="High-level overview of entire fleet health status."
                        items={["Aggregated KPIs", "Critical Vehicle List", "Nav: /dashboard"]}
                    />
                    <Connector />
                    <FlowCard
                        title="Vehicle Detail View"
                        icon={Activity}
                        color="border-blue-500"
                        description="Deep-dive diagnostics for a specific unit."
                        items={["3D Holographic View", "Real-time Graphs", "Maint. History", "Nav: /vehicle/:id"]}
                    />
                </div>

                {/* MIDDLE ARROW (Desktop only) */}
                <div className="hidden md:flex flex-col justify-center h-[500px] text-slate-600">
                    <ArrowRight size={48} strokeWidth={1} />
                </div>

                {/* COLUMN 3: USER EXPERIENCE */}
                <div className="flex flex-col gap-6 w-full md:w-1/3">
                    <div className="text-center font-mono text-cyan-500/50 mb-2 uppercase tracking-widest text-sm">Actionable Insights</div>

                    <FlowCard
                        title="Diagnostic Console"
                        icon={Smartphone}
                        color="border-emerald-500"
                        description="Interactive 3D visualization for technicians."
                        items={["Visual Part Loaction", "Alert Highlights", "Repair Guides"]}
                    />
                    <Connector />
                    <div className="p-6 rounded-xl border border-dashed border-slate-700 bg-slate-900/30 text-center">
                        <h4 className="text-slate-400 font-bold mb-2">Predictive Maintenance Outcome</h4>
                        <p className="text-sm text-slate-500">Technicians resolve issues BEFORE failure, reducing downtime by 40%.</p>
                    </div>
                </div>

            </div>

            <div className="mt-16 text-center text-slate-600 font-mono text-xs">
                AutoCare.ai System Architecture • Generated for Presentation
            </div>
        </div>
    );
};

export default WireframePage;
