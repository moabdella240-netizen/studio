"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateImageFromPrompt } from "@/ai/flows/generate-image-from-prompt";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Sparkles, Loader2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const translations = {
  ti: {
    title: "AI ምስሊ ምፍጣር",
    description: "ክትፈጥሮ እትደሊ ምስሊ ብትግርኛ ግለጽ። ክሳብ ዝከኣልካ መጠን ብዝርዝር ግለጾ።",
    promptLabel: "መበገሲ ሓሳብ",
    promptPlaceholder: "ንኣብነት, ኣብ ማርስ ፈረስ ዝጋልብ ዘሎ ጠፈርተኛ, ከም ፊልም ዝበለ መብራህቲ",
    generateButton: "ምስሊ ፍጠር",
    generatingButton: "ይስራሕ ኣሎ...",
    generatedImageTitle: "ዝተፈጥረ ምስሊ",
    initialMessage: "ዝፈጠርካዮ ምስሊ ኣብዚ ክርአ እዩ።",
    errorTitle: "ጌጋ ኣጋጢሙ",
    errorMessage: "ምስሊ ምፍጣር ኣይተኻእለን። በጃኻ ካልእ መበገሲ ሓሳብ ተጠቒምካ ፈትን።",
    promptMinError: "መበገሲ ሓሳብ እንተወሓደ 10 ፊደላት ክህልዎ ኣለዎ።",
  },
  en: {
    title: "AI Image Generation",
    description: "Describe the image you want to create in Tigrinya. Be as detailed as possible.",
    promptLabel: "Prompt",
    promptPlaceholder: "e.g., An astronaut riding a horse on Mars, cinematic lighting",
    generateButton: "Generate Image",
    generatingButton: "Generating...",
    generatedImageTitle: "Generated Image",
    initialMessage: "Your generated image will appear here.",
    errorTitle: "Error",
    errorMessage: "Failed to generate image. Please try a different prompt.",
    promptMinError: "Prompt must be at least 10 characters long.",
  },
};

export default function ImageGenerator({ language = 'ti' }: { language?: 'ti' | 'en' }) {
  const t = translations[language];

  const imageSchema = z.object({
    prompt: z.string().min(10, t.promptMinError),
  });

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof imageSchema>>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof imageSchema>) => {
    setIsLoading(true);
    setImageUrl(null);
    try {
      const result = await generateImageFromPrompt(values);
      setImageUrl(result.imageUrl);
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
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
            <CardHeader>
              <CardTitle>{t.title}</CardTitle>
              <CardDescription>{t.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.promptLabel}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t.promptPlaceholder}
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {isLoading ? t.generatingButton : t.generateButton}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t.generatedImageTitle}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center aspect-square">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : imageUrl ? (
            <div className="relative w-full h-full rounded-lg overflow-hidden">
               <Image src={imageUrl} alt={form.getValues("prompt")} fill className="object-contain" />
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <ImageIcon className="mx-auto h-12 w-12" />
              <p>{t.initialMessage}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
