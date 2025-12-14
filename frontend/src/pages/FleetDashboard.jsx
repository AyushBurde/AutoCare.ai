import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, AlertTriangle, CheckCircle, Activity, LayoutGrid, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../components/ui/GlassCard';
import StatusBadge from '../components/ui/StatusBadge';
import NeonButton from '../components/ui/NeonButton';

const vehicles = [
    { id: 'MH-12-AB-1000', model: 'Honda City', status: 'CRITICAL', risk: 98, lastUpdate: '2 mins ago' },
    { id: 'MH-12-XY-2021', model: 'Maruti Suzuki Swift', status: 'HEALTHY', risk: 2, lastUpdate: '5 mins ago' },
    { id: 'MH-12-CD-3456', model: 'Hyundai Creta', status: 'HEALTHY', risk: 5, lastUpdate: '10 mins ago' },
    { id: 'MH-14-EF-9012', model: 'Tata Nexon', status: 'HEALTHY', risk: 1, lastUpdate: '1 min ago' },
    { id: 'MH-02-GH-4567', model: 'Mahindra XUV700', status: 'HEALTHY', risk: 8, lastUpdate: '15 mins ago' },
    { id: 'MH-43-IJ-7890', model: 'Kia Seltos', status: 'HEALTHY', risk: 3, lastUpdate: 'Just now' },
    { id: 'MH-04-KL-1234', model: 'Toyota Fortuner', status: 'HEALTHY', risk: 0, lastUpdate: '30 mins ago' },
    { id: 'MH-01-MN-5678', model: 'Honda Amaze', status: 'HEALTHY', risk: 4, lastUpdate: '8 mins ago' },
    { id: 'MH-48-OP-9012', model: 'Skoda Slavia', status: 'HEALTHY', risk: 6, lastUpdate: '45 mins ago' },
    { id: 'MH-46-QR-3456', model: 'Volkswagen Virtus', status: 'HEALTHY', risk: 2, lastUpdate: '1 hour ago' },
];

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
                            className="bg-slate-900/50 border border-slate-700 text-slate-200 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-cyan-500/50 transition-all w-64"
                        />
                        <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                    </div>
                    <NeonButton variant="outline" className="!px-3 !py-2.5" icon={Filter}>
                        Filter
                    </NeonButton>
                    <NeonButton variant="outline" className="!px-3 !py-2.5" icon={Filter}>
                        Filter
                    </NeonButton>
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

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
                {vehicles.map((vehicle) => (
                    <motion.div key={vehicle.id} variants={item}>
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
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
