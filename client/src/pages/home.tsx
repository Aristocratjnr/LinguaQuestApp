import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Flame, Heart, Star, Trophy, Users, MapPin } from "lucide-react";
import type { Character } from "@shared/schema";

const MOCK_USER = {
  id: 1,
  username: "learner",
  streak: 127,
  hearts: 5,
  totalXp: 2450,
  level: 8,
  avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
};

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("intermediate");

  const { data: charactersData, isLoading } = useQuery({
    queryKey: ["/api/characters"],
  });

  const startConversationMutation = useMutation({
    mutationFn: async ({ characterId, difficulty }: { characterId: number; difficulty: string }) => {
      // Generate a random debate scenario based on character and difficulty
      const scenarios = {
        beginner: [
          "Should traditional cooking methods be preserved over modern convenience?",
          "Is it better to live in the city or countryside?",
          "Should children learn traditional languages first?"
        ],
        intermediate: [
          "Should Ghana prioritize renewable energy over economic growth?",
          "Is technology making traditional crafts obsolete?",
          "Should education be taught in local languages or English?"
        ],
        advanced: [
          "How should Ghana balance cultural preservation with modernization?",
          "What role should traditional leadership play in modern governance?",
          "How can Ghana address climate change while developing economically?"
        ]
      };
      
      const scenarioList = scenarios[difficulty as keyof typeof scenarios] || scenarios.intermediate;
      const randomScenario = scenarioList[Math.floor(Math.random() * scenarioList.length)];
      
      const response = await apiRequest("POST", "/api/conversations", {
        userId: MOCK_USER.id,
        characterId,
        title: "Persuasion Challenge",
        difficulty,
        scenario: randomScenario,
        topic: randomScenario,
        aiStance: "I have strong opinions about this topic that you must convince me to reconsider."
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setLocation(`/conversation/${data.conversation.id}`);
    },
  });

  const characters = (charactersData as any)?.characters || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-duo-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #E3F2FD 0%, #F1F8E9 100%)' }}>
      {/* Top Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-orange-50 px-3 py-1 rounded-full">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-orange-600">{MOCK_USER.streak}</span>
            </div>
          </div>
          
          <h1 className="text-xl font-black text-gray-800" style={{ color: '#3E8E00' }}>PersuadeGH</h1>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-red-50 px-3 py-1 rounded-full">
              <Heart className="w-5 h-5 text-red-500 fill-current" />
              <span className="font-bold text-red-600">{MOCK_USER.hearts}</span>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-full overflow-hidden border-2 border-white shadow-md">
              <img src={MOCK_USER.avatar} alt="User avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </nav>

      {/* User Stats */}
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="duo-card p-6" style={{ background: 'linear-gradient(135deg, #F8F9FA 0%, #E3F2FD 100%)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-gray-800 mb-1">Welcome back!</h2>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 bg-blue-100 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-blue-700">Level {MOCK_USER.level}</span>
                </div>
                <div className="flex items-center space-x-1 bg-yellow-100 px-3 py-1 rounded-full">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                  <span className="font-bold text-yellow-700">{MOCK_USER.totalXp} XP</span>
                </div>
              </div>
            </div>
            <div className="text-6xl">🇬🇭</div>
          </div>
        </div>
      </div>

      {/* Difficulty Selection */}
      <div className="max-w-md mx-auto px-4 mb-6">
        <div className="duo-card p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
              <Users className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-black text-gray-800">Choose Your Challenge</h3>
          </div>
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="duo-button h-12 text-left font-bold" style={{ 
              background: '#F0F0F0', 
              border: '2px solid #CECECE',
              borderRadius: '12px'
            }}>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent className="duo-card border-0 shadow-xl">
              <SelectItem value="beginner" className="font-semibold p-4 hover:bg-green-50">
                🟢 Beginner - Simple arguments
              </SelectItem>
              <SelectItem value="intermediate" className="font-semibold p-4 hover:bg-yellow-50">
                🟡 Intermediate - Persuasive debates
              </SelectItem>
              <SelectItem value="advanced" className="font-semibold p-4 hover:bg-red-50">
                🔴 Advanced - Complex persuasion
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Characters */}
      <div className="max-w-md mx-auto px-4 pb-8">
        <h3 className="text-xl font-black text-gray-800 mb-6 text-center">Choose Your Debate Opponent</h3>
        <div className="space-y-4">
          {characters.map((character: Character) => (
            <div key={character.id} className="duo-card p-6 hover:shadow-xl transition-all duration-200 hover:scale-105">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-gray-100 to-gray-200">
                    <img 
                      src={character.avatar || "/placeholder-avatar.jpg"} 
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center border-2 border-white">
                    <Users className="w-3 h-3 text-white" />
                  </div>
                </div>
                
                  <div>
                    <h4 className="font-black text-lg text-gray-800">{character.name}</h4>
                    <p className="text-sm font-semibold text-gray-600">{character.role}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <MapPin className="w-3 h-3 text-red-500" />
                      <span className="text-xs text-gray-500">{character.location}</span>
                      <div className="px-2 py-1 bg-yellow-100 rounded-full">
                        <span className="text-xs font-bold text-yellow-800">{character.language}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{character.backgroundContext}</p>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => startConversationMutation.mutate({ 
                      characterId: character.id, 
                      difficulty: selectedDifficulty 
                    })}
                    disabled={startConversationMutation.isPending}
                    className="duo-button-primary px-6 py-3 text-sm font-black disabled:opacity-50"
                  >
                    {startConversationMutation.isPending ? "Starting..." : "START DEBATE"}
                  </button>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
