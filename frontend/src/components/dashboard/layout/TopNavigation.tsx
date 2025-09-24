import { Button } from '../../ui';
import { 
  Home, 
  Library, 
  Search, 
  Users, 
  Bell,
  Settings,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { useAuthActions } from '../../../stores/authStore';

const navigationItems = [
  { icon: Library, label: "Mi Biblioteca", id: "library" },
  { icon: Search, label: "Explorar", id: "discover" },
  { icon: Home, label: "Home", id: "home" },
  { icon: Users, label: "Comunidad", id: "community" },
  { icon: User, label: "Mi Perfil", id: "profile" },
];

interface TopNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function TopNavigation({ activeSection, onSectionChange }: TopNavigationProps) {
  const { logout } = useAuthActions();

  const handleLogout = () => {
    logout();
    // Redirigir a la página de login
    window.location.href = '/login';
  };
  
  return (
    <div className="w-full">
      {/* Main Header Container */}
      <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 mx-8 my-6 p-6">
        <div className="flex items-center justify-between">
          {/* Logo Container */}
          <div className="flex-shrink-0">
            <h1 className="font-display font-bold text-3xl text-neutral-900 tracking-tight">BookTracker</h1>
          </div>

          {/* Navigation Tabs Container */}
          <div className="flex items-center gap-1 bg-neutral-50 rounded-xl p-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                  <button
                    key={item.id}
                    onClick={() => onSectionChange(item.id)}
                    className={cn(
                    "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 min-w-[80px]",
                    isActive 
                      ? "bg-white text-primary-500 shadow-sm" 
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-white/50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Controls Container */}
          <div className="flex items-center gap-2 bg-neutral-50 rounded-xl px-3 py-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white text-neutral-500 hover:text-neutral-900">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white text-neutral-500 hover:text-neutral-900">
              <Settings className="h-4 w-4" />
            </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:bg-red-100 text-neutral-500 hover:text-red-600"
                    title="Cerrar sesión"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
