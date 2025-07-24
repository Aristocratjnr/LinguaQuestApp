import { TrendingUp, Languages, Heart, Star } from "lucide-react";

interface ScoringDisplayProps {
  persuasionStrength?: number;
  translationAccuracy?: number;
  culturalAppropriateness?: number;
  persuasionChange?: number;
  feedback?: string;
  isVisible: boolean;
}

export default function ScoringDisplay({
  persuasionStrength = 0,
  translationAccuracy = 0,
  culturalAppropriateness = 0,
  persuasionChange = 0,
  feedback,
  isVisible
}: ScoringDisplayProps) {
  if (!isVisible) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="duo-card p-6 mt-4 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-black text-gray-800 flex items-center">
            <Star className="w-5 h-5 text-yellow-500 mr-2" />
            Your Performance
          </h4>
          <div className="flex items-center space-x-1 bg-yellow-100 px-3 py-1 rounded-full">
            <Star className="w-4 h-4 text-yellow-600" />
            <span className="font-bold text-yellow-700">+25 XP</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-gray-700">Persuasion Strength</span>
              </div>
              <span className={`font-black text-lg ${getScoreColor(persuasionStrength)}`}>
                {persuasionStrength}%
              </span>
            </div>
            <div className="duo-progress-bar">
              <div 
                className="duo-progress-fill" 
                style={{ width: `${persuasionStrength}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Languages className="w-5 h-5 text-green-500" />
                <span className="font-semibold text-gray-700">Translation Accuracy</span>
              </div>
              <span className={`font-black text-lg ${getScoreColor(translationAccuracy)}`}>
                {translationAccuracy}%
              </span>
            </div>
            <div className="duo-progress-bar">
              <div 
                className="duo-progress-fill" 
                style={{ width: `${translationAccuracy}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-purple-500" />
                <span className="font-semibold text-gray-700">Cultural Respect</span>
              </div>
              <span className={`font-black text-lg ${getScoreColor(culturalAppropriateness)}`}>
                {culturalAppropriateness}%
              </span>
            </div>
            <div className="duo-progress-bar">
              <div 
                className="duo-progress-fill" 
                style={{ width: `${culturalAppropriateness}%` }}
              />
            </div>
          </div>
        </div>

        {persuasionChange !== 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">AI Stance Change:</span>
              <span className={`font-black text-lg ${
                persuasionChange > 0 ? "text-green-600" : 
                persuasionChange < 0 ? "text-red-600" : "text-gray-600"
              }`}>
                {persuasionChange > 0 ? "+" : ""}{persuasionChange}
              </span>
            </div>
          </div>
        )}

        {feedback && (
          <div className="pt-4 border-t border-gray-200">
            <h5 className="font-bold text-gray-700 mb-2">AI Feedback:</h5>
            <p className="text-sm text-gray-600 italic leading-relaxed">"{feedback}"</p>
          </div>
        )}
      </div>
    </div>
  );
}