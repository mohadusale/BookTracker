import { BookOpen, Archive } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface LibraryTabsProps {
  activeTab: 'books' | 'shelves';
  onTabChange: (tab: 'books' | 'shelves') => void;
}

export function LibraryTabs({ activeTab, onTabChange }: LibraryTabsProps) {
  const tabs = [
    {
      id: 'books' as const,
      label: 'Libros',
      icon: BookOpen
    },
    {
      id: 'shelves' as const,
      label: 'Estanterías',
      icon: Archive
    }
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex bg-neutral-100 rounded-xl p-1 shadow-sm hover:shadow-md transition-shadow duration-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 font-medium",
                isActive
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-white/50"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
