"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon, MailIcon, CheckIcon } from "lucide-react";
import { getRaterEmailTemplate } from "@/lib/emailTemplates";
import { getArchetypeLabel } from "@/lib/tenant";
import { useTenant } from "@/components/tenant-context";

export function DispatchHubList({ entries, goalType, userName }: { entries: any[], goalType?: string, userName?: string }) {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const { tenant } = useTenant();
    const isMirror = tenant === 'perception_mirror';

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleCopy = async (id: string, url: string) => {
        await navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getMailtoLink = (entry: any, url: string) => {
        const template = getRaterEmailTemplate(
            goalType,
            entry.archetype_group || entry.archetype,
            entry.rater_name,
            url,
            userName
        );

        const subject = encodeURIComponent(template.subject);
        const body = encodeURIComponent(template.body);
        return `mailto:${entry.rater_email}?subject=${subject}&body=${body}`;
    };

    return (
        <div className="space-y-6">
            {entries.map((entry) => {
                // Use a stable base URL for SSR to prevent hydration mismatch
                const baseUrl = mounted && typeof window !== 'undefined'
                    ? window.location.origin
                    : 'https://reputation-audit.vercel.app';

                const shareUrl = `${baseUrl}/rate/${entry.rater_link_id}`;

                return (
                    <div key={entry.id} className="p-5 rounded-lg bg-card border border-border flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                            <div>
                                <h3 className="font-serif font-semibold text-foreground">{getArchetypeLabel(entry.archetype)}</h3>
                                <p className="text-sm text-muted-foreground">{entry.rater_name} ({entry.rater_email})</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge status={entry.status} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                                {isMirror ? "Unique Anonymous Link" : "Unique Anonymous Link"}
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    readOnly
                                    value={shareUrl}
                                    className="bg-secondary border-input text-foreground font-mono text-xs focus-visible:ring-0"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="shrink-0 border-input hover:bg-secondary hover:text-foreground cursor-pointer"
                                    onClick={() => handleCopy(entry.id, shareUrl)}
                                >
                                    {copiedId === entry.id ? <CheckIcon className="w-4 h-4 text-emerald-500" /> : <CopyIcon className="w-4 h-4 text-muted-foreground" />}
                                </Button>
                                <Button
                                    variant="default"
                                    className="shrink-0 font-bold rounded-full cursor-pointer"
                                    asChild
                                >
                                    <a href={getMailtoLink(entry, shareUrl)}>
                                        <MailIcon className="w-4 h-4 mr-2" />
                                        Mail
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function Badge({ status }: { status: string }) {
    if (status === 'submitted') {
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Submitted</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground border border-border">Waiting for reply</span>;
}

