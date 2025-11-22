import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2, Package, Key, Users, TrendingUp, DollarSign } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
  const { data: games, isLoading: gamesLoading } = useQuery({
    queryKey: ['/api/v1/games/showGames'],
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/v1/orders/all'],
  });

  const { data: keys, isLoading: keysLoading } = useQuery({
    queryKey: ['/api/v1/keys/all'],
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/v1/users/all'],
  });

  const stats = [
    {
      title: 'Total de Jogos',
      value: games?.length || 0,
      icon: Gamepad2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      loading: gamesLoading,
    },
    {
      title: 'Pedidos',
      value: orders?.length || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-600/10',
      loading: ordersLoading,
    },
    {
      title: 'Chaves Cadastradas',
      value: keys?.length || 0,
      icon: Key,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-600/10',
      loading: keysLoading,
    },
    {
      title: 'Usuários',
      value: users?.length || 0,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-600/10',
      loading: usersLoading,
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const totalRevenue = orders?.reduce((sum: number, order: any) => {
    return order.status === 1 ? sum + order.total : sum;
  }, 0) || 0;

  const completedOrders = orders?.filter((order: any) => order.status === 1).length || 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do sistema CheckPoint Games
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-md ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  {stat.loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="text-2xl font-bold" data-testid={`stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      {stat.value}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Receita Total</CardTitle>
              <div className="p-2 rounded-md bg-green-600/10">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <Skeleton className="h-10 w-32" />
              ) : (
                <div className="text-3xl font-bold text-green-600" data-testid="text-total-revenue">
                  {formatPrice(totalRevenue)}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                De {completedOrders} pedidos finalizados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Taxa de Conversão</CardTitle>
              <div className="p-2 rounded-md bg-primary/10">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <Skeleton className="h-10 w-24" />
              ) : (
                <div className="text-3xl font-bold" data-testid="text-conversion-rate">
                  {orders && orders.length > 0
                    ? Math.round((completedOrders / orders.length) * 100)
                    : 0}
                  %
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Pedidos finalizados vs totais
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : !orders || orders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum pedido registrado ainda
              </p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-md bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">Pedido #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.userName || 'Cliente'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">
                        {formatPrice(order.total)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.status === 0 && 'Pendente'}
                        {order.status === 1 && 'Finalizado'}
                        {order.status === 2 && 'Cancelado'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
