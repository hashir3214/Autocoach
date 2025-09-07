import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckIcon } from './icons/CheckIcon';

interface QuizComponentProps {
    questions: QuizQuestion[];
    onComplete: (score: number) => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ questions, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSelectAnswer = (optionIndex: number) => {
        if (isSubmitted) return;
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setSelectedAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };
    
    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };
    
    const handleSubmit = () => {
        setIsSubmitted(true);
    };

    const score = selectedAnswers.reduce((total: number, answer, index) => {
        return answer === questions[index].correctAnswerIndex ? total + 1 : total;
    }, 0);

    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswerForCurrent = selectedAnswers[currentQuestionIndex];

    if (isSubmitted) {
        return (
            <div className="fixed inset-0 bg-brand-gray-900/90 z-50 flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-brand-gray-800 rounded-lg shadow-2xl border border-white/10 p-8 w-full max-w-2xl mx-4 animate-fade-in-up">
                    <h2 className="text-3xl font-bold text-white mb-2 text-center">Quiz Results</h2>
                    <p className="text-2xl font-semibold text-center text-brand-blue mb-6">
                        You scored {score} out of {questions.length}!
                    </p>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {questions.map((q, index) => {
                            const userAnswer = selectedAnswers[index];
                            const isCorrect = userAnswer === q.correctAnswerIndex;
                            return (
                                <div key={index} className="bg-brand-gray-900 p-4 rounded-md">
                                    <p className="font-semibold text-white">{index + 1}. {q.question}</p>
                                    <p className={`text-sm mt-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                        Your answer: {userAnswer !== null ? q.options[userAnswer] : 'Not answered'} {isCorrect ? '(Correct)' : '(Incorrect)'}
                                    </p>
                                    {!isCorrect && (
                                        <p className="text-sm text-gray-300">
                                            Correct answer: {q.options[q.correctAnswerIndex]}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={() => onComplete(score)}
                            className="px-8 py-3 text-lg font-semibold bg-brand-blue text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-gray-900 focus:ring-brand-blue transition-colors duration-200"
                        >
                            Finish
                        </button>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="fixed inset-0 bg-brand-gray-900/90 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-brand-gray-800 rounded-lg shadow-2xl border border-white/10 p-8 w-full max-w-2xl mx-4 animate-fade-in-up flex flex-col" style={{minHeight: '450px'}}>
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-white">Knowledge Check</h2>
                    <p className="text-gray-400 font-mono">{currentQuestionIndex + 1} / {questions.length}</p>
                </div>

                <div className="flex-grow">
                    <p className="text-lg text-gray-200 mb-6 min-h-[50px]">{currentQuestion.question}</p>
                    <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = selectedAnswerForCurrent === index;
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleSelectAnswer(index)}
                                    className={`w-full text-left p-4 rounded-md border-2 transition-all duration-200 flex items-center justify-between
                                        ${isSelected ? 'border-brand-blue bg-blue-500/20' : 'border-brand-gray-700 bg-brand-gray-900/50 hover:bg-brand-gray-700/50'}`
                                    }
                                >
                                    <span>{option}</span>
                                    {isSelected && <CheckIcon className="w-5 h-5 text-brand-blue"/>}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="flex justify-between items-center mt-8 pt-4 border-t border-white/10">
                    <button
                        onClick={handlePrev}
                        disabled={currentQuestionIndex === 0}
                        className="px-6 py-2 text-sm font-semibold text-gray-300 bg-transparent rounded-md hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    {currentQuestionIndex === questions.length - 1 ? (
                         <button
                            onClick={handleSubmit}
                            disabled={selectedAnswers.includes(null)}
                            className="px-6 py-2 font-semibold bg-green-600 text-white rounded-md hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                         >
                            Submit
                         </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            disabled={selectedAnswerForCurrent === null}
                            className="px-6 py-2 font-semibold bg-brand-blue text-white rounded-md hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizComponent;