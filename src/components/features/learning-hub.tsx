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

const translations = {
  ti: {
    personalizedSuggestions: "ብሕታዊ ምኽሪታት",
    resourceLibrary: "ቤተ-መጻሕፍቲ ጸጋታት",
    findYourPath: "መንገድኻ ረኸብ",
    description: "ብዛዕባ ናይ ትምህርቲ ሸቶታትካ ንገረና፡ AI ድማ ንዓኻ ዝኸውን ጸጋታት ከማክር እዩ።",
    learningGoal: "እንታይ ክትመሃር ትደሊ?",
    learningGoalPlaceholder: "ንኣብነት, React hooks ምፍላጥ",
    skillLevel: "ደረጃ ክእለትካ",
    selectLevel: "ደረጃኻ ምረጽ",
    beginner: "ጀማሪ",
    intermediate: "ማእከላይ",
    expert: "ኪኢላ",
    getSuggestions: "ምኽሪታት ርኸብ",
    generating: "ይስራሕ ኣሎ...",
    recommendations: "ብሕታዊ ምኽሪታትካ",
    suggestedResources: "ዝተመኸሩ ጸጋታት:",
    reasoning: "ምኽንያት:",
    libraryTitle: "ቤተ-መጻሕፍቲ ጸጋታት",
    libraryDescription: "ዝተመርጹ ናይ ላዕለዋይ ደረጃ መምሃሪ ጽሑፋት ዝርዝር።",
    errorTitle: "ጌጋ ኣጋጢሙ",
    errorMessage: "ምኽሪታት ክንረክብ ኣይከኣልናን። በጃኻ ደጊምካ ፈትን።",
    skillLevelRequired: "ደረጃ ክእለትካ የድሊ።",
    learningGoalRequired: "ናይ ትምህርቲ ሸቶኻ የድሊ።",
  },
  en: {
    personalizedSuggestions: "Personalized Suggestions",
    resourceLibrary: "Resource Library",
    findYourPath: "Find Your Path",
    description: "Tell us about your learning goals, and our AI will suggest resources for you.",
    learningGoal: "What do you want to learn?",
    learningGoalPlaceholder: "e.g., Master React hooks",
    skillLevel: "Your Skill Level",
    selectLevel: "Select your level",
    beginner: "Beginner",
    intermediate: "Intermediate",
    expert: "Expert",
    getSuggestions: "Get Suggestions",
    generating: "Generating...",
    recommendations: "Your Personalized Recommendations",
    suggestedResources: "Suggested Resources:",
    reasoning: "Reasoning:",
    libraryTitle: "Resource Library",
    libraryDescription: "A curated list of high-quality learning materials.",
    errorTitle: "Error",
    errorMessage: "Failed to get suggestions. Please try again.",
    skillLevelRequired: "Skill level is required.",
    learningGoalRequired: "Learning goal is required.",
  },
  ar: {
    personalizedSuggestions: "اقتراحات شخصية",
    resourceLibrary: "مكتبة الموارد",
    findYourPath: "ابحث عن طريقك",
    description: "أخبرنا عن أهدافك التعليمية، وسيقترح الذكاء الاصطناعي موارد لك.",
    learningGoal: "ماذا تريد أن تتعلم؟",
    learningGoalPlaceholder: "مثال: إتقان React hooks",
    skillLevel: "مستوى مهارتك",
    selectLevel: "اختر مستواك",
    beginner: "مبتدئ",
    intermediate: "متوسط",
    expert: "خبير",
    getSuggestions: "احصل على اقتراحات",
    generating: "جاري الإنشاء...",
    recommendations: "توصياتك الشخصية",
    suggestedResources: "الموارد المقترحة:",
    reasoning: "السبب:",
    libraryTitle: "مكتبة الموارد",
    libraryDescription: "قائمة منسقة من المواد التعليمية عالية الجودة.",
    errorTitle: "خطأ",
    errorMessage: "فشل في الحصول على اقتراحات. يرجى المحاولة مرة أخرى.",
    skillLevelRequired: "مستوى المهارة مطلوب.",
    learningGoalRequired: "الهدف التعليمي مطلوب.",
  }
};


