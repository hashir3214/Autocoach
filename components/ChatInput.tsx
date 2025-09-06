import React, { useState } from 'react';
import { SendIcon } from './icons/SendIcon';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything about any subject..."
        className="w-full pl-4 pr-16 py-3 bg-brand-gray-800/80 border border-white/10 rounded-lg text-white resize-none focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all duration-300"
        rows={1}
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gradient-to-br from-blue-500 to-brand-blue text-white hover:opacity-90 disabled:from-brand-gray-600 disabled:to-brand-gray-700 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
      >
        <SendIcon className="w-5 h-5" />
      </button>
    </form>
  );
};

export default ChatInput;