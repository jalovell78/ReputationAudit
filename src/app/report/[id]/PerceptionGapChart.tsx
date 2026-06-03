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
    isMirror?: boolean;
}

export function PerceptionGapChart({ perceptionGap, isMirror = false }: PerceptionGapChartProps) {
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

    // Dynamic brand-aligned colors for the chart elements
    const selfStroke = isMirror ? "oklch(0.38 0.04 140)" : "#818cf8"; // Sage Green vs Indigo
    const selfFill = isMirror ? "oklch(0.38 0.04 140)" : "#818cf8";
    const othersStroke = isMirror ? "oklch(0.6 0.03 140)" : "#34d399";
    const othersFill = isMirror ? "oklch(0.6 0.03 140)" : "#34d399";
    
    // Semantic boundary grid/axis lines
    const gridColor = isMirror ? "oklch(0.88 0.02 140)" : "#3f3f46"; // Light border vs Zinc-700
    const labelColor = isMirror ? "oklch(0.22 0.02 140)" : "#a1a1aa"; // Deep charcoal vs Zinc-400
    const subLabelColor = isMirror ? "oklch(0.5 0.02 140)" : "#71717a"; // Muted text

    const tooltipBg = isMirror ? "oklch(0.99 0.005 85)" : "#18181b";
    const tooltipBorder = isMirror ? "oklch(0.88 0.02 140)" : "#3f3f46";
    const tooltipText = isMirror ? "oklch(0.22 0.02 140)" : "#f4f4f5";

    return (
        <div className="mb-10">
            <div className="text-center mb-6 space-y-1">
                <h2 className="text-2xl font-serif font-black tracking-tight text-foreground">
                    Perception Gap Analysis
                </h2>
                <p className="text-muted-foreground text-sm">
                    How you see yourself vs. how your {isMirror ? "reflection partners" : "raters"} see you, across 6 dimensions.
                </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                <ResponsiveContainer width="100%" height={340}>
                    <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
                        <PolarGrid stroke={gridColor} />
                        <PolarAngleAxis
                            dataKey="dimension"
                            tick={{ fill: labelColor, fontSize: 12, fontWeight: 500 }}
                        />
                        <PolarRadiusAxis
                            angle={30}
                            domain={[0, 5]}
                            tick={{ fill: subLabelColor, fontSize: 10 }}
                            tickCount={6}
                        />
                        {hasSelfData && (
                            <Radar
                                name={isMirror ? "You (Self)" : "You (Self)"}
                                dataKey="Self"
                                stroke={selfStroke}
                                fill={selfFill}
                                fillOpacity={0.15}
                                strokeWidth={2}
                            />
                        )}
                        {hasRaterData && (
                            <Radar
                                name={isMirror ? "Partners (Others)" : "Raters (Others)"}
                                dataKey="Others"
                                stroke={othersStroke}
                                fill={othersFill}
                                fillOpacity={0.15}
                                strokeWidth={2}
                            />
                        )}
                        <Tooltip
                            contentStyle={{ 
                                backgroundColor: tooltipBg, 
                                border: `1px solid ${tooltipBorder}`, 
                                borderRadius: "8px" 
                            }}
                            labelStyle={{ color: tooltipText, fontWeight: "bold" }}
                            itemStyle={{ color: labelColor }}
                            formatter={(value: any, name: string | undefined) => [
                                value !== undefined ? `${value}/5` : "N/A",
                                name ?? "",
                            ]}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: "12px", color: labelColor, paddingTop: "16px" }}
                        />
                    </RadarChart>
                </ResponsiveContainer>

                {/* Gap insight cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                    {chartData.map(d => (
                        <div key={d.dimension} className="bg-secondary/40 rounded-xl p-3 border border-border/50">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{d.dimension}</p>
                            <div className="flex gap-3 text-sm">
                                <span className="text-primary font-semibold">
                                    You: {d.Self !== undefined ? `${d.Self}/5` : "—"}
                                </span>
                                <span className="text-emerald-500 font-semibold" style={{ color: othersStroke }}>
                                    Others: {d.Others !== undefined ? `${d.Others}/5` : "—"}
                                </span>
                            </div>
                            {d.gap !== null && d.gap > 0.5 && (
                                <p className="text-xs text-amber-500 font-medium mt-1">
                                    {d.gap.toFixed(1)} point gap ↗
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {maxGapDim?.gap !== null && (maxGapDim?.gap ?? 0) > 0 && (
                    <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-600 dark:text-amber-300">
                        <strong>Biggest gap:</strong> {maxGapDim.dimension} ({maxGapDim.gap?.toFixed(1)} point difference between self and {isMirror ? "partner" : "rater"} perception)
                    </div>
                )}
            </div>
        </div>
    );
}
