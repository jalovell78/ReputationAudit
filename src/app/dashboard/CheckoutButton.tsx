"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LockIcon } from "lucide-react";

export function CheckoutButton({ auditId }: { auditId: string }) {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleCheckout = async () => {
        setOpen(false); // Close the modal
        setLoading(true);
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ auditId }),
            });

            const data = await res.json();

            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                console.error("Checkout API failed:", data.error);
                alert(data.error || "Failed to initialize checkout.");
            }
        } catch (err: any) {
            console.error(err);
            alert("A network error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    disabled={loading}
                    className="w-full bg-white text-black hover:bg-zinc-200 font-bold shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all hover:scale-[1.01]"
                >
                    {loading ? "Preparing Checkout..." : "Unlock Your Report ($49)"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <LockIcon className="w-5 h-5 text-amber-500" />
                        Ready to view your Radical Truth?
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Proceeding to checkout will explicitly finalize the AI analysis and <strong className="text-zinc-200">permanently lock your current hypothesis</strong>. If you'd like to update your predictions on what your raters said, do that now.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-between flex-col-reverse sm:flex-row gap-2 mt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setOpen(false)}
                        className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white w-full sm:w-auto"
                    >
                        Wait, let me edit
                    </Button>
                    <Button
                        type="button"
                        onClick={handleCheckout}
                        disabled={loading}
                        className="bg-white text-black hover:bg-zinc-200 font-bold w-full sm:w-auto"
                    >
                        Lock Hypothesis & Checkout
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
