import { createClient } from "@/lib/supabase/server";
import { FeedbackForm } from "./FeedbackForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function RatePage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: entry } = await supabase
        .from("feedback_entries")
        .select("*")
        .eq("rater_link_id", id)
        .single();

    if (!entry) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
                <Card className="max-w-md w-full bg-zinc-900 text-white border-zinc-800">
                    <CardHeader>
                        <CardTitle>Invalid Link</CardTitle>
                        <CardDescription className="text-zinc-400">This feedback link does not exist or has expired.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    if (entry.status === "submitted") {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
                <Card className="max-w-lg w-full bg-zinc-900 text-white border-zinc-800 text-center py-8">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold mb-2">Thank You.</CardTitle>
                        <CardDescription className="text-zinc-400 text-lg">
                            Your feedback has been sanitized and recorded.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-6">
                        <p className="text-zinc-300 mb-4">
                            As a thank you for your honesty, here is a 50% discount code to run your own Reputation Audit:
                        </p>
                        {entry.promo_code ? (
                            <div className="bg-black border border-zinc-700 p-4 rounded-lg inline-block">
                                <code className="text-2xl font-mono text-emerald-400">{entry.promo_code}</code>
                            </div>
                        ) : (
                            <div className="bg-black border border-zinc-700 p-4 rounded-lg inline-block">
                                <code className="text-xl font-mono text-zinc-500">No promo code available</code>
                            </div>
                        )}
                        <p className="text-xs text-zinc-500 mt-4">This code is unique to your email address.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 selection:bg-zinc-800">
            <FeedbackForm id={id} archetype={entry.archetype} />
        </div>
    );
}
