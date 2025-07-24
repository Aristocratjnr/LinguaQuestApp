import { Trophy, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Achievement } from "@shared/schema";

interface AchievementPopupProps {
  achievement: Achievement;
  isVisible: boolean;
  onClose: () => void;
}

export default function AchievementPopup({ achievement, isVisible, onClose }: AchievementPopupProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 m-4 max-w-sm w-full text-center transform transition-all duration-300">
        <div className="w-20 h-20 bg-gradient-to-r from-duo-yellow to-duo-orange rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{achievement.title}</h3>
        <p className="text-duo-gray mb-4">{achievement.description}</p>
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Star className="w-5 h-5 text-duo-yellow" />
          <span className="font-bold text-duo-yellow">+{achievement.xpReward} XP</span>
        </div>
        <Button
          className="w-full bg-gradient-to-r from-duo-green to-duo-blue text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all duration-200"
          onClick={onClose}
        >
          ¡Excelente!
        </Button>
      </div>
    </div>
  );
}
