"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { findEritreanMusic, type FindEritreanMusicOutput } from "@/ai/flows/find-eritrean-music";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Music, Search, Loader2, Youtube, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const musicFinderSchema = z.object({
  artist: z.string().optional(),
  genre: z.string().optional(),
  language: z.enum(['Tigrinya', 'Saho', 'Tigre', 'Any']).optional(),
  mood: z.string().optional(),
});

export default function MusicFinder() {
  const [recommendations, setRecommendations] = useState<FindEritreanMusicOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof musicFinderSchema>>({
    resolver: zodResolver(musicFinderSchema),
    defaultValues: {
      artist: "",
      genre: "",
      language: "Any",
      mood: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof musicFinderSchema>) => {
    setIsLoading(true);
    setRecommendations(null);
    try {
      if (!values.artist && !values.genre && !values.mood && values.language === 'Any') {
        toast({
            variant: "destructive",
            title: "Please specify your preferences",
            description: "Enter at least one preference to get music recommendations.",
        });
        setIsLoading(false);
        return;
      }
      const result = await findEritreanMusic(values);
      setRecommendations(result);
    } catch (error) {
      console.error("AI Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get music recommendations. Please try again.",
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
                <CardTitle>Eritrean Music Finder</CardTitle>
                <CardDescription>Discover music by artist, genre, language, or mood.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <FormField
                  control={form.control}
                  name="artist"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Artist</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Helen Meles" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Genre</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Guayla, Pop" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mood</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Energetic, Relaxing" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Any">Any</SelectItem>
                          <SelectItem value="Tigrinya">Tigrinya</SelectItem>
                          <SelectItem value="Saho">Saho</SelectItem>
                          <SelectItem value="Tigre">Tigre</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                  Find Music
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="min-h-[60vh]">
          <CardHeader>
            <CardTitle>{recommendations?.playlistTitle || "Your Playlist"}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                ))}
              </div>
            )}
            {!isLoading && !recommendations && (
              <div className="text-center text-muted-foreground py-12">
                <Music className="mx-auto h-12 w-12" />
                <p className="mt-2">Your music recommendations will appear here.</p>
              </div>
            )}
            {recommendations && (
              <div className="space-y-6">
                {recommendations.suggestions.map((song, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold text-lg">{song.songTitle}</p>
                            <p className="text-sm text-muted-foreground">{song.artist} - {song.album}</p>
                            <p className="text-sm mt-2">{song.reason}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                <Heart className="h-4 w-4" />
                                <span className="sr-only">Favorite</span>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                                <Link href={song.youtubeUrl} target="_blank">
                                    <Youtube className="mr-2 h-4 w-4 text-red-600" />
                                    Listen
                                </Link>
                            </Button>
                        </div>
                    </div>
                    {i < recommendations.suggestions.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
