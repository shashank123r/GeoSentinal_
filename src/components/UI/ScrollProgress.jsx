import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ScrollProgress() {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-slate-800 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: scrollProgress > 0 ? 1 : 0 }}
        >
            <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500"
                style={{ width: `${scrollProgress}%` }}
                transition={{ duration: 0.1 }}
            />
        </motion.div>
    );
}
