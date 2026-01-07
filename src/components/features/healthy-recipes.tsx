
"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { generateRecipe, type GenerateRecipeInput, type GenerateRecipeOutput } from "@/ai/flows/generate-recipe";
import { generateImageFromPrompt } from "@/ai/flows/generate-image-from-prompt";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ChefHat, Loader2, Sparkles, Soup } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const translations = {
    ti: {
        title: "ጥዕና ዝሰመዖም መግቢታት",
        description: "ብልሕን ገንቢን ዝኾኑ መግቢታት ብምድላው፡ መዓልታዊ ምግባኻ ኣመሓይሽ።",
        explore: "መግቢታት ድለ",
        random: "ዘይተመርጸ መግቢ",
        generate: "መግቢ ፍጠር",
        generating: "ይስራሕ ኣሎ...",
        cuisine: "ዓይነት መግቢ",
        diet: "ዓይነት ኣመጋግባ",
        difficulty: "ጽፍሒ ምድላው",
        maxTime: "ዝለዓለ ግዜ (ደቓይቕ)",
        errorTitle: "ጌጋ ኣጋጢሙ",
        errorMessage: "መግቢ ክንፈጥር ኣይከኣልናን። በጃኻ ደጊምካ ፈትን።",
        initialMessage: "ዝተመርጸ መግቢ ኣብዚ ክርአ እዩ።",
        ingredients: "ግብኣታት",
        instructions: "ኣሰራርሓ",
        nutrition: "ኣመጋግባዊ ትሕዝቶ",
        calories: "ካሎሪ",
        protein: "ፕሮቲን",
        carbs: "ካርቦሃይድሬት",
        fat: "ስብሒ",
    },
    en: {
        title: "Healthy & Delicious Recipes",
        description: "Eat better every day with smart, nutritious, and easy-to-cook recipes.",
        explore: "Explore Recipes",
        random: "Random Recipe",
        generate: "Generate Recipe",
        generating: "Generating...",
        cuisine: "Cuisine",
        diet: "Diet",
        difficulty: "Difficulty",
        maxTime: "Max Time (mins)",
        errorTitle: "Error",
        errorMessage: "Failed to generate recipe. Please try again.",
        initialMessage: "Your delicious recipe will appear here.",
        ingredients: "Ingredients",
        instructions: "Instructions",
        nutrition: "Nutrition Facts",
        calories: "Calories",
        protein: "Protein",
        carbs: "Carbs",
        fat: "Fat",
    },
};

const GenerateRecipeInputSchema = z.object({
  diet: z.string().optional(),
  cuisine: z.string().optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
  maxTime: z.number().optional(),
});


export default function HealthyRecipes({ language = 'ti' }: { language?: 'ti' | 'en' }) {
    const [recipe, setRecipe] = useState<GenerateRecipeOutput | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const t = translations[language];

    const form = useForm<GenerateRecipeInput>({
        resolver: zodResolver(GenerateRecipeInputSchema),
        defaultValues: {
            cuisine: "",
            diet: "",
            difficulty: undefined,
            maxTime: undefined,
        },
    });

    const handleGenerate = async (values: GenerateRecipeInput) => {
        setIsLoading(true);
        setRecipe(null);
        setImageUrl(null);
        try {
            const recipeResult = await generateRecipe(values);
            setRecipe(recipeResult);

            if (recipeResult.imagePrompt) {
                const imageResult = await generateImageFromPrompt({ prompt: recipeResult.imagePrompt });
                setImageUrl(imageResult.imageUrl);
            }
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

    const handleRandom = () => {
        form.reset();
        handleGenerate({});
    }

    return (
        <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
                <Card>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleGenerate)}>
                            <CardHeader>
                                <CardTitle>{t.explore}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField control={form.control} name="cuisine" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t.cuisine}</FormLabel>
                                        <FormControl><Input placeholder="Eritrean, Italian..." {...field} /></FormControl>
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="diet" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t.diet}</FormLabel>
                                        <FormControl><Input placeholder="Vegetarian, Gluten-Free..." {...field} /></FormControl>
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="difficulty" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t.difficulty}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="Easy">Easy</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="Hard">Hard</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="maxTime" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t.maxTime}</FormLabel>
                                        <FormControl><Input type="number" placeholder="e.g., 30" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))}/></FormControl>
                                    </FormItem>
                                )}/>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-2">
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                    {isLoading ? t.generating : t.generate}
                                </Button>
                                <Button type="button" variant="outline" onClick={handleRandom} disabled={isLoading} className="w-full">
                                    <Soup className="mr-2 h-4 w-4"/>
                                    {t.random}
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </div>

            <div className="lg:col-span-8">
                <Card className="min-h-[80vh]">
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl text-primary">{recipe?.recipeName || t.title}</CardTitle>
                        <CardDescription>{recipe?.description || t.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center h-96">
                                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            </div>
                        ) : !recipe ? (
                            <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-96">
                                <ChefHat className="h-20 w-20 mb-4" />
                                <p>{t.initialMessage}</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <Card className="overflow-hidden">
                                    {imageUrl ? (
                                        <div className="relative w-full h-64">
                                            <Image src={imageUrl} alt={recipe.recipeName} layout="fill" objectFit="cover" />
                                        </div>
                                    ) : (
                                        <div className="w-full h-64 bg-muted flex items-center justify-center">
                                            <Skeleton className="w-full h-full" />
                                        </div>
                                    )}
                                </Card>

                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="md:col-span-1 space-y-4">
                                        <Card>
                                            <CardHeader><CardTitle>{t.ingredients}</CardTitle></CardHeader>
                                            <CardContent>
                                                <ul className="list-disc list-inside space-y-1">
                                                    {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader><CardTitle>{t.nutrition}</CardTitle></CardHeader>
                                            <CardContent className="text-sm space-y-2">
                                                <p><strong>{t.calories}:</strong> {recipe.nutrition.calories}</p>
                                                <p><strong>{t.protein}:</strong> {recipe.nutrition.protein}</p>
                                                <p><strong>{t.carbs}:</strong> {recipe.nutrition.carbs}</p>
                                                <p><strong>{t.fat}:</strong> {recipe.nutrition.fat}</p>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="md:col-span-2">
                                        <Card>
                                            <CardHeader><CardTitle>{t.instructions}</CardTitle></CardHeader>
                                            <CardContent>
                                                <ol className="list-decimal list-inside space-y-3">
                                                    {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                                                </ol>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
