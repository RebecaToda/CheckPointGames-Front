import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Order } from '@shared/schema';
import { api } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Clock, XCircle, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['/api/v1/orders/all'],
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>
      api.put(`/api/v1/orders/updateStatus/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/v1/orders/all'] });
      toast({ title: 'Status atualizado!' });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar status',
        description: error.response?.data?.message,
      });
    },
  });

  const filteredOrders = orders?.filter(order => {
    if (statusFilter === 'all') return true;
    return order.status === parseInt(statusFilter);
  }) || [];

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
        return { label: 'Pendente', icon: Clock, variant: 'secondary' as const };
      case 1:
        return { label: 'Finalizado', icon: CheckCircle, variant: 'default' as const };
      case 2:
        return { label: 'Cancelado', icon: XCircle, variant: 'destructive' as const };
      default:
        return { label: 'Desconhecido', icon: Clock, variant: 'secondary' as const };
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">Gestão de Pedidos</h1>
            <p className="text-muted-foreground">Visualize e gerencie todos os pedidos</p>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48" data-testid="select-status-filter">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="0">Pendentes</SelectItem>
              <SelectItem value="1">Finalizados</SelectItem>
              <SelectItem value="2">Cancelados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground">
              Nenhum pedido encontrado
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <TableRow key={order.id} data-testid={`order-row-${order.id}`}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>{order.userName || 'Cliente'}</TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell className="font-bold text-primary">
                        {formatPrice(order.total)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusInfo.variant} className="flex items-center gap-1 w-fit">
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setSelectedOrder(order)}
                            data-testid={`button-view-${order.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {order.status === 0 && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  updateStatusMutation.mutate({ id: order.id, status: 1 })
                                }
                                data-testid={`button-complete-${order.id}`}
                              >
                                Finalizar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  updateStatusMutation.mutate({ id: order.id, status: 2 })
                                }
                                data-testid={`button-cancel-${order.id}`}
                              >
                                Cancelar
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-medium">{selectedOrder.userName || 'Cliente'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">Itens do Pedido:</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between p-2 bg-muted rounded">
                      <span>{item.gameTitle} x{item.quantity}</span>
                      <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-primary">{formatPrice(selectedOrder.total)}</span>
              </div>

              {selectedOrder.keys && selectedOrder.keys.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">Chaves Associadas:</p>
                  <div className="space-y-2">
                    {selectedOrder.keys.map((key) => (
                      <div key={key.id} className="p-2 bg-muted rounded">
                        <p className="text-xs text-muted-foreground">{key.gameTitle}</p>
                        <code className="text-sm">{key.key}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
