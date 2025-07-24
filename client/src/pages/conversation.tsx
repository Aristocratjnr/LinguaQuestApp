import { useState, useRef, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import TopNavigation from "@/components/ui/top-navigation";
import ProgressHeader from "@/components/ui/progress-header";
import CharacterIntro from "@/components/conversation/character-intro";
import MessageBubble from "@/components/conversation/message-bubble";
import InputArea from "@/components/conversation/input-area";
import TranslationTooltip from "@/components/conversation/translation-tooltip";
import CulturalTip from "@/components/conversation/cultural-tip";
import AchievementPopup from "@/components/conversation/achievement-popup";
import type { Message, Achievement } from "@shared/schema";

const MOCK_USER = {
  id: 1,
  username: "learner",
  streak: 127,
  hearts: 5,
  totalXp: 2450,
  level: 8,
  avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
};

export default function Conversation() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const conversationId = parseInt(id || "0");
  
  const [translationData, setTranslationData] = useState<{
    isVisible: boolean;
    originalText: string;
    translatedText: string;
  }>({ isVisible: false, originalText: "", translatedText: "" });
  
  const [culturalTipData, setCulturalTipData] = useState<{
    isVisible: boolean;
    tip: string;
  }>({ isVisible: false, tip: "" });
  
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversationData, isLoading } = useQuery({
    queryKey: ["/api/conversations", conversationId],
    enabled: !!conversationId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      setIsTyping(true);
      const response = await apiRequest("POST", `/api/conversations/${conversationId}/messages`, {
        sender: "user",
        content,
        translation: "",
        culturalContext: "",
        xpAwarded: 0
      });
      return response.json();
    },
    onSuccess: (data) => {
      setIsTyping(false);
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", conversationId] });
      
      // Check if this unlocked any achievements
      if (data.conversation && data.conversation.progress === 1) {
        setTimeout(() => {
          setNewAchievement({
            id: Date.now(),
            userId: MOCK_USER.id,
            type: "conversation_starter",
            title: "Conversation Starter!",
            description: `You successfully started your first conversation with ${(conversationData as any)?.character?.name}!`,
            xpReward: 50,
            unlockedAt: new Date()
          });
        }, 1000);
      }
    },
    onError: () => {
      setIsTyping(false);
    }
  });

  const translateMutation = useMutation({
    mutationFn: async ({ text, sourceLanguage }: { text: string; sourceLanguage?: string }) => {
      const response = await apiRequest("POST", "/api/translate", {
        text,
        sourceLanguage,
        targetLanguage: "en"
      });
      return response.json();
    },
    onSuccess: (data) => {
      setTranslationData({
        isVisible: true,
        originalText: data.translation.originalText,
        translatedText: data.translation.translatedText
      });
    }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [(conversationData as any)?.messages, isTyping]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-duo-blue"></div>
      </div>
    );
  }

  if (!(conversationData as any)?.conversation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Conversation not found</h2>
          <button 
            onClick={() => setLocation("/")}
            className="text-duo-blue hover:underline"
          >
            Return to home
          </button>
        </div>
      </div>
    );
  }

  const { conversation, messages = [], character } = conversationData as any;

  const handleSendMessage = (content: string) => {
    sendMessageMutation.mutate(content);
  };

  const handleShowTranslation = (text: string, sourceLanguage?: string) => {
    translateMutation.mutate({ text, sourceLanguage });
  };

  const handleShowCulturalTip = (tip: string) => {
    setCulturalTipData({ isVisible: true, tip });
  };

  const handleCloseTranslation = () => {
    setTranslationData({ ...translationData, isVisible: false });
  };

  const handleCloseCulturalTip = () => {
    setCulturalTipData({ ...culturalTipData, isVisible: false });
  };

  const handleCloseAchievement = () => {
    setNewAchievement(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <TopNavigation 
        user={MOCK_USER} 
        onBack={() => setLocation("/")}
      />
      
      <ProgressHeader 
        conversation={conversation}
        character={character}
        user={MOCK_USER}
      />

      <div className="max-w-md mx-auto bg-white min-h-[60vh] relative">
        {character && (
          <CharacterIntro 
            character={character}
            onShowInfo={() => {}}
          />
        )}

        <div className="p-4 space-y-4 max-h-96 overflow-y-auto pb-32" id="conversationArea">
          {messages.map((message: Message) => (
            <MessageBubble
              key={message.id}
              message={message}
              character={character}
              user={MOCK_USER}
              onShowTranslation={handleShowTranslation}
              onShowCulturalTip={handleShowCulturalTip}
            />
          ))}

          {isTyping && character && (
            <div className="flex items-start space-x-3">
              <img 
                src={character.avatar || "/placeholder-avatar.jpg"} 
                alt={character.name}
                className="w-10 h-10 rounded-full object-cover" 
              />
              <div className="bg-gray-100 rounded-2xl rounded-tl-md p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-duo-gray rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-duo-gray rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-duo-gray rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <InputArea
        onSendMessage={handleSendMessage}
        isLoading={sendMessageMutation.isPending}
        suggestions={[
          "Hola, ¿cómo está?",
          "Me gustaría...",
          "¿Cuánto cuesta?",
          "Gracias"
        ]}
        targetLanguage={character?.language || "Spanish"}
      />

      <TranslationTooltip
        isVisible={translationData.isVisible}
        originalText={translationData.originalText}
        translatedText={translationData.translatedText}
        onClose={handleCloseTranslation}
      />

      <CulturalTip
        isVisible={culturalTipData.isVisible}
        tip={culturalTipData.tip}
        onClose={handleCloseCulturalTip}
      />

      {newAchievement && (
        <AchievementPopup
          achievement={newAchievement}
          isVisible={true}
          onClose={handleCloseAchievement}
        />
      )}
    </div>
  );
}
