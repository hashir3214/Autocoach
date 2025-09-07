import React, { useState } from 'react';
import { UserProfile } from '../types';

interface SignUpPageProps {
  onSave: (profile: Omit<UserProfile, 'level' | 'xp' | 'streak' | 'lastLoginDate'>) => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onSave }) => {
  const [name, setName] = useState('');
  const [learningLevel, setLearningLevel] = useState('Beginner');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({ name, learningLevel });
    }
  };

  const learningLevels = ['Beginner', 'High School', 'University', 'Professional', 'Expert'];

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="bg-brand-gray-900/50 backdrop-blur-xl rounded-lg shadow-2xl border border-white/10 p-8 w-full max-w-lg mx-4 transform transition-all animate-fade-in-up">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Create Your Profile</h2>
        <p className="text-gray-400 mb-6 text-center">Let's personalize your learning experience.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              What should I call you?
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-brand-gray-800/80 border border-white/10 rounded-md text-white focus:ring-2 focus:ring-brand-blue focus:outline-none transition-colors"
              placeholder="e.g., Alex"
              required
            />
          </div>
          <div className="mb-8">
            <label htmlFor="learningLevel" className="block text-sm font-medium text-gray-300 mb-2">
              What is your current learning level?
            </label>
            <select
              id="learningLevel"
              value={learningLevel}
              onChange={(e) => setLearningLevel(e.target.value)}
              className="w-full px-4 py-2 bg-brand-gray-800/80 border border-white/10 rounded-md text-white focus:ring-2 focus:ring-brand-blue focus:outline-none transition-colors"
            >
              {learningLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-brand-blue text-white font-semibold py-3 px-4 rounded-md hover:from-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-gray-800 focus:ring-brand-blue transition-all duration-300 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed"
            disabled={!name.trim()}
          >
            Start Learning
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;