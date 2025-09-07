export interface UserProfile {
  name: string;
  learningLevel: string;
  subjectPreferences?: string;
  level: number;
  xp: number;
  streak: number;
  lastLoginDate: string; // YYYY-MM-DD
}

export enum MessageAuthor {
    USER = 'user',
    BOT = 'bot'
}

export interface ChatMessage {
  author: 'user' | 'bot';
  content: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}