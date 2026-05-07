/**
 * KPI Card Component
 * Displays executive metrics with icons and formatting
 */

import { motion } from 'framer-motion';

export default function KPICard({ icon: Icon, label, value, suffix = '', trend, delay = 0 }) {
    const formatValue = (val) => {
        if (typeof val === 'string') return val;
        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
        return val.toLocaleString();
    };

    return (
        <motion.div
            className="glass-dark rounded-xl p-6 hover:scale-105 transition-transform"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                    <Icon className="w-6 h-6 text-cyan-400" />
                </div>
                {trend && (
                    <span className={`text-sm font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                )}
            </div>
            <div className="text-3xl font-bold mb-1">
                {formatValue(value)}{suffix}
            </div>
            <div className="text-sm text-slate-400">{label}</div>
        </motion.div>
    );
}
