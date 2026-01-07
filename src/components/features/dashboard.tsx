
'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import DailyQuote from "./daily-quote";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

import MultilingualChat from "@/components/features/multilingual-chat";
import ImageGenerator from "@/components/features/image-generator";
import LearningHub from "@/components/features/learning-hub";
import VoiceAssistant from "@/components/features/voice-assistant";
import MusicFinder from "@/components/features/music-finder";
import BrainTeasers from "@/components/features/brain-teasers";
import HealthyRecipes from "@/components/features/healthy-recipes";
import GymCoach from "@/components/features/gym-coach";


import {
  MessageSquare,
  ImageIcon,
  BookOpen,
  Globe,
  ListTodo,
  Mic,
  LayoutDashboard,
  Music,
  Brain,
  Sparkles,
  HeartPulse,
  Users,
  GraduationCap,
  Soup,
  Dumbbell
} from "lucide-react";

const translations = {
  ti: {
    askAssistant: "ንሓጋዚ AI ሕተት",
    quoteAnswer: "ዕለታዊ ጥቕስን መልስን",
    brainTeasers: "ሕንቅልሕንቅሊተይን ብልሃትን",
    healthyRecipes: "ጥዕና ዝሰመዖም መግቢታት",
    musicFinder: "ሙዚቃ ኤርትራ ድለ",
    gymCoach: "AI ናይ ስፖርት ኣማኻሪ",
    featureGridTitle: "መሳርሒታትካ ዳህስስ",
    learningHub: "ማእከል ትምህርትን ክእለትን",
    iqTraining: "IQን ምህዞን ምፍታን",
    languageSupport: "ሓገዝ ቋንቋን ትርጉምን",
    productivityTools: "መሳርሒታት ፍርያምን ህይወትን",
    tryNow: "ሕጂ ፈትን →",
    empoweringMinds: "ንኤርትራዊ ኣእምሮ ምብቃዕ",
    mentorship: "ምምሃርን ትምህርታዊ ምትሕግጋዝን",
    youthOpportunities: "ንመንእሰያት ዕድላትን ክእለታትን",
    wellBeing: "ጥዕናን ኣወንታዊ ህይወትን",
    localResources: "ከባቢያዊ ጸጋታትን ሓገዝን",
    recommendations: "ንዓኻ ዝተመደበ",
    chat: "ትርጉምን ቻትን",
    imageGenerator: "ምስሊ ምፍጣር",
  },
  en: {
    askAssistant: "Ask AI Assistant",
    quoteAnswer: "Quote & Answer",
    brainTeasers: "Brain Teasers",
    healthyRecipes: "Healthy Recipes",
    musicFinder: "Eritrean Music Finder",
    gymCoach: "AI Gym Coach",
    featureGridTitle: "Explore Your AI Tools",
    learningHub: "Learning & Skills Hub",
    iqTraining: "IQ & Brain Training",
    languageSupport: "Language & Translation Support",
    productivityTools: "Productivity & Life Tools",
    tryNow: "Try Now →",
    empoweringMinds: "Empowering Eritrean Minds",
    mentorship: "Mentorship & Education Support",
    youthOpportunities: "Youth Opportunities & Skills",
    wellBeing: "Well-Being & Positive Living",
    localResources: "Local Resources & Help",
    recommendations: "Recommended For You",
    chat: "Translate & Chat",
    imageGenerator: "Image Generator",
  }
};

const featureMap = {
  'assistant': VoiceAssistant,
  'quote': DailyQuote,
  'teasers': BrainTeasers,
  'recipes': HealthyRecipes,
  'music': MusicFinder,
  'learning': LearningHub,
  'chat': MultilingualChat,
  'coach': GymCoach,
  'image': ImageGenerator,
};

type FeatureKey = keyof typeof featureMap;

const FeatureDialog = ({ featureKey, language, children }: { featureKey: FeatureKey, language: 'ti' | 'en', children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  const Component = featureMap[featureKey];
  const t = translations[language];

  const featureInfo = {
    'assistant': { title: t.askAssistant },
    'quote': { title: t.quoteAnswer },
    'teasers': { title: t.brainTeasers },
    'recipes': { title: t.healthyRecipes },
    'music': { title: t.musicFinder },
    'coach': { title: t.gymCoach },
    'learning': { title: t.learningHub },
    'chat': { title: t.chat },
    'image': { title: t.imageGenerator },
  };

  const title = featureInfo[featureKey].title;

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent side="bottom" className="h-[90vh]">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
          <div className="py-4 overflow-auto h-full">
            <Component language={language} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto flex-grow">
          <Component language={language} />
        </div>
      </DialogContent>
    </Dialog>
  );
};


