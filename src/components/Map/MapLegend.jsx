/**
 * Map Legend Component
 * Shows color key for disaster types and severity levels
 */

export default function MapLegend() {
    const disasterTypes = [
        { type: 'Hurricane', color: '#8b5cf6' },
        { type: 'Fire', color: '#ef4444' },
        { type: 'Flood', color: '#3b82f6' },
        { type: 'Earthquake', color: '#78350f' }
    ];

    const severityLevels = [
        { level: 'Low', size: 20 },
        { level: 'Medium', size: 25 },
        { level: 'High', size: 30 },
        { level: 'Critical', size: 35 }
    ];

    return (
        <div className="absolute bottom-4 right-4 z-[1000] bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-lg p-4 text-white text-sm">
            <h4 className="font-semibold mb-3">Legend</h4>

            {/* Disaster Types */}
            <div className="mb-4">
                <div className="text-xs text-slate-400 mb-2">Disaster Type</div>
                <div className="space-y-2">
                    {disasterTypes.map(({ type, color }) => (
                        <div key={type} className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded-full border-2 border-white"
                                style={{ backgroundColor: color }}
                            />
                            <span className="text-xs">{type}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Severity Levels */}
            <div>
                <div className="text-xs text-slate-400 mb-2">Severity</div>
                <div className="space-y-2">
                    {severityLevels.map(({ level, size }) => (
                        <div key={level} className="flex items-center gap-2">
                            <div
                                className="rounded-full bg-slate-600 border-2 border-white"
                                style={{ width: `${size / 2}px`, height: `${size / 2}px` }}
                            />
                            <span className="text-xs">{level}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
