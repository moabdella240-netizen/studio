"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { translateAndChat } from "@/ai/flows/translate-and-chat";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mic, Bot, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const voiceSchema = z.object({
  message: z.string().min(1, "Message cannot be empty."),
});

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function VoiceAssistant() {
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

  const form = useForm<z.infer<typeof voiceSchema>>({
    resolver: zodResolver(voiceSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof voiceSchema>) => {
    setIsThinking(true);
    const userMessage: ChatMessage = { role: "user", content: values.message };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();

    try {
      const result = await translateAndChat({ message: `Act as a helpful life-advice assistant and respond to this: ${values.message}`, targetLanguage: 'Tigrinya' });
      const assistantMessage: ChatMessage = { role: "assistant", content: result.response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "The assistant is unavailable right now. Please try again later.",
      });
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <Card className="h-[70vh] flex flex-col max-w-3xl mx-auto">
      <CardHeader className="text-center">
        <Mic className="mx-auto h-12 w-12 text-primary mb-2" />
        <CardTitle>AI Voice Assistant</CardTitle>
        <CardDescription>Ask for lifestyle or problem-solving advice. (Text input for now)</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Ask me anything...</p>
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
                  className={`max-w-lg p-3 rounded-lg shadow-sm ${
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
                    <Textarea
                      placeholder="Ask for advice..."
                      {...field}
                      disabled={isThinking}
                      className="min-h-[40px] max-h-[120px]"
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
            <Button type="submit" disabled={isThinking}>
              {isThinking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Ask"
              )}
            </Button>
          </form>
        </Form>
      </CardFooter>
    </Card>
  );
}
