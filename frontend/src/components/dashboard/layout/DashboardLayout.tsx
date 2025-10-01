import React, { useState, useCallback, memo, Suspense, lazy } from 'react';
import { TopNavigation } from './TopNavigation';
import DashboardErrorBoundary from './ErrorBoundary';
import PageLoader from './PageLoader';
import { useDataRefresh } from '../../../hooks/useDataRefresh';

// Lazy loading de secciones
const HomePage = lazy(() => import('../home/HomePage'));
const LibraryPage = lazy(() => import('../library/LibraryPage'));
const ExplorePage = lazy(() => import('../explore/ExplorePage'));
const CommunityPage = lazy(() => import('../community/CommunityPage'));
const ProfilePage = lazy(() => import('../profile/ProfilePage'));
const ShelfView = lazy(() => import('../library/shelves/ShelfView').then(module => ({ default: module.ShelfView })));

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = memo(() => {
  const [activeSection, setActiveSection] = useState('home');
  const [shelfView, setShelfView] = useState<{ id: number; name: string } | null>(null);
  const [showShelvesTab, setShowShelvesTab] = useState(false);
  const { refreshShelves } = useDataRefresh();

  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
    setShelfView(null); // Limpiar vista de estantería al cambiar sección
    setShowShelvesTab(false); // Resetear tab de shelves
  }, []);

  const handleViewShelf = useCallback((shelfId: number, shelfName: string) => {
    setShelfView({ id: shelfId, name: shelfName });
  }, []);

  const handleBackToShelves = useCallback(() => {
    setShelfView(null);
    setActiveSection('library');
    setShowShelvesTab(true); // Indicar que debe mostrar el tab de shelves
    // Refrescar las estanterías para obtener contadores actualizados
    refreshShelves();
  }, [refreshShelves]);

  // Renderizar sección activa
  const renderActiveSection = () => {
    // Si hay una estantería seleccionada, mostrar la vista de la estantería
    if (shelfView) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <ShelfView
            shelfId={shelfView.id}
            shelfName={shelfView.name}
            onBack={handleBackToShelves}
          />
        </div>
      );
    }

    switch (activeSection) {
      case 'home':
        return <HomePage />;
      case 'library':
        return <LibraryPage onViewShelf={handleViewShelf} initialTab={showShelvesTab ? 'shelves' : 'books'} />;
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