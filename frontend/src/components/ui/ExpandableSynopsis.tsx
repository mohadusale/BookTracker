import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandableSynopsisProps {
  synopsis: string;
}

export function ExpandableSynopsis({ synopsis }: ExpandableSynopsisProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const displayText = isExpanded ? synopsis : '';

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="border-t border-neutral-200 pt-5">
      <div className="space-y-3">
        <div className="flex items-center">
          <button
            onClick={toggleExpanded}
            className="flex items-center gap-2 font-semibold text-neutral-800 hover:text-neutral-900 transition-colors duration-200 group"
          >
            <span>Synopsis</span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
            ) : (
              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
            )}
          </button>
        </div>
        
        <div className="transition-all duration-300 ease-in-out">
          <p className="text-neutral-700 text-sm leading-relaxed">
            {displayText}
          </p>
        </div>
      </div>
    </div>
  );
}
