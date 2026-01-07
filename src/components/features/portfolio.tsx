'use client';

import { useState, useEffect } from 'react';
import { getPortfolioData, type PortfolioData } from '@/ai/flows/get-portfolio-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, UserCircle, Code, Briefcase, Languages, Facebook } from 'lucide-react';
import Link from 'next/link';

export default function Portfolio({ language = 'en' }: { language?: 'ti' | 'en' | 'ar' }) {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const portfolioData = await getPortfolioData();
        setData(portfolioData);
      } catch (error) {
        console.error('Failed to fetch portfolio data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-muted-foreground">
        <p>Could not load portfolio data.</p>
      </div>
    );
  }
  
  const translations = {
      en: {
          about: "About Me",
          skills: "Skills",
          experience: "Experience",
          languages: "Languages",
          contact: "Contact",
          appName: "App Builder & Programmer"
      },
      ti: {
          about: "ብዛዕባይ",
          skills: "ክእለታት",
          experience: "ተሞክሮ",
          languages: "ቋንቋታት",
          contact: "ተወከስ",
          appName: "App Builder & Programmer"
      },
      ar: {
          about: "عني",
          skills: "مهارات",
          experience: "خبرة",
          languages: "لغات",
          contact: "اتصل",
          appName: "باني ومبرمج تطبيقات"
      }
  }
  
  const t = translations[language];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in p-4">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold font-headline text-primary">{data.name}</h1>
        <p className="text-xl text-muted-foreground">{t.appName}</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserCircle className="text-primary" /> {t.about}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{data.about}</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Code className="text-primary" /> {t.skills}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.skills.map((skillSet, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-2">{skillSet.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillSet.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Briefcase className="text-primary" /> {t.experience}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <h3 className="font-semibold">{exp.role}</h3>
                <p className="text-sm text-muted-foreground">{exp.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

       <div className="grid md:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Languages className="text-primary" /> {t.languages}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                {data.languages.map((lang, index) => (
                    <Badge key={index} variant="outline">{lang}</Badge>
                ))}
                </div>
            </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t.contact}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href={data.contact.facebook} target="_blank" rel="noopener noreferrer">
                <Facebook className="mr-2" /> Facebook
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
