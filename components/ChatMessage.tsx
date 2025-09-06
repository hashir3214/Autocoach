import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage, UserProfile } from '../types';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';
import CodeBlock from './CodeBlock';
import ResourceCard from './ResourceCard';

interface ChatMessageProps {
  message: ChatMessage;
  userProfile: UserProfile;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message, userProfile }) => {
  const isUser = message.author === 'user';

  const markdownComponents = {
      code(props: any) {
        const {children, className, ...rest} = props
        const match = /language-(\w+)/.exec(className || '')
        return match ? (
          <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
        ) : (
          <code {...rest} className={className}>
            {children}
          </code>
        )
      }
  };

  const renderFormattedContent = (content: string) => {
    // Regex to find [RESOURCE] tags OR standalone URLs.
    const combinedRegex = /(\[RESOURCE\].+)|(https?:\/\/[^\s]+)/g;
    const elements = [];
    let lastIndex = 0;
    let match;

    while ((match = combinedRegex.exec(content)) !== null) {
        // 1. Add the text before the match
        if (match.index > lastIndex) {
            const textPart = content.substring(lastIndex, match.index);
            elements.push(
                <ReactMarkdown key={`text-${lastIndex}`} remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {textPart}
                </ReactMarkdown>
            );
        }

        // 2. Process the match
        const matchedString = match[0];
        if (matchedString.startsWith('[RESOURCE]')) {
            // It's a structured resource tag
            const resourceText = matchedString.replace('[RESOURCE]', '').trim();
            const linkMatch = /\[(.*?)\]\((.*?)\)/.exec(resourceText);

            let title = resourceText;
            let url = '#';
            let description = '';

            if (linkMatch) {
                title = linkMatch[1];
                url = linkMatch[2];
                description = resourceText.split(') - ')[1] || '';
            } else {
                const textParts = resourceText.split(' - ');
                title = textParts[0];
                description = textParts.slice(1).join(' - ');
            }
            elements.push(<ResourceCard key={`res-${match.index}`} title={title} url={url} description={description} />);
        } else {
            // It's a standalone URL
            elements.push(<ResourceCard key={`url-${match.index}`} title={matchedString} url={matchedString} description="An external link to learn more." />);
        }

        lastIndex = match.index + matchedString.length;
    }

    // 3. Add any remaining text after the last match
    if (lastIndex < content.length) {
        const remainingText = content.substring(lastIndex);
        elements.push(
            <ReactMarkdown key={`text-final`} remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {remainingText}
            </ReactMarkdown>
        );
    }
    
    // If no matches were found, just render the whole content
    if (elements.length === 0) {
        return <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{content}</ReactMarkdown>;
    }

    return elements;
  }

  return (
    <div className={`flex items-start space-x-4 animate-fade-in ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-brand-gray-800 ring-1 ring-white/10 flex items-center justify-center flex-shrink-0">
          <BotIcon className="w-5 h-5 text-gray-400" />
        </div>
      )}
      <div className={`max-w-3xl px-4 py-3 rounded-xl shadow-md ${isUser ? 'bg-gradient-to-br from-blue-500 to-brand-blue text-white' : 'bg-brand-gray-800 text-gray-200'}`}>
        <div className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-headings:my-3 prose-a:text-blue-400 hover:prose-a:text-blue-300">
           {isUser
            ? <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{message.content}</ReactMarkdown>
            : renderFormattedContent(message.content)
           }
        </div>
      </div>
       {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-600 ring-1 ring-white/10 flex items-center justify-center flex-shrink-0">
          <UserIcon className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessageComponent;