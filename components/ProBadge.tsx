import React from 'react';
import { StarIcon } from './icons/StarIcon';

const ProBadge: React.FC = () => {
    return (
        <div className="flex items-center space-x-1 bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded-full text-xs font-bold">
            <StarIcon className="w-3 h-3" />
            <span>PRO</span>
        </div>
    );
};

export default ProBadge;