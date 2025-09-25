import React, { useState } from 'react';
import { LibraryTabs } from './LibraryTabs';
import { BooksSection } from './BooksSection';
import { ShelvesSection } from './shelves/ShelvesSection';

const LibraryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'books' | 'shelves'>('books');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="space-y-6">
        {/* Header Centered */}
        <div className="text-center">
          <h1 className="font-display font-bold text-2xl text-neutral-900 mb-1">Mi Biblioteca</h1>
        </div>

        {/* Tabs Navigation */}
        <LibraryTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content based on active tab */}
        {activeTab === 'books' ? <BooksSection /> : <ShelvesSection />}
      </div>
    </div>
  );
};

export default LibraryPage;