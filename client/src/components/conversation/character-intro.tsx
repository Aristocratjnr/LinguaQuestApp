import { Info, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Character } from "@shared/schema";

interface CharacterIntroProps {
  character: Character;
  onShowInfo: () => void;
}

export default function CharacterIntro({ character, onShowInfo }: CharacterIntroProps) {
  return (
    <div className="p-4 bg-gradient-to-r from-duo-green/10 to-duo-blue/10 border-b">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img 
            src={character.avatar || "/placeholder-avatar.jpg"} 
            alt={`AI Character - ${character.name}`}
            className="w-16 h-16 rounded-full object-cover border-3 border-duo-green" 
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-duo-green rounded-full flex items-center justify-center">
            <Users className="w-3 h-3 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800">{character.name}</h3>
          <p className="text-sm text-duo-gray">{character.role}</p>
          <div className="flex items-center space-x-2 mt-1">
            <MapPin className="w-3 h-3 text-duo-red" />
            <span className="text-xs text-duo-gray">{character.location}</span>
            <Badge className="text-xs bg-duo-yellow text-gray-800 hover:bg-duo-yellow">
              Native Speaker
            </Badge>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onShowInfo}
          className="p-2 rounded-full bg-duo-blue/10 hover:bg-duo-blue/20"
        >
          <Info className="w-4 h-4 text-duo-blue" />
        </Button>
      </div>
    </div>
  );
}
