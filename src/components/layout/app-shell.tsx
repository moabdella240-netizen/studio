"use client";

import React, { useState } from "react";
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

import Dashboard from "@/components/features/dashboard";
import MultilingualChat from "@/components/features/multilingual-chat";
import ImageGenerator from "@/components/features/image-generator";
import LearningHub from "@/components/features/learning-hub";
import WebBrowser from "@/components/features/web-browser";
import TaskManager from "@/components/features/task-manager";
import VoiceAssistant from "@/components/features/voice-assistant";
import MusicFinder from "@/components/features/music-finder";

type Feature =
  | "dashboard"
  | "chat"
  | "image"
  | "learning"
  | "browser"
  | "tasks"
  | "voice"
  | "music";

const featureComponents: Record<Feature, React.ComponentType> = {
  dashboard: Dashboard,
  chat: MultilingualChat,
  image: ImageGenerator,
  learning: LearningHub,
  browser: WebBrowser,
  tasks: TaskManager,
  voice: VoiceAssistant,
  music: MusicFinder,
};

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "chat", label: "Multilingual Chat", icon: MessageSquare },
  { id: "image", label: "Image Generation", icon: ImageIcon },
  { id: "learning", label: "Learning Hub", icon: BookOpen },
  { id: "music", label: "Eritrean Music Finder", icon: Music },
  { id: "browser", label: "Web Browser", icon: Globe },
  { id: "tasks", label: "Task Manager", icon: ListTodo },
  { id: "voice", label: "Voice Assistant", icon: Mic },
] as const;


export default function AppShell() {
  const [activeFeature, setActiveFeature] = useState<Feature>("dashboard");
  const ActiveComponent = featureComponents[activeFeature];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Card className="bg-transparent border-0 shadow-none">
            <CardHeader className="flex flex-row items-center gap-3 p-2">
              <div className="flex flex-col">
                <CardTitle className="text-xl font-headline text-sidebar-foreground">AnAi Hub</CardTitle>
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
                <AvatarImage src="https://picsum.photos/seed/user/40/40" alt="User" data-ai-hint="person" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm font-medium">User</CardTitle>
                <CardDescription className="text-xs">Free Plan</CardDescription>
              </div>
             </CardHeader>
          </Card>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b bg-transparent sticky top-0 z-10 h-16">
          <SidebarTrigger className="md:hidden"/>
          <h1 className="text-xl font-semibold font-headline hidden md:block">
            {navigationItems.find(item => item.id === activeFeature)?.label}
          </h1>
          <div className="flex-grow md:hidden"/>
          <h1 className="text-xl font-semibold font-headline md:hidden">
            AnAi Hub
          </h1>
        </header>
        <main className="p-4 md:p-6">
          <ActiveComponent />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
