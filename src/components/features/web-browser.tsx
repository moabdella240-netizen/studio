"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { summarizeWebpageContent } from "@/ai/flows/summarize-webpage-content";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Loader2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const browserSchema = z.object({
  url: z.string().url("Please enter a valid URL."),
});

export default function WebBrowser() {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof browserSchema>>({
    resolver: zodResolver(browserSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof browserSchema>) => {
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await summarizeWebpageContent(values);
      setSummary(result.summary);
    } catch (error) {
      console.error("AI Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to summarize the webpage. Please check the URL or try another.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Intelligent Web Browser</CardTitle>
                <CardDescription>
                  Enter a URL to get an AI-powered summary of its content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Webpage URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                  Summarize
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[85%]" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : summary ? (
              <p className="text-muted-foreground whitespace-pre-wrap">{summary}</p>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <FileText className="mx-auto h-12 w-12" />
                <p className="mt-2">The summary will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
