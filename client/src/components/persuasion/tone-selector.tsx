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
    <div className="mb-6">
      <h4 className="text-lg font-black text-gray-800 mb-4 text-center">Choose your persuasion style:</h4>
      <div className="grid grid-cols-2 gap-3">
        {tones.map((tone) => {
          const IconComponent = tone.icon;
          const isSelected = selectedTone === tone.id;
          
          return (
            <button
              key={tone.id}
              className={`duo-card p-4 flex flex-col items-center space-y-2 transition-all duration-200 hover:scale-105 ${
                isSelected ? "ring-4 ring-green-400 bg-green-50" : "hover:shadow-md"
              }`}
              onClick={() => onToneChange(tone.id)}
              disabled={disabled}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isSelected ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600"
              }`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-gray-800">{tone.name}</span>
              <span className="text-xs text-gray-500 text-center leading-tight">{tone.description}</span>
              <span className="text-xs font-medium text-blue-600 italic">"{tone.example}"</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}