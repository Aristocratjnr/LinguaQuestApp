import { MessageCircle } from "lucide-react";
import type { Conversation, Character } from "@shared/schema";

interface ProgressHeaderProps {
  conversation: Conversation;
  character?: Character;
  user: {
    totalXp: number;
  };
}

export default function ProgressHeader({ conversation, character, user }: ProgressHeaderProps) {
  const progressPercentage = Math.round(((conversation.progress || 0) / (conversation.totalRounds || 5)) * 100);

  return (
    <div className="max-w-md mx-auto px-4 py-4 bg-white border-b">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-duo-purple to-duo-blue rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">{conversation.title}</h2>
            <p className="text-sm text-duo-gray">
              {conversation.difficulty.charAt(0).toUpperCase() + conversation.difficulty.slice(1)} • {character?.language}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-duo-yellow font-bold text-lg">+{conversation.xpEarned} XP</div>
          <div className="text-xs text-duo-gray">This lesson</div>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
        <div 
          className="bg-gradient-to-r from-duo-green to-duo-blue h-3 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-duo-gray">
        <span>Progress: {progressPercentage}%</span>
        <span>{conversation.progress}/{conversation.totalRounds || 5} rounds</span>
      </div>
    </div>
  );
}
