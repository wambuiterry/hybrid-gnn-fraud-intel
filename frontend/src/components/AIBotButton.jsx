import { MessageCircle, Zap, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function AIBotButton({ onOpen }) {
  const [tooltip, setTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={onOpen}
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
      >
        <MessageCircle size={18} />
        <Zap size={16} className="text-yellow-300" />
        AI Analyst Bot (Coming Soon)
      </button>
      
      {tooltip && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap z-50">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={12} />
            <span className="font-semibold">Feature Coming Soon</span>
          </div>
          <p>Interactive AI assistant to explain fraud findings and answer questions about transactions</p>
        </div>
      )}
    </div>
  );
}
