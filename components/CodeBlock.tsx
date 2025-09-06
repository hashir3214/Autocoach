import React, { useState } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';

interface CodeBlockProps {
    language: string;
    value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="relative my-4 rounded-md bg-brand-gray-900">
            <div className="flex items-center justify-between px-4 py-1.5 border-b border-brand-gray-700">
                <span className="text-xs font-sans text-gray-400">{language}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white transition-colors"
                    aria-label="Copy code"
                >
                    {isCopied ? (
                        <>
                            <CheckIcon className="w-4 h-4 text-green-500" />
                            <span>Copied!</span>
                        </>
                    ) : (
                        <>
                            <CopyIcon className="w-4 h-4" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <pre className="p-4 overflow-x-auto">
                <code className={`language-${language} text-sm`}>{value}</code>
            </pre>
        </div>
    );
};

export default CodeBlock;