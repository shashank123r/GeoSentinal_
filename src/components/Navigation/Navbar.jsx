import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Satellite } from 'lucide-react';

export default function Navbar({ scrollToSection }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            // Determine active section based on scroll position
            const sections = ['hero', 'disasters', 'comparison', 'analysis', 'map', 'statistics', 'dashboard', 'about'];
            const scrollPosition = window.scrollY + 100;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Hero', section: 'hero' },
        { name: 'Disasters', section: 'disasters' },
        { name: 'Analysis', section: 'analysis' },
        { name: 'Map', section: 'map' },
        { name: 'Dashboard', section: 'dashboard' },
        { name: 'About', section: 'about' },
    ];

    const handleNavClick = (section) => {
        scrollToSection(section);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled
                    ? 'bg-slate-900/80 backdrop-blur-lg border-b border-white/10 shadow-lg'
                    : 'bg-transparent'
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <motion.div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => scrollToSection('hero')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Satellite className="w-8 h-8 text-cyan-400" />
                            <span className="text-2xl font-bold font-display bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                GeoSentinal
                            </span>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <button
                                    key={link.section}
                                    onClick={() => handleNavClick(link.section)}
                                    className={`relative text-sm font-medium transition-colors ${activeSection === link.section
                                        ? 'text-cyan-400'
                                        : 'text-slate-300 hover:text-white'
                                        }`}
                                >
                                    {link.name}
                                    {activeSection === link.section && (
                                        <motion.div
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-400"
                                            layoutId="activeSection"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="fixed inset-0 z-30 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Menu */}
                        <motion.div
                            className="absolute top-16 right-0 left-0 bg-slate-900/95 backdrop-blur-lg border-b border-white/10 shadow-xl"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                        >
                            <div className="px-4 py-6 space-y-4">
                                {navLinks.map((link) => (
                                    <button
                                        key={link.section}
                                        onClick={() => handleNavClick(link.section)}
                                        className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${activeSection === link.section
                                            ? 'bg-cyan-500/20 text-cyan-400'
                                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        {link.name}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
