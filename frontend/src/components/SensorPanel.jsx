import React from 'react';
import { Activity, Droplets, Gauge, Wrench } from 'lucide-react';
import GlassCard from './ui/GlassCard';

const SensorPanel = ({ isMaintenance, isHealthy }) => {
    return (
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
    );
};

export default SensorPanel;
