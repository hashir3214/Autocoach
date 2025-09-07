import React from 'react';
import { BotIcon } from './icons/BotIcon';
import { BrainIcon } from './icons/BrainIcon';
import { PathIcon } from './icons/PathIcon';
import { BookIcon } from './icons/BookIcon';
import { CodeIcon } from './icons/CodeIcon';

interface LandingPageProps {
    onNavigateToSignUp: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; delay: string }> = ({ icon, title, description, delay }) => (
    <div className={`bg-white/5 backdrop-blur-xl p-6 rounded-lg shadow-lg border border-white/10 animate-fade-in-up`} style={{ animationDelay: delay }}>
        <div className="flex items-center space-x-4 mb-3">
            <div className="bg-brand-blue/20 p-2 rounded-full">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        <p className="text-gray-400">{description}</p>
    </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToSignUp }) => {
  return (
    <div className="w-full h-full overflow-y-auto flex flex-col items-center justify-center p-4">
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
            <header className="mb-12 animate-fade-in-up">
                 <div className="flex justify-center items-center space-x-4 mb-4">
                    <BotIcon className="w-16 h-16 text-brand-blue" />
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
                        AutoCoach AI
                    </h1>
                </div>
                <p className="text-xl md:text-2xl text-gray-300 mt-4 max-w-2xl">
                    Your personal AI tutor for any subject. Master concepts from beginner to expert, with guidance every step of the way.
                </p>
            </header>

            <div className="w-full animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <button
                    onClick={onNavigateToSignUp}
                    className="bg-gradient-to-r from-blue-500 to-brand-blue text-white font-bold py-4 px-10 rounded-full text-lg hover:from-blue-400 transform hover:scale-105 transition-all duration-300 shadow-2xl focus:outline-none animate-glow"
                >
                    Start Your Learning Journey
                </button>
            </div>
            
            <section className="mt-20 w-full text-left animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <h2 className="text-3xl font-bold text-center mb-8 text-white">Why AutoCoach AI?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FeatureCard
                        icon={<PathIcon className="w-6 h-6 text-blue-300" />}
                        title="Structured Learning Paths"
                        description="From a single question to a full curriculum, get a customized roadmap for any topic you want to learn."
                        delay="0.8s"
                    />
                    <FeatureCard
                        icon={<BrainIcon className="w-6 h-6 text-blue-300" />}
                        title="Step-by-Step Explanations"
                        description="Never get lost. Our AI breaks down complex problems into simple, easy-to-understand steps."
                        delay="1s"
                    />
                    <FeatureCard
                        icon={<BookIcon className="w-6 h-6 text-blue-300" />}
                        title="Curated Resources"
                        description="Go deeper with hand-picked suggestions for books, YouTube videos, and articles to supplement your learning."
                        delay="1.2s"
                    />
                    <FeatureCard
                        icon={<CodeIcon className="w-6 h-6 text-blue-300" />}
                        title="Code & Solve with Confidence"
                        description="Get working code examples and detailed solutions for technical problems, explained clearly."
                        delay="1.4s"
                    />
                </div>
            </section>
        </div>
    </div>
  );
};

export default LandingPage;