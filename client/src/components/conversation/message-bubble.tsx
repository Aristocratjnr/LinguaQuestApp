import { Languages, Lightbulb, Volume2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Message, Character } from "@shared/schema";

interface MessageBubbleProps {
  message: Message;
  character?: Character;
  user: {
    avatar: string;
  };
  onShowTranslation: (text: string, sourceLanguage?: string) => void;
  onShowCulturalTip: (tip: string) => void;
}

export default function MessageBubble({ 
  message, 
  character, 
  user,
  onShowTranslation,
  onShowCulturalTip 
}: MessageBubbleProps) {
  const isUser = message.sender === "user";
  const avatar = isUser ? user.avatar : (character?.avatar || "/placeholder-avatar.jpg");
  const name = isUser ? "You" : (character?.name || "AI");

  return (
    <div className={`flex items-start space-x-3 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <img 
          src={avatar}
          alt={name}
          className="w-10 h-10 rounded-full object-cover" 
        />
      )}
      
      <div className={`flex-1 ${isUser ? "flex justify-end" : ""}`}>
        <div className={`rounded-2xl p-3 max-w-xs ${
          isUser 
            ? "bg-gradient-to-r from-duo-green to-duo-blue text-white rounded-tr-md" 
            : "bg-gray-100 text-gray-800 rounded-tl-md"
        }`}>
          <p>{message.content}</p>
        </div>
        
        {!isUser && (
          <div className="flex items-center space-x-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-duo-blue text-xs font-medium hover:underline p-0 h-auto"
              onClick={() => onShowTranslation(message.content, character?.language)}
            >
              <Languages className="w-3 h-3 mr-1" />
              Translate
            </Button>
            
            {message.aiResponse && (
              <Button
                variant="ghost"
                size="sm"
                className="text-duo-purple text-xs font-medium hover:underline p-0 h-auto"
                onClick={() => onShowCulturalTip(message.aiResponse!)}
              >
                <Lightbulb className="w-3 h-3 mr-1" />
                AI Feedback
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="text-duo-gray text-xs hover:text-duo-blue p-0 h-auto"
            >
              <Volume2 className="w-3 h-3" />
            </Button>
            
            {message.xpAwarded && message.xpAwarded > 0 && (
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-duo-yellow" />
                <span className="text-xs text-duo-gray">+{message.xpAwarded} XP</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {isUser && (
        <img 
          src={avatar}
          alt={name}
          className="w-10 h-10 rounded-full object-cover" 
        />
      )}
    </div>
  );
}
