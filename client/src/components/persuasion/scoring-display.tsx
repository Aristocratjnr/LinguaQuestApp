import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
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
    if (score >= 80) return "text-duo-green";
    if (score >= 60) return "text-duo-yellow";
    if (score >= 40) return "text-duo-orange";
    return "text-duo-red";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-duo-green";
    if (score >= 60) return "bg-duo-yellow";
    if (score >= 40) return "bg-duo-orange";
    return "bg-duo-red";
  };

  return (
    <Card className="mt-4 border-2 border-duo-blue/20">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h4 className="font-bold text-gray-800 flex items-center">
            <Star className="w-4 h-4 text-duo-yellow mr-2" />
            Your Performance
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-duo-blue" />
                <span className="text-sm font-medium">Persuasion Strength</span>
              </div>
              <span className={`text-sm font-bold ${getScoreColor(persuasionStrength)}`}>
                {persuasionStrength}%
              </span>
            </div>
            <Progress value={persuasionStrength} className="h-2" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Languages className="w-4 h-4 text-duo-green" />
                <span className="text-sm font-medium">Translation Accuracy</span>
              </div>
              <span className={`text-sm font-bold ${getScoreColor(translationAccuracy)}`}>
                {translationAccuracy}%
              </span>
            </div>
            <Progress value={translationAccuracy} className="h-2" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-duo-purple" />
                <span className="text-sm font-medium">Cultural Respect</span>
              </div>
              <span className={`text-sm font-bold ${getScoreColor(culturalAppropriateness)}`}>
                {culturalAppropriateness}%
              </span>
            </div>
            <Progress value={culturalAppropriateness} className="h-2" />
          </div>

          {persuasionChange !== 0 && (
            <div className="pt-3 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">AI Stance Change:</span>
                <span className={`text-sm font-bold ${
                  persuasionChange > 0 ? "text-duo-green" : 
                  persuasionChange < 0 ? "text-duo-red" : "text-duo-gray"
                }`}>
                  {persuasionChange > 0 ? "+" : ""}{persuasionChange}
                </span>
              </div>
            </div>
          )}

          {feedback && (
            <div className="pt-3 border-t">
              <h5 className="text-sm font-medium text-gray-700 mb-1">AI Feedback:</h5>
              <p className="text-sm text-gray-600 italic">"{feedback}"</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}