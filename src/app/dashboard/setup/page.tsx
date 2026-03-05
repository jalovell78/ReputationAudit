import { SetupWizard } from "./SetupWizard";

export default function SetupPage() {
    return (
        <div className="min-h-screen bg-zinc-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black p-4 py-8 md:p-12">
            <SetupWizard />
        </div>
    );
}
