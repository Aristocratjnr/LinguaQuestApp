import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Flame, Heart, Star, MapPin, Users, Trophy } from "lucide-react";
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
      const response = await apiRequest("POST", "/api/conversations", {
        userId: MOCK_USER.id,
        characterId,
        title: "New Conversation",
        difficulty
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-duo-orange rounded-full flex items-center justify-center">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-duo-orange">{MOCK_USER.streak}</span>
            </div>
          </div>
          
          <h1 className="text-lg font-bold text-gray-800">PersuadeGH</h1>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4 text-duo-red" />
              <span className="font-bold text-duo-red">{MOCK_USER.hearts}</span>
            </div>
            <div className="w-8 h-8 bg-duo-green rounded-full overflow-hidden">
              <img src={MOCK_USER.avatar} alt="User avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </nav>

      {/* User Stats */}
      <div className="max-w-md mx-auto px-4 py-4">
        <Card className="bg-gradient-to-r from-duo-green/10 to-duo-blue/10 border-none">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Welcome back!</h2>
                <p className="text-duo-gray">Level {MOCK_USER.level} • {MOCK_USER.totalXp} XP</p>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-duo-yellow" />
                <Trophy className="w-5 h-5 text-duo-orange" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Difficulty Selection */}
      <div className="max-w-md mx-auto px-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Users className="w-5 h-5 mr-2 text-duo-blue" />
              Choose Your Persuasion Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner - Simple arguments</SelectItem>
                <SelectItem value="intermediate">Intermediate - Persuasive debates</SelectItem>
                <SelectItem value="advanced">Advanced - Complex persuasion</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Characters */}
      <div className="max-w-md mx-auto px-4 pb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Choose Your Debate Opponent</h3>
        <div className="space-y-4">
          {characters.map((character: Character) => (
            <Card key={character.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img 
                      src={character.avatar || "/placeholder-avatar.jpg"} 
                      alt={character.name}
                      className="w-16 h-16 rounded-full object-cover border-3 border-duo-green"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-duo-green rounded-full flex items-center justify-center">
                      <Users className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{character.name}</h4>
                    <p className="text-sm text-duo-gray">{character.role}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="w-3 h-3 text-duo-red" />
                      <span className="text-xs text-duo-gray">{character.location}</span>
                      <Badge variant="secondary" className="text-xs bg-duo-yellow text-gray-800">
                        {character.language}
                      </Badge>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => startConversationMutation.mutate({ 
                      characterId: character.id, 
                      difficulty: selectedDifficulty 
                    })}
                    disabled={startConversationMutation.isPending}
                    className="bg-gradient-to-r from-duo-green to-duo-blue hover:shadow-lg transition-all duration-200"
                  >
                    {startConversationMutation.isPending ? "Starting..." : "Chat"}
                  </Button>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-600">{character.backgroundContext}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
