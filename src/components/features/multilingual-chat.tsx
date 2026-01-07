"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { translateAndChat } from "@/ai/flows/translate-and-chat";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const translations = {
  ti: {
    title: "ትርጉምን ዕላልን",
    initialMessage: "ብእንግሊዝኛ ጽሒፍካ ምዝርራብ ጀምር።",
    placeholder: "መልእኽትኻ ብእንግሊዝኛ ኣብዚ ጸሓፍ...",
    send: "ስደድ",
    thinking: "ይሓስብ ኣሎ...",
    errorTitle: "ጌጋ ኣጋጢሙ",
    errorMessage: "ካብ AI መልሲ ክንረክብ ኣይከኣልናን። በጃኻ ደጊምካ ፈትን።",
    emptyMessage: "መልእኽቲ ባዶ ክኸውን ኣይክእልን።",
  },
  en: {
    title: "Multilingual Chat",
    initialMessage: "Start a conversation by typing below.",
    placeholder: "Type your message in English...",
    send: "Send",
    thinking: "Thinking...",
    errorTitle: "Error",
    errorMessage: "Failed to get a response from the AI. Please try again.",
    emptyMessage: "Message cannot be empty.",
  }
};

export default function MultilingualChat({ language = 'ti' }: { language?: 'ti' | 'en' }) {
  const t = translations[language];

  const chatSchema = z.object({
    message: z.string().min(1, t.emptyMessage),
    targetLanguage: z.enum(["Tigrinya"]),
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
      message: "",
      targetLanguage: "Tigrinya",
    },
  });

  const onSubmit = async (values: z.infer<typeof chatSchema>) => {
    setIsThinking(true);
    const userMessage: ChatMessage = { role: "user", content: values.message };
    setMessages((prev) => [...prev, userMessage]);
    form.reset({ ...values, message: "" });

    try {
      const result = await translateAndChat(values);
      const assistantMessage: ChatMessage = { role: "assistant", content: result.response };
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
    <Card className="h-[70vh] flex flex-col">
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
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
                  <Avatar className="w-8 h-8">
                    <AvatarFallback><Bot size={18} /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-md p-3 rounded-lg shadow-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.content}
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
                <Avatar className="w-8 h-8">
                  <AvatarFallback><Bot size={18} /></AvatarFallback>
                </Avatar>
                <div className="max-w-md p-3 rounded-lg bg-muted">
                  <Loader2 className="w-5 h-5 animate-spin" />
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
              name="message"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input placeholder={t.placeholder} {...field} disabled={isThinking} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isThinking} size="icon">
              {isThinking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="sr-only">{t.send}</span>
            </Button>
          </form>
        </Form>
      </CardFooter>
    </Card>
  );
}
