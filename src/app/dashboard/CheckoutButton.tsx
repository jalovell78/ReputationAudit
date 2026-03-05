"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CheckoutButton({ auditId }: { auditId: string }) {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
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
        <Button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-white text-black hover:bg-zinc-200 font-bold shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all hover:scale-[1.01]"
        >
            {loading ? "Preparing Report..." : "Unlock Your Report ($49)"}
        </Button>
    );
}
