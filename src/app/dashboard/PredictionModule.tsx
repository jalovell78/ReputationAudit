"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTenant } from "@/components/tenant-context";

interface PredictionModuleProps {
    auditId: string;
    initialText?: string | null;
    isLocked?: boolean;
}

export function PredictionModule({ auditId, initialText, isLocked = false }: PredictionModuleProps) {
    const [text, setText] = useState(initialText || "");
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const { tenant } = useTenant();
    const isMirror = tenant === 'perception_mirror';

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
        <div className="mt-6 rounded-md bg-secondary/30 border border-border p-4 transition-colors duration-300">
            <h4 className="text-sm font-serif font-semibold text-foreground mb-1 flex items-center gap-2">
                {isMirror ? "While you wait: Note your self-reflection" : "While you wait: Formulate your hypothesis"}
            </h4>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                {isLocked
                    ? (isMirror ? "Your reflection has been locked because a report was generated." : "Your hypothesis has been locked because a report was generated.")
                    : (isMirror 
                        ? "What is the #1 strength you think your inner circle will highlight? What is your greatest vulnerability or the shadow behavior you expect? (This helps our AI identify your Blindspots and Hidden Shadows)."
                        : "What is the #1 strength you think this group will highlight? What is your biggest insecurity or the main criticism you expect? (This helps our AI identify your Blindspots and Phantom Insecurities).")
                }
            </p>
            <div className="space-y-3">
                <Textarea
                    placeholder={isMirror 
                        ? "I think they will feel I am deeply empathetic, but I worry my family feels I don't set strong boundaries..."
                        : "I think they will say I am highly strategic, but I worry my direct reports feel I don't give enough tactical direction..."
                    }
                    value={text}
                    onChange={(e) => {
                        if (!isLocked) setText(e.target.value);
                    }}
                    disabled={isLocked}
                    className="bg-background border-input text-foreground text-sm h-28 resize-none focus-visible:ring-primary/30 disabled:opacity-75 disabled:cursor-not-allowed"
                />
                <div className="flex justify-end items-center gap-3">
                    {saved && <span className="text-xs text-emerald-650 dark:text-emerald-400">Saved successfully.</span>}
                    <Button
                        size="sm"
                        variant="secondary"
                        className="font-bold border border-border disabled:opacity-50 cursor-pointer"
                        onClick={handleSave}
                        disabled={isSaving || text === initialText || isLocked}
                    >
                        {isLocked 
                            ? (isMirror ? "Reflection Locked" : "Hypothesis Locked") 
                            : isSaving 
                                ? "Saving..." 
                                : (isMirror ? "Save Reflection" : "Save Hypothesis")}
                    </Button>
                </div>
            </div>
        </div>
    );
}

