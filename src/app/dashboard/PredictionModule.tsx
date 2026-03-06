"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface PredictionModuleProps {
    auditId: string;
    initialText?: string | null;
    isLocked?: boolean;
}

export function PredictionModule({ auditId, initialText, isLocked = false }: PredictionModuleProps) {
    const [text, setText] = useState(initialText || "");
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        setSaved(false);
        try {
            const res = await fetch(`/api/audits/${auditId}/prediction`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prediction: text }),
            });
            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } else {
                const errText = await res.text();
                console.error("Failed to save prediction. Server says:", errText);
            }
        } catch (e) {
            console.error("Error saving prediction:", e);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="mt-6 rounded-md bg-zinc-950/50 border border-zinc-800 p-4">
            <h4 className="text-sm font-semibold text-zinc-200 mb-1 flex items-center gap-2">
                While you wait: Formulate your hypothesis
            </h4>
            <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
                {isLocked
                    ? "Your hypothesis has been locked because a report was generated."
                    : "What is the #1 strength you think this group will highlight? What is your biggest insecurity or the main criticism you expect? (This helps our AI identify your Blindspots and Phantom Insecurities)."
                }
            </p>
            <div className="space-y-3">
                <Textarea
                    placeholder="I think they will say I am highly strategic, but I worry my direct reports feel I don't give enough tactical direction..."
                    value={text}
                    onChange={(e) => {
                        if (!isLocked) setText(e.target.value);
                    }}
                    disabled={isLocked}
                    className="bg-black/40 border-zinc-800 text-sm h-28 resize-none focus-visible:ring-emerald-500/30 disabled:opacity-75 disabled:cursor-not-allowed"
                />
                <div className="flex justify-end items-center gap-3">
                    {saved && <span className="text-xs text-emerald-400">Saved successfully.</span>}
                    <Button
                        size="sm"
                        variant="secondary"
                        className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border-none disabled:opacity-50"
                        onClick={handleSave}
                        disabled={isSaving || text === initialText || isLocked}
                    >
                        {isLocked ? "Hypothesis Locked" : isSaving ? "Saving..." : "Save Hypothesis"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
