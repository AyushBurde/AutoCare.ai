import React, { useEffect, useState } from 'react';
import { getInsights } from '../services/api';
import { Lightbulb, Wrench, BarChart3, TrendingDown, ArrowRight, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Insights() {
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getInsights().then(setData).catch(console.error);
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <header className="mb-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/')} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Manufacturing Intelligence</h1>
                        <p className="text-slate-400">Quality Loop Feedback System</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Recommendation Card */}
                <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Lightbulb size={120} className="text-yellow-400" />
                    </div>

                    <div className="relative z-10">
                        <div className="uppercase tracking-widest text-xs font-bold text-yellow-500 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                            High Priority Insight
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
                            Material Upgrade Recommended
                        </h2>

                        {data ? (
                            <div className="space-y-6">
                                <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-700/50">
                                    <p className="text-slate-400 text-sm mb-2">Detected Issue</p>
                                    <p className="text-lg text-white font-medium">
                                        {data.pattern_detected}
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 p-6 rounded-2xl border border-cyan-500/30">
                                    <p className="text-cyan-300 text-sm mb-2 font-bold flex items-center gap-2">
                                        <Wrench size={16} /> ACTION REQUIRED
                                    </p>
                                    <p className="text-2xl text-white font-bold">
                                        {data.recommendation}
                                    </p>
                                    <p className="text-cyan-200/60 text-sm mt-2">
                                        Projected Outcome: -40% Failure Rate
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 text-slate-500">
                                <div className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div>
                                Analyzing fleet data...
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Card */}
                <div className="grid grid-rows-2 gap-8">
                    <div className="glass-card p-8 rounded-3xl flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-red-500/20 text-red-400 rounded-xl">
                                <TrendingDown size={24} />
                            </div>
                            <div>
                                <h3 className="text-slate-400">Critical Component</h3>
                                <p className="text-2xl font-bold text-white">{data?.critical_component || 'Loading...'}</p>
                            </div>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 w-3/4"></div>
                        </div>
                        <p className="text-right text-xs text-slate-500 mt-2">75% of recent failures</p>
                    </div>

                    <div className="glass-card p-8 rounded-3xl flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
                                <BarChart3 size={24} />
                            </div>
                            <div>
                                <h3 className="text-slate-400">Total Failures Detected</h3>
                                <p className="text-2xl font-bold text-white">{data?.total_failures_detected || '...'}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">Last 6 Months</span>
                            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">Region: Global</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
