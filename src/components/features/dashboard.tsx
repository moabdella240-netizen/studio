import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const translations = {
  ti: {
    title: "ንኤርትራዊ ፍልጠት ብኣእምሮኣዊ ቴክኖሎጂ ምዕባይ",
    description: "ናይ AI ሓይሊ ዘለዎ፡ ንኹሉ መዳያዊ ፍርያት፡ ትምህርቲ፡ און ፈጠራን ዝኸውን መድረኽኩም።",
    startLearning: "ምምሃር ጀምር",
    tryAssistant: "AI ሓጋዚ ፈትን",
    chatTitle: "ብብዙሕ ቋንቋ ዝሰርሕ ቻት",
    chatDescription: "ምስ ናይና AI ብትግርኛ ተዛረብ።",
    chatAction: "ናብ ቻት ባህሪ ኪድ እሞ ጀምር።",
    imageTitle: "ምስሊ ምፍጣር",
    imageDescription: "ሓሳባትካ ብቐሊሉ ናብ ምስሊ ቀይሮም።",
    imageAction: "ንፈጥረት ናብ ምስሊ መፍጠሪ ኺድ።",
    learningTitle: "ብሕታዊ ትምህርቲ",
    learningDescription: "ብ AI ዝምራሕ፡ ንዕላማኻ ዝተዳለወ መንገድታት ትምህርቲ ርኸብ።",
    learningAction: "ንሀብትታት መምሃרי מאַ켄 ዳህסס።",
  },
  en: {
    title: "Empowering Eritrean Knowledge with AI",
    description: "Your all-in-one platform for AI-powered productivity, learning, and creativity.",
    startLearning: "Start Learning",
    tryAssistant: "Try AI Assistant",
    chatTitle: "Multilingual AI Chat",
    chatDescription: "Converse with our AI in Tigrinya.",
    chatAction: "Go to the chat feature to start.",
    imageTitle: "AI Image Generation",
    imageDescription: "Turn your ideas into visuals with a simple prompt.",
    imageAction: "Visit the image generator to create.",
    learningTitle: "Personalized Learning",
    learningDescription: "Get AI-driven learning paths tailored to your goals.",
    learningAction: "Explore the learning hub for resources.",
  }
};


export default function Dashboard({ language = 'ti' }: { language?: 'ti' | 'en' }) {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');
  const t = translations[language];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="relative h-96 w-full">
          {heroImage && (
             <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <h1 className="text-5xl font-bold font-headline text-primary">{t.title}</h1>
            <p className="mt-4 text-lg text-foreground max-w-2xl">
              {t.description}
            </p>
            <div className="mt-6 flex gap-4">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg">{t.startLearning}</Button>
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg">{t.tryAssistant}</Button>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg hover:-translate-y-1 transition-transform duration-300 border-border bg-card">
          <CardHeader>
            <CardTitle>{t.chatTitle}</CardTitle>
            <CardDescription>{t.chatDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t.chatAction}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg hover:-translate-y-1 transition-transform duration-300 border-border bg-card">
          <CardHeader>
            <CardTitle>{t.imageTitle}</CardTitle>
            <CardDescription>{t.imageDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t.imageAction}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg hover:-translate-y-1 transition-transform duration-300 border-border bg-card">
          <CardHeader>
            <CardTitle>{t.learningTitle}</CardTitle>
            <CardDescription>{t.learningDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t.learningAction}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
