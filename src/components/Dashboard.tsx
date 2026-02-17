import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Map, 
  BookOpen, 
  Wrench, 
  MessageSquare,
  Menu,
  X,
  LogOut,
  Shield,
  User,
  MapPin
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import bizMapLogo from '@/assets/bizmap-logo.png';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, signOut, isAdmin, isGuest } = useAuth();

  const roleIcon = isAdmin ? Shield : isGuest ? MapPin : User;
  const roleLabel = isAdmin ? 'Admin' : isGuest ? 'Guest' : 'User';
  const roleColor = isAdmin ? 'text-destructive' : isGuest ? 'text-[hsl(var(--earth-green))]' : 'text-primary';

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Map, label: 'Map', path: '/map' },
    { icon: BookOpen, label: 'Knowledge Base', path: '/knowledge' },
    { icon: Wrench, label: 'Tools', path: '/tools' },
    { icon: MessageSquare, label: 'AI Assistant', path: '/chat' },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 z-50",
          isSidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
            {isSidebarOpen && (
              <img 
                src={bizMapLogo} 
                alt="BizMap Logo" 
                className="h-10 w-auto object-contain"
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent",
                      isActive && "bg-sidebar-accent text-sidebar-primary",
                      !isSidebarOpen && "justify-center"
                    )}
                  >
                    <Icon size={20} />
                    {isSidebarOpen && <span>{item.label}</span>}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-3 border-t border-sidebar-border">
            {isSidebarOpen ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-2">
                  {(() => { const RoleIcon = roleIcon; return <RoleIcon size={16} className={roleColor} />; })()}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-sidebar-foreground truncate">{user?.email}</p>
                    <p className={cn("text-[10px] font-semibold uppercase", roleColor)}>{roleLabel}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent text-xs"
                  onClick={async () => { await signOut(); navigate('/auth'); }}
                >
                  <LogOut size={14} />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="w-full text-sidebar-foreground hover:bg-sidebar-accent"
                onClick={async () => { await signOut(); navigate('/auth'); }}
                title="Sign Out"
              >
                <LogOut size={18} />
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          isSidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
