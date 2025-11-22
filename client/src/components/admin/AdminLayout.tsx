import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    } else if (!isAdmin) {
      setLocation('/');
    }
  }, [isAuthenticated, isAdmin]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const style = {
    '--sidebar-width': '16rem',
    '--sidebar-width-icon': '3rem',
  };

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-4 px-6 py-4 border-b bg-background/95 backdrop-blur">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-4">
              <div className="text-sm text-right">
                <p className="font-medium" data-testid="text-admin-name">{user?.name}</p>
                <p className="text-xs text-muted-foreground">Administrador</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} data-testid="button-admin-logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
