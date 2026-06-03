import { createClient } from "@/lib/supabase/server";
import { FeedbackForm } from "./FeedbackForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTenantFromHeaders } from "@/lib/tenant-server";
import { getTenantConfig } from "@/lib/tenant";

const GOAL_TENANT_MAP: Record<string, 'repstanding' | 'perception_mirror'> = {
    career_progression: 'repstanding',
    leadership_mastery: 'repstanding',
    personal_growth: 'perception_mirror',
    social_intelligence: 'perception_mirror',
};

export default async function RatePage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: entry } = await supabase
        .from("feedback_entries")
        .select(`
            *,
            audits (
                goal_type,
                profiles (
                    full_name
                )
            )
        `)
        .eq("rater_link_id", id)
        .single();

    const headerTenant = await getTenantFromHeaders();

    if (!entry) {
        const isMirror = headerTenant === 'perception_mirror';
        const cardTitleClass = isMirror ? "text-2xl font-serif font-semibold" : "text-2xl font-sans font-bold";
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="max-w-md w-full bg-card text-card-foreground border-border shadow-xl">
                    <CardHeader>
                        <CardTitle className={cardTitleClass}>Invalid Link</CardTitle>
                        <CardDescription className="text-muted-foreground">This feedback link does not exist or has expired.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    const audit = entry.audits as any;
    const subjectName = audit?.profiles?.full_name || "the subject";
    const goalType = audit?.goal_type || null;

    // Resolve tenant based on parent audit goal_type, fallback to header tenant
    const tenant = (goalType && GOAL_TENANT_MAP[goalType]) || headerTenant;
    const config = getTenantConfig(tenant);
    const isMirror = tenant === 'perception_mirror';

    const fontHeaderClass = isMirror ? "font-serif" : "font-sans";
    const brandTerm = config.vocabulary.raterTerm; // e.g. "Reflection Partner" or "Rater"

    if (entry.status === "submitted") {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="max-w-lg w-full bg-card text-card-foreground border-border text-center py-8 shadow-xl">
                    <CardHeader>
                        <CardTitle className={`text-3xl font-bold mb-2 ${fontHeaderClass}`}>Thank You.</CardTitle>
                        <CardDescription className="text-muted-foreground text-lg">
                            Your feedback has been sanitized and recorded.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-6">
                        <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                            As a thank you for your honesty, here is a 50% discount code to run your own {isMirror ? "Perception Mirror" : "Reputation Audit"}:
                        </p>
                        {entry.promo_code ? (
                            <div className="bg-secondary border border-border p-4 rounded-lg inline-block">
                                <code className="text-2xl font-mono text-primary font-bold">{entry.promo_code}</code>
                            </div>
                        ) : (
                            <div className="bg-secondary border border-border p-4 rounded-lg inline-block">
                                <code className="text-xl font-mono text-muted-foreground">No promo code available</code>
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-4">This code is unique to your email address.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 selection:bg-primary/20">
            <FeedbackForm
                id={id}
                archetype={entry.archetype}
                subjectName={subjectName}
                goalType={goalType}
                tenant={tenant}
            />
        </div>
    );
}
