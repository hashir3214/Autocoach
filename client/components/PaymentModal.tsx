import React, { useState } from 'react';
import { StarIcon } from './icons/StarIcon';
import { CheckIcon } from './icons/CheckIcon';
import { QrCodeIcon } from './icons/QrCodeIcon';
import { CopyIcon } from './icons/CopyIcon';

interface PaymentModalProps {
    onClose: () => void;
    onUpgradeSuccess: () => void;
}

const SOLANA_ADDRESS = "4anmJNZ6qpU57W3E7oBpqgnjzyMUtfhxYfCmdGMFnVgX";

const PlanFeature: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start space-x-3">
        <div className="flex-shrink-0 pt-1">
            <CheckIcon className="w-5 h-5 text-green-400" />
        </div>
        <span className="text-gray-300">{children}</span>
    </li>
);

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onUpgradeSuccess }) => {
    const [transactionId, setTransactionId] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(SOLANA_ADDRESS);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleVerify = () => {
        if (!transactionId.trim()) return;
        setIsVerifying(true);
        // Simulate network delay for verification
        setTimeout(() => {
            setIsVerifying(false);
            onUpgradeSuccess();
        }, 2500);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-modal-title"
        >
            <div 
                className="bg-brand-gray-900/80 backdrop-blur-xl rounded-lg shadow-2xl border border-white/10 p-8 w-full max-w-2xl mx-4 transform transition-all animate-fade-in-up flex flex-col md:flex-row gap-8"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Left Side: Features */}
                <div className="flex-1">
                    <h2 id="payment-modal-title" className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                        <StarIcon className="w-8 h-8 text-yellow-300"/>
                        Go Pro
                    </h2>
                    <p className="text-gray-400 mb-6">Unlock the full potential of AutoCoach AI with a one-time contribution.</p>
                    <ul className="space-y-3">
                        <PlanFeature><strong>AI Quiz Generation:</strong> Test your knowledge with quizzes created from your chat history.</PlanFeature>
                        <PlanFeature><strong>Unlimited Messages:</strong> Bypass the standard rate limits for uninterrupted learning.</PlanFeature>
                        <PlanFeature><strong>Priority Access:</strong> Get first access to new features and models as they are released.</PlanFeature>
                        <PlanFeature><strong>Permanent Access:</strong> One-time payment for lifetime pro features.</PlanFeature>
                    </ul>
                </div>

                {/* Right Side: Payment */}
                <div className="flex-1 bg-brand-gray-800/60 p-6 rounded-lg border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-1 text-center">1. Make a Contribution</h3>
                    <p className="text-sm text-gray-400 text-center mb-4">Send any amount of SOL to the address below.</p>
                    <div className="flex justify-center mb-4">
                        <div className="bg-white p-2 rounded-md">
                            <QrCodeIcon className="w-32 h-32 text-black" />
                        </div>
                    </div>
                    <div className="relative mb-4">
                        <input 
                            type="text"
                            readOnly
                            value={SOLANA_ADDRESS}
                            className="w-full bg-brand-gray-900/70 border border-white/10 rounded-md text-gray-300 text-xs px-3 py-2 pr-10 truncate"
                        />
                         <button onClick={handleCopy} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                            {isCopied ? <CheckIcon className="w-5 h-5 text-green-500"/> : <CopyIcon className="w-5 h-5"/>}
                        </button>
                    </div>
                     <h3 className="text-xl font-semibold text-white mb-2 mt-6 text-center">2. Verify & Upgrade</h3>
                     <p className="text-sm text-gray-400 text-center mb-4">Paste the transaction signature below.</p>
                     <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full px-3 py-2 bg-brand-gray-900/70 border border-white/10 rounded-md text-white focus:ring-2 focus:ring-brand-blue focus:outline-none transition-colors"
                        placeholder="Paste transaction signature here"
                        disabled={isVerifying}
                    />
                    <button
                        onClick={handleVerify}
                        disabled={!transactionId.trim() || isVerifying}
                        className="w-full mt-4 bg-gradient-to-r from-blue-500 to-brand-blue text-white font-semibold py-3 px-4 rounded-md hover:from-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-gray-800 focus:ring-brand-blue transition-all duration-300 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {isVerifying ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Verifying...</span>
                            </>
                        ) : (
                            <span>Verify and Upgrade</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;