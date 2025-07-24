import { ArrowLeft, Flame, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopNavigationProps {
  user: {
    streak: number;
    hearts: number;
    avatar: string;
  };
  onBack: () => void;
}

export default function TopNavigation({ user, onBack }: TopNavigationProps) {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5 text-duo-gray" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-duo-orange rounded-full flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-duo-orange">{user.streak}</span>
          </div>
        </div>
        
        <h1 className="text-lg font-bold text-gray-800">Conversation</h1>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <Heart className="w-4 h-4 text-duo-red" />
            <span className="font-bold text-duo-red">{user.hearts}</span>
          </div>
          <div className="w-8 h-8 bg-duo-green rounded-full overflow-hidden">
            <img src={user.avatar} alt="User avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </nav>
  );
}
