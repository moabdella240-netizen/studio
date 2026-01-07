"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { answerGeneralQuestion } from "@/ai/flows/q-and-a";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Loader2, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const translations = {
  ti: {
    title: "ማእከል ሕቶን መልስን",
    description: "ዝኾነ ሕቶታትኩም ኣብዚ ሕተቱ፣ ብ AI ዝተደገፈ መልሲ ድማ ረኸቡ።",
    initialMessage: "እንታይ ክትፈልጥ ትደሊ፧ ሕቶኻ ኣብ ታሕቲ ጸሓፍ።",
    placeholder: "ሕቶኻ ኣብዚ ጸሓፍ...",
    send: "ስደድ",
    thinking: "ይሓስብ ኣሎ...",
    errorTitle: "ጌጋ ኣጋጢሙ",
    errorMessage: "መልሲ ክንረክብ ኣይከኣልናን። በጃኻ ደጊምካ ፈትን።",
    emptyMessage: "መልእኽቲ ባዶ ክኸውን ኣይክእልን።",
  },
  en: {
    title: "Q&A Hub",
    description: "Ask anything and get AI-powered answers.",
    initialMessage: "What would you like to know? Type your question below.",
    placeholder: "Type your question here...",
    send: "Send",
    thinking: "Thinking...",
    errorTitle: "Error",
    errorMessage: "Failed to get a response. Please try again.",
    emptyMessage: "Message cannot be empty.",
  },
  ar: {
    title: "مركز الأسئلة والأجوبة",
    description: "اسأل أي شيء واحصل على إجابات مدعومة بالذكاء الاصطناعي.",
    initialMessage: "ماذا تريد أن تعرف؟ اكتب سؤالك أدناه.",
    placeholder: "اكتب سؤالك هنا...",
    send: "إرسال",
    thinking: "يفكر...",
    errorTitle: "خطأ",
    errorMessage: "فشل في الحصول على استجابة. يرجى المحاولة مرة أخرى.",
    emptyMessage: "لا يمكن أن تكون الرسالة فارغة.",
  }
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};


export default function QandA({ language = 'ti' }: { language?: 'ti' | 'en' | 'ar' }) {
  const t = translations[language];
  const langKey = language === 'ar' ? 'Arabic' : language === 'en' ? 'English' : 'Tigrinya';

  const chatSchema = z.object({
    question: z.string().min(1, t.emptyMessage),
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const form = useForm<z.infer<typeof chatSchema>>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      question: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof chatSchema>) => {
    setIsThinking(true);
    const userMessage: ChatMessage = { role: "user", content: values.question };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();

    try {
      const result = await answerGeneralQuestion({ question: values.question, language: langKey });
      const assistantMessage: ChatMessage = { role: "assistant", content: result.answer };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      toast({
        variant: "destructive",
        title: t.errorTitle,
        description: t.errorMessage,
      });
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <Card className="h-[70vh] flex flex-col max-w-4xl mx-auto">
       <CardHeader className="text-center">
        <HelpCircle className="mx-auto h-12 w-12 text-primary mb-2" />
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>{t.initialMessage}</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${message.role === "user" ? "justify-end" : ""}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="w-8 h-8 bg-primary/10 text-primary">
                    <AvatarFallback><Bot size={18} /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-xl p-3 rounded-lg shadow-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                 {message.role === "user" && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback><User size={18} /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isThinking && (
              <div className="flex items-start gap-3">
                 <Avatar className="w-8 h-8 bg-primary/10 text-primary">
                  <AvatarFallback><Bot size={18} /></AvatarFallback>
                </Avatar>
                <div className="max-w-md p-3 rounded-lg bg-muted flex items-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  <span>{t.thinking}</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start w-full gap-2">
             <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Textarea
                      placeholder={t.placeholder}
                      {...field}
                      disabled={isThinking}
                      className="min-h-[40px] max-h-[150px]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          form.handleSubmit(onSubmit)();
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isThinking} size="icon">
                <Send className="w-4 h-4" />
                <span className="sr-only">{t.send}</span>
            </Button>
          </form>
        </Form>
      </CardFooter>
    </Card>
  );
}
