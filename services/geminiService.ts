import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { UserProfile, ChatMessage, QuizQuestion } from "../types";
import { getSystemInstruction, getQuizGenerationInstruction, REQUESTS_PER_MINUTE_LIMIT } from "../constants";

// NOTE: This service assumes the API key is set in the environment variables.
// It will not work without a valid API_KEY.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY environment variable not set. Gemini API will not be available.");
}

class GeminiServiceController {
    private static instance: GeminiServiceController;
    private ai: GoogleGenAI | null = null;
    private chat: Chat | null = null;
    private userProfile: UserProfile | null = null;
    private requestTimestamps: number[] = [];

    private constructor() {
        if (API_KEY) {
            this.ai = new GoogleGenAI({ apiKey: API_KEY });
        }
    }

    public static getInstance(): GeminiServiceController {
        if (!GeminiServiceController.instance) {
            GeminiServiceController.instance = new GeminiServiceController();
        }
        return GeminiServiceController.instance;
    }
    
    public isChatInitialized(): boolean {
        return this.chat !== null;
    }
    
    public checkRateLimit(): boolean {
        const oneMinuteAgo = Date.now() - 60 * 1000;
        this.requestTimestamps = this.requestTimestamps.filter(
            (timestamp) => timestamp > oneMinuteAgo
        );
        return this.requestTimestamps.length >= REQUESTS_PER_MINUTE_LIMIT;
    }

    public initializeChat(userProfile: UserProfile): void {
        if (!this.ai) {
            console.error("Gemini AI client not initialized. Check API Key.");
            return;
        }
        this.userProfile = userProfile;
        const systemInstruction = getSystemInstruction(userProfile.name, userProfile.learningLevel, userProfile.subjectPreferences);
        
        this.chat = this.ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
            },
        });
    }

    public async sendMessageStream(message: string): Promise<AsyncGenerator<GenerateContentResponse>> {
        if (!this.chat) {
            throw new Error("Chat is not initialized. Please set user profile first.");
        }
        
        if (this.checkRateLimit()) {
            throw new Error("RATE_LIMIT_EXCEEDED");
        }
        this.requestTimestamps.push(Date.now());

        try {
            const result = await this.chat.sendMessageStream({ message });
            return result;
        } catch (error) {
            console.error("Error in sendMessageStream:", error);
            throw error;
        }
    }

    public async generateQuiz(chatHistory: ChatMessage[]): Promise<QuizQuestion[]> {
        if (!this.ai) {
            throw new Error("Gemini AI client not initialized. Check API Key.");
        }
        
        const recentTopics = chatHistory
            .filter(m => m.author === 'bot')
            .slice(-5)
            .map(m => m.content)
            .join('\n\n---\n\n');
        
        if (!recentTopics.trim()) {
            console.log("Not enough context to generate a quiz.");
            return [];
        }

        const quizSystemInstruction = getQuizGenerationInstruction(recentTopics);

        const quizSchema = {
            type: Type.OBJECT,
            properties: {
                quiz: {
                    type: Type.ARRAY,
                    description: "An array of 3 multiple-choice quiz questions.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: {
                                type: Type.STRING,
                                description: "The quiz question."
                            },
                            options: {
                                type: Type.ARRAY,
                                description: "An array of 4 possible answers.",
                                items: { type: Type.STRING }
                            },
                            correctAnswerIndex: {
                                type: Type.INTEGER,
                                description: "The 0-based index of the correct answer in the options array."
                            }
                        },
                        required: ["question", "options", "correctAnswerIndex"]
                    }
                }
            },
            required: ["quiz"]
        };

        try {
            const response = await this.ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: "Generate the quiz now based on the topics provided.",
                config: {
                    systemInstruction: quizSystemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: quizSchema,
                },
            });
            
            const jsonString = response.text.trim();
            const parsedResponse = JSON.parse(jsonString);
            
            if (parsedResponse && Array.isArray(parsedResponse.quiz)) {
                return parsedResponse.quiz as QuizQuestion[];
            } else {
                console.error("Quiz generation failed: unexpected response format.", parsedResponse);
                return [];
            }
        } catch (error) {
            console.error("Error generating quiz:", error);
            throw error;
        }
    }
}

export const GeminiService = GeminiServiceController;