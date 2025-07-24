import { Lightbulb, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CulturalTipProps {
  isVisible: boolean;
  tip: string;
  onClose: () => void;
}

export default function CulturalTip({ isVisible, tip, onClose }: CulturalTipProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-4 bottom-32 bg-gradient-to-r from-duo-purple/10 to-duo-blue/10 rounded-xl shadow-2xl border-2 border-duo-purple/20 p-4 transform transition-all duration-300 z-40">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-bold text-gray-800 flex items-center">
          <Lightbulb className="w-4 h-4 text-duo-purple mr-2" />
          Cultural Context
        </h4>
        <Button
          variant="ghost"
          size="sm"
          className="text-duo-gray hover:text-gray-800 p-0 w-5 h-5"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <img 
            src="https://images.unsplash.com/photo-1534080564583-6be75777b70a?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=60" 
            alt="Cultural context"
            className="w-16 h-12 rounded-lg object-cover" 
          />
          <div className="flex-1">
            <h5 className="font-semibold text-gray-800 mb-1">Cultural Insight</h5>
            <p className="text-sm text-gray-600">{tip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
