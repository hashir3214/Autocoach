import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChatMessage, UserProfile, QuizQuestion } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import ChatWindow from './components/ChatWindow';
import { GeminiService } from './services/geminiService';
import { initialBotMessage, XP_PER_MESSAGE, XP_FOR_NEXT_LEVEL, XP_PER_STREAK_DAY_BONUS, XP_FOR_QUIZ } from './constants';
import LandingPage from './components/LandingPage';
import SignUpPage from './components/SignUpPage';
import AnimatedBackground from './components/AnimatedBackground';
import PersonalizationModal from './components/PersonalizationModal';
import QuizComponent from './components/QuizComponent';

type View = 'landing' | 'signup' | 'chat';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('userProfile', null);
  const [chatHistory, setChatHistory] = useLocalStorage<ChatMessage[]>('chatHistory', []);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<View>('landing');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPersonalizationModalOpen, setIsPersonalizationModalOpen] = useState(false);
  
  // Pro Features State
  const [isQuizVisible, setIsQuizVisible] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);


  // Streak and Leveling Logic
  useEffect(() => {
    if (userProfile) {
      const today = new Date().toISOString().split('T')[0];
      const lastLogin = userProfile.lastLoginDate;

      if (lastLogin !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = userProfile.streak;
        if (lastLogin === yesterdayStr) {
          newStreak++;
        } else {
          newStreak = 1;
        }
        setUserProfile({ ...userProfile, streak: newStreak, lastLoginDate: today });
      }
    }
  }, []); // Run only once on app load


  useEffect(() => {
    if (userProfile) {
      if (!GeminiService.getInstance().isChatInitialized()) {
          GeminiService.getInstance().initializeChat(userProfile);
      }
      
      if (chatHistory.length === 0) {
        setChatHistory([
            {...initialBotMessage, content: `Welcome back, ${userProfile.name}! Let's continue our learning journey. What's on your mind today?`}
        ]);
      }
      setView('chat');
    } else {
      setView('landing');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile?.name]);
  
  const handleSaveProfile = (profileData: Omit<UserProfile, 'level' | 'xp' | 'streak' | 'lastLoginDate'>) => {
     const today = new Date().toISOString().split('T')[0];
     const newProfile: UserProfile = {
        ...profileData,
        subjectPreferences: '',
        level: 1,
        xp: 0,
        streak: 1,
        lastLoginDate: today,
     }
    setUserProfile(newProfile);
    GeminiService.getInstance().initializeChat(newProfile);
    setChatHistory([
        {...initialBotMessage, content: `Hello ${profileData.name}! I'm AutoCoach AI. I'm ready to help you learn anything. How can I assist you today?`}
    ]);
    setView('chat');
  };

  const handleUpdateProfile = (updatedProfileData: Pick<UserProfile, 'learningLevel' | 'subjectPreferences'>) => {
    if (!userProfile) return;
    const updatedProfile = { ...userProfile, ...updatedProfileData };
    setUserProfile(updatedProfile);
    GeminiService.getInstance().initializeChat(updatedProfile);
    setIsPersonalizationModalOpen(false);
    setChatHistory(prev => [...prev, {
        author: 'bot',
        content: "Your learning preferences have been updated! I'll adjust my teaching style accordingly."
    }]);
  };
  
  const handleNewChat = () => {
    if (userProfile) {
        setChatHistory([
            {...initialBotMessage, content: `Hello ${userProfile.name}! A fresh start. What new topic are you curious about?`}
        ]);
        GeminiService.getInstance().initializeChat(userProfile);
        setSearchQuery('');
    }
  };

  const addXp = useCallback((amount: number) => {
    if (!userProfile) return;
    
    let currentXp = userProfile.xp + amount;
    let currentLevel = userProfile.level;
    let xpToNextLevel = XP_FOR_NEXT_LEVEL(currentLevel);

    let levelUpMessage = '';
    while (currentXp >= xpToNextLevel) {
        currentXp -= xpToNextLevel;
        currentLevel++;
        xpToNextLevel = XP_FOR_NEXT_LEVEL(currentLevel);
        levelUpMessage += `Congratulations, you've reached Level ${currentLevel}!\n`;
    }
    
    setUserProfile({ ...userProfile, xp: currentXp, level: currentLevel });

    if (levelUpMessage) {
        setChatHistory(prev => [...prev, { author: 'bot', content: levelUpMessage.trim() }]);
    }

  }, [userProfile, setUserProfile]);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoading || !userProfile) return;

    setSearchQuery('');
    const userMessage: ChatMessage = { author: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);

    const botMessage: ChatMessage = { author: 'bot', content: '' };
    setChatHistory(prev => [...prev, botMessage]);

    try {
        const stream = await GeminiService.getInstance().sendMessageStream(message);
        
        // Only add XP if the request was successful
        const streakBonus = userProfile.streak > 1 ? userProfile.streak * XP_PER_STREAK_DAY_BONUS : 0;
        addXp(XP_PER_MESSAGE + streakBonus);

        let currentContent = '';
        for await (const chunk of stream) {
            currentContent += chunk.text;
            setChatHistory(prev => {
                const newHistory = [...prev];
                const lastMessage = newHistory[newHistory.length - 1];
                if (lastMessage && lastMessage.author === 'bot') {
                    lastMessage.content = currentContent;
                }
                return newHistory;
            });
        }
    } catch (error) {
        console.error("Error sending message:", error);
        let errorMessage = "I'm sorry, I encountered an error. Please check your API key or try again later.";

        if (error instanceof Error && error.message === 'RATE_LIMIT_EXCEEDED') {
            errorMessage = "You've reached the request limit for the free tier. Please wait a moment before sending another message.";
        }
        
        setChatHistory(prev => {
            const newHistory = [...prev];
            const lastMessage = newHistory[newHistory.length - 1];
            if (lastMessage && lastMessage.author === 'bot') {
                lastMessage.content = errorMessage;
            } else {
                 newHistory.push({ author: 'bot', content: errorMessage });
            }
            // Remove the user message that failed
            if(newHistory[newHistory.length - 2]?.author === 'user') {
                newHistory.splice(newHistory.length - 2, 1);
            }
            return newHistory;
        });
    } finally {
        setIsLoading(false);
    }
  }, [isLoading, userProfile, setChatHistory, addXp]);

  const handleGenerateQuiz = useCallback(async () => {
    setIsGeneratingQuiz(true);
    setChatHistory(prev => [...prev, { author: 'bot', content: "Generating a quiz based on our recent conversation... this might take a moment!" }]);
    try {
        const questions = await GeminiService.getInstance().generateQuiz(chatHistory);
        if (questions && questions.length > 0) {
            setQuizQuestions(questions);
            setIsQuizVisible(true);
        } else {
            setChatHistory(prev => [...prev, { author: 'bot', content: "I couldn't generate a quiz right now. Let's chat a bit more about a topic first!" }]);
        }
    } catch (error) {
        console.error("Error generating quiz:", error);
        setChatHistory(prev => [...prev, { author: 'bot', content: "Sorry, I ran into an error while creating the quiz. Please try again." }]);
    } finally {
        setIsGeneratingQuiz(false);
    }
  }, [chatHistory]);

  const handleQuizComplete = (score: number) => {
    const totalQuestions = quizQuestions.length;
    const xpGained = Math.round((score / totalQuestions) * XP_FOR_QUIZ);
    addXp(xpGained);
    
    setChatHistory(prev => [...prev, {
        author: 'bot',
        content: `Quiz complete! You scored ${score}/${totalQuestions}. You've earned ${xpGained} XP for your effort!`
    }]);

    setIsQuizVisible(false);
    setQuizQuestions([]);
  };
  
  const displayedMessages = useMemo(() => {
    if (!searchQuery.trim()) {
        return chatHistory;
    }
    return chatHistory.filter(msg => 
        msg.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chatHistory, searchQuery]);


  const renderView = () => {
    switch(view) {
        case 'landing':
            return <LandingPage onNavigateToSignUp={() => setView('signup')} />;
        case 'signup':
            return <SignUpPage onSave={handleSaveProfile} />;
        case 'chat':
             return (
                 <ChatWindow
                    messages={displayedMessages}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading || isGeneratingQuiz}
                    onNewChat={handleNewChat}
                    userProfile={userProfile!}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    hasActiveSearch={searchQuery.trim().length > 0}
                    onOpenPersonalizationModal={() => setIsPersonalizationModalOpen(true)}
                    onGenerateQuiz={handleGenerateQuiz}
                />
             )
        default:
             return <LandingPage onNavigateToSignUp={() => setView('signup')} />;
    }
  }

  return (
    <div className="flex flex-col h-screen bg-brand-gray-900 text-white relative">
       <AnimatedBackground />
       <div className="relative z-10 h-full flex flex-col">
         {renderView()}
       </div>
       {isPersonalizationModalOpen && userProfile && (
            <PersonalizationModal
                userProfile={userProfile}
                onSave={handleUpdateProfile}
                onClose={() => setIsPersonalizationModalOpen(false)}
            />
        )}
        {isQuizVisible && quizQuestions.length > 0 && (
            <QuizComponent 
                questions={quizQuestions}
                onComplete={handleQuizComplete}
            />
        )}
    </div>
  );
};

export default App;