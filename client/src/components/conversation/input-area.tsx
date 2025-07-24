import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Mic, Send, Languages, X } from "lucide-react";

interface InputAreaProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  suggestions: string[];
  targetLanguage: string;
}

export default function InputArea({ 
  onSendMessage, 
  isLoading, 
  suggestions, 
  targetLanguage 
}: InputAreaProps) {
  const [message, setMessage] = useState("");
  const [showTranslationHelper, setShowTranslationHelper] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    textareaRef.current?.focus();
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real implementation, this would start/stop voice recording
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
      <div className="max-w-md mx-auto p-4">
        {/* Quick Suggestions */}
        <div className="flex space-x-2 mb-3 overflow-x-auto pb-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="flex-shrink-0 bg-duo-light text-gray-700 hover:bg-gray-200"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>

        {/* Input Controls */}
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Type your response in ${targetLanguage}...`}
              className="min-h-[44px] max-h-32 resize-none pr-12 border-2 border-gray-200 rounded-2xl focus:border-duo-blue"
              rows={1}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-3 top-3 text-duo-gray hover:text-duo-blue p-0 w-6 h-6"
              onClick={() => setShowTranslationHelper(!showTranslationHelper)}
            >
              <Languages className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className={`w-12 h-12 rounded-full ${
              isRecording 
                ? "bg-duo-red hover:bg-duo-red/80 animate-pulse" 
                : "bg-duo-gray hover:bg-duo-blue"
            }`}
            onClick={toggleRecording}
          >
            <Mic className="w-4 h-4 text-white" />
          </Button>
          
          <Button
            size="sm"
            className="w-12 h-12 bg-duo-green rounded-full hover:bg-duo-green/80 hover:scale-105 transition-all duration-200"
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
          >
            <Send className="w-4 h-4 text-white" />
          </Button>
        </div>

        {/* Translation Helper */}
        {showTranslationHelper && (
          <div className="mt-3 p-3 bg-duo-blue/10 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-duo-blue">Translation Helper</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-duo-gray hover:text-gray-800 p-0 w-4 h-4"
                onClick={() => setShowTranslationHelper(false)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            <Input 
              placeholder="Type in English to get translation..."
              className="border-duo-blue/20 focus:border-duo-blue"
            />
          </div>
        )}
      </div>
    </div>
  );
}
