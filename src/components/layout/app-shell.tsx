
"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MessageSquare,
  Image as ImageIcon,
  BookOpen,
  LayoutDashboard,
  Music,
  Brain,
  Soup,
  Dumbbell,
  UserCircle,
  Globe,
  Mic,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

import Dashboard from "@/components/features/dashboard";
import MultilingualChat from "@/components/features/multilingual-chat";
import ImageGenerator from "@/components/features/image-generator";
import LearningHub from "@/components/features/learning-hub";
import MusicFinder from "@/components/features/music-finder";
import BrainTeasers from "@/components/features/brain-teasers";
import HealthyRecipes from "@/components/features/healthy-recipes";
import GymCoach from "@/components/features/gym-coach";
import Portfolio from "@/components/features/portfolio";
import DailyQuote from "@/components/features/daily-quote";
import VoiceAssistant from "@/components/features/voice-assistant";
import QandA from "@/components/features/q-and-a";


type FeatureKey =
  | "dashboard"
  | "portfolio"
  | "q-and-a"
  | "chat"
  | "image"
  | "learning"
  | "music"
  | "teasers"
  | "recipes"
  | "coach"
  | "quote"
  | "assistant";
  
type Feature = {
  id: FeatureKey;
  label: string;
  icon: React.ElementType;
  component: React.ComponentType<{ language: 'ti' | 'en' | 'ar' }>;
  mainNav: boolean;
};


const translations = {
  ti: {
    dashboard: "መበገሲ",
    chat: "ትርጉምን ቻትን",
    image: "ምስሊ ምፍጣር",
    learning: "ማእከል ትምህርቲ",
    music: "ሙዚቃ ድለ",
    teasers: "ሕንቅልሕንቅሊተይ",
    recipes: "ጥዕና ዝሓለወ መግቢ",
    coach: "AI ናይ ስፖርት ኣማኻሪ",
    appName: "መምህረይ",
    portfolio: "ብዛዕባይ",
    quote: "ዕለታዊ ጥቕስን መልስን",
    assistant: "ሓጋዚ AI",
    "q-and-a": "ማእከል ሕቶን መልስን",
    more: "ተጨማሪ",
    language: "Language",
  },
  en: {
    dashboard: "Dashboard",
    chat: "Multilingual Chat",
    image: "Image Generation",
    learning: "Learning Hub",
    music: "Eritrean Music Finder",
    teasers: "Brain Teasers",
    recipes: "Healthy Recipes",
    coach: "AI Gym Coach",
    appName: "Memhrey",
    portfolio: "Portfolio",
    quote: "Quote & Answer",
    assistant: "AI Assistant",
    "q-and-a": "Q&A Hub",
    more: "More",
    language: "ቋንቋ",
  },
  ar: {
    dashboard: "لوحة التحكم",
    chat: "الدردشة والترجمة",
    image: "إنشاء الصور",
    learning: "مركز التعلم",
    music: "البحث عن موسيقى",
    teasers: "ألغاز وألعاب ذهنية",
    recipes: "وصفات صحية",
    coach: "مدرب رياضي ذكي",
    appName: "معلمي",
    portfolio: "ملفي الشخصي",
    quote: "اقتباس وإجابة اليوم",
    assistant: "مساعد ذكي",
    "q-and-a": "مركز الأسئلة والأجوبة",
    more: "المزيد",
    language: "لغة",
  }
};


