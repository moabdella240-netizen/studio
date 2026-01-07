"use client";

import { useState } from "react";
import { generateBrainTeasers, type GenerateBrainTeasersOutput } from "@/ai/flows/generate-brain-teasers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { BrainCircuit, Loader2, Footprints, Lightbulb, Repeat } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "../ui/separator";

const translations = {
    ti: {
        title: "ሕንቅልሕንቅሊተይን ናይ ህይወት ብልሃትን",
        description: "ኣእምሮኻ ፈትን፣ ሓድሽ ነገር ድማ ተምሃር።",
        generate: "ሓደስቲ ሕንቅልሕንቅሊተይ ፍጠር",
        loading: "ይስራሕ ኣሎ...",
        footballTitle: "ሕቶታት ብዛዕባ ኩዕሶ እግሪ",
        lifeTitle: "ናይ ህይወት ሕንቅልሕንቅሊተይ",
        lifehacksTitle: "ተግባራዊ ናይ ህይወት ብልሓት",
        showAnswer: "መልሲ ርአ",
        errorTitle: "ጌጋ ተፈጥሩ",
        errorMessage: "ሕንቅልሕንቅሊተይ ምፍጣር ኣይተኻእለን። በጃኻ ደጊምካ ፈትን።",
        initialMessage: "ሓድሽ ሕንቅልሕንቅሊተይን ናይ ህይወት ብልሓትን ንምርካብ 'ሓደስቲ ፍጠር' ዝብል ቁልፊ ጠውቕ።"
    },
    en: {
        title: "Brain Teasers & Lifehacks",
        description: "Challenge your mind and learn something new.",
        generate: "Generate New Teasers",
        loading: "Generating...",
        footballTitle: "Football Trick Questions",
        lifeTitle: "Life Trick Questions",
        lifehacksTitle: "Practical Lifehacks",
        showAnswer: "Show Answer",
        errorTitle: "Error",
        errorMessage: "Failed to generate teasers. Please try again.",
        initialMessage: "Press 'Generate' to get new brain teasers and lifehacks."
    }
}

export default function BrainTeasers({ language = 'ti' }: { language?: 'ti' | 'en' }) {
    const [content, setContent] = useState<GenerateBrainTeasersOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const t = translations[language];

    const handleGenerate = async () => {
        setIsLoading(true);
        setContent(null);
        try {
            const result = await generateBrainTeasers({ language: language === 'ti' ? 'Tigrinya' : 'English' });
            setContent(result);
        } catch (error) {
            console.error("AI Error:", error);
            toast({
                variant: "destructive",
                title: t.errorTitle,
                description: t.errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{t.title}</CardTitle>
                        <CardDescription>{t.description}</CardDescription>
                    </div>
                    <Button onClick={handleGenerate} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Repeat className="mr-2 h-4 w-4" />}
                        {isLoading ? t.loading : t.generate}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="min-h-[60vh] space-y-8">
                {isLoading ? (
                    <div className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                             <div key={i} className="space-y-4">
                                <Skeleton className="h-6 w-1/2" />
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-5 w-3/4" />
                            </div>
                        ))}
                    </div>
                ) : !content ? (
                     <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-12">
                        <BrainCircuit className="h-16 w-16 mb-4" />
                        <p>{t.initialMessage}</p>
                    </div>
                ) : (
                    <>
                        {content.footballTrickQuestions?.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-semibold flex items-center mb-4"><Footprints className="mr-3 h-6 w-6 text-primary"/>{t.footballTitle}</h2>
                                <Accordion type="single" collapsible className="w-full space-y-2">
                                    {content.footballTrickQuestions.map((item, index) => (
                                        <AccordionItem value={`football-${index}`} key={index} className="bg-card border rounded-lg px-4">
                                            <AccordionTrigger>{item.question}</AccordionTrigger>
                                            <AccordionContent>
                                                {item.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </section>
                        )}
                        
                        {content.lifeTrickQuestions?.length > 0 && (
                             <section>
                                <h2 className="text-2xl font-semibold flex items-center mb-4"><BrainCircuit className="mr-3 h-6 w-6 text-primary"/>{t.lifeTitle}</h2>
                                <Accordion type="single" collapsible className="w-full space-y-2">
                                    {content.lifeTrickQuestions.map((item, index) => (
                                        <AccordionItem value={`life-${index}`} key={index} className="bg-card border rounded-lg px-4">
                                            <AccordionTrigger>{item.question}</AccordionTrigger>
                                            <AccordionContent>
                                                 {item.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </section>
                        )}
                        
                        {content.lifehacks?.length > 0 && (
                           <section>
                                <h2 className="text-2xl font-semibold flex items-center mb-4"><Lightbulb className="mr-3 h-6 w-6 text-primary"/>{t.lifehacksTitle}</h2>
                                <div className="space-y-4">
                                    {content.lifehacks.map((item, index) => (
                                        <Card key={index} className="bg-card">
                                            <CardHeader>
                                                <CardTitle className="text-lg">{item.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground">{item.description}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