export default function Dashboard({ language = 'ti' }: { language?: 'ti' | 'en' }) {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');
  const t = translations[language];

  return (
    <div className="space-y-12">
      {/* Main Action Panel */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-background/50">
        <CardHeader className="text-center">
            <h1 className="text-5xl font-bold font-headline text-primary">መምህረይ</h1>
            <CardDescription className="text-lg">
                {"ንኤርትራዊ ፍልጠት ብኣእምሮኣዊ ቴክኖሎጂ ምዕባይ"}
            </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-center gap-4">
            <FeatureDialog featureKey="assistant" language={language}>
                <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"><Mic className="mr-2"/>{t.askAssistant}</Button>
            </FeatureDialog>
            <FeatureDialog featureKey="quote" language={language}>
                <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"><Sparkles className="mr-2"/>{t.quoteAnswer}</Button>
            </FeatureDialog>
            <FeatureDialog featureKey="teasers" language={language}>
                <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"><Brain className="mr-2"/>{t.brainTeasers}</Button>
            </FeatureDialog>
            <FeatureDialog featureKey="recipes" language={language}>
                 <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"><Soup className="mr-2"/>{t.healthyRecipes}</Button>
            </FeatureDialog>
             <FeatureDialog featureKey="music" language={language}>
                <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"><Music className="mr-2"/>{t.musicFinder}</Button>
            </FeatureDialog>
            <FeatureDialog featureKey="coach" language={language}>
                <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"><Dumbbell className="mr-2"/>{t.gymCoach}</Button>
            </FeatureDialog>
        </CardContent>
      </Card>
      
      {/* Smart Recommendation Carousel Placeholder */}
      <div>
        <h2 className="text-3xl font-bold font-headline mb-4 text-center">{t.recommendations}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
             <Card className="hover:shadow-lg hover:-translate-y-1 transition-transform duration-300"><CardContent className="p-6 text-center"><p>ዕለታዊ ጥቕሲ</p></CardContent></Card>
             <Card className="hover:shadow-lg hover:-translate-y-1 transition-transform duration-300"><CardContent className="p-6 text-center"><p>ናይ ሎሚ ሕንቅልሕንቅሊተይ</p></CardContent></Card>
             <Card className="hover:shadow-lg hover:-translate-y-1 transition-transform duration-300"><CardContent className="p-6 text-center"><p>ኣዝዩ ዝስማዕ ዘሎ ደርፊ</p></CardContent></Card>
             <Card className="hover:shadow-lg hover:-translate-y-1 transition-transform duration-300"><CardContent className="p-6 text-center"><p>ምኽሪ ንትምህርቲ</p></CardContent></Card>
        </div>
      </div>

      {/* AI Feature Grid */}
       <div>
            <h2 className="text-3xl font-bold font-headline mb-6 text-center">{t.featureGridTitle}</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                <FeatureDialog featureKey="learning" language={language}>
                    <Card className="hover:shadow-lg hover:-translate-y-1 transition-transform duration-300 border-border bg-card cursor-pointer">
                        <CardHeader className="flex-row items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg"><BookOpen className="h-8 w-8 text-primary"/></div>
                            <div>
                                <CardTitle>{t.learningHub}</CardTitle>
                                <CardDescription>ብ AI ዝተደገፈ ናይ ትምህርቲ መደባት</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent><Button variant="link" className="p-0">{t.tryNow}</Button></CardContent>
                    </Card>
                </FeatureDialog>
                 <FeatureDialog featureKey="teasers" language={language}>
                    <Card className="hover:shadow-lg hover:-translate-y-1 transition-transform duration-300 border-border bg-card cursor-pointer">
                        <CardHeader className="flex-row items-center gap-4">
                             <div className="p-3 bg-primary/10 rounded-lg"><Brain className="h-8 w-8 text-primary"/></div>
                            <div>
                                <CardTitle>{t.iqTraining}</CardTitle>
                                <CardDescription>ሕንቅልሕንቅሊተይን ኣእምሮኻ ዘፈትኑ ጸወታታትን</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent><Button variant="link" className="p-0">{t.tryNow}</Button></CardContent>
                    </Card>
                 </FeatureDialog>
                <FeatureDialog featureKey="chat" language={language}>
                    <Card className="hover:shadow-lg hover:-translate-y-1 transition-transform duration-300 border-border bg-card cursor-pointer">
                        <CardHeader className="flex-row items-center gap-4">
                             <div className="p-3 bg-primary/10 rounded-lg"><MessageSquare className="h-8 w-8 text-primary"/></div>
                            <div>
                                <CardTitle>{t.languageSupport}</CardTitle>
                                <CardDescription>ትርጉምን ቻትን</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent><Button variant="link" className="p-0">{t.tryNow}</Button></CardContent>
                    </Card>
                </FeatureDialog>
                 <FeatureDialog featureKey="image" language={language}>
                     <Card className="hover:shadow-lg hover:-translate-y-1 transition-transform duration-300 border-border bg-card cursor-pointer">
                        <CardHeader className="flex-row items-center gap-4">
                             <div className="p-3 bg-primary/10 rounded-lg"><ImageIcon className="h-8 w-8 text-primary"/></div>
                            <div>
                                <CardTitle>{t.imageGenerator}</CardTitle>
                                <CardDescription>ብ AI ምስሊ ፍጠር</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent><Button variant="link" className="p-0">{t.tryNow}</Button></CardContent>
                    </Card>
                </FeatureDialog>
            </div>
      </div>

       {/* Community & Culture Section */}
      <div>
        <h2 className="text-3xl font-bold font-headline mb-6 text-center">{t.empoweringMinds}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="text-center p-6 bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <GraduationCap className="mx-auto h-10 w-10 text-primary mb-3"/>
            <CardTitle className="text-lg">{t.mentorship}</CardTitle>
          </Card>
           <Card className="text-center p-6 bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <Users className="mx-auto h-10 w-10 text-primary mb-3"/>
            <CardTitle className="text-lg">{t.youthOpportunities}</CardTitle>
          </Card>
           <Card className="text-center p-6 bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <HeartPulse className="mx-auto h-10 w-10 text-primary mb-3"/>
            <CardTitle className="text-lg">{t.wellBeing}</CardTitle>
          </Card>
           <Card className="text-center p-6 bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <Globe className="mx-auto h-10 w-10 text-primary mb-3"/>
            <CardTitle className="text-lg">{t.localResources}</CardTitle>
          </Card>
        </div>
      </div>
    </div>
  );
}
