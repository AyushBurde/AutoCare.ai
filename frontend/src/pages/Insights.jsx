import React, { useEffect, useState } from 'react';
import { getInsights } from '../services/api';
import { AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
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
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="flex items-center gap-3 text-slate-400 text-xl font-medium animate-pulse">
                    <div className="w-6 h-6 border-2 border-slate-500 border-t-cyan-400 rounded-full animate-spin"></div>
                    Analyzing Fleet Data...
                </div>
            </div>
        );
    }

    if (!data) return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
            <p>No insights available.</p>
            <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                Return to Dashboard
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-12 font-sans flex items-center justify-center">

            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all"
            >
                <ArrowLeft size={24} />
            </button>

            {/* Critical Alert Card */}
            <div className="max-w-3xl w-full bg-slate-900 border-l-4 border-red-500 rounded-r-xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="bg-red-500/10 p-6 border-b border-red-500/20 flex items-center gap-4">
                    <div className="bg-red-500/20 p-3 rounded-full text-red-500">
                        <AlertTriangle size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-red-50 text-wrap">
                            {data.title}
                        </h2>
                        <p className="text-red-400/80 text-sm font-medium uppercase tracking-wider">Engineering Report #2024-88A</p>
                    </div>
                </div>

                {/* Main Stat Section */}
                <div className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                            <p className="text-slate-400 text-sm uppercase tracking-wide font-semibold mb-1">Affected Component</p>
                            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                {data.critical_component}
                            </h1>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                            <div className="text-right">
                                <p className="text-slate-400 text-xs font-bold uppercase">Failures Detected</p>
                                <span className="text-3xl font-bold text-red-400 font-mono">
                                    {data.total_failures_detected}
                                </span>
                            </div>
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-red-500/20 text-red-500 animate-pulse">
                                !
                            </div>
                        </div>
                    </div>

                    {/* Context Section (Gray Background) */}
                    <div className="grid md:grid-cols-2 gap-6 bg-slate-950/80 rounded-2xl p-6 border border-slate-800 mb-8">
                        <div>
                            <h3 className="text-slate-400 text-sm font-semibold mb-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                                Pattern Detected
                            </h3>
                            <p className="text-slate-200 leading-relaxed font-medium">
                                {data.pattern_detected}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-slate-400 text-sm font-semibold mb-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                                Lifecycle Analysis
                            </h3>
                            <p className="text-slate-200 leading-relaxed font-medium">
                                {data.lifecycle_analysis}
                            </p>
                        </div>
                    </div>

                    {/* Action Section (Key Part) */}
                    <div className="bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/30 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full filter blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                        <div className="relative z-10">
                            <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                                AI RECOMMENDATION
                            </h3>

                            <p className="text-xl md:text-2xl text-white font-bold leading-snug mb-6">
                                {data.recommendation}
                            </p>

                            <button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20">
                                <CheckCircle size={20} />
                                Approve ECO (Engineering Change Order)
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
