import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Character } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("intermediate");
  const { user } = useAuth();

  const { data: charactersData, isLoading } = useQuery({
    queryKey: ["/api/characters"],
  });

  const startConversationMutation = useMutation({
    mutationFn: async ({ characterId, difficulty }: { characterId: number; difficulty: string }) => {
      const response = await apiRequest("POST", "/api/conversations", {
        characterId,
        title: "Persuasion Challenge",
        difficulty
      });
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setLocation(`/conversation/${data.conversation.id}`);
    },
    onError: (error) => {
      console.error("Failed to start conversation:", error);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center">
        <div className="glass-lemon-card p-8 text-center">
          <span className="material-icons text-4xl text-amber-600 animate-spin mb-4 block">hourglass_empty</span>
          <p className="text-gray-700 font-semibold">Loading LinguaQuest...</p>
        </div>
      </div>
    );
  }

  const characters: Character[] = charactersData?.characters || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      {/* Header with User Profile */}
      <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 px-4 py-6 border-b-4 border-amber-500">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="glass-card p-3 rounded-full">
              <span className="material-icons text-2xl text-amber-600">language</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-800">LinguaQuest</h1>
              <p className="text-sm text-gray-700">Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => window.location.href = '/api/logout'}
              className="glass-button px-4 py-2 text-sm border-0 rounded-lg text-gray-800 hover:text-white"
            >
              <span className="material-icons text-sm mr-1">logout</span>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gradient-to-r from-amber-300 to-yellow-300 px-4 py-4">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-1 glass-card px-3 py-2 rounded-full">
            <span className="material-icons text-red-500 text-sm">favorite</span>
            <span className="text-sm font-bold text-gray-800">{user?.hearts || 5}</span>
          </div>
          
          <div className="flex items-center space-x-1 glass-card px-3 py-2 rounded-full">
            <span className="material-icons text-orange-500 text-sm">local_fire_department</span>
            <span className="text-sm font-bold text-gray-800">{user?.streak || 0}</span>
          </div>
          
          <div className="flex items-center space-x-1 glass-card px-3 py-2 rounded-full">
            <span className="material-icons text-yellow-600 text-sm">stars</span>
            <span className="text-sm font-bold text-gray-800">{user?.totalXp || 0} XP</span>
          </div>
          
          <div className="flex items-center space-x-1 glass-card px-3 py-2 rounded-full">
            <span className="material-icons text-purple-500 text-sm">emoji_events</span>
            <span className="text-sm font-bold text-gray-800">Lv {user?.level || 1}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Difficulty Selection */}
        <div className="glass-lemon-card p-6 mb-8">
          <h2 className="text-xl font-black text-gray-800 mb-4 flex items-center">
            <span className="material-icons text-purple-500 mr-2">tune</span>
            Choose Your Challenge
          </h2>
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="glass-button border-0 text-gray-800 font-semibold">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">
                <div className="flex items-center">
                  <span className="material-icons text-green-500 mr-2 text-sm">child_care</span>
                  Beginner - Simple Topics
                </div>
              </SelectItem>
              <SelectItem value="intermediate">
                <div className="flex items-center">
                  <span className="material-icons text-orange-500 mr-2 text-sm">school</span>
                  Intermediate - Cultural Issues
                </div>
              </SelectItem>
              <SelectItem value="advanced">
                <div className="flex items-center">
                  <span className="material-icons text-red-500 mr-2 text-sm">psychology</span>
                  Advanced - Complex Debates
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Characters */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-gray-800 text-center">Choose Your Debate Opponent</h3>
          {characters.map((character: Character) => (
            <div key={character.id} className="glass-lemon-card p-6 hover:scale-105 transition-all duration-200">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    {character.avatar ? (
                      <img 
                        src={character.avatar} 
                        alt={character.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="material-icons text-2xl text-gray-500">person</span>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center border-2 border-white">
                    <span className="material-icons text-white text-xs">chat</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-black text-lg text-gray-800">{character.name}</h4>
                  <p className="text-sm font-semibold text-gray-600">{character.role}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="material-icons text-red-500 text-xs">place</span>
                    <span className="text-xs text-gray-500">{character.location}</span>
                    <div className="px-2 py-1 bg-yellow-100 rounded-full">
                      <span className="text-xs font-bold text-yellow-800">{character.language}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 leading-relaxed">{character.backgroundContext}</p>
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={() => startConversationMutation.mutate({ 
                    characterId: character.id, 
                    difficulty: selectedDifficulty 
                  })}
                  disabled={startConversationMutation.isPending}
                  className="glass-button px-6 py-3 text-sm font-black border-0 rounded-xl text-gray-800 hover:text-white disabled:opacity-50"
                >
                  {startConversationMutation.isPending ? (
                    <>
                      <span className="material-icons text-sm mr-2 animate-spin">hourglass_empty</span>
                      Starting...
                    </>
                  ) : (
                    <>
                      <span className="material-icons text-sm mr-2">play_arrow</span>
                      START DEBATE
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}