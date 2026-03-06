"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface GenerateReportButtonProps {
    auditId: string;
}

export function GenerateReportButton({ auditId }: GenerateReportButtonProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleConfirm = () => {
        setOpen(false);
        router.push(`/report/${auditId}`);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-emerald-500 text-black hover:bg-emerald-400 font-bold border-none">
                    View Final Report
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <LockIcon className="w-5 h-5 text-amber-500" />
                        Ready to view your Radical Truth?
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Generating this report will explicitly finalize the AI analysis and <strong className="text-zinc-200">permanently lock your current hypothesis</strong>. If you'd like to update your predictions on what your raters said, do that now.
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
                        onClick={handleConfirm}
                        className="bg-emerald-500 text-black hover:bg-emerald-400 font-semibold w-full sm:w-auto"
                    >
                        Lock Hypothesis & View Report
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
