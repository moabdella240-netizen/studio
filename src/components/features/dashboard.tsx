import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="relative h-96 w-full">
          <Image
            src="https://images.unsplash.com/photo-1626908013351-800ddd734b8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8YWJzdHJhY3QlMjB0ZWNobm9sb2d5fGVufDB8fHx8MTc2Nzc0MjM0MHww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="AI-powered productivity"
            fill
            className="object-cover"
            data-ai-hint="abstract technology"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <h1 className="text-5xl font-bold font-headline text-primary">Empowering Eritrean Knowledge with AI</h1>
            <p className="mt-4 text-lg text-foreground max-w-2xl">
              Your all-in-one platform for AI-powered productivity, learning, and creativity.
            </p>
            <div className="mt-6 flex gap-4">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg">Start Learning</Button>
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg">Try AI Assistant</Button>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg hover:-translate-y-1 transition-transform duration-300 border-border bg-card">
          <CardHeader>
            <CardTitle>Multilingual AI Chat</CardTitle>
            <CardDescription>Converse with our AI in Tigrinya and Saho.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Go to the chat feature to start.</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg hover:-translate-y-1 transition-transform duration-300 border-border bg-card">
          <CardHeader>
            <CardTitle>AI Image Generation</CardTitle>
            <CardDescription>Turn your ideas into visuals with a simple prompt.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Visit the image generator to create.</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg hover:-translate-y-1 transition-transform duration-300 border-border bg-card">
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
