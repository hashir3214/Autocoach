
import React, { useRef, useEffect, useState } from 'react';
import { ChatMessage, UserProfile } from '../types';
import ChatMessageComponent from './ChatMessage';
import ChatInput from './ChatInput';
import { SearchIcon } from './icons/SearchIcon';
import { CloseIcon } from './icons/CloseIcon';
import { FireIcon } from './icons/FireIcon';
import { XP_FOR_NEXT_LEVEL } from '../constants';
import { EditIcon } from './icons/EditIcon';
import { QuizIcon } from './icons/QuizIcon';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onNewChat: () => void;
  userProfile: UserProfile;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  hasActiveSearch: boolean;
  onOpenPersonalizationModal: () => void;
  onGenerateQuiz: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
    messages, 
    onSendMessage, 
    isLoading, 
    onNewChat, 
    userProfile,
    searchQuery,
    onSearchChange,
    hasActiveSearch,
    onOpenPersonalizationModal,
    onGenerateQuiz,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!hasActiveSearch) {
        scrollToBottom();
    }
  }, [messages, hasActiveSearch]);

  useEffect(() => {
    if (isSearchVisible) {
        searchInputRef.current?.focus();
    }
  }, [isSearchVisible]);

  const handleClearSearch = () => {
    onSearchChange('');
    setIsSearchVisible(false);
  };

  const handleGenerateQuizClick = () => {
    onGenerateQuiz();
  };
  
  const xpToNextLevel = XP_FOR_NEXT_LEVEL(userProfile.level);
  const xpProgressPercentage = (userProfile.xp / xpToNextLevel) * 100;

  return (
    <div className="flex flex-col h-full bg-transparent">
      <header className="p-4 bg-brand-gray-900/50 backdrop-blur-md border-b border-white/10 shadow-md">
        <div className="flex items-center justify-between">
            {/* Left Side: Profile & Progress */}
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-brand-blue flex items-center justify-center text-lg font-bold">
                    {userProfile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <div className="flex items-center space-x-2">
                         <h1 className="text-md font-bold text-white">{userProfile.name}</h1>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <span>Level {userProfile.level}</span>
                        <div className="w-20 h-2 bg-brand-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: `${xpProgressPercentage}%` }}></div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-1 text-orange-400" title={`${userProfile.streak}-day streak!`}>
                    <FireIcon className="w-5 h-5"/>
                    <span className="font-bold text-sm">{userProfile.streak}</span>
                </div>
                 <button 
                    onClick={onOpenPersonalizationModal} 
                    className="p-1.5 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors" 
                    title="Edit Profile & Preferences"
                    aria-label="Edit Profile and Preferences"
                >
                    <EditIcon className="w-5 h-5" />
                </button>
            </div>
            
            {/* Right Side: Search & New Chat */}
            <div className="flex items-center space-x-2">
                <div className={`flex items-center transition-all duration-300 ${isSearchVisible ? 'w-40' : 'w-0'}`}>
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search..."
                        className={`bg-brand-gray-800/80 border border-white/10 rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-blue w-full transition-opacity duration-300 ${isSearchVisible ? 'opacity-100' : 'opacity-0'}`}
                    />
                     {isSearchVisible && (
                        <button onClick={handleClearSearch} className="ml-2 text-gray-400 hover:text-white">
                            <CloseIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
                 {!isSearchVisible && (
                    <button onClick={() => setIsSearchVisible(true)} className="p-2 text-gray-300 hover:text-white transition-colors">
                        <SearchIcon className="w-5 h-5" />
                    </button>
                )}
                <button
                    onClick={handleGenerateQuizClick}
                    disabled={isLoading}
                    className="p-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Generate Quiz"
                >
                    <QuizIcon className="w-5 h-5" />
                </button>
                <button
                    onClick={onNewChat}
                    className="px-4 py-2 text-sm font-semibold bg-brand-blue text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-gray-900 focus:ring-brand-blue transition-colors duration-200"
                >
                    New Chat
                </button>
            </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {messages.length > 0 ? (
            <div className="space-y-6">
                {messages.map((msg, index) => (
                  <ChatMessageComponent key={index} message={msg} userProfile={userProfile} />
                ))}
            </div>
        ) : hasActiveSearch ? (
            <div className="text-center text-gray-400 mt-8">
                <p>No messages found for your search.</p>
            </div>
        ) : null}

        {isLoading && messages[messages.length - 1]?.author === 'bot' && (
             <div className="flex items-start space-x-4 animate-pulse mt-6">
                <div className="w-8 h-8 rounded-full bg-brand-gray-700 flex-shrink-0"></div>
                <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-brand-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-brand-gray-700 rounded w-1/2"></div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </main>
      <footer className="p-4 bg-brand-gray-900/50 backdrop-blur-md border-t border-white/10">
        <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
      </footer>
    </div>
  );
};

export default ChatWindow;
