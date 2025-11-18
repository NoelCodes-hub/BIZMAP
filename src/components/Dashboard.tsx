import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Map, 
  BookOpen, 
  Wrench, 
  MessageSquare,
  Menu,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import bizMapLogo from '@/assets/bizmap-logo.png';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

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
