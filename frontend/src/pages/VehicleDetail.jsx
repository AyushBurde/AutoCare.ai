import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Activity, Thermometer, Droplets, Gauge, AlertTriangle, Phone, ArrowLeft, Cpu, Calendar, Clock, MapPin, CheckCircle, Wrench } from 'lucide-react';
import { predictFailure, getScheduleSlots, bookAppointment } from '../services/api';
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
    const [callStatus, setCallStatus] = useState('idle');

    // Booking State
    const [bookingStage, setBookingStage] = useState('idle');
    const [slots, setSlots] = useState([]);
    const [centerInfo, setCenterInfo] = useState(null);
    const [jobCardId, setJobCardId] = useState(null);

    const handleAnalysis = async () => {
        setAnalyzing(true);
        try {
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
        vapi.start(import.meta.env.VITE_VAPI_ASSISTANT_ID)
            .then(() => setCallStatus('active'))
            .catch(err => {
                console.error("Vapi Error:", err);
                setCallStatus('idle');
                alert("Failed to start call. Check console for Vapi errors.");
            });
    };

    const fetchSlots = async () => {
        setBookingStage('loading_slots');
        try {
            const data = await getScheduleSlots();
            setSlots(data.available_slots);
            setCenterInfo(data.recommended_center);
            setBookingStage('slots_visible');
        } catch (error) {
            console.error("Error fetching slots:", error);
            setBookingStage('idle');
        }
    };

    const confirmBooking = async (slot) => {
        setBookingStage('booking');
        try {
            const response = await bookAppointment({
                vehicle_id: id,
                slot: slot,
                owner_name: "Rajesh Sharma"
            });
            if (response.status === 'confirmed') {
                setJobCardId(response.job_card_id);
                setBookingStage('confirmed');
            }
        } catch (error) {
            console.error("Booking failed:", error);
            setBookingStage('slots_visible');
        }
    };

    return (
        <div className="h-screen bg-[#020617] text-slate-200 font-sans overflow-hidden flex flex-col">

            {/* COMPACT HEADER - Reduced padding */}
            <header className="px-5 py-3 border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-sm flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/')} className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold text-white tracking-wide">{id}</h1>
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">HONDA CITY '22</span>
                        </div>
                    </div>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 animate-pulse">
                    <AlertTriangle size={12} /> Critical Attention
                </div>
            </header>

            {/* MAIN CONTENT - SINGLE VIEWPORT GRID */}
            {/* Added overflow-hidden to ensure it doesn't spill out parent */}
            <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden h-full">

                {/* LEFT COLUMN: TELEMETRY (7 Cols) */}
                <div className="lg:col-span-7 flex flex-col gap-4 h-full min-h-0">

                    {/* Live Chart - Takes remaining height - Added min-h-0 */}
                    <div className="glass-panel p-4 rounded-xl flex-1 flex flex-col border border-slate-800/60 bg-slate-900/40 min-h-0">
                        <div className="flex justify-between items-center mb-2 shrink-0">
                            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                <Thermometer size={16} className="text-cyan-400" />
                                Thermal Analysis
                            </h3>
                            <div className="text-[10px] font-mono text-cyan-500 bg-cyan-950/30 px-2 py-0.5 rounded">LIVE</div>
                        </div>
                        <div className="flex-1 min-h-0 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={sensorData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} dy={5} />
                                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} dx={-5} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '8px', fontSize: '12px', padding: '8px' }}
                                        itemStyle={{ color: '#22d3ee' }}
                                    />
                                    <Line type="monotone" dataKey="temp" stroke="#22d3ee" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#22d3ee' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Sensor Strip - Fixed Height - Reduced size */}
                    <div className="grid grid-cols-3 gap-3 shrink-0 h-24">
                        <div className="glass-card p-3 rounded-lg flex flex-col justify-between border border-slate-800/60 bg-slate-900/40">
                            <div className="text-slate-500 text-[10px] font-bold uppercase flex items-center gap-1"><Droplets size={12} /> Oil Pressure</div>
                            <div className="text-2xl font-mono text-white">25.0 <span className="text-[10px] text-slate-500">PSI</span></div>
                        </div>
                        <div className="glass-card p-3 rounded-lg flex flex-col justify-between border border-slate-800/60 bg-slate-900/40">
                            <div className="text-slate-500 text-[10px] font-bold uppercase flex items-center gap-1"><Gauge size={12} /> RPM</div>
                            <div className="text-2xl font-mono text-white">2,200</div>
                        </div>
                        <div className="glass-card p-3 rounded-lg flex flex-col justify-between border border-yellow-500/20 bg-yellow-500/5">
                            <div className="text-yellow-500/80 text-xs font-bold uppercase flex items-center gap-1"><Activity size={12} /> Vibration</div>
                            <div className="text-2xl font-mono text-yellow-500">45 <span className="text-[10px] text-yellow-500/60">Hz</span></div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: INTELLIGENCE CONSOLE (5 Cols) */}
                <div className="lg:col-span-5 h-full min-h-0">
                    <div className="h-full glass-panel rounded-xl border border-slate-800 bg-slate-900/80 p-4 flex flex-col relative overflow-hidden">

                        {/* Background Deco */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        {/* Header */}
                        <div className="flex items-center gap-2 mb-4 shrink-0 z-10">
                            <div className="p-1.5 bg-purple-500/10 rounded text-purple-400">
                                <Cpu size={18} />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-white">AI Diagnostics Console</h2>
                                <p className="text-slate-400 text-[10px]">Predictive Maintenance Engine v2.1</p>
                            </div>
                        </div>

                        {/* DYNAMIC CONTENT AREA - Added min-h-0 for proper scrolling */}
                        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar z-10 min-h-0">
                            {!prediction ? (
                                <div className="h-full flex flex-col items-center justify-center space-y-4">
                                    <div className="text-center space-y-1">
                                        <p className="text-slate-400 text-xs text-center">System ready.</p>
                                    </div>
                                    <button
                                        onClick={handleAnalysis}
                                        disabled={analyzing}
                                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 text-sm"
                                    >
                                        {analyzing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Activity size={16} className="group-hover:animate-pulse" />
                                                Run Diagnostics
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">

                                    {/* Prediction Result - Compact */}
                                    <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800 text-center flex items-center justify-between gap-4">
                                        <div className="text-left">
                                            <div className="text-slate-500 text-[10px] uppercase font-bold">Risk Score</div>
                                            <div className="text-3xl font-black text-red-500 tracking-tighter">{prediction.failure_risk_score}%</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-slate-500 text-[10px] uppercase font-bold">Status</div>
                                            <div className="text-red-400 text-xs font-bold border border-red-500/20 px-2 py-1 rounded bg-red-500/10 flex items-center gap-1 justify-end">
                                                {prediction.alert_level} <AlertTriangle size={10} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Technical Details - Compact */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-slate-950/30 p-2 rounded border border-slate-800">
                                            <div className="text-[10px] text-slate-500 uppercase font-bold">Component</div>
                                            <div className="text-white text-xs font-medium mt-0.5">Cooling Pump</div>
                                        </div>
                                        <div className="bg-slate-950/30 p-2 rounded border border-slate-800">
                                            <div className="text-[10px] text-slate-500 uppercase font-bold">Time left</div>
                                            <div className="text-white text-xs font-medium mt-0.5">~10 Days</div>
                                        </div>
                                    </div>

                                    {/* ACTION MODULE - INTEGRATED */}
                                    {prediction.failure_risk_score > 80 && (
                                        <div className="border-t border-slate-700/50 pt-3 mt-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Wrench size={14} className="text-red-500" />
                                                <span className="text-xs font-bold text-white uppercase tracking-wide">Action Required</span>
                                            </div>

                                            {/* Booking Logic Container */}
                                            <div className="bg-gradient-to-b from-slate-800/40 to-slate-900/40 rounded-lg border border-slate-700/50 overflow-hidden">

                                                {/* Stage A: Prompt */}
                                                {bookingStage === 'idle' && (
                                                    <div className="p-3 text-center">
                                                        <p className="text-xs text-slate-300 mb-3">Immediate maintenance recommended.</p>
                                                        <button
                                                            onClick={fetchSlots}
                                                            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-3 rounded-lg shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 text-xs"
                                                        >
                                                            <Calendar size={14} /> Book Priority Service
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Stage B: Slots */}
                                                {(bookingStage === 'loading_slots' || bookingStage === 'slots_visible' || bookingStage === 'booking') && (
                                                    <div className="p-3">
                                                        {bookingStage === 'loading_slots' ? (
                                                            <div className="py-4 flex justify-center text-slate-400 gap-2 text-xs">
                                                                <div className="w-3 h-3 border-2 border-slate-500 border-t-red-500 rounded-full animate-spin"></div>
                                                                Checking slots...
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 p-1.5 bg-slate-950/50 rounded border border-slate-800">
                                                                    <MapPin size={12} className="text-red-500" />
                                                                    <div>
                                                                        <div className="text-xs font-bold text-white leading-tight">{centerInfo?.name}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                                                                    {slots.map((slot, i) => (
                                                                        <button
                                                                            key={i}
                                                                            onClick={() => confirmBooking(slot)}
                                                                            disabled={bookingStage === 'booking'}
                                                                            className="w-full text-left p-2 rounded bg-slate-800/50 hover:bg-slate-700 border border-slate-700/50 hover:border-cyan-500/30 transition-all text-[11px] text-slate-200 flex justify-between group"
                                                                        >
                                                                            <span className="flex items-center gap-2"><Clock size={12} className="text-cyan-500" /> {slot}</span>
                                                                            <ArrowLeft size={12} className="rotate-180 opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity" />
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Stage C: Success */}
                                                {bookingStage === 'confirmed' && (
                                                    <div className="p-4 bg-emerald-500/5 text-center">
                                                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-500/20">
                                                            <CheckCircle size={16} className="text-white" />
                                                        </div>
                                                        <h4 className="text-emerald-400 font-bold text-xs mb-2">Booking Confirmed</h4>
                                                        <div className="bg-slate-950 p-1.5 rounded border border-slate-800 mb-2">
                                                            <div className="text-[10px] text-slate-500 uppercase font-bold">Job Card ID</div>
                                                            <div className="text-sm font-mono font-bold text-white tracking-widest">{jobCardId}</div>
                                                        </div>
                                                        <p className="text-[10px] text-slate-400">Assigned to <span className="text-slate-300 font-bold">Rajesh</span></p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Call Button - Compact */}
                        {prediction && (
                            <div className="pt-3 mt-auto border-t border-slate-800/50 shrink-0 z-10">
                                <button
                                    onClick={handleCallOwner}
                                    className={`w-full py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${callStatus === 'active'
                                        ? 'bg-rose-500/20 text-rose-500 border border-rose-500'
                                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                        }`}
                                >
                                    <Phone size={14} />
                                    {callStatus === 'active' ? 'Call in Progress...' : 'Contact Customer (AI)'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
