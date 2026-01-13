import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, Loader2, MapPin, Navigation, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface SmartAIChatProps {
  context?: {
    currentLocation?: { lat: number; lng: number };
    currentCity?: string;
    recentBusinesses?: string[];
  };
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/bizmap-ai`;

const quickActions = [
  { icon: MapPin, label: "Find nearby", prompt: "Find businesses near me" },
  { icon: Navigation, label: "Plan route", prompt: "Help me plan an efficient route for multiple stops" },
  { icon: Clock, label: "Open now", prompt: "What restaurants are open right now?" },
  { icon: Users, label: "Less crowded", prompt: "Find less crowded places to visit" },
];

const SmartAIChat = ({ context }: SmartAIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "👋 Hi! I'm your BizMap AI assistant. I can help you discover businesses, plan efficient routes, and find the best times to visit. What would you like to explore today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const streamChat = async (userMessage: string) => {
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          context 
        }),
      });

      if (!resp.ok) {
        if (resp.status === 429) {
          toast({
            title: "Rate Limited",
            description: "Too many requests. Please wait a moment.",
            variant: "destructive"
          });
          return;
        }
        if (resp.status === 402) {
          toast({
            title: "Credits Exhausted",
            description: "Please add AI credits to continue.",
            variant: "destructive"
          });
          return;
        }
        throw new Error("Failed to connect to AI");
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && prev.length > 1) {
                  return prev.map((m, i) => 
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, { role: "assistant" as const, content: assistantContent }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to AI assistant",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    const message = input.trim();
    setInput('');
    streamChat(message);
  };

  const handleQuickAction = (prompt: string) => {
    if (isLoading) return;
    streamChat(prompt);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full cosmic-gradient flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">BizMap AI</h3>
            <p className="text-xs text-muted-foreground">Intelligent Business Discovery</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b border-border bg-muted/30">
        <div className="flex gap-2 overflow-x-auto">
          {quickActions.map((action, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action.prompt)}
              disabled={isLoading}
              className="flex-shrink-0 text-xs"
            >
              <action.icon className="h-3 w-3 mr-1" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex gap-3",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full cosmic-gradient flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3",
                  message.role === 'user'
                    ? 'cosmic-gradient text-white rounded-br-md'
                    : 'bg-card border border-border rounded-bl-md'
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full cosmic-gradient flex items-center justify-center">
                <Loader2 className="h-4 w-4 text-white animate-spin" />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card/50">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about businesses, routes, or recommendations..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()}
            className="cosmic-gradient text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SmartAIChat;
