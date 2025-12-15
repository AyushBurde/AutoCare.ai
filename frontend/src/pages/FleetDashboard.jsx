import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, AlertTriangle, CheckCircle, Activity, LayoutGrid, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../components/ui/GlassCard';
import StatusBadge from '../components/ui/StatusBadge';
import NeonButton from '../components/ui/NeonButton';

import { vehicles } from '../data/mockData';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function FleetDashboard() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filteredVehicles = vehicles.filter(vehicle => {
        const matchesSearch = vehicle.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || vehicle.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    console.log('Current Filter:', filterStatus);
    console.log('Search Term:', searchTerm);
    console.log('Filtered Count:', filteredVehicles.length);

    const totalFleet = vehicles.length;
    const criticalRisks = vehicles.filter(v => v.status === 'CRITICAL').length;
    const healthyVehicles = vehicles.filter(v => v.status === 'HEALTHY').length;
    const maintenanceVehicles = vehicles.filter(v => v.status === 'MAINTENANCE').length;

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-1">
                        Fleet <span className="text-cyan-400">Command Center</span>
                    </h1>
                    <p className="text-slate-400 text-sm">Real-time predictive maintenance monitoring</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search fleet..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-900/50 border border-slate-700 text-slate-200 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-cyan-500/50 transition-all w-64"
                        />
                        <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                    </div>
                    <div className="relative z-50">
                        <NeonButton
                            variant="outline"
                            className={`!px-3 !py-2.5 ${filterStatus !== 'ALL' ? 'text-cyan-400 border-cyan-500/50' : ''}`}
                            icon={Filter}
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            {filterStatus === 'ALL' ? 'Filter' : filterStatus}
                        </NeonButton>

                        {isFilterOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl backdrop-blur-xl z-50 overflow-hidden">
                                {['ALL', 'CRITICAL', 'HEALTHY', 'MAINTENANCE'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            setFilterStatus(status);
                                            setIsFilterOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-800 transition-colors ${filterStatus === status ? 'text-cyan-400 font-medium' : 'text-slate-400'
                                            }`}
                                    >
                                        {status === 'ALL' ? 'All Statuses' : status.charAt(0) + status.slice(1).toLowerCase()}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Fleet", value: totalFleet, color: "text-white" },
                    { label: "Critical Risks", value: criticalRisks, color: "text-red-500" },
                    { label: "Healthy", value: healthyVehicles, color: "text-emerald-500" },
                    { label: "Maintenance", value: maintenanceVehicles, color: "text-yellow-500" },
                ].map((stat, i) => (
                    <GlassCard key={i} className="!p-4" hoverEffect={false}>
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</div>
                        <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                    </GlassCard>
                ))}
            </div>

            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
                {filteredVehicles.length === 0 ? (
                    <div className="col-span-full text-center text-slate-400 py-12">
                        No vehicles found matching your criteria
                    </div>
                ) : (
                    filteredVehicles.map((vehicle) => (
                        <div key={vehicle.id}>
                            <GlassCard
                                onClick={() => navigate(`/vehicle/${vehicle.id}`, { state: { vehicle } })}
                                className={`border-t-4 ${vehicle.status === 'CRITICAL' ? 'border-t-red-500 bg-red-500/5' :
                                    vehicle.status === 'MAINTENANCE' ? 'border-t-yellow-500 bg-yellow-500/5' :
                                        'border-t-emerald-500'}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl ${vehicle.status === 'CRITICAL' ? 'bg-red-500/20 text-red-500' : 'bg-slate-800 text-cyan-400'}`}>
                                        <Car size={24} />
                                    </div>
                                    <StatusBadge status={vehicle.status} />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-100 transition-colors">{vehicle.id}</h3>
                                <p className="text-slate-400 text-sm mb-4">{vehicle.model}</p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-700/30">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Failure Probability</span>
                                        <span className={`text-lg font-bold font-mono ${vehicle.status === 'CRITICAL' ? 'text-red-500' : 'text-emerald-500'}`}>
                                            {vehicle.risk}%
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Last Update</span>
                                        <span className="text-xs text-slate-300 font-mono">{vehicle.lastUpdate}</span>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
