import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Activity, Thermometer, Droplets, Gauge, AlertTriangle, Phone, ArrowLeft, Cpu } from 'lucide-react';
import { predictFailure } from '../services/api';
import vapi from '../services/vapi';

const sensorData = [
    { time: '10:00', temp: 85 },
    { time: '10:05', temp: 87 },
    { time: '10:10', temp: 89 },
    { time: '10:15', temp: 92 },
    { time: '10:20', temp: 95 },
    { time: '10:25', temp: 98 },
    { time: '10:30', temp: 105 },
];

export default function VehicleDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [analyzing, setAnalyzing] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [callStatus, setCallStatus] = useState('idle'); // idle, calling, active

    const handleAnalysis = async () => {
        setAnalyzing(true);
        try {
            // Hardcoded data from prompt for demo purposes
            const dummyData = {
                "engine_temp_c": 105.5, "oil_pressure_psi": 25.0, "vibration_hz": 45.0,
                "rpm": 2200, "temp_ma_3h": 104.0, "pressure_ma_3h": 26.0, "vib_ma_3h": 44.0
            };
            const result = await predictFailure(dummyData);
            setPrediction(result);
        } catch (err) {
            console.error("Analysis Error:", err);
        }
        setAnalyzing(false);
    };

    const handleCallOwner = () => {
        setCallStatus('calling');
        // Start Vapi Assistant (Ensure API Key and Assistant ID are in .env)
        vapi.start(import.meta.env.VITE_VAPI_ASSISTANT_ID)
            .then(() => setCallStatus('active'))
            .catch(err => {
                console.error("Vapi Error:", err);
                setCallStatus('idle'); // Should maybe show error toast
                alert("Failed to start call. Check console for Vapi errors.");
            });
    };

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <button onClick={() => navigate('/')} className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
                <ArrowLeft size={18} className="mr-2" /> Back to Fleet
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Vehicle Status & Sensors */}
                <div className="lg:col-span-2 space-y-8">
                    <header className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{id}</h1>
                            <p className="text-slate-400">Honda City - 2022 Model</p>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg flex items-center gap-2 font-bold animate-pulse">
                            <AlertTriangle size={18} />
                            ATTENTION REQUIRED
                        </div>
                    </header>

                    {/* Charts */}
                    <div className="glass-panel p-6 rounded-2xl">
                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                            <Thermometer size={20} className="text-cyan-400" />
                            Engine Temperature Trend
                        </h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={sensorData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                    <XAxis dataKey="time" stroke="#64748b" />
                                    <YAxis stroke="#64748b" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                        itemStyle={{ color: '#22d3ee' }}
                                    />
                                    <Line type="monotone" dataKey="temp" stroke="#22d3ee" strokeWidth={3} dot={{ fill: '#22d3ee' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="glass-card p-4 rounded-xl text-center">
                            <div className="text-slate-400 text-sm mb-1 flex items-center justify-center gap-1"><Droplets size={14} /> Oil Pressure</div>
                            <div className="text-2xl font-bold text-white">25.0 PSI</div>
                        </div>
                        <div className="glass-card p-4 rounded-xl text-center">
                            <div className="text-slate-400 text-sm mb-1 flex items-center justify-center gap-1"><Gauge size={14} /> RPM</div>
                            <div className="text-2xl font-bold text-white">2,200</div>
                        </div>
                        <div className="glass-card p-4 rounded-xl text-center">
                            <div className="text-slate-400 text-sm mb-1 flex items-center justify-center gap-1"><Activity size={14} /> Vibration</div>
                            <div className="text-2xl font-bold text-yellow-500">45 Hz</div>
                        </div>
                    </div>
                </div>

                {/* Right Column: AI Diagnostics */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-2xl h-full flex flex-col">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Cpu className="text-purple-500" />
                                AI Diagnostics
                            </h2>
                            <p className="text-slate-400 text-sm mt-1">Run predictive model on current sensor data</p>
                        </div>

                        {!prediction ? (
                            <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-10">
                                <button
                                    onClick={handleAnalysis}
                                    disabled={analyzing}
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-purple-500/25 transition-all w-full flex items-center justify-center gap-2 group disabled:opacity-50"
                                >
                                    {analyzing ? (
                                        <>Processing...</>
                                    ) : (
                                        <>
                                            <Activity size={20} className="group-hover:animate-pulse" />
                                            Run AI Analysis
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="text-center py-6 border-b border-slate-800">
                                    <span className="text-slate-400 text-sm uppercase tracking-wider">Failure Probability</span>
                                    <div className="text-5xl font-black text-red-500 mt-2">{prediction.failure_risk_score}%</div>
                                    <div className="text-red-400 font-bold mt-2 flex items-center justify-center gap-2">
                                        <AlertTriangle size={16} />
                                        {prediction.alert_level} RISK
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                        <div className="text-sm text-slate-400">Predicted Failure</div>
                                        <div className="text-white font-medium">Cooling Pump</div>
                                    </div>
                                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                        <div className="text-sm text-slate-400">Time to Failure</div>
                                        <div className="text-white font-medium">~10 Days</div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={handleCallOwner}
                                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${callStatus === 'active'
                                                ? 'bg-rose-500/20 text-rose-500 border border-rose-500'
                                                : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20'
                                            }`}
                                    >
                                        <Phone size={18} />
                                        {callStatus === 'active' ? 'Call in Progress...' : 'Contact Customer (AI)'}
                                    </button>
                                    <p className="text-center text-xs text-slate-500 mt-3">
                                        Initiates AI Voice Agent call to registered owner
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
