
"use client";

import { useState, useEffect } from "react";
import { generateQuote, answerQuestion, type GenerateQuoteOutput } from "@/ai/flows/generate-quote";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Wand2, MessageCircle, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const translations = {
    ti: {
        generateNew: "ሓዱሽ ጥቕሲ ፍጠር",
        askQuestion: "ሕቶ ሕተት",
        asking: "ይሓትት ኣሎ...",
        generating: "ይፈጥር ኣሎ...",
        questionPlaceholder: "ሕቶኻ ኣብዚ ጸሓፍ...",
        errorTitle: "ጌጋ ኣጋጢሙ",
        quoteError: "ጥቕሲ ክንፈጥር ኣይከኣልናን።",
        answerError: "መልሲ ክንረክብ ኣይከኣልናን።",
        copied: "ተቐዲሑ!",
        copiedDescription: "እቲ ጥቕሲ ኣብ መዝገብ ተቐዲሑ ኣሎ።",

    },
    en: {
        generateNew: "New Quote",
        askQuestion: "Ask Question",
        asking: "Asking...",
        generating: "Generating...",
        questionPlaceholder: "Type your question here...",
        errorTitle: "Error",
        quoteError: "Failed to generate a quote.",
        answerError: "Failed to get an answer.",
        copied: "Copied!",
        copiedDescription: "Quote copied to clipboard.",
    },
    ar: {
        generateNew: "اقتباس جديد",
        askQuestion: "اطرح سؤالاً",
        asking: "يسأل...",
        generating: "جاري الإنشاء...",
        questionPlaceholder: "اكتب سؤالك هنا...",
        errorTitle: "خطأ",
        quoteError: "فشل إنشاء الاقتباس.",
        answerError: "فشل الحصول على إجابة.",
        copied: "تم النسخ!",
        copiedDescription: "تم نسخ الاقتباس إلى الحافظة.",
    }
}

export default function DailyQuote({ language = 'ti' }: { language?: 'ti' | 'en' | 'ar' }) {
    const [quoteData, setQuoteData] = useState<GenerateQuoteOutput | null>(null);
    const [isLoadingQuote, setIsLoadingQuote] = useState(true);
    const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);
    const [showQuestion, setShowQuestion] = useState(false);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState<string | null>(null);
    const { toast } = useToast();
    const t = translations[language];
    
    const getLangKey = () => {
        switch (language) {
            case 'ti': return 'Tigrinya';
            case 'ar': return 'Arabic';
            default: return 'English';
        }
    }

    const fetchQuote = async () => {
        setIsLoadingQuote(true);
        setAnswer(null);
        setQuoteData(null);
        try {
            const result = await generateQuote({ language: getLangKey() });
            setQuoteData(result);
        } catch (error) {
            console.error("AI Error:", error);
            toast({ variant: "destructive", title: t.errorTitle, description: t.quoteError });
        } finally {
            setIsLoadingQuote(false);
        }
    };

    const handleAskQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question) return;
        setIsLoadingAnswer(true);
        setAnswer(null);
        try {
            const result = await answerQuestion({ language: getLangKey(), question });
            setAnswer(result.answer);
        } catch (error) {
            console.error("AI Error:", error);
            toast({ variant: "destructive", title: t.errorTitle, description: t.answerError });
        } finally {
            setIsLoadingAnswer(false);
            setQuestion("");
        }
    };

    useEffect(() => {
        fetchQuote();
    }, [language]);

    const handleShare = () => {
        if (quoteData) {
            const text = `"${quoteData.quote}" - መምህረይ`;
            if (navigator.share) {
                navigator.share({ title: 'Quote from መምህረይ', text })
                    .catch(err => console.error("Share failed", err));
            } else {
                navigator.clipboard.writeText(text);
                toast({ title: t.copied, description: t.copiedDescription });
            }
        }
    };

    return (
        <Card className="w-full shadow-lg border-primary/20 bg-gradient-to-br from-card to-background">
            <CardContent className="p-6 space-y-6">
                {isLoadingQuote ? (
                    <div className="space-y-4 animate-fade-in-fast">
                        <Skeleton className="h-8 w-3/4 mx-auto" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6 mx-auto" />
                    </div>
                ) : quoteData ? (
                    <div className="text-center space-y-4 animate-fade-in">
                        <blockquote className="text-2xl md:text-3xl font-headline text-primary italic">
                          "{quoteData.quote}"
                        </blockquote>
                        <p className="text-foreground/80 leading-relaxed">{quoteData.explanation}</p>
                    </div>
                ) : null}

                {answer && (
                    <div className="p-4 bg-muted rounded-lg text-center animate-fade-in border border-primary/20">
                        <p>{answer}</p>
                    </div>
                )}
                 {isLoadingAnswer && (
                    <div className="flex justify-center items-center p-4">
                       <Loader2 className="h-6 w-6 animate-spin text-primary"/>
                    </div>
                )}


                <div className="flex justify-center items-center gap-4 flex-wrap">
                    <Button onClick={fetchQuote} disabled={isLoadingQuote || isLoadingAnswer}>
                        {isLoadingQuote ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        {isLoadingQuote ? t.generating : t.generateNew}
                    </Button>
                    <Button variant="outline" onClick={() => setShowQuestion(!showQuestion)}>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        {t.askQuestion}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleShare} disabled={!quoteData}>
                        <Share2 className="h-4 w-4" />
                        <span className="sr-only">Share</span>
                    </Button>
                </div>

                {showQuestion && (
                    <form onSubmit={handleAskQuestion} className="flex gap-2 pt-4 animate-fade-in-fast">
                        <Input
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder={t.questionPlaceholder}
                            disabled={isLoadingAnswer}
                        />
                        <Button type="submit" disabled={isLoadingAnswer}>
                            {isLoadingAnswer ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isLoadingAnswer ? t.asking : t.askQuestion}
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}