export default function AppShell() {
  const [activeFeatureKey, setActiveFeatureKey] = useState<FeatureKey>("dashboard");
  const [language, setLanguage] = useState<'ti' | 'en' | 'ar'>('ti');
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentTexts = translations[language];

  const navigationItems: Feature[] = [
    { id: "dashboard", label: currentTexts.dashboard, icon: LayoutDashboard, component: Dashboard, mainNav: true },
    { id: "q-and-a", label: currentTexts["q-and-a"], icon: HelpCircle, component: QandA, mainNav: true },
    { id: "portfolio", label: currentTexts.portfolio, icon: UserCircle, component: Portfolio, mainNav: true },
    { id: "assistant", label: currentTexts.assistant, icon: Mic, component: VoiceAssistant, mainNav: false },
    { id: "quote", label: currentTexts.quote, icon: Sparkles, component: DailyQuote, mainNav: false },
    { id: "chat", label: currentTexts.chat, icon: MessageSquare, component: MultilingualChat, mainNav: false },
    { id: "image", label: currentTexts.image, icon: ImageIcon, component: ImageGenerator, mainNav: false },
    { id: "learning", label: currentTexts.learning, icon: BookOpen, component: LearningHub, mainNav: false },
    { id: "music", label: currentTexts.music, icon: Music, component: MusicFinder, mainNav: false },
    { id: "teasers", label: currentTexts.teasers, icon: Brain, component: BrainTeasers, mainNav: false },
    { id: "recipes", label: currentTexts.recipes, icon: Soup, component: HealthyRecipes, mainNav: false },
    { id: "coach", label: currentTexts.coach, icon: Dumbbell, component: GymCoach, mainNav: false },
  ];

  const ActiveComponent = navigationItems.find(item => item.id === activeFeatureKey)?.component || Dashboard;

  const handleLanguageChange = (lang: 'ti' | 'en' | 'ar') => {
    setLanguage(lang);
  };
  
  const renderFeature = (feature: Feature) => {
    const Component = feature.component;
    if (!isMounted) {
      return (
         <SidebarMenuButton
              tooltip={{ children: feature.label }}
              className="w-full"
              disabled
          >
              <feature.icon />
              <span>{feature.label}</span>
          </SidebarMenuButton>
      );
    }
    
    if (isMobile) {
      return (
        <Sheet>
          <SheetTrigger asChild>
            <SidebarMenuButton
              tooltip={{ children: feature.label }}
              className="w-full"
            >
              <feature.icon />
              <span>{feature.label}</span>
            </SidebarMenuButton>
          </SheetTrigger>
          <SheetContent side="left" className="w-full">
            <SheetHeader>
              <SheetTitle>{feature.label}</SheetTitle>
            </SheetHeader>
            <div className="py-4 h-full overflow-auto">
              <Component language={language} />
            </div>
          </SheetContent>
        </Sheet>
      );
    }

    if (feature.mainNav) {
         return (
             <SidebarMenuButton
                onClick={() => setActiveFeatureKey(feature.id)}
                isActive={activeFeatureKey === feature.id}
                tooltip={{ children: feature.label }}
                className="[&[data-active=true]]:bg-sidebar-primary [&[data-active=true]]:text-sidebar-primary-foreground"
            >
                <feature.icon />
                <span>{feature.label}</span>
            </SidebarMenuButton>
         );
    }
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                <SidebarMenuButton
                    tooltip={{ children: feature.label }}
                    className="w-full"
                >
                    <feature.icon />
                    <span>{feature.label}</span>
                </SidebarMenuButton>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                 <DialogHeader>
                    <DialogTitle>{feature.label}</DialogTitle>
                </DialogHeader>
                <div className="overflow-auto flex-grow">
                    <Component language={language} />
                </div>
            </DialogContent>
        </Dialog>
    );
  };


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Card className="bg-transparent border-0 shadow-none">
            <CardHeader className="flex flex-row items-center gap-3 p-2">
              <div className="flex flex-col">
                <CardTitle className="text-xl font-headline text-sidebar-primary">{currentTexts.appName}</CardTitle>
              </div>
            </CardHeader>
          </Card>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navigationItems.filter(item => item.mainNav).map((item) => (
              <SidebarMenuItem key={item.id}>
                {renderFeature(item)}
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <SidebarMenuButton
                    tooltip={{ children: currentTexts.more }}
                    className="w-full"
                    >
                    <Sparkles />
                    <span>{currentTexts.more}</span>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start">
                    {navigationItems.filter(item => !item.mainNav).map((item) => (
                      <DropdownMenuItem key={item.id} asChild>
                         {renderFeature(item)}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          {/* User profile section removed */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10 h-16">
          <SidebarTrigger className="md:hidden"/>
          <h1 className="text-xl font-semibold font-headline hidden md:block text-primary">
            {navigationItems.find(item => item.id === activeFeatureKey)?.label}
          </h1>
          <div className="flex-grow md:hidden"/>
          <h1 className="text-xl font-semibold font-headline md:hidden text-primary">
            {currentTexts.appName}
          </h1>
           <div className="flex-grow hidden md:block"/>
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" aria-label="Toggle Language">
                <Globe className="h-5 w-5 text-primary" />
                <span className="ml-2 md:hidden">{currentTexts.language}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => handleLanguageChange('en')}>English</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleLanguageChange('ti')}>ትግርኛ</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleLanguageChange('ar')}>العربية</DropdownMenuItem>
            </DropdownMenuContent>
           </DropdownMenu>
        </header>
        <main className="p-4 md:p-6 lg:p-8">
          <ActiveComponent language={language} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
