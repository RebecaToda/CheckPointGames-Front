import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Order } from "@shared/schema";
import {
  ShoppingBag,
  Package,
  XCircle,
  CheckCircle,
  Clock,
  Key,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Orders() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated]);

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery<Order[]>({
    queryKey: ["/api/v1/orders/user"],
    enabled: isAuthenticated,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const datePart = dateString.toString().split("T")[0];
    const [year, month, day] = datePart.split("-");
    return `${day}/${month}/${year}`;
  };

  const getStatusInfo = (status: number) => {
    switch (status) {
      case 0:
        return {
          label: "Pendente",
          icon: Clock,
          variant: "secondary" as const,
        };
      case 1:
        return {
          label: "Concluído",
          icon: CheckCircle,
          variant: "default" as const,
        };
      case 2:
        return {
          label: "Cancelado",
          icon: XCircle,
          variant: "destructive" as const,
        };
      default:
        return {
          label: "Desconhecido",
          icon: Package,
          variant: "secondary" as const,
        };
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-heading font-bold mb-8">Meus Pedidos</h1>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Não foi possível carregar seus pedidos.
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
                <p className="text-muted-foreground mb-4">
                  Você ainda não fez nenhuma compra.
                </p>
                <Button asChild>
                  <Link href="/">Ver Jogos</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;
                return (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/40 py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Data</p>
                            <p className="font-medium">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Total</p>
                            <p className="font-medium">
                              {formatPrice(order.total)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Pedido #</p>
                            <p className="font-medium">{order.id}</p>
                          </div>
                        </div>
                        <Badge
                          variant={statusInfo.variant}
                          className="flex items-center gap-1 w-fit"
                        >
                          <StatusIcon className="h-3 w-3" /> {statusInfo.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        {order.items?.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0"
                          >
                            <div>
                              <p className="font-semibold">{item.gameTitle}</p>
                              <p className="text-sm text-muted-foreground">
                                Qtd: {item.quantity}
                              </p>
                            </div>
                            <p className="font-medium">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                        ))}
                        {order.status === 1 &&
                          order.keys &&
                          order.keys.length > 0 && (
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-4">
                              <div className="flex items-center gap-2 mb-3 text-primary font-semibold">
                                <Key className="h-4 w-4" />
                                <span>Suas Chaves de Ativação</span>
                              </div>
                              <div className="grid gap-2">
                                {order.keys.map((key) => (
                                  <div
                                    key={key.id}
                                    className="flex justify-between bg-background p-3 rounded border text-sm"
                                  >
                                    <span className="text-muted-foreground">
                                      {key.gameTitle}
                                    </span>
                                    <code className="bg-muted px-2 py-1 rounded font-mono select-all">
                                      {key.key}
                                    </code>
                                  </div>
                                ))}
                              </div>
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
