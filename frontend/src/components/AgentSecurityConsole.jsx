import React, { useState, useEffect, useRef } from 'react';
import {
    ShieldAlert,
    Bot,
    Terminal,
    Lock,
    Activity,
    Server,
    Wifi,
    AlertTriangle,
    CheckCircle,
    Database,
    Cpu,
    Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data for Log Stream
const MOCK_LOGS = [
    { agent: 'Data Fetcher', action: 'Querying sensor API...', status: 'normal' },
    { agent: 'Scheduler', action: 'Checking availability slots...', status: 'normal' },
    { agent: 'Voice Bot', action: 'Processing user intent...', status: 'normal' },
    { agent: 'Data Fetcher', action: 'Telemetry packet received.', status: 'normal' },
    { agent: 'Master', action: 'Orchestrating workflow ID: #8821', status: 'normal' },
];

const AgentSecurityConsole = () => {
    const [logs, setLogs] = useState([]);
    const [isUnderAttack, setIsUnderAttack] = useState(false);
    const [attackDetails, setAttackDetails] = useState(null);
    const logContainerRef = useRef(null);

    // Initial Logs Simulation
    useEffect(() => {
        let interval;
        if (!isUnderAttack) {
            interval = setInterval(() => {
                const randomLog = MOCK_LOGS[Math.floor(Math.random() * MOCK_LOGS.length)];
                addLog(randomLog.agent, randomLog.action, 'normal');
            }, 800);
        }
        return () => clearInterval(interval);
    }, [isUnderAttack]);

    // Auto-scroll logs
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    const addLog = (agent, action, type = 'normal') => {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        setLogs(prev => [...prev.slice(-20), { id: Date.now(), timestamp, agent, action, type }]);
    };

    const triggerAttack = () => {
        if (isUnderAttack) return;

        setIsUnderAttack(true);
        setAttackDetails(null);

        // Sequence of Attack Events
        setTimeout(() => {
            addLog('Voice Bot', 'GET /admin/users - 401 Unauthorized', 'warning');
        }, 500);

        setTimeout(() => {
            addLog('Voice Bot', 'Attempting Privilege Escalation...', 'error');
        }, 1200);

        setTimeout(() => {
            addLog('UEBA SYSTEM', 'MALICIOUS BEHAVIOR DETECTED: Voice Bot', 'critical');
            setAttackDetails({
                type: 'Unauthorized API Access',
                description: 'Agent attempted to reach restricted /admin endpoint.',
                action: 'Workflow Terminated'
            });
        }, 2000);
    };

    const resolveAttack = () => {
        setIsUnderAttack(false);
        setAttackDetails(null);
        addLog('UEBA SYSTEM', 'Security Protocol: Resetting Agent Context...', 'system');
        setTimeout(() => {
            addLog('Master', 'Voice Bot reinstated with restricted permissions.', 'success');
        }, 1000);
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-6 bg-slate-950 text-slate-200 font-sans min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 rounded-lg border border-slate-700">
                        <ShieldAlert className={isUnderAttack ? "text-red-500 animate-pulse" : "text-emerald-500"} size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white">Security Command Center</h1>
                        <p className="text-xs text-slate-400 font-mono">UEBA Protocol: ACTIVE • Monitoring Agents...</p>
                    </div>
                </div>
                <div>
                    <button
                        onClick={isUnderAttack ? resolveAttack : triggerAttack}
                        className={`px-4 py-2 rounded font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${isUnderAttack
                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/50 hover:bg-emerald-500/20'
                                : 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20'
                            }`}
                    >
                        {isUnderAttack ? <><CheckCircle size={14} /> Resolve Security Incident</> : <><AlertTriangle size={14} /> Simulate Attack</>}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Visual Hierarchy */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Master Agent */}
                    <div className="relative">
                        <div className="absolute left-8 top-12 bottom-[-40px] w-0.5 bg-gradient-to-b from-slate-700 to-transparent z-0"></div>

                        <div className="relative z-10 bg-slate-900 border border-slate-700 p-4 rounded-xl flex items-center justify-between shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                    <Cpu size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Master Orchestrator</h3>
                                    <p className="text-xs text-slate-400">Status: <span className="text-emerald-400">ONLINE</span></p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-slate-500 font-mono">CPU: 12%</div>
                                <div className="text-xs text-slate-500 font-mono">MEM: 1.4GB</div>
                            </div>
                        </div>
                    </div>

                    {/* Worker Agents */}
                    <div className="grid grid-cols-2 gap-4 pl-8">
                        {/* Data Fetcher */}
                        <AgentCard
                            name="Data Fetcher"
                            role="Telemetry"
                            icon={Database}
                            status="normal"
                            isUnderAttack={false}
                        />

                        {/* Voice Bot (The Victim) */}
                        <AgentCard
                            name="Voice Bot"
                            role="Interaction"
                            icon={Bot}
                            status={isUnderAttack ? "compromised" : "normal"}
                            isUnderAttack={isUnderAttack}
                            lockdownMessage={attackDetails?.description}
                        />

                        {/* Scheduler */}
                        <AgentCard
                            name="Scheduler"
                            role="CRM Actions"
                            icon={Server}
                            status="normal"
                            isUnderAttack={false}
                        />

                        {/* Analyzer */}
                        <AgentCard
                            name="Analyzer"
                            role="Decision Engine"
                            icon={Search}
                            status="normal"
                            isUnderAttack={false}
                        />
                    </div>
                </div>

                {/* Live Terminal */}
                <div className="lg:col-span-1 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[500px] shadow-2xl">
                    <div className="bg-slate-900 p-3 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                            <Terminal size={12} />
                            <span>System Logs</span>
                        </div>
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                        </div>
                    </div>
                    <div
                        ref={logContainerRef}
                        className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-2 custom-scrollbar bg-black/50"
                    >
                        {logs.length === 0 && <span className="text-slate-600 italic">Waiting for agents...</span>}
                        {logs.map((log) => (
                            <div key={log.id} className="flex gap-2 animate-fadeIn">
                                <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                                <div className="break-all">
                                    <span className={`font-bold mr-2 ${getAgentColor(log.agent)}`}>{log.agent}:</span>
                                    <span className={getLogColor(log.type)}>{log.action}</span>
                                </div>
                            </div>
                        ))}
                        {isUnderAttack && attackDetails && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mt-4 p-3 border-l-2 border-red-500 bg-red-500/10 text-red-400"
                            >
                                <div className="font-bold mb-1 flex items-center gap-2"><ShieldAlert size={12} /> UEBA ALERT TRIGGERED</div>
                                <div className="opacity-80">Reason: {attackDetails.type}</div>
                                <div className="text-slate-500 mt-1">Action: {attackDetails.action}</div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Components & Functions
const AgentCard = ({ name, role, icon: Icon, status, isUnderAttack, lockdownMessage }) => {
    const isCompromised = status === 'compromised';

    return (
        <div className={`relative p-4 rounded-xl border transition-all duration-300 overflow-hidden ${isCompromised
                ? 'bg-red-950/30 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                : 'bg-slate-900 border-slate-700 hover:border-slate-600'
            }`}>
            {isCompromised && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-red-500/10 z-0 animate-pulse"
                ></motion.div>
            )}

            <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isCompromised ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        <Icon size={20} />
                    </div>
                    <div>
                        <h4 className={`font-bold text-sm ${isCompromised ? 'text-red-400' : 'text-slate-200'}`}>{name}</h4>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{role}</p>
                    </div>
                </div>
                {isCompromised ? (
                    <Lock size={16} className="text-red-500" />
                ) : (
                    <Activity size={16} className="text-emerald-500/50" />
                )}
            </div>

            {/* Lockdown Overlay */}
            <AnimatePresence>
                {isCompromised && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-3 pt-3 border-t border-red-500/30"
                    >
                        <div className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-wider mb-1">
                            <ShieldAlert size={12} /> Security Lockdown
                        </div>
                        <p className="text-xs text-red-400/80 leading-relaxed">
                            {lockdownMessage || "Anomaly detected. Access revoked."}
                        </p>
                        <div className="mt-2 inline-block px-2 py-0.5 rounded bg-red-500 text-white text-[10px] font-bold">
                            BLOCKED BY UEBA
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const getAgentColor = (agent) => {
    switch (agent) {
        case 'Master': return 'text-blue-400';
        case 'Voice Bot': return 'text-purple-400';
        case 'Data Fetcher': return 'text-cyan-400';
        case 'UEBA SYSTEM': return 'text-red-500';
        default: return 'text-slate-400';
    }
};

const getLogColor = (type) => {
    switch (type) {
        case 'error': return 'text-red-400';
        case 'critical': return 'text-red-500 font-bold';
        case 'warning': return 'text-yellow-400';
        case 'success': return 'text-emerald-400';
        case 'system': return 'text-slate-500 italic';
        default: return 'text-slate-300';
    }
};

export default AgentSecurityConsole;
