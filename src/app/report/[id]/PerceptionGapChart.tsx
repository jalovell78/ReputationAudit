"use client";

import {
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const DIMENSION_LABELS: Record<string, string> = {
    communication: "Communication",
    leadership: "Leadership",
    integrity: "Integrity",
    emotional_intelligence: "Emotional Intel.",
    reliability: "Reliability",
    innovation: "Innovation",
};

type GapData = Record<string, { self: number | null; raters: number | null }>;

interface PerceptionGapChartProps {
    perceptionGap: GapData;
}

export function PerceptionGapChart({ perceptionGap }: PerceptionGapChartProps) {
    const dimensions = Object.keys(perceptionGap);

    const hasSelfData = dimensions.some(d => perceptionGap[d].self !== null);
    const hasRaterData = dimensions.some(d => perceptionGap[d].raters !== null);

    if (!hasSelfData && !hasRaterData) return null;

    const chartData = dimensions.map(dim => ({
        dimension: DIMENSION_LABELS[dim] ?? dim,
        Self: perceptionGap[dim].self ?? undefined,
        Others: perceptionGap[dim].raters ?? undefined,
        gap: perceptionGap[dim].self !== null && perceptionGap[dim].raters !== null
            ? Math.abs((perceptionGap[dim].self ?? 0) - (perceptionGap[dim].raters ?? 0))
            : null,
    }));

    const maxGapDim = chartData.reduce(
        (max, d) => (d.gap !== null && (max.gap === null || d.gap > (max.gap ?? 0)) ? d : max),
        chartData[0]
    );

    return (
        <div className="mb-10">
            <div className="text-center mb-6 space-y-1">
                <h2 className="text-2xl font-black tracking-tight text-white">Perception Gap Analysis</h2>
                <p className="text-zinc-400 text-sm">
                    How you see yourself vs. how your raters see you, across 6 dimensions.
                </p>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <ResponsiveContainer width="100%" height={340}>
                    <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
                        <PolarGrid stroke="#3f3f46" />
                        <PolarAngleAxis
                            dataKey="dimension"
                            tick={{ fill: "#a1a1aa", fontSize: 12, fontWeight: 500 }}
                        />
                        <PolarRadiusAxis
                            angle={30}
                            domain={[0, 5]}
                            tick={{ fill: "#71717a", fontSize: 10 }}
                            tickCount={6}
                        />
                        {hasSelfData && (
                            <Radar
                                name="You (Self)"
                                dataKey="Self"
                                stroke="#818cf8"
                                fill="#818cf8"
                                fillOpacity={0.15}
                                strokeWidth={2}
                            />
                        )}
                        {hasRaterData && (
                            <Radar
                                name="Raters (Others)"
                                dataKey="Others"
                                stroke="#34d399"
                                fill="#34d399"
                                fillOpacity={0.15}
                                strokeWidth={2}
                            />
                        )}
                        <Tooltip
                            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px" }}
                            labelStyle={{ color: "#f4f4f5", fontWeight: "bold" }}
                            itemStyle={{ color: "#a1a1aa" }}
                            formatter={(value: any, name: string) => [
                                value !== undefined ? `${value}/5` : "N/A",
                                name,
                            ]}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: "12px", color: "#a1a1aa", paddingTop: "16px" }}
                        />
                    </RadarChart>
                </ResponsiveContainer>

                {/* Gap insight cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                    {chartData.map(d => (
                        <div key={d.dimension} className="bg-zinc-950/60 rounded-xl p-3 border border-zinc-800/60">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{d.dimension}</p>
                            <div className="flex gap-3 text-sm">
                                <span className="text-indigo-400 font-semibold">
                                    You: {d.Self !== undefined ? `${d.Self}/5` : "—"}
                                </span>
                                <span className="text-emerald-400 font-semibold">
                                    Others: {d.Others !== undefined ? `${d.Others}/5` : "—"}
                                </span>
                            </div>
                            {d.gap !== null && d.gap > 0.5 && (
                                <p className="text-xs text-amber-400 mt-1">
                                    {d.gap.toFixed(1)} point gap ↗
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {maxGapDim?.gap !== null && (maxGapDim?.gap ?? 0) > 0 && (
                    <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-300">
                        <strong>Biggest gap:</strong> {maxGapDim.dimension} ({maxGapDim.gap?.toFixed(1)} point difference between self and rater perception)
                    </div>
                )}
            </div>
        </div>
    );
}
