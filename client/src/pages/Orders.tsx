import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Order } from '@shared/schema';
import { ShoppingBag, Package, XCircle, CheckCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { useEffect } from 'react';

export default function Orders() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated]);

  const { data: orders, isLoading, error } = useQuery<Order[]>({
    queryKey: ['/api/v1/orders/user'],
    enabled: isAuthenticated,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusInfo = (status: number) => {
    switch (status) {
      case 0:
        return {
          label: 'Pendente',
          icon: Clock,
          variant: 'secondary' as const,
        };
      case 1:
        return {
          label: 'Finalizado',
          icon: CheckCircle,
          variant: 'default' as const,
        };
      case 2:
        return {
          label: 'Cancelado',
          icon: XCircle,
          variant: 'destructive' as const,
        };
      default:
        return {
          label: 'Desconhecido',
          icon: Package,
          variant: 'secondary' as const,
        };
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-heading font-bold mb-8">
            Meus Pedidos
          </h1>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Erro ao carregar pedidos. Tente novamente mais tarde.
              </AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          ) : !orders || orders.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">
                  Você ainda não fez nenhum pedido
                </p>
                <p className="text-sm text-muted-foreground">
                  Explore nosso catálogo e encontre seus jogos favoritos
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <Card key={order.id} data-testid={`order-${order.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <CardTitle className="text-lg" data-testid={`text-order-id-${order.id}`}>
                            Pedido #{order.id}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground" data-testid={`text-order-date-${order.id}`}>
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <Badge variant={statusInfo.variant} className="flex items-center gap-1" data-testid={`badge-status-${order.id}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.gameTitle} x{item.quantity}</span>
                              <span className="font-medium">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t pt-3 flex justify-between font-bold">
                          <span>Total:</span>
                          <span className="text-primary" data-testid={`text-order-total-${order.id}`}>
                            {formatPrice(order.total)}
                          </span>
                        </div>

                        {order.keys && order.keys.length > 0 && order.status === 1 && (
                          <div className="bg-success/10 border border-success/20 rounded-md p-4 space-y-2">
                            <p className="text-sm font-semibold text-success mb-2">
                              Chaves do Jogo:
                            </p>
                            {order.keys.map((key) => (
                              <div key={key.id} className="bg-background/50 rounded p-2">
                                <p className="text-xs text-muted-foreground mb-1">
                                  {key.gameTitle}
                                </p>
                                <code className="text-sm font-mono" data-testid={`text-key-${key.id}`}>
                                  {key.key}
                                </code>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
