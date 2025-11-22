import { useState } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { CreateOrderResponse } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBag, CreditCard } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, total, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setLocation('/login');
      return;
    }

    if (items.length === 0) {
      toast({
        variant: "destructive",
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho antes de finalizar",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = {
        items: items.map(item => ({
          gameId: item.game.id,
          quantity: item.quantity,
        })),
      };

      const response = await api.post<CreateOrderResponse>(
        '/api/v1/orders/create',
        orderData
      );

      const { paymentLink, orderId } = response.data;

      clearCart();
      
      toast({
        title: "Pedido criado!",
        description: `Pedido #${orderId} - Redirecionando para pagamento...`,
      });

      // Redirecionar para Mercado Pago
      setTimeout(() => {
        window.location.href = paymentLink;
      }, 1500);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar pedido",
        description: error.response?.data?.message || "Tente novamente mais tarde",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Carrinho Vazio</h2>
            <p className="text-muted-foreground mb-6">
              Adicione jogos ao carrinho para continuar
            </p>
            <Button onClick={() => setLocation('/')}>
              Ver Jogos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-heading font-bold mb-8">
            Finalizar Compra
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Itens do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.game.id} className="flex gap-4" data-testid={`checkout-item-${item.game.id}`}>
                      <img
                        src={item.game.coverImage}
                        alt={item.game.title}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.game.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Quantidade: {item.quantity}
                        </p>
                        <p className="font-bold text-primary">
                          {formatPrice((item.game.finalPrice || item.game.price) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Alert className="mt-6">
                <CreditCard className="h-4 w-4" />
                <AlertDescription>
                  Você será redirecionado para o Mercado Pago para finalizar o pagamento de forma segura.
                  Após a confirmação, as chaves dos jogos serão enviadas automaticamente.
                </AlertDescription>
              </Alert>
            </div>

            {/* Payment Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Resumo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span data-testid="text-subtotal">{formatPrice(total)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary" data-testid="text-total">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full"
                    size="lg"
                    data-testid="button-process-payment"
                  >
                    {isProcessing ? (
                      'Processando...'
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pagar via Mercado Pago
                      </>
                    )}
                  </Button>

                  <div className="text-xs text-muted-foreground text-center">
                    Pagamento 100% seguro via Mercado Pago
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
