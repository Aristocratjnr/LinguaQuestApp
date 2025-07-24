import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center glass-lemon-card px-8 py-4 mb-8">
            <span className="material-icons text-4xl text-amber-600 mr-4">language</span>
            <h1 className="text-4xl font-black text-gray-800">LinguaQuest</h1>
          </div>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Master Ghanaian languages through persuasive conversations with AI characters. 
            Build cultural communication skills while learning Twi, Ga, and Ewe.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="glass-card p-8 text-center hover:scale-105 transition-transform">
            <span className="material-icons text-5xl text-amber-500 mb-4 block">chat</span>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Persuasive Debates</h3>
            <p className="text-gray-600">Engage AI characters in meaningful debates and learn to persuade through cultural understanding.</p>
          </div>
          
          <div className="glass-card p-8 text-center hover:scale-105 transition-transform">
            <span className="material-icons text-5xl text-green-500 mb-4 block">translate</span>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Real Translation</h3>
            <p className="text-gray-600">Get instant feedback on translation accuracy and cultural appropriateness of your messages.</p>
          </div>
          
          <div className="glass-card p-8 text-center hover:scale-105 transition-transform">
            <span className="material-icons text-5xl text-purple-500 mb-4 block">psychology</span>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Cultural Context</h3>
            <p className="text-gray-600">Learn the nuances of Ghanaian communication styles and build cultural competency.</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="glass-lemon-card p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-black text-gray-800 mb-4">Ready to Start?</h2>
            <p className="text-gray-600 mb-6">Sign in with your Replit account to begin your language learning journey.</p>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="glass-button w-full py-4 text-lg font-bold border-0 rounded-xl text-gray-800 hover:text-white"
            >
              <span className="material-icons mr-2">login</span>
              Sign In to Continue
            </Button>
          </div>
        </div>

        {/* Characters Preview */}
        <div className="mt-16">
          <h2 className="text-3xl font-black text-center text-gray-800 mb-8">Meet Your AI Debate Partners</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mr-4">
                  <span className="material-icons text-white">person</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Kwame</h4>
                  <p className="text-sm text-gray-600">Traditional Elder • Twi</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">A respected elder who values traditions and cultural customs.</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center mr-4">
                  <span className="material-icons text-white">school</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Ama</h4>
                  <p className="text-sm text-gray-600">University Student • Ga</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Progressive environmental science student with strong opinions.</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center mr-4">
                  <span className="material-icons text-white">balance</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Togbe</h4>
                  <p className="text-sm text-gray-600">Chief • Ewe</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Diplomatic leader who believes in community consensus.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}