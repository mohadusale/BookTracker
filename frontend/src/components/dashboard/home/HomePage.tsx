import React from 'react';
import { FloatingCurrentlyReading } from './FloatingCurrentlyReading';
import { FloatingAnnualProgress } from './FloatingAnnualProgress';
import { FloatingContinueReading } from './FloatingContinueReading';
import { FloatingRecentActivities } from './FloatingRecentActivities';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Dashboard Layout - Floating Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Currently Reading - Spans 2 columns on large screens */}
        <div className="lg:col-span-2">
          <FloatingCurrentlyReading />
        </div>
        
        {/* Annual Progress */}
        <div>
          <FloatingAnnualProgress />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Reading - Spans 2 columns */}
        <div className="lg:col-span-2">
          <FloatingContinueReading />
        </div>
        
        {/* Recent Activities */}
        <div>
          <FloatingRecentActivities />
        </div>
      </div>
    </div>
  );
};

export default HomePage;