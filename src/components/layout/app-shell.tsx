
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
  Dumbbell,
  UserCircle,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useUser } from "@/firebase";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

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
import Portfolio from "@/components/features/portfolio";


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
  | "voice"
  | "portfolio";
  
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
    recipes: "ጥዕና ዝሓለወ መግቢ",
    coach: "AI ናይ ስፖርት ኣማኻሪ",
    browser: "መረብ ሓበሬታ",
    tasks: "መቆጻጸሪ ዕማማት",
    voice: "ሓጋዚ ድምጺ",
    user: "ተጠቃሚ",
    freePlan: "ነጻ ኣገልግሎት",
    appName: "መምህረይ",
    portfolio: "ሥራይ",
    logout: "ውጻእ",
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
    appName: "Memhrey",
    portfolio: "Portfolio",
    logout: "Log Out",
  },
};


export default function AppShell() {
  const [activeFeatureKey, setActiveFeatureKey] = useState<FeatureKey>("dashboard");
  const [language, setLanguage] = useState<'ti' | 'en'>('ti');
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/login');
  };

  const currentTexts = translations[language];

  const navigationItems: Feature[] = [
    { id: "dashboard", label: currentTexts.dashboard, icon: LayoutDashboard, component: Dashboard },
    { id: "portfolio", label: currentTexts.portfolio, icon: UserCircle, component: Portfolio },
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

  const handleLanguageChange = (lang: 'ti' | 'en') => {
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

    if (feature.id === 'dashboard' || feature.id === 'portfolio') {
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Card className="bg-sidebar-accent m-2 cursor-pointer hover:bg-sidebar-accent/80">
                  <CardHeader className="p-3 flex-row items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user?.photoURL || userAvatar?.imageUrl} alt={user?.displayName || "User"} data-ai-hint={userAvatar?.imageHint} />
                      <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <CardTitle className="text-sm font-medium truncate">{user?.displayName || currentTexts.user}</CardTitle>
                      <CardDescription className="text-xs truncate">{user?.email}</CardDescription>
                    </div>
                  </CardHeader>
              </Card>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-56">
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{currentTexts.logout}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" aria-label="Toggle Language">
                <Globe className="h-5 w-5 text-primary" />
                <span className="ml-2 md:hidden">{language === 'ti' ? 'English' : 'Tigrinya'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => handleLanguageChange('en')}>English</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleLanguageChange('ti')}>ትግርኛ</DropdownMenuItem>
            </DropdownMenuContent>
           </DropdownMenu>
        </header>
        <main className="p-4 md:p-6">
          <ActiveComponent language={language} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
