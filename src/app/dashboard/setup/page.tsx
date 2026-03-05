import { SetupWizard } from "./SetupWizard";

export default function SetupPage() {
    return (
        <div className="min-h-screen bg-zinc-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black p-4 py-12 md:p-12">
            <div className="max-w-4xl mx-auto mb-8">
                <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Configure Audit</h1>
                <p className="text-zinc-400">Step 1 of 2: Define your roster.</p>
            </div>
            <SetupWizard />
        </div>
    );
}
