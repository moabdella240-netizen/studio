"use client";

import React, { useState, useCallback } from "react";
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
  MessageSquare,
  Image as ImageIcon,
  BookOpen,
  Globe,
  ListTodo,
  Mic,
  LayoutDashboard,
  Music,
  Brain,
  Soup,
  Dumbbell
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

import Dashboard from "@/components/features/dashboard";
import MultilingualChat from "@/components/features/multilingual-chat";
import ImageGenerator from "@/components/features/image-generator";
import LearningHub from "@/components/features/learning-hub";
import WebBrowser from "@/components/features/web-browser";
import TaskManager from "@/components/features/task-manager";
import VoiceAssistant from "@/components/features/voice-assistant";
import MusicFinder from "@/components/features/music-finder";
import BrainTeasers from "@/components/features/brain-teasers";
import HealthyRecipes from "@/components/features/healthy-recipes";
import GymCoach from "@/components/features/gym-coach";

type FeatureKey =
  | "dashboard"
  | "chat"
  | "image"
  | "learning"
  | "music"
  | "teasers"
  | "recipes"
  | "coach"
  | "browser"
  | "tasks"
  | "voice";
  
type Feature = {
  id: FeatureKey;
  label: string;
  icon: React.ElementType;
  component: React.ComponentType<{ language: 'ti' | 'en' }>;
};


const translations = {
  ti: {
    dashboard: "መበገሲ",
    chat: "ቻት",
    image: "ምስሊ ምፍጣር",
    learning: "ማእከል ትምህርቲ",
    music: "ሙዚቃ ድለ",
    teasers: "ሕንቅልሕንቅሊተይ",
    recipes: "ጥዕና ዝሰመዖም መግቢታት",
    coach: "AI ናይ ስፖርት ኣ教练",
    browser: "መረብ ሓበሬታ",
    tasks: "መቆጻጸሪ ዕማማት",
    voice: "ሓጋዚ ድምጺ",
    user: "ተጠቃሚ",
    freePlan: "ነጻ ኣገልግሎት",
    appName: "AnAi Hub",
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
    browser: "Web Browser",
    tasks: "Task Manager",
    voice: "Voice Assistant",
    user: "User",
    freePlan: "Free Plan",
    appName: "AnAi Hub",
  },
};


export default function AppShell() {
  const [activeFeatureKey, setActiveFeatureKey] = useState<FeatureKey>("dashboard");
  const [language, setLanguage] = useState<'ti' | 'en'>('ti');
  const isMobile = useIsMobile();

  const currentTexts = translations[language];

  const navigationItems: Feature[] = [
    { id: "dashboard", label: currentTexts.dashboard, icon: LayoutDashboard, component: Dashboard },
    { id: "chat", label: currentTexts.chat, icon: MessageSquare, component: MultilingualChat },
    { id: "image", label: currentTexts.image, icon: ImageIcon, component: ImageGenerator },
    { id: "learning", label: currentTexts.learning, icon: BookOpen, component: LearningHub },
    { id: "music", label: currentTexts.music, icon: Music, component: MusicFinder },
    { id: "teasers", label: currentTexts.teasers, icon: Brain, component: BrainTeasers },
    { id: "recipes", label: currentTexts.recipes, icon: Soup, component: HealthyRecipes },
    { id: "coach", label: currentTexts.coach, icon: Dumbbell, component: GymCoach },
    { id: "browser", label: currentTexts.browser, icon: Globe, component: WebBrowser },
    { id: "tasks", label: currentTexts.tasks, icon: ListTodo, component: TaskManager },
    { id: "voice", label: currentTexts.voice, icon: Mic, component: VoiceAssistant },
  ];

  const ActiveComponent = navigationItems.find(item => item.id === activeFeatureKey)?.component || Dashboard;
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => (prev === 'ti' ? 'en' : 'ti'));
  }, []);
  
  const renderFeature = (feature: Feature) => {
    const Component = feature.component;
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

    if (feature.id === 'dashboard') {
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
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                {renderFeature(item)}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Card className="bg-sidebar-accent m-2">
             <CardHeader className="p-3 flex-row items-center gap-3">
              <Avatar>
                <AvatarImage src={userAvatar?.imageUrl} alt="User" data-ai-hint={userAvatar?.imageHint} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm font-medium">{currentTexts.user}</CardTitle>
                <CardDescription className="text-xs">{currentTexts.freePlan}</CardDescription>
              </div>
             </CardHeader>
          </Card>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b bg-transparent sticky top-0 z-10 h-16">
          <SidebarTrigger className="md:hidden"/>
          <h1 className="text-xl font-semibold font-headline hidden md:block text-primary">
            {navigationItems.find(item => item.id === activeFeatureKey)?.label}
          </h1>
          <div className="flex-grow md:hidden"/>
          <h1 className="text-xl font-semibold font-headline md:hidden text-primary">
            {currentTexts.appName}
          </h1>
           <div className="flex-grow hidden md:block"/>
           <Button variant="ghost" size="icon" onClick={toggleLanguage} aria-label="Toggle Language">
            <Globe className="h-5 w-5 text-primary" />
          </Button>
        </header>
        <main className="p-4 md:p-6">
          <ActiveComponent language={language} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
