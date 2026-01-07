"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { suggestLearningResources } from "@/ai/flows/suggest-learning-resources";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Book, Lightbulb, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const learningSchema = z.object({
  skillLevel: z.string().min(1, "Skill level is required."),
  learningGoal: z.string().min(3, "Learning goal is required."),
  preferredResourceType: z.string().optional(),
});

type Suggestions = {
  suggestedResources: string[];
  reasoning: string;
};

const staticResources = [
  { title: "Official React Docs", description: "The best place to start learning React.", category: "Web Development" },
  { title: "Python for Everybody", description: "A free online course for Python beginners.", category: "Programming" },
  { title: "Figma 101", description: "Learn the basics of UI/UX design with Figma.", category: "Design" },
  { title: "AWS Certified Cloud Practitioner", description: "Get started with cloud computing on AWS.", category: "Cloud" },
];

export default function LearningHub() {
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof learningSchema>>({
    resolver: zodResolver(learningSchema),
    defaultValues: {
      skillLevel: "",
      learningGoal: "",
      preferredResourceType: "any",
    },
  });

  const onSubmit = async (values: z.infer<typeof learningSchema>) => {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await suggestLearningResources(values);
      setSuggestions(result);
    } catch (error) {
      console.error("AI Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get suggestions. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="suggestions">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="suggestions">Personalized Suggestions</TabsTrigger>
        <TabsTrigger value="library">Resource Library</TabsTrigger>
      </TabsList>
      <TabsContent value="suggestions">
        <Card>
          <CardHeader>
            <CardTitle>Find Your Path</CardTitle>
            <CardDescription>Tell us about your learning goals, and our AI will suggest resources for you.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="learningGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What do you want to learn?</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Master React hooks" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="skillLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Skill Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter>
                 <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                  Get Suggestions
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
        
        {isLoading && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Generating recommendations...</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        )}

        {suggestions && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Your Personalized Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">Suggested Resources:</h3>
              <ul className="list-disc pl-5 space-y-2">
                {suggestions.suggestedResources.map((res, i) => (
                  <li key={i}>{res}</li>
                ))}
              </ul>
              <h3 className="font-semibold mt-4 mb-2">Reasoning:</h3>
              <p className="text-muted-foreground">{suggestions.reasoning}</p>
            </CardContent>
          </Card>
        )}

      </TabsContent>
      <TabsContent value="library">
        <Card>
          <CardHeader>
            <CardTitle>Resource Library</CardTitle>
            <CardDescription>A curated list of high-quality learning materials.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {staticResources.map((res, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Book className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{res.title}</CardTitle>
                    <CardDescription>{res.category}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{res.description}</p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
