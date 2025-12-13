import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, AlertTriangle, CheckCircle, Activity, LayoutGrid } from 'lucide-react';

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

export default function FleetDashboard() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <header className="mb-10 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg">
                            <LayoutGrid size={24} className="text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-white tracking-tight">
                            Kritagya <span className="text-cyan-400">Fleet Monitor</span>
                        </h1>
                    </div>
                    <p className="text-slate-400 pl-14">Real-time predictive maintenance dashboard</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/insights')}
                        className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl font-bold text-slate-900 hover:from-yellow-400 hover:to-amber-500 shadow-lg shadow-yellow-500/20 transition-all flex items-center gap-2"
                    >
                        <AlertTriangle size={20} />
                        Manufacturing Insights
                    </button>
                    <div className="glass-card px-6 py-3 rounded-xl flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-slate-300 font-medium">System Online</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {vehicles.map((vehicle) => (
                    <div
                        key={vehicle.id}
                        onClick={() => vehicle.status === 'CRITICAL' && navigate(`/vehicle/${vehicle.id}`)}
                        className={`
                relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer group
                ${vehicle.status === 'CRITICAL'
                                ? 'bg-red-500/10 border-red-500/50 hover:bg-red-500/20 hover:border-red-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]'
                                : 'bg-slate-900/50 border-slate-800 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10'
                            }
            `}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${vehicle.status === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400 group-hover:text-cyan-400 group-hover:bg-cyan-950/30'}`}>
                                <Car size={24} />
                            </div>
                            {vehicle.status === 'CRITICAL' ? (
                                <span className="flex items-center gap-1 text-red-500 font-bold text-sm bg-red-950/30 px-2 py-1 rounded-lg border border-red-900/50 animate-pulse">
                                    <AlertTriangle size={14} /> CRITICAL
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-emerald-500 font-medium text-sm bg-emerald-950/30 px-2 py-1 rounded-lg border border-emerald-900/50">
                                    <CheckCircle size={14} /> HEALTHY
                                </span>
                            )}
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-100 transition-colors">{vehicle.id}</h3>
                        <p className="text-slate-400 text-sm mb-4">{vehicle.model}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-800 group-hover:border-slate-700/50 transition-colors">
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Risk Score</span>
                                <span className={`text-lg font-bold ${vehicle.status === 'CRITICAL' ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {vehicle.risk}%
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-slate-500 block">Last Update</span>
                                <span className="text-xs text-slate-300">{vehicle.lastUpdate}</span>
                            </div>
                        </div>

                        {vehicle.status === 'CRITICAL' && (
                            <div className="absolute inset-0 border-2 border-red-500/30 rounded-2xl animate-pulse pointer-events-none"></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
