import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function GlassCard({ children, className, onClick, hoverEffect = true }) {
    return (
        <motion.div
            whileHover={hoverEffect ? { scale: 1.02, y: -5 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={onClick}
            className={clsx(
                "glass-card rounded-2xl p-6 relative overflow-hidden group",
                onClick && "cursor-pointer",
                className
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10 h-full">
                {children}
            </div>
        </motion.div>
    );
}
