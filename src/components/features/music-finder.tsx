
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

const translations = {
  ti: {
    title: "ኤርትራዊ ሙዚቃ ድለ",
    description: "ብመሰረት ድምጻዊ፣ ጓይላ፣ ቋንቋ፣ ወይ ድማ ሙድ ሙዚቃ ድለ።",
    artist: "ድምጻዊ",
    artistPlaceholder: "ንኣብነት, ሄለን መለስ",
    genre: "ዓይነት ሙዚቃ (ጓይላ)",
    genrePlaceholder: "ንኣብነት, ጓይላ, ፖፕ",
    mood: "ሙድ",
    moodPlaceholder: "ንኣብነት, ወኻዒ, ህዱእ",
    language: "ቋንቋ",
    selectLanguage: "ቋንቋ ምረጽ",
    any: "ዝኾነ",
    tigrinya: "ትግርኛ",
    tigre: "ትግረ",
    saho: "ሳሆ",
    arabic: "ዓረብኛ",
    findMusic: "ሙዚቃ ድለ",
    finding: "ይድለ ኣሎ...",
    playlistTitle: "ናይ ሙዚቃ ዝርዝርካ",
    initialMessage: "ናይ ሙዚቃ ምኽሪታትካ ኣብዚ ክርአ እዩ።",
    errorTitle: "ጌጋ ኣጋጢሙ",
    errorMessage: "ናይ ሙዚቃ ምኽሪታት ክንረክብ ኣይከኣልናን። በጃኻ ደጊምካ ፈትን።",
    preferenceError: "በጃኻ ምርጫኻ ኣነጽር",
    preferenceDescription: "ናይ ሙዚቃ ምኽሪታት ንምርካብ እንተወሓደ ሓደ ምርጫ ኣመልክት።",
    listen: "ስምዓዮ",
    favorite: "ኣፍቅር",
  },
  en: {
    title: "Eritrean Music Finder",
    description: "Discover music by artist, genre, language, or mood.",
    artist: "Artist",
    artistPlaceholder: "e.g., Helen Meles",
    genre: "Genre",
    genrePlaceholder: "e.g., Guayla, Pop",
    mood: "Mood",
    moodPlaceholder: "e.g., Energetic, Relaxing",
    language: "Language",
    selectLanguage: "Select a language",
    any: "Any",
    tigrinya: "Tigrinya",
    tigre: "Tigre",
    saho: "Saho",
    arabic: "Arabic",
    findMusic: "Find Music",
    finding: "Finding...",
    playlistTitle: "Your Playlist",
    initialMessage: "Your music recommendations will appear here.",
    errorTitle: "Error",
    errorMessage: "Failed to get music recommendations. Please try again.",
    preferenceError: "Please specify your preferences",
    preferenceDescription: "Enter at least one preference to get music recommendations.",
    listen: "Listen",
    favorite: "Favorite",
  },
  ar: {
    title: " مكتشف الموسيقى الإريترية",
    description: "اكتشف الموسيقى حسب الفنان أو النوع أو اللغة أو الحالة المزاجية.",
    artist: "الفنان",
    artistPlaceholder: "مثال: هيلين ملس",
    genre: "النوع",
    genrePlaceholder: "مثال: غوايلا، بوب",
    mood: "الحالة المزاجية",
    moodPlaceholder: "مثال: حماسي، هادئ",
    language: "اللغة",
    selectLanguage: "اختر لغة",
    any: "أي",
    tigrinya: "التجرينية",
    tigre: "التجرية",
    saho: "الساهو",
    arabic: "العربية",
    findMusic: "ابحث عن موسيقى",
    finding: "جاري البحث...",
    playlistTitle: "قائمة التشغيل الخاصة بك",
    initialMessage: "ستظهر توصيات الموسيقى الخاصة بك هنا.",
    errorTitle: "خطأ",
    errorMessage: "فشل في الحصول على توصيات الموسيقى. يرجى المحاولة مرة أخرى.",
    preferenceError: "يرجى تحديد تفضيلاتك",
    preferenceDescription: "أدخل تفضيلاً واحدًا على الأقل للحصول على توصيات الموسيقى.",
    listen: "استمع",
    favorite: "مفضل",
  },
};

const musicFinderSchema = z.object({
  artist: z.string().optional(),
  genre: z.string().optional(),
  language: z.enum(['Tigrinya', 'Tigre', 'Saho', 'Arabic', 'Any']).optional(),
  mood: z.string().optional(),
});

export default function MusicFinder({ language = 'ti' }: { language?: 'ti' | 'en' | 'ar' }) {
  const [recommendations, setRecommendations] = useState<FindEritreanMusicOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const t = translations[language];

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
            title: t.preferenceError,
            description: t.preferenceDescription,
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
        title: t.errorTitle,
        description: t.errorMessage,
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
                <CardTitle>{t.title}</CardTitle>
                <CardDescription>{t.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <FormField
                  control={form.control}
                  name="artist"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.artist}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.artistPlaceholder} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.genre}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.genrePlaceholder} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.mood}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.moodPlaceholder} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.language}</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t.selectLanguage} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Any">{t.any}</SelectItem>
                          <SelectItem value="Tigrinya">{t.tigrinya}</SelectItem>
                          <SelectItem value="Tigre">{t.tigre}</SelectItem>
                          <SelectItem value="Saho">{t.saho}</SelectItem>
                          <SelectItem value="Arabic">{t.arabic}</SelectItem>
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
                  {isLoading ? t.finding : t.findMusic}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="min-h-[60vh]">
          <CardHeader>
            <CardTitle>{recommendations?.playlistTitle || t.playlistTitle}</CardTitle>
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
                <p className="mt-2">{t.initialMessage}</p>
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
                                <span className="sr-only">{t.favorite}</span>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                                <Link href={song.youtubeUrl} target="_blank">
                                    <Youtube className="mr-2 h-4 w-4 text-red-600" />
                                    {t.listen}
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
