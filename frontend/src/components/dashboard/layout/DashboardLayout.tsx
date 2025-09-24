import React, { useState, useCallback, memo, Suspense, lazy } from 'react';
import { TopNavigation } from './TopNavigation';
import DashboardErrorBoundary from './ErrorBoundary';
import PageLoader from './PageLoader';

// Lazy loading de secciones
const HomePage = lazy(() => import('../home/HomePage'));
const LibraryPage = lazy(() => import('../library/LibraryPage'));
const ExplorePage = lazy(() => import('../explore/ExplorePage'));
const CommunityPage = lazy(() => import('../community/CommunityPage'));
const ProfilePage = lazy(() => import('../profile/ProfilePage'));

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = memo(() => {
  const [activeSection, setActiveSection] = useState('home');

  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
  }, []);

  // Renderizar sección activa
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomePage />;
      case 'library':
        return <LibraryPage />;
      case 'discover':
        return <ExplorePage />;
      case 'community':
        return <CommunityPage />;
      case 'profile':
        return <ProfilePage />;
      case 'notifications':
        return (
          <div className="max-w-4xl mx-auto px-6 space-y-6">
            <div>
              <h1 className="font-display font-bold text-2xl text-neutral-900 mb-1">Notificaciones</h1>
              <p className="text-neutral-500">Mantente al día con las últimas actualizaciones</p>
            </div>
            <div className="text-center py-16">
              <p className="text-neutral-500">No tienes notificaciones nuevas</p>
            </div>
          </div>
        );
      default:
        return <HomePage />;
    }
  };

  return (
    <DashboardErrorBoundary>
      <div className="min-h-screen bg-white">
        <TopNavigation activeSection={activeSection} onSectionChange={handleSectionChange} />
        
        <main className="pb-8">
          <Suspense fallback={<PageLoader message="Cargando sección..." size="lg" />}>
            {renderActiveSection()}
          </Suspense>
        </main>
      </div>
    </DashboardErrorBoundary>
  );
});

DashboardLayout.displayName = 'DashboardLayout';

export default DashboardLayout;