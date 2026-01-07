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
  MessageSquare,
  Image as ImageIcon,
  BookOpen,
  Globe,
  ListTodo,
  Mic,
  LayoutDashboard,
  Music,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";

import Dashboard from "@/components/features/dashboard";
import MultilingualChat from "@/components/features/multilingual-chat";
import ImageGenerator from "@/components/features/image-generator";
import LearningHub from "@/components/features/learning-hub";
import WebBrowser from "@/components/features/web-browser";
import TaskManager from "@/components/features/task-manager";
import VoiceAssistant from "@/components/features/voice-assistant";
import MusicFinder from "@/components/features/music-finder";
import { Button } from "@/components/ui/button";

type Feature =
  | "dashboard"
  | "chat"
  | "image"
  | "learning"
  | "music"
  | "browser"
  | "tasks"
  | "voice";

const featureComponents: Record<Feature, React.ComponentType<{ language: 'ti' | 'en' }>> = {
  dashboard: Dashboard,
  chat: MultilingualChat,
  image: ImageGenerator,
  learning: LearningHub,
  music: MusicFinder,
  browser: WebBrowser,
  tasks: TaskManager,
  voice: VoiceAssistant,
};

const translations = {
  ti: {
    dashboard: "ዳሽቦርድ",
    chat: "ብብዙሕ ቋንቋ ዝሰርሕ ቻት",
    image: "ምስሊ ምፍጣር",
    learning: "መምሃሪ ማእከል",
    music: "ኤርትራዊ ሙዚቃ ድለ",
    browser: "መረብ ሓበሬታ",
    tasks: "መቆጻጸሪ ዕማማት",
    voice: "ናይ ድምጺ ሓጋዚ",
    user: "ተጠቃሚ",
    freePlan: "ነጻ ኣገልግሎት",
    appName: "ኣንአይ ማእከል",
  },
  en: {
    dashboard: "Dashboard",
    chat: "Multilingual Chat",
    image: "Image Generation",
    learning: "Learning Hub",
    music: "Eritrean Music Finder",
    browser: "Web Browser",
    tasks: "Task Manager",
    voice: "Voice Assistant",
    user: "User",
    freePlan: "Free Plan",
    appName: "AnAi Hub",
  },
};


export default function AppShell() {
  const [activeFeature, setActiveFeature] = useState<Feature>("dashboard");
  const [language, setLanguage] = useState<'ti' | 'en'>('ti');

  const ActiveComponent = featureComponents[activeFeature];
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');
  const currentTexts = translations[language];

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => (prev === 'ti' ? 'en' : 'ti'));
  }, []);

  const navigationItems = [
    { id: "dashboard", label: currentTexts.dashboard, icon: LayoutDashboard },
    { id: "chat", label: currentTexts.chat, icon: MessageSquare },
    { id: "image", label: currentTexts.image, icon: ImageIcon },
    { id: "learning", label: currentTexts.learning, icon: BookOpen },
    { id: "music", label: currentTexts.music, icon: Music },
    { id: "browser", label: currentTexts.browser, icon: Globe },
    { id: "tasks", label: currentTexts.tasks, icon: ListTodo },
    { id: "voice", label: currentTexts.voice, icon: Mic },
  ] as const;

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
                <SidebarMenuButton
                  onClick={() => setActiveFeature(item.id)}
                  isActive={activeFeature === item.id}
                  tooltip={{ children: item.label }}
                  className="[&[data-active=true]]:bg-sidebar-primary [&[data-active=true]]:text-sidebar-primary-foreground"
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
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
            {navigationItems.find(item => item.id === activeFeature)?.label}
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
