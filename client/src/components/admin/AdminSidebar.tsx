import { Home, Gamepad2, Package, Key, Users, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: LayoutDashboard,
    testId: 'link-admin-dashboard',
  },
  {
    title: 'Jogos',
    url: '/admin/games',
    icon: Gamepad2,
    testId: 'link-admin-games',
  },
  {
    title: 'Pedidos',
    url: '/admin/orders',
    icon: Package,
    testId: 'link-admin-orders',
  },
  {
    title: 'Chaves',
    url: '/admin/keys',
    icon: Key,
    testId: 'link-admin-keys',
  },
  {
    title: 'Usuários',
    url: '/admin/users',
    icon: Users,
    testId: 'link-admin-users',
  },
];

export function AdminSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/">
          <div className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md p-2 -m-2">
            <Home className="h-5 w-5" />
            <div>
              <p className="font-heading font-bold text-sm">CheckPoint Games</p>
              <p className="text-xs text-muted-foreground">Painel Admin</p>
            </div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestão</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} data-testid={item.testId}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
