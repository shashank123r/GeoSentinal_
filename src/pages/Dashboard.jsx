/**
 * Main Dashboard Page
 * Comprehensive analytics dashboard with real xBD data
 */

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Globe, Target, Image, Building, Users, MapPin, DollarSign } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import KPICard from '../components/Dashboard/KPICard';
import TypeDistributionChart from '../components/Dashboard/TypeDistributionChart';
import TimelineChart from '../components/Dashboard/TimelineChart';
import EventsTable from '../components/Dashboard/EventsTable';

export default function Dashboard() {
    const {
        loading,
        kpis,
        typeDistribution,
        temporalTrends,
        geographicDistribution
    } = useAnalytics();

    // Get events from analytics
    const [events, setEvents] = React.useState([]);

    React.useEffect(() => {
        // Load events from analytics
        import('../data/dashboard_analytics.json')
            .then(data => {
                setEvents(data.default?.events || data.events || []);
            })
            .catch(err => console.error('Error loading events:', err));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 py-20">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 className="text-5xl md:text-6xl font-bold mb-4 font-display bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Analytics Dashboard
                    </h2>
                    <p className="text-xl text-slate-300">
                        Comprehensive insights from {kpis.total_images?.toLocaleString()} satellite images
                    </p>
                </motion.div>

                {/* KPI Cards - Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <KPICard
                        icon={BarChart3}
                        label="Total Disasters"
                        value={kpis.total_disasters || 0}
                        delay={0}
                    />
                    <KPICard
                        icon={Globe}
                        label="Countries Affected"
                        value={kpis.countries_affected || 0}
                        delay={0.1}
                    />
                    <KPICard
                        icon={Target}
                        label="Avg Damage Rate"
                        value={kpis.avg_damage_rate || 0}
                        suffix="%"
                        delay={0.2}
                    />
                    <KPICard
                        icon={Image}
                        label="Images Analyzed"
                        value={kpis.total_images || 0}
                        delay={0.3}
                    />
                </div>

                {/* KPI Cards - Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <KPICard
                        icon={Building}
                        label="Buildings Analyzed"
                        value={kpis.total_buildings || 0}
                        delay={0.4}
                    />
                    <KPICard
                        icon={Users}
                        label="Total Casualties"
                        value={kpis.total_casualties || 0}
                        delay={0.5}
                    />
                    <KPICard
                        icon={MapPin}
                        label="People Displaced"
                        value={kpis.total_displaced || 0}
                        delay={0.6}
                    />
                    <KPICard
                        icon={DollarSign}
                        label="Economic Loss"
                        value={`$${kpis.total_economic_loss || 0}B`}
                        delay={0.7}
                    />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Type Distribution */}
                    <motion.div
                        className="glass-dark rounded-2xl p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <TypeDistributionChart
                            data={typeDistribution}
                            title="Disaster Type Distribution"
                        />
                    </motion.div>

                    {/* Geographic Distribution */}
                    <motion.div
                        className="glass-dark rounded-2xl p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
                        <div className="space-y-3">
                            {Object.entries(geographicDistribution.by_continent || {}).map(([continent, data], idx) => (
                                <div key={continent} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span>{continent}</span>
                                        <span className="text-slate-400">{data.count} ({data.percentage}%)</span>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${data.percentage}%` }}
                                            transition={{ duration: 1, delay: 0.3 + idx * 0.1 }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Timeline Chart */}
                <motion.div
                    className="glass-dark rounded-2xl p-6 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <TimelineChart
                        data={temporalTrends}
                        title="Temporal Trends (2016-2019)"
                    />
                </motion.div>

                {/* Events Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <EventsTable events={events} />
                </motion.div>
            </div>
        </div>
    );
}
