import React from 'react';
import clsx from 'clsx';
import { AlertTriangle, CheckCircle, Activity } from 'lucide-react';

const styles = {
    CRITICAL: "bg-red-500/10 text-red-500 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse-slow",
    HEALTHY: "bg-emerald-500/10 text-emerald-400 border-emerald-500/50 shadow-[0_0_10px_rgba(52,211,153,0.1)]",
    WARNING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.1)]",
};

const icons = {
    CRITICAL: AlertTriangle,
    HEALTHY: CheckCircle,
    WARNING: Activity
};

export default function StatusBadge({ status, className }) {
    const Icon = icons[status] || Activity;

    return (
        <div className={clsx(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider",
            styles[status] || styles.WARNING,
            className
        )}>
            <Icon size={14} />
            <span>{status}</span>
        </div>
    );
}
