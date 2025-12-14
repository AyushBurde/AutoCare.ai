import React, { useEffect, useState } from 'react';
import { getInsights } from '../services/api';
import {
    AlertTriangle,
    CheckCircle,
    Activity,
    Thermometer,
    FileText,
    Shield,
    Cpu,
    ArrowLeft,
    Zap,
    BarChart3,
    History,
    TrendingUp,
    Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';

// Mock Historical Data (5 Years)
const historicalData = [
    { year: '2020', failures: 2, efficiency: 98 },
    { year: '2021', failures: 3, efficiency: 95 },
    { year: '2022', failures: 5, efficiency: 91 },
    { year: '2023', failures: 12, efficiency: 84 },
    { year: '2024', failures: 34, efficiency: 62 },
];

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
            <div className="flex flex-col items-center justify-center h-[80vh]">
                <div className="w-16 h-16 border-4 border-slate-800 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                <p className="text-cyan-400 font-mono text-sm tracking-widest uppercase animate-pulse">Initializing Historical Database...</p>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-800/60">
                <div className="flex items-center gap-4">
                    <NeonButton variant="ghost" className="!p-2 md:hidden" onClick={() => navigate('/')}>
                        <ArrowLeft size={20} />
                    </NeonButton>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight">Component Intelligence</h1>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950/30 text-purple-400 border border-purple-900/50 flex items-center gap-2">
                                <Database size={10} className="fill-purple-400" />
                                HISTORICAL ARCHIVE
                            </span>
                        </div>
                        <p className="text-slate-500 text-xs font-mono mt-1">
                            TARGET: <span className="text-white font-bold">{data.critical_component}</span> • TIMEFRAME: <span className="text-slate-400">2020-2025</span>
                        </p>
                    </div>
                </div>
                <NeonButton variant="outline" icon={BarChart3} className="!py-2 !px-4 !text-xs hidden sm:flex">
                    Export Analysis
                </NeonButton>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT: Current Critical Status (4 Cols) */}
                <div className="lg:col-span-4 space-y-6">
                    <GlassCard className="group relative overflow-hidden !border-red-500/30" hoverEffect={true}>
                        <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors"></div>

                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="p-3 bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-pulse-slow">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white leading-none mb-1">Critical Failure Detected</h2>
                                <p className="text-red-400 text-xs uppercase font-bold tracking-wider">Immediate Action Required</p>
                            </div>
                        </div>

                        <div className="relative z-10 space-y-4">
                            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800/50">
                                <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">Component ID</p>
                                <p className="text-xl font-mono text-white">CP-774-X (Cooling Pump)</p>
                            </div>
                            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800/50">
                                <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">Failure Signature</p>
                                <p className="text-sm font-mono text-cyan-400">THERMAL_ELASTICITY_LOSS</p>
                            </div>
                        </div>

                        {/* Visual Glitch Effect Decoration */}
                        <div className="absolute bottom-0 right-0 p-4 opacity-20 pointer-events-none">
                            <Activity size={120} className="text-red-500" />
                        </div>
                    </GlassCard>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <GlassCard className="!p-4 bg-slate-900/50 flex flex-col justify-center items-center text-center" hoverEffect={true}>
                            <p className="text-4xl font-black text-white mb-1">5 <span className="text-sm font-medium text-slate-500">Years</span></p>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">Data Range</p>
                        </GlassCard>
                        <GlassCard className="!p-4 bg-slate-900/50 flex flex-col justify-center items-center text-center" hoverEffect={true}>
                            <p className="text-4xl font-black text-red-500 mb-1">+480%</p>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">Failure Rate Incr.</p>
                        </GlassCard>
                    </div>
                </div>

                {/* RIGHT: Historical Analysis Chart (8 Cols) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <GlassCard className="flex-1 min-h-[400px] flex flex-col relative !overflow-visible">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                                    <History size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-white">5-Year Degradation Analysis</h3>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-cyan-500"></span> MTBF
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Failures
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 w-full h-full min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={historicalData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorFailure" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                                            <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis
                                        dataKey="year"
                                        stroke="#64748b"
                                        tick={{ fontSize: 12, fontWeight: 'bold' }}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="#64748b"
                                        tick={{ fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        dx={-10}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#FFFFFF', opacity: 0.05 }}
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '12px' }}
                                    />
                                    <Bar dataKey="failures" radius={[4, 4, 0, 0]} barSize={40} fill="url(#colorFailure)">
                                        {historicalData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === historicalData.length - 1 ? '#ef4444' : '#3b82f6'} fillOpacity={index === historicalData.length - 1 ? 1 : 0.3} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 font-mono text-center">
                            Analysis indicates exponential degradation in polymer seals post-2023 due to thermal cycling.
                        </div>
                    </GlassCard>
                </div>
            </div>

            {/* Bottom Row: Detailed Technical Report (Full Width) */}
            <GlassCard className="bg-slate-900/80 backdrop-blur-md">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText size={16} className="text-cyan-400" />
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Root Cause Analysis</h4>
                        </div>
                        <div className="text-slate-300 leading-relaxed text-sm bg-slate-950/50 p-6 rounded-xl border border-slate-800/50 relative overflow-hidden group">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500/50 group-hover:h-full transition-all"></div>
                            {data.root_cause || "Thermal elasticity breakdown in nitrile seals under sustained load >45°C. The material composition shows accelerated aging correlated with high-RPM usage."}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp size={16} className="text-emerald-400" />
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Predictive Recommendation</h4>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="text-white text-lg font-bold">
                                {data.recommendation}
                            </div>
                            <div className="flex gap-4">
                                <NeonButton variant="primary" className="flex-1" icon={Zap}>
                                    Initiate Replacement Loop
                                </NeonButton>
                                <NeonButton variant="outline" className="flex-1" icon={FileText}>
                                    Download Full Spec
                                </NeonButton>
                            </div>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
