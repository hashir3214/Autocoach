import React, { useState } from 'react';
import { UserProfile } from '../types';

interface PersonalizationModalProps {
  userProfile: UserProfile;
  onSave: (updatedProfile: Pick<UserProfile, 'learningLevel' | 'subjectPreferences'>) => void;
  onClose: () => void;
}

const PersonalizationModal: React.FC<PersonalizationModalProps> = ({ userProfile, onSave, onClose }) => {
  const [learningLevel, setLearningLevel] = useState(userProfile.learningLevel);
  const [subjectPreferences, setSubjectPreferences] = useState(userProfile.subjectPreferences || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      learningLevel,
      subjectPreferences,
    });
  };

  const learningLevels = ['Beginner', 'High School', 'University', 'Professional', 'Expert'];

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-brand-gray-900/80 backdrop-blur-xl rounded-lg shadow-2xl border border-white/10 p-8 w-full max-w-md mx-4 transform transition-all animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className="text-2xl font-bold text-white mb-2 text-center">Update Preferences</h2>
        <p className="text-gray-400 mb-6 text-center">Fine-tune your learning experience.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="learningLevelModal" className="block text-sm font-medium text-gray-300 mb-2">
              Current Learning Level
            </label>
            <select
              id="learningLevelModal"
              value={learningLevel}
              onChange={(e) => setLearningLevel(e.target.value)}
              className="w-full px-4 py-2 bg-brand-gray-800/80 border border-white/10 rounded-md text-white focus:ring-2 focus:ring-brand-blue focus:outline-none transition-colors"
            >
              {learningLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <div className="mb-6">
             <label htmlFor="subjectPreferences" className="block text-sm font-medium text-gray-300 mb-2">
              Subjects of Interest (optional)
            </label>
            <textarea
              id="subjectPreferences"
              value={subjectPreferences}
              onChange={(e) => setSubjectPreferences(e.target.value)}
              className="w-full px-4 py-2 bg-brand-gray-800/80 border border-white/10 rounded-md text-white focus:ring-2 focus:ring-brand-blue focus:outline-none transition-colors resize-none"
              placeholder="e.g., Quantum Physics, JavaScript, Ancient Rome"
              rows={3}
            />
             <p className="text-xs text-gray-500 mt-1">Help me relate topics to your interests.</p>
          </div>
          <div className="flex justify-end space-x-4">
            <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-gray-300 bg-transparent rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-gray-900 focus:ring-brand-blue transition-colors duration-200"
            >
                Cancel
            </button>
            <button
                type="submit"
                className="px-6 py-2 text-sm font-semibold bg-brand-blue text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-gray-900 focus:ring-brand-blue transition-colors duration-200"
            >
                Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalizationModal;
