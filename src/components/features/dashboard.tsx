import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="relative h-64 w-full">
          <Image
            src="https://picsum.photos/seed/hero/1200/400"
            alt="AI-powered productivity"
            fill
            className="object-cover"
            data-ai-hint="abstract technology"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <h1 className="text-4xl font-bold text-foreground font-headline">Welcome to AnAi Hub</h1>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
              Your all-in-one platform for AI-powered productivity, learning, and creativity.
            </p>
          </div>
        </div>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Multilingual AI Chat</CardTitle>
            <CardDescription>Converse with our AI in Tigrinya and Saho.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Go to the chat feature to start.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Image Generation</CardTitle>
            <CardDescription>Turn your ideas into visuals with a simple prompt.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Visit the image generator to create.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Personalized Learning</CardTitle>
            <CardDescription>Get AI-driven learning paths tailored to your goals.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Explore the learning hub for resources.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
