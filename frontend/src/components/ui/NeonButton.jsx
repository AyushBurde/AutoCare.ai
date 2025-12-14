import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const variants = {
    primary: "bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] border border-cyan-400",
    danger: "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:shadow-[0_0_30px_rgba(220,38,38,0.8)] border border-red-500",
    outline: "bg-transparent border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]",
    ghost: "bg-transparent hover:bg-white/5 text-slate-300 hover:text-white"
};

export default function NeonButton({ children, onClick, variant = 'primary', className, icon: Icon, disabled, type = 'button' }) {
    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={onClick}
            disabled={disabled}
            type={type}
            className={clsx(
                "relative px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100",
                variants[variant],
                className
            )}
        >
            {Icon && <Icon size={20} className={clsx(variant === 'primary' ? "text-black" : "text-current")} />}
            {children}
        </motion.button>
    );
}
