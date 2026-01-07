
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToyBrick } from "lucide-react";

const translations = {
  ti: {
    title: "ጸወታታት ቋንቋ ምምሃር",
    description: "ብናይ ጸወታ መልክዕ፡ ቃላት ትግርኛ፣ እንግሊዝኛ፣ ወይ ዓረብኛ ተለማመድ።",
    comingSoon: "ብቕልጡፍ ይመጽእ ኣሎ!",
    message: "ኣብዚ ናይ ቋንቋ ምምሃር ጸወታታት ክንሰርሕ ኢና። ንተሳትፎኻ ነመስግን!",
  },
  en: {
    title: "Language Learning Games",
    description: "Practice your Tigrinya, English, or Arabic vocabulary in a fun, game-like way.",
    comingSoon: "Coming Soon!",
    message: "We are actively developing fun language learning games. Thanks for your interest!",
  },
  ar: {
    title: "ألعاب تعلم اللغة",
    description: "مارس مفرداتك في اللغة التجرينية أو الإنجليزية أو العربية بطريقة ممتعة تشبه الألعاب.",
    comingSoon: "قريباً!",
    message: "نحن نعمل بنشاط على تطوير ألعاب ممتعة لتعلم اللغة. شكرا لاهتمامك!",
  },
};

export default function LanguageLearningGames({ language = 'ti' }: { language?: 'ti' | 'en' | 'ar' }) {
  const t = translations[language];

  return (
    <Card className="max-w-4xl mx-auto">
       <CardHeader className="text-center">
        <ToyBrick className="mx-auto h-12 w-12 text-primary mb-2" />
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[40vh] p-8 bg-muted/50 rounded-lg">
          <h3 className="text-2xl font-bold text-primary mb-4">{t.comingSoon}</h3>
          <p>{t.message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
