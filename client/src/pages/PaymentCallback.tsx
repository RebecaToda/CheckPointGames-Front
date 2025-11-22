import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function PaymentCallback() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'success' | 'pending' | 'failure'>('pending');

  useEffect(() => {
    // Capturar parâmetros da URL do Mercado Pago
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('status');
    const paymentId = urlParams.get('payment_id');
    const preferenceId = urlParams.get('preference_id');

    // Determinar status baseado nos parâmetros
    if (paymentStatus === 'approved') {
      setStatus('success');
    } else if (paymentStatus === 'pending' || paymentStatus === 'in_process') {
      setStatus('pending');
    } else {
      setStatus('failure');
    }

    // Log para debug
    console.log('Payment callback:', {
      status: paymentStatus,
      paymentId,
      preferenceId,
    });
  }, []);

  const renderContent = () => {
    switch (status) {
      case 'success':
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>
              <CardTitle className="text-2xl" data-testid="text-payment-success">
                Pagamento Confirmado!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Seu pagamento foi processado com sucesso. As chaves dos jogos foram enviadas para seu email e estão disponíveis em "Meus Pedidos".
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button onClick={() => setLocation('/orders')} data-testid="button-view-orders">
                  Ver Meus Pedidos
                </Button>
                <Button variant="outline" onClick={() => setLocation('/')}>
                  Continuar Comprando
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'pending':
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center">
                <Clock className="h-10 w-10 text-warning" />
              </div>
              <CardTitle className="text-2xl" data-testid="text-payment-pending">
                Pagamento Pendente
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Seu pagamento está sendo processado. Você receberá um email assim que for confirmado.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button onClick={() => setLocation('/orders')}>
                  Ver Meus Pedidos
                </Button>
                <Button variant="outline" onClick={() => setLocation('/')}>
                  Voltar à Loja
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'failure':
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
              <CardTitle className="text-2xl" data-testid="text-payment-failure">
                Pagamento Não Processado
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Não foi possível processar seu pagamento. Por favor, tente novamente ou escolha outro método de pagamento.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button onClick={() => setLocation('/checkout')}>
                  Tentar Novamente
                </Button>
                <Button variant="outline" onClick={() => setLocation('/')}>
                  Voltar à Loja
                </Button>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        {renderContent()}
      </div>
    </div>
  );
}
