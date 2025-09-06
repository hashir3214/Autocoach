import React from 'react';
import { BookIcon } from './icons/BookIcon'; // A generic icon

interface ResourceCardProps {
    title: string;
    description: string;
    url: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ title, description, url }) => {
    return (
        <a 
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block my-4 bg-brand-gray-700/50 hover:bg-brand-gray-700/80 p-4 rounded-lg border border-white/10 no-underline transition-all duration-300 transform hover:-translate-y-1"
        >
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-brand-blue/20 p-2 rounded-full mt-1">
                    <BookIcon className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                    <h4 className="font-bold text-white text-base mt-0 mb-1">{title}</h4>
                    <p className="text-gray-400 text-sm m-0">{description}</p>
                </div>
            </div>
        </a>
    );
};

export default ResourceCard;
