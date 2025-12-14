import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { Activity, Thermometer, Droplets, Gauge, AlertTriangle, Phone, ArrowLeft, Cpu, Calendar, Clock, MapPin, CheckCircle, Wrench, ChevronRight, PenTool } from 'lucide-react';
import { predictFailure, getScheduleSlots, bookAppointment } from '../services/api';
import vapi from '../services/vapi';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import { motion, AnimatePresence } from 'framer-motion';

const sensorData = [
    { time: '10:00', temp: 85 },
    { time: '10:05', temp: 87 },
    { time: '10:10', temp: 89 },
    { time: '10:15', temp: 92 },
    { time: '10:20', temp: 95 },
    { time: '10:25', temp: 98 },
    { time: '10:30', temp: 105 },
];

const healthySensorData = [
    { time: '10:00', temp: 65 },
    { time: '10:05', temp: 66 },
    { time: '10:10', temp: 65 },
    { time: '10:15', temp: 67 },
    { time: '10:20', temp: 66 },
    { time: '10:25', temp: 65 },
    { time: '10:30', temp: 66 },
];

export default function VehicleDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Get vehicle status from navigation state or default to HEALTHY
    const vehicleStatus = location.state?.vehicle?.status || 'HEALTHY';
    const isCritical = vehicleStatus === 'CRITICAL';
    const isMaintenance = vehicleStatus === 'MAINTENANCE';
    const isHealthy = vehicleStatus === 'HEALTHY';

    const [analyzing, setAnalyzing] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [callStatus, setCallStatus] = useState('idle');

    // Booking State
    const [bookingStage, setBookingStage] = useState('idle');
    const [slots, setSlots] = useState([]);
    const [centerInfo, setCenterInfo] = useState(null);
    const [jobCardId, setJobCardId] = useState(null);

    // Initial Prediction State based on Status
    useEffect(() => {
        if (isHealthy) {
            setPrediction({
                failure_risk_score: 2,
                alert_level: 'NOMINAL',
                component: 'System',
                recommendation: 'No actions required.'
            });
        }
    }, [isHealthy]);

    const handleAnalysis = async () => {
        setAnalyzing(true);
        try {
            if (isHealthy) {
                // Simulate analysis delay for healthy vehicle
                await new Promise(r => setTimeout(r, 1500));
                setPrediction({
                    failure_risk_score: 2,
                    alert_level: 'NOMINAL',
                    component: 'All Systems',
                    recommendation: 'System functioning within optimal parameters.'
                });
            } else {
                const dummyData = {
                    "engine_temp_c": 105.5, "oil_pressure_psi": 25.0, "vibration_hz": 45.0,
                    "rpm": 2200, "temp_ma_3h": 104.0, "pressure_ma_3h": 26.0, "vib_ma_3h": 44.0
                };
                const result = await predictFailure(dummyData);
                setPrediction(result);
            }
        } catch (err) {
            console.error("Analysis Error:", err);
        }
        setAnalyzing(false);
    };

    const handleCallOwner = () => {
        setCallStatus('calling');
        const assistantOverrides = {
            variableValues: {
                ownerName: "Rajesh Sharma",
                vehicleModel: "Honda City 2022",
                riskScore: prediction?.failure_risk_score || "Unknown",
                failedComponent: isHealthy ? "None" : "Cooling Pump",
                failureTime: isHealthy ? "N/A" : "10 Days"
            }
        };

        vapi.start(import.meta.env.VITE_VAPI_ASSISTANT_ID, assistantOverrides)
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

    const renderHeaderStatus = () => {
        if (isCritical) {
            return (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 animate-pulse-slow shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                    <AlertTriangle size={14} /> Critical Attention Needed
                </div>
            );
        } else if (isMaintenance) {
            return (
                <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                    <Wrench size={14} /> Under Maintenance
                </div>
            );
        } else {
            return (
                <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <CheckCircle size={14} /> System Healthy
                </div>
            );
        }
    };

    const chartData = isHealthy ? healthySensorData : sensorData;
    const chartColor = isCritical ? '#22d3ee' : isMaintenance ? '#eab308' : '#34d399'; // Cyan for Critical (keep consistent with theme), Yellow Main, Green Healthy

    // Override chart color for critical to be red? No, keep cyan as primary theme but maybe area fill changes.
    // Actually user said "graphs and values also normal".

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <NeonButton variant="ghost" className="!p-2" onClick={() => navigate('/')}>
                        <ArrowLeft size={20} />
                    </NeonButton>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight">{id}</h1>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">HONDA CITY '22</span>
                        </div>
                        <p className="text-slate-400 text-xs">Connected • Live Telemetry Active</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {renderHeaderStatus()}
                </div>
            </div>

            {/* Main Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">

                {/* Left Column: Telemetry (7 Cols) */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    {/* Live Chart */}
                    <GlassCard className="flex-1 flex flex-col !p-0 overflow-hidden relative" hoverEffect={false}>
                        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-slate-900/80 to-transparent">
                            <div className="flex items-center gap-2">
                                <Thermometer className={isCritical ? "text-cyan-400" : isMaintenance ? "text-yellow-400" : "text-emerald-400"} size={18} />
                                <h3 className="font-bold text-slate-200">Thermal Analysis</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${isCritical ? 'bg-cyan-500' : isMaintenance ? 'bg-yellow-500' : 'bg-emerald-500'} animate-pulse`}></div>
                                <span className={`text-xs ${isCritical ? 'text-cyan-400' : isMaintenance ? 'text-yellow-400' : 'text-emerald-400'} font-mono`}>LIVE FEED</span>
                            </div>
                        </div>

                        <div className="w-full h-full pt-12 pb-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} dx={-10} domain={isHealthy ? [60, 70] : ['auto', 'auto']} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '12px', fontSize: '12px', padding: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                                        itemStyle={{ color: chartColor }}
                                    />
                                    <Area type="monotone" dataKey="temp" stroke={chartColor} strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>

                    {/* Sensor Strip */}
                    <div className="grid grid-cols-3 gap-4 h-28 shrink-0">
                        {isMaintenance ? (
                            <GlassCard className="col-span-3 flex flex-row items-center justify-between !bg-yellow-500/5 !border-yellow-500/20" hoverEffect={false}>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-yellow-500/20 rounded-lg text-yellow-500">
                                        <Wrench size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-yellow-500 font-bold">Maintenance in Progress</h3>
                                        <p className="text-slate-400 text-xs">Vehicle is currently being serviced.</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-slate-500 uppercase font-bold">Est. Completion</div>
                                    <div className="text-xl font-mono text-white">Today, 5:00 PM</div>
                                </div>
                            </GlassCard>
                        ) : (
                            <>
                                <GlassCard className="flex flex-col justify-between" hoverEffect={true}>
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                        <Droplets size={14} /> Oil Pressure
                                    </div>
                                    <div>
                                        <span className="text-3xl font-mono font-bold text-white">
                                            {isHealthy ? "32.0" : "25.0"}
                                        </span>
                                        <span className="text-xs text-slate-500 ml-1">PSI</span>
                                    </div>
                                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                        <div className={`h-full ${isHealthy ? 'bg-emerald-500' : 'bg-cyan-500'} w-[${isHealthy ? '80%' : '60%'}]`}></div>
                                    </div>
                                </GlassCard>

                                <GlassCard className="flex flex-col justify-between" hoverEffect={true}>
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                        <Gauge size={14} /> RPM
                                    </div>
                                    <div>
                                        <span className="text-3xl font-mono font-bold text-white">
                                            {isHealthy ? "1,800" : "2,200"}
                                        </span>
                                    </div>
                                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                        <div className={`h-full ${isHealthy ? 'bg-emerald-500' : 'bg-emerald-500'} w-[40%]`}></div>
                                    </div>
                                </GlassCard>

                                <GlassCard className={`flex flex-col justify-between group ${isHealthy ? '' : '!border-yellow-500/20 !bg-yellow-500/5'}`} hoverEffect={true}>
                                    <div className={`flex items-center gap-2 ${isHealthy ? 'text-slate-400' : 'text-yellow-500/80'} text-xs font-bold uppercase tracking-wider`}>
                                        <Activity size={14} /> Vibration
                                    </div>
                                    <div>
                                        <span className={`text-3xl font-mono font-bold ${isHealthy ? 'text-white' : 'text-yellow-500 group-hover:text-yellow-400'} transition-colors`}>
                                            {isHealthy ? "12" : "45"}
                                        </span>
                                        <span className={`text-xs ${isHealthy ? 'text-slate-500' : 'text-yellow-500/60'} ml-1`}>Hz</span>
                                    </div>
                                    <div className={`h-1 ${isHealthy ? 'bg-slate-800' : 'bg-yellow-900/30'} rounded-full overflow-hidden`}>
                                        <div className={`h-full ${isHealthy ? 'bg-emerald-500 w-[15%]' : 'bg-yellow-500 w-[85%] animate-pulse'}`}></div>
                                    </div>
                                </GlassCard>
                            </>
                        )}
                    </div>
                </div>

                {/* Right Column: AI Console (5 Cols) */}
                <div className="lg:col-span-5 flex flex-col h-full">
                    <GlassCard className="flex-1 flex flex-col relative !overflow-hidden border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.05)]">
                        {/* Background FX */}
                        <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] pointer-events-none ${isHealthy ? 'bg-emerald-500/10' : 'bg-cyan-500/10'}`}></div>

                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className={`p-2 bg-gradient-to-tr ${isHealthy ? 'from-emerald-600 to-cyan-600' : 'from-cyan-600 to-purple-600'} rounded-lg shadow-lg`}>
                                <Cpu size={20} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">Diagnostics Console</h2>
                                <p className="text-slate-400 text-xs">AI-Powered Predictive Engine v2.1</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 min-h-0">
                            <AnimatePresence mode="wait">
                                {!prediction ? (
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="h-full flex flex-col items-center justify-center space-y-6"
                                    >
                                        <div className={`w-24 h-24 rounded-full border-4 border-slate-800 ${isHealthy ? 'border-t-emerald-500' : 'border-t-cyan-500'} animate-spin flex items-center justify-center`}>
                                            <div className="w-16 h-16 rounded-full bg-slate-900"></div>
                                        </div>
                                        <div className="text-center space-y-1">
                                            <h3 className="text-slate-200 font-medium">{isHealthy ? "Monitoring Active" : "System Standby"}</h3>
                                            <p className="text-slate-500 text-xs">{isHealthy ? "All sensors reporting nominal data" : "Ready for deep diagnostic scan"}</p>
                                        </div>
                                        {!isHealthy && (
                                            <NeonButton
                                                onClick={handleAnalysis}
                                                disabled={analyzing}
                                                variant="primary"
                                                className="w-full"
                                                icon={Activity}
                                            >
                                                {analyzing ? 'Processing Telemetry...' : 'Run Diagnostics'}
                                            </NeonButton>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                        className="space-y-6"
                                    >
                                        {/* Result Card */}
                                        <div className={`bg-slate-900/50 rounded-2xl p-6 border flex items-center justify-between ${isHealthy ? 'border-emerald-500/30' : 'border-slate-800'}`}>
                                            <div>
                                                <div className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Failure Probability</div>
                                                <div className={`text-5xl font-black ${isHealthy ? 'text-emerald-500' : 'text-red-500'} tracking-tighter`}>{prediction.failure_risk_score}%</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-2">Confidence</div>
                                                <div className={`inline-block px-3 py-1 rounded-full border text-xs font-bold ${isHealthy ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                                                    {isHealthy ? "OPTIMAL" : "HIGH PRIORITY"}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Details Grid */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                                                <div className="text-slate-500 text-[10px] uppercase font-bold mb-1">Predicted Component</div>
                                                <div className="text-white font-medium flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-emerald-500' : 'bg-red-500'}`}></span> {isHealthy ? "All Systems" : "Cooling Pump"}
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                                                <div className="text-slate-500 text-[10px] uppercase font-bold mb-1">{isHealthy ? "Next Service" : "Est. Time to Failure"}</div>
                                                <div className="text-white font-medium flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-emerald-500' : 'bg-yellow-500'}`}></span> {isHealthy ? "In 3 Months" : "~10 Days"}
                                                </div>
                                            </div>
                                        </div>

                                        {isMaintenance && (
                                            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 mt-2">
                                                <div className="flex items-start gap-3">
                                                    <PenTool className="text-yellow-500 mt-1" size={18} />
                                                    <div>
                                                        <h4 className="text-yellow-500 font-bold text-sm">Maintenance Log</h4>
                                                        <p className="text-slate-300 text-xs mt-1">Intake Date: <span className="text-white font-mono">Today, 09:00 AM</span></p>
                                                        <p className="text-slate-300 text-xs">Technician: <span className="text-white">Rajeev S.</span></p>
                                                        <div className="mt-3 w-full bg-yellow-900/30 h-1.5 rounded-full overflow-hidden">
                                                            <div className="bg-yellow-500 h-full w-[45%] rounded-full"></div>
                                                        </div>
                                                        <p className="text-[10px] text-yellow-500/70 text-right mt-1">45% Complete</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Module */}
                                        {prediction.failure_risk_score > 80 && !isMaintenance && (
                                            <div className="border-t border-slate-800 pt-6">
                                                <h4 className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider mb-4">
                                                    <Wrench size={16} className="text-cyan-400" /> Recommended Actions
                                                </h4>

                                                <div className="bg-slate-800/30 rounded-xl overflow-hidden border border-slate-700/50">
                                                    {bookingStage === 'idle' && (
                                                        <div className="p-6 text-center">
                                                            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                                                                Immediate maintenance is recommended to prevent catastrophic failure.
                                                            </p>
                                                            <NeonButton onClick={fetchSlots} variant="danger" className="w-full" icon={Calendar}>
                                                                Book Priority Service
                                                            </NeonButton>
                                                        </div>
                                                    )}

                                                    {(bookingStage === 'loading_slots' || bookingStage === 'slots_visible' || bookingStage === 'booking') && (
                                                        <div className="p-4">
                                                            {bookingStage === 'loading_slots' ? (
                                                                <div className="py-8 flex flex-col items-center gap-3 text-slate-400">
                                                                    <div className="w-6 h-6 border-2 border-slate-600 border-t-cyan-500 rounded-full animate-spin"></div>
                                                                    <span className="text-xs">querying service network...</span>
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-4">
                                                                    <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700 flex items-start gap-3">
                                                                        <MapPin className="text-red-500 shrink-0 mt-0.5" size={16} />
                                                                        <div>
                                                                            <div className="text-sm font-bold text-white">{centerInfo?.name}</div>
                                                                            <div className="text-xs text-slate-400 mt-0.5">Recommended Center (1.2km)</div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="grid grid-cols-2 gap-2">
                                                                        {slots.map((slot, i) => (
                                                                            <button
                                                                                key={i}
                                                                                onClick={() => confirmBooking(slot)}
                                                                                disabled={bookingStage === 'booking'}
                                                                                className="p-3 rounded-lg bg-slate-800/50 hover:bg-cyan-500/10 border border-slate-700 hover:border-cyan-500/50 transition-all text-xs text-slate-200 flex items-center justify-between group"
                                                                            >
                                                                                <span className="flex items-center gap-2 font-medium">
                                                                                    <Clock size={14} className="text-cyan-500" /> {slot}
                                                                                </span>
                                                                                {bookingStage === 'booking' && <div className="w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin"></div>}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {bookingStage === 'confirmed' && (
                                                        <div className="p-8 text-center bg-emerald-500/5">
                                                            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                                                                <CheckCircle size={24} className="text-white" />
                                                            </div>
                                                            <h4 className="text-emerald-400 font-bold text-lg mb-1">Booking Confirmed</h4>
                                                            <p className="text-slate-400 text-xs mb-4">Job Card generated successfully</p>
                                                            <div className="bg-slate-950 px-4 py-2 rounded-lg border border-slate-800 inline-block">
                                                                <div className="text-[10px] text-slate-500 uppercase font-bold">Job Card ID</div>
                                                                <div className="text-xl font-mono font-bold text-white tracking-widest">{jobCardId}</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Call Button Area */}
                        {prediction && !isHealthy && (
                            <div className="mt-4 pt-4 border-t border-slate-800/50 relative z-10">
                                <NeonButton
                                    onClick={handleCallOwner}
                                    variant={callStatus === 'active' ? 'danger' : 'primary'}
                                    className="w-full"
                                    icon={Phone}
                                >
                                    {callStatus === 'active' ? 'Call in Progress...' : 'Contact Customer (AI)'}
                                </NeonButton>
                            </div>
                        )}
                        {/* Healthy Call Button (Optional, maybe just "Contact Owner") */}
                        {isHealthy && (
                            <div className="mt-4 pt-4 border-t border-slate-800/50 relative z-10">
                                <NeonButton
                                    onClick={() => alert("Owner is happy, no need to call!")}
                                    variant="outline"
                                    className="w-full"
                                    icon={Phone}
                                >
                                    Contact Owner
                                </NeonButton>
                            </div>
                        )}
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
