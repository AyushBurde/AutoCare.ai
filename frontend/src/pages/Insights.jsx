import React, { useEffect, useState } from 'react';
import { getInsights } from '../services/api';
import {
    AlertTriangle,
    CheckCircle,
    ArrowLeft,
    Activity,
    Thermometer,
    Cpu,
    FileText,
    Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Insights() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getInsights()
            .then(response => {
                if (response.status === 'success') {
                    setData(response.insight_card);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-slate-800 border-t-cyan-500 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-mono text-sm tracking-widest uppercase animate-pulse">Initializing Analysis Module...</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans p-6 md:p-8">
            {/* Top Navigation Bar */}
            <header className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800/60">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-slate-900 rounded-lg transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-white tracking-wide">ENGINEERING INSIGHTS</h1>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/30 text-cyan-400 border border-cyan-900/50">
                                LIVE STREAM
                            </span>
                        </div>
                        <p className="text-slate-500 text-xs font-mono mt-1">
                            SYSTEM ID: <span className="text-slate-400">MQI-2024-X99</span> • REGION: <span className="text-slate-400">ASIA-PACIFIC</span>
                        </p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Session Active</p>
                        <p className="text-xs text-emerald-500 font-mono">SECURE_CONNECTION_V2</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div>
                </div>
            </header>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">

                {/* LEFT COLUMN: Status & Overview (30%) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Critical Alert Card */}
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-red-500/30 rounded-2xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors"></div>
                        <div className="p-6 relative z-10">
                            <div className="flex items-start justify-between mb-6">
                                <div className="p-3 bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                                    <AlertTriangle size={28} />
                                </div>
                                <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full animate-pulse shadow-lg shadow-red-500/40">
                                    Critical Alert
                                </span>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-2">{data.critical_component}</h2>
                            <p className="text-red-400 text-sm font-mono mb-6">DEFECT_CODE: ERR_SEAL_FAIL_09</p>

                            <div className="grid grid-cols-2 gap-4 border-t border-red-500/20 pt-6">
                                <div>
                                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">Impacted Units</p>
                                    <p className="text-2xl font-mono font-bold text-white">{data.total_failures_detected}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">Risk Level</p>
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex gap-0.5">
                                            <div className="w-1.5 h-4 bg-red-500 rounded-sm"></div>
                                            <div className="w-1.5 h-4 bg-red-500 rounded-sm"></div>
                                            <div className="w-1.5 h-4 bg-red-500 rounded-sm"></div>
                                            <div className="w-1.5 h-4 bg-red-900/50 rounded-sm"></div>
                                        </div>
                                        <span className="text-red-400 font-bold text-sm">HIGH</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Progress Bar at bottom */}
                        <div className="h-1 bg-slate-800 w-full">
                            <div className="h-full bg-red-500 w-[85%] shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                        </div>
                    </div>

                    {/* Sensor Data / Tech Specs Mini-Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                            <Thermometer size={16} className="text-slate-500 mb-2" />
                            <p className="text-xs text-slate-500 uppercase font-bold">Avg Temp</p>
                            <p className="text-xl font-mono text-cyan-400">38.5°C</p>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                            <Activity size={16} className="text-slate-500 mb-2" />
                            <p className="text-xs text-slate-500 uppercase font-bold">Vibration</p>
                            <p className="text-xl font-mono text-orange-400">124Hz</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Detailed Analysis (70%) */}
                <div className="lg:col-span-8 flex flex-col gap-6">

                    {/* Technical Findings Panel */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-md">
                        <div className="flex items-center gap-3 mb-6">
                            <FileText size={20} className="text-cyan-500" />
                            <h3 className="text-lg font-bold text-white">Technical Analysis Report</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-mono text-slate-500 mb-1">PATTERN_RECOGNITION://RESULTS</p>
                                    <p className="text-slate-300 leading-relaxed text-sm bg-slate-950/50 p-4 rounded-lg border border-slate-800/50">
                                        <span className="text-cyan-400 font-mono text-xs block mb-2">[LOG_ENTRY_4402]</span>
                                        {data.pattern_detected}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 bg-slate-800 text-slate-400 text-[10px] font-mono rounded">ERR_RATE: 12%</span>
                                    <span className="px-2 py-1 bg-slate-800 text-slate-400 text-[10px] font-mono rounded">CONFIDENCE: 99.8%</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-mono text-slate-500 mb-1">ROOT_CAUSE://DIAGNOSIS</p>
                                    <p className="text-slate-300 leading-relaxed text-sm bg-slate-950/50 p-4 rounded-lg border border-slate-800/50">
                                        <span className="text-orange-400 font-mono text-xs block mb-2">[MATERIAL_ANALYSIS]</span>
                                        {data.root_cause || "Thermal elasticity breakdown in nitrile seals under sustained load >45°C."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ACTION CENTER - ECO APPROVAL */}
                    <div className="flex-1 bg-gradient-to-r from-yellow-900/10 to-transparent border border-yellow-600/30 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                            <div>
                                <h3 className="text-yellow-500 font-bold mb-2 flex items-center gap-2">
                                    <Shield size={18} />
                                    AI RECOMMENDED ACTION
                                </h3>
                                <p className="text-xl md:text-2xl text-white font-bold max-w-xl leading-tight">
                                    {data.recommendation}
                                </p>
                                <p className="text-slate-400 text-xs mt-3 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
                                    Implementation ready for Production Line B
                                </p>
                            </div>

                            <button className="whitespace-nowrap bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 px-8 rounded-lg shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] transition-all transform hover:-translate-y-0.5 flex items-center gap-3">
                                <CheckCircle size={20} className="text-black" />
                                APPROVE ECO #9921
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
