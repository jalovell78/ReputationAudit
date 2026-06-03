"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { getGoalConfig, SCALING_LABELS } from "@/lib/tenant";

export function FeedbackForm({
    id,
    archetype,
    subjectName,
    goalType,
    tenant,
}: {
    id: string;
    archetype: string;
    subjectName: string;
    goalType: string | null;
    tenant: 'repstanding' | 'perception_mirror';
}) {
    const isMirror = tenant === 'perception_mirror';
    const categories = getGoalConfig(goalType);
    const totalSteps = categories.length; // Steps 0 to totalSteps-1 for categories, totalSteps for review

    const [currentStep, setCurrentStep] = useState(0);
    const [scores, setScores] = useState<Record<string, number>>({});
    const [tags, setTags] = useState<Record<string, string[]>>({});
    const [seeds, setSeeds] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Enforce the tenant-specific styles on the document root
        document.documentElement.setAttribute("data-tenant", tenant);
        if (tenant === "perception_mirror") {
            document.documentElement.classList.remove("dark");
        } else {
            document.documentElement.classList.add("dark");
        }
    }, [tenant]);

    const handleScoreSelect = (categoryName: string, score: number) => {
        setScores(prev => ({ ...prev, [categoryName]: score }));
    };

    const handleTagToggle = (categoryName: string, tag: string) => {
        setTags(prev => {
            const currentTags = prev[categoryName] || [];
            const updatedTags = currentTags.includes(tag)
                ? currentTags.filter(t => t !== tag)
                : [...currentTags, tag];
            return { ...prev, [categoryName]: updatedTags };
        });
    };

    const handleSeedChange = (categoryName: string, text: string) => {
        setSeeds(prev => ({ ...prev, [categoryName]: text }));
    };

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const responsesPayload = categories.map(cat => ({
            category_name: cat.categoryName,
            quantitative_score: scores[cat.categoryName] || 0,
            selected_tags: tags[cat.categoryName] || [],
            optional_text_seed: seeds[cat.categoryName] || "",
        }));

        try {
            const res = await fetch("/api/submit-feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, responses: responsesPayload }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to submit feedback");
            }

            router.refresh(); // Refresh the page to trigger Thank You view
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fontHeaderClass = isMirror ? "font-serif" : "font-sans";
    const brandTerm = isMirror ? "Reflection Partner" : "Rater";

    // 1. RENDER SUMMARY / CONFIRMATION STEP
    if (currentStep === totalSteps) {
        return (
            <Card className="w-full max-w-lg mx-auto mt-6 bg-card text-card-foreground border-border shadow-2xl backdrop-blur-md">
                <CardHeader className="space-y-3">
                    <CardTitle className={`text-2xl text-foreground ${fontHeaderClass}`}>
                        Review Your {isMirror ? "Reflections" : "Feedback"}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Please review your ratings and selected tags for <span className="capitalize font-semibold">{subjectName}</span> before submitting anonymously.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                        {categories.map((cat) => {
                            const score = scores[cat.categoryName];
                            const selectedTags = tags[cat.categoryName] || [];
                            const seed = seeds[cat.categoryName];

                            return (
                                <div key={cat.categoryName} className="p-4 rounded-lg bg-secondary/50 border border-border/50 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-foreground text-sm">{cat.categoryName}</h4>
                                        <span className="text-xs bg-primary text-primary-foreground font-bold px-2.5 py-0.5 rounded-full">
                                            Score: {score}/5
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        <strong>Attributes:</strong> {selectedTags.length > 0 ? selectedTags.join(', ') : 'None'}
                                    </p>
                                    {seed && (
                                        <p className="text-xs text-muted-foreground italic border-l-2 border-border/80 pl-2 mt-1">
                                            "{seed}"
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-center font-medium text-primary bg-primary/10 py-2.5 rounded-md border border-primary/20 text-sm">
                        Your identity remains strictly masked and anonymous.
                    </div>

                    {error && <p className="text-destructive text-sm mt-3">{error}</p>}
                </CardContent>
                <CardFooter className="flex justify-between gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        className="rounded-full gap-1"
                        disabled={loading}
                    >
                        <ChevronLeft className="w-4 h-4" /> Edit
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        className="flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold gap-2"
                        disabled={loading}
                    >
                        {loading ? (isMirror ? "Sanitizing Reflections..." : "Sanitizing Feedback...") : `Submit Anonymous ${isMirror ? "Reflections" : "Feedback"}`}
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    // 2. RENDER SURVEY STEP FOR A CATEGORY
    const category = categories[currentStep];
    const score = scores[category.categoryName] || 0;
    const selectedTags = tags[category.categoryName] || [];
    const seedText = seeds[category.categoryName] || "";

    // Dynamic Context Placeholder logic
    const dynamicPlaceholder = selectedTags.length > 0
        ? `Optional: Can you share a quick, real-world example of when they showed ${selectedTags.map(t => t.toLowerCase()).join(', ')}?`
        : `Optional: ${category.placeholderText}`;

    return (
        <Card className="w-full max-w-lg mx-auto mt-6 bg-card text-card-foreground border-border shadow-2xl backdrop-blur-md">
            <CardHeader className="space-y-2">
                <div className="flex justify-between items-center text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    <span>Evaluating {subjectName} as {archetype}</span>
                    <span>Step {currentStep + 1} of {totalSteps}</span>
                </div>
                <CardTitle className={`text-2xl text-foreground ${fontHeaderClass}`}>
                    {category.categoryName}
                </CardTitle>
                <CardDescription className="text-muted-foreground leading-relaxed text-sm">
                    {category.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Step 1: Connected Segmented Blocks */}
                <div className="space-y-3">
                    <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        1. Quantitative Scalar Rating
                    </label>
                    <div className="flex flex-col divide-y sm:flex-row sm:divide-x sm:divide-y-0 border border-border rounded-lg overflow-hidden bg-card w-full mt-1">
                        {[1, 2, 3, 4, 5].map((val) => {
                            const isActive = score === val;
                            const label = SCALING_LABELS[tenant][val];
                            return (
                                <button
                                    key={val}
                                    type="button"
                                    onClick={() => handleScoreSelect(category.categoryName, val)}
                                    className={`flex-1 py-3.5 px-2 flex flex-col items-center justify-center transition-all cursor-pointer text-center select-none focus:outline-none ${isActive
                                        ? "bg-primary text-primary-foreground font-semibold"
                                        : "bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                        }`}
                                >
                                    <span className="text-sm sm:text-base font-bold">{val}</span>
                                    <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-tight opacity-90 mt-0.5 whitespace-nowrap">
                                        {label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Step 2: Trait Tag Cloud */}
                <div className="space-y-3">
                    <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        2. Key Attributes & Behavioral Markers
                    </label>
                    <div className="flex flex-wrap gap-2 pt-1">
                        {category.tagBank.map((tag) => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => handleTagToggle(category.categoryName, tag)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${isSelected
                                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                        : "bg-secondary text-secondary-foreground border-border hover:bg-secondary/80 hover:border-primary/30"
                                        }`}
                                >
                                    {tag}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Step 3: Contextual Seed Box */}
                <div className="space-y-3">
                    <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        3. Real-World Context & Evidence
                    </label>
                    <Textarea
                        placeholder={dynamicPlaceholder}
                        value={seedText}
                        onChange={(e) => handleSeedChange(category.categoryName, e.target.value)}
                        className="min-h-[100px] bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring rounded-lg text-sm transition-all leading-relaxed"
                    />
                </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-4 pt-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="rounded-full gap-1"
                    disabled={currentStep === 0}
                >
                    <ChevronLeft className="w-4 h-4" /> Back
                </Button>
                <Button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold gap-1"
                    disabled={score === 0} // Enforce score selection before moving forward
                >
                    {currentStep === totalSteps - 1 ? "Review Reflections" : "Next Category"} <ChevronRight className="w-4 h-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
