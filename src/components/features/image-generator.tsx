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

const imageSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters long."),
});

export default function ImageGenerator() {
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
        title: "Error",
        description: "Failed to generate image. Please try a different prompt.",
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
              <CardTitle>AI Image Generation</CardTitle>
              <CardDescription>
                Describe the image you want to create in Tigrinya or Saho. Be as detailed as possible.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., An astronaut riding a horse on Mars, cinematic lighting"
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
                Generate Image
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Generated Image</CardTitle>
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
              <p>Your generated image will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
