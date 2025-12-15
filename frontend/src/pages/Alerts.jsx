import React from 'react';
import { useNavigate } from 'react-router-dom';
import { vehicles } from '../data/mockData';
import GlassCard from '../components/ui/GlassCard';
import StatusBadge from '../components/ui/StatusBadge';
import NeonButton from '../components/ui/NeonButton';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export default function Alerts() {
    const navigate = useNavigate();
    const criticalVehicles = vehicles.filter(v => v.status === 'CRITICAL');

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-white tracking-tight mb-1">
                    System <span className="text-red-500">Alerts</span>
                </h1>
                <p className="text-slate-400 text-sm">Critical issues requiring immediate attention</p>
            </header>

            {criticalVehicles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                    <div className="bg-emerald-500/10 p-4 rounded-full mb-4">
                        <StatusBadge status="HEALTHY" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">All Systems Nominal</h3>
                    <p>No critical alerts at this time.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {criticalVehicles.map(vehicle => (
                        <GlassCard key={vehicle.id} className="!border-l-4 !border-l-red-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-red-500/20 rounded-xl text-red-500 shrink-0">
                                    <AlertTriangle size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        {vehicle.id}
                                        <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-500 border border-red-500/20 font-mono">
                                            {vehicle.risk}% FAILURE RISK
                                        </span>
                                    </h3>
                                    <p className="text-slate-400 text-sm">{vehicle.model} • Updated {vehicle.lastUpdate}</p>
                                </div>
                            </div>

                            <NeonButton
                                variant="danger"
                                className="!py-2 !px-4 text-sm w-full md:w-auto"
                                onClick={() => navigate(`/vehicle/${vehicle.id}`, { state: { vehicle } })}
                            >
                                Resolve Issue <ArrowRight size={16} />
                            </NeonButton>
                        </GlassCard>
                    ))}
                </div>
            )}
        </div>
    );
}
