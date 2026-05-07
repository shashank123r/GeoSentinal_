import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

export default function StatCard({ icon: Icon, label, value, suffix = '', delay = 0 }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    const [displayValue, setDisplayValue] = useState(0);

    // Parse the actual value
    const numericValue = typeof value === 'string'
        ? parseFloat(value.replace(/[$,B]/g, '')) || 0
        : (value || 0);

    // Animate value when in view
    useEffect(() => {
        if (isInView && numericValue > 0) {
            const duration = 1500;
            const startTime = Date.now();

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Easing function
                const eased = 1 - Math.pow(1 - progress, 3);
                setDisplayValue(Math.round(numericValue * eased));

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    setDisplayValue(numericValue);
                }
            };

            requestAnimationFrame(animate);
        }
    }, [isInView, numericValue]);

    // Format display value
    const formatValue = (val) => {
        if (typeof value === 'string' && value.includes('$')) {
            return `$${val}B`;
        }
        return val.toLocaleString();
    };

    return (
        <motion.div
            ref={ref}
            className="glass-dark rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -5, scale: 1.02 }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-all`}>
                    <Icon className="w-6 h-6 text-cyan-400" />
                </div>
            </div>

            <div className="text-3xl font-bold text-white mb-1 font-display">
                <span>{formatValue(displayValue)}</span>
                {suffix && <span className="text-2xl ml-1">{suffix}</span>}
            </div>

            <div className="text-sm text-slate-400">{label}</div>
        </motion.div>
    );
}
