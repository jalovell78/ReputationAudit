import { SetupWizard } from "./SetupWizard";

export default function SetupPage() {
    return (
        <div className="min-h-screen bg-background text-foreground p-4 py-8 md:p-12 transition-colors duration-300">
            <SetupWizard />
        </div>
    );
}

