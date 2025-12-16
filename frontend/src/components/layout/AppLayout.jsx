import React from 'react';
import { useLocation } from 'react-router-dom';
import { LayoutGrid, BarChart3, AlertTriangle, Settings, LogOut, Cpu, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { vehicles } from '../../data/mockData';

const navItems = [
    { path: '/dashboard', icon: LayoutGrid, label: 'Fleet' },
    { path: '/insights', icon: BarChart3, label: 'Insights' },
    { path: '/alerts', icon: AlertTriangle, label: 'Alerts', badge: vehicles.filter(v => v.status === 'CRITICAL').length },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/security', icon: ShieldCheck, label: 'Security' },
];

export default function AppLayout({ children }) {
    const location = useLocation();

    return (
        <div className="flex min-h-screen pt-4 pb-4 pl-4 pr-1 gap-4 overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-64 glass-card rounded-2xl flex flex-col p-4 shrink-0"
            >
                <div className="flex items-center gap-3 px-2 mb-8 mt-2">
                    <div className="p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20">
                        <Cpu size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">AutoCare.ai</h1>
                        <p className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">Intelligent Systems</p>
                    </div>
                </div>

                <nav className="space-y-2 flex-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                                    isActive
                                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                                        : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={20} className={isActive ? "animate-pulse" : ""} />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                                {item.badge && (
                                    <span className="bg-red-500/20 text-red-500 text-xs font-bold px-2 py-0.5 rounded-full border border-red-500/20">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                <div className="mt-auto px-4 py-4 border-t border-slate-700/30">
                    <div className="flex items-center gap-3 text-slate-400 hover:text-white cursor-pointer transition-colors">
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Disconnect</span>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 glass-card rounded-2xl mr-4 overflow-hidden relative flex flex-col">
                {/* Top Gradient Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-50"></div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                    >
                        {children}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
