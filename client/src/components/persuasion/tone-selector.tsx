import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Zap, Users, Crown } from "lucide-react";

interface ToneSelectorProps {
  selectedTone: string;
  onToneChange: (tone: string) => void;
  disabled?: boolean;
}

const tones = [
  {
    id: "polite",
    name: "Polite",
    description: "Respectful and courteous",
    icon: Heart,
    color: "bg-duo-green",
    example: "With all due respect..."
  },
  {
    id: "passionate",
    name: "Passionate",
    description: "Emotional and intense",
    icon: Zap,
    color: "bg-duo-orange", 
    example: "I strongly believe..."
  },
  {
    id: "formal",
    name: "Formal",
    description: "Professional and structured",
    icon: Crown,
    color: "bg-duo-blue",
    example: "According to research..."
  },
  {
    id: "casual",
    name: "Casual",
    description: "Friendly and conversational",
    icon: Users,
    color: "bg-duo-purple",
    example: "You know what I think..."
  }
];

export default function ToneSelector({ selectedTone, onToneChange, disabled }: ToneSelectorProps) {
  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Choose your tone:</h4>
      <div className="grid grid-cols-2 gap-2">
        {tones.map((tone) => {
          const IconComponent = tone.icon;
          const isSelected = selectedTone === tone.id;
          
          return (
            <Button
              key={tone.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className={`h-auto p-3 flex flex-col items-center space-y-1 ${
                isSelected ? `${tone.color} text-white` : "hover:bg-gray-50"
              }`}
              onClick={() => onToneChange(tone.id)}
              disabled={disabled}
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-xs font-medium">{tone.name}</span>
              <span className="text-xs opacity-80">{tone.example}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}