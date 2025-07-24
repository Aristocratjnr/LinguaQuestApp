import { Languages, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TranslationTooltipProps {
  isVisible: boolean;
  originalText: string;
  translatedText: string;
  onClose: () => void;
}

export default function TranslationTooltip({ 
  isVisible, 
  originalText, 
  translatedText, 
  onClose 
}: TranslationTooltipProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-4 bottom-32 bg-white rounded-xl shadow-2xl border-2 border-duo-blue/20 p-4 transform transition-all duration-300 z-40">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-bold text-gray-800 flex items-center">
          <Languages className="w-4 h-4 text-duo-blue mr-2" />
          Translation
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
        <div>
          <p className="text-sm text-duo-gray mb-1">Original:</p>
          <p className="font-medium text-gray-800">{originalText}</p>
        </div>
        <div>
          <p className="text-sm text-duo-gray mb-1">English:</p>
          <p className="font-medium text-gray-800">{translatedText}</p>
        </div>
      </div>
    </div>
  );
}