const staticResources = {
  ti: [
    { title: "ወግዓዊ ሰነዳት React", description: "React ንምምሃር ዝበለጸ ቦታ።", category: "ምዕባለ ዌብ" },
    { title: "Python ንኹሉ", description: "ንጀመርቲ Python ዝኸውን ናጻ অনলাইন ኮርስ።", category: "ፕሮግራሚንግ" },
    { title: "Figma 101", description: "መሰረታዊ ነገራት UI/UX ዲዛይን ብ Figma ተመሃር።", category: "ዲዛይን" },
    { title: "AWS Certified Cloud Practitioner", description: "ብ AWS ኣብ ክላውድ ኮምፒቲንግ ጀምር።", category: "ክላውድ" },
  ],
  en: [
    { title: "Official React Docs", description: "The best place to start learning React.", category: "Web Development" },
    { title: "Python for Everybody", description: "A free online course for Python beginners.", category: "Programming" },
    { title: "Figma 101", description: "Learn the basics of UI/UX design with Figma.", category: "Design" },
    { title: "AWS Certified Cloud Practitioner", description: "Get started with cloud computing on AWS.", category: "Cloud" },
  ],
  ar: [
    { title: "وثائق React الرسمية", description: "أفضل مكان لبدء تعلم React.", category: "تطوير الويب" },
    { title: "Python للجميع", description: "دورة مجانية على الإنترنت للمبتدئين في Python.", category: "البرمجة" },
    { title: "Figma 101", description: "تعلم أساسيات تصميم واجهة المستخدم/تجربة المستخدم باستخدام Figma.", category: "التصميم" },
    { title: "AWS Certified Cloud Practitioner", description: "ابدأ مع الحوسبة السحابية على AWS.", category: "السحابة" },
  ]
};

export default function LearningHub({ language = 'ti' }: { language?: 'ti' | 'en' | 'ar' }) {
  const t = translations[language];
  const s = staticResources[language];

  const learningSchema = z.object({
    skillLevel: z.string().min(1, t.skillLevelRequired),
    learningGoal: z.string().min(3, t.learningGoalRequired),
    preferredResourceType: z.string().optional(),
  });

  const [suggestions, setSuggestions] = useState<{ suggestedResources: string[]; reasoning: string; } | null>(null);
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
        title: t.errorTitle,
        description: t.errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="suggestions">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="suggestions">{t.personalizedSuggestions}</TabsTrigger>
        <TabsTrigger value="library">{t.resourceLibrary}</TabsTrigger>
      </TabsList>
      <TabsContent value="suggestions">
        <Card>
          <CardHeader>
            <CardTitle>{t.findYourPath}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
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
                        <FormLabel>{t.learningGoal}</FormLabel>
                        <FormControl>
                          <Input placeholder={t.learningGoalPlaceholder} {...field} />
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
                        <FormLabel>{t.skillLevel}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t.selectLevel} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">{t.beginner}</SelectItem>
                            <SelectItem value="intermediate">{t.intermediate}</SelectItem>
                            <SelectItem value="expert">{t.expert}</SelectItem>
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
                  {isLoading ? t.generating : t.getSuggestions}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
        
        {isLoading && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t.generating}...</CardTitle>
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
              <CardTitle>{t.recommendations}</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">{t.suggestedResources}</h3>
              <ul className="list-disc pl-5 space-y-2">
                {suggestions.suggestedResources.map((res, i) => (
                  <li key={i}>{res}</li>
                ))}
              </ul>
              <h3 className="font-semibold mt-4 mb-2">{t.reasoning}</h3>
              <p className="text-muted-foreground">{suggestions.reasoning}</p>
            </CardContent>
          </Card>
        )}

      </TabsContent>
      <TabsContent value="library">
        <Card>
          <CardHeader>
            <CardTitle>{t.libraryTitle}</CardTitle>
            <CardDescription>{t.libraryDescription}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {s.map((res, i) => (
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
