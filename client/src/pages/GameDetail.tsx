import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Game } from "@shared/schema";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function GameDetail() {
  const [, params] = useRoute("/game/:id");
  const [, setLocation] = useLocation();
  const { addItem } = useCart();
  const { toast } = useToast();

  const {
    data: game,
    isLoading,
    error,
  } = useQuery<Game>({
    queryKey: [`/api/v1/games/showGamesById/${params?.id}`],
    enabled: !!params?.id,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleAddToCart = () => {
    if (game) {
      addItem(game);
      toast({
        title: "Adicionado ao carrinho",
        description: game.title,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Jogo não encontrado ou erro ao carregar.
            </AlertDescription>
          </Alert>
          <div className="text-center mt-6">
            <Button onClick={() => setLocation("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
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
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative aspect-video rounded-md overflow-hidden mb-6 bg-muted">
              <img
                src={game.coverImage}
                alt={game.title}
                className="w-full h-full object-cover"
                data-testid="img-game-cover"
              />
              {game.discount > 0 && (
                <Badge
                  className="absolute top-4 right-4 bg-destructive text-destructive-foreground font-bold text-lg px-3 py-1"
                  data-testid="badge-discount"
                >
                  -{game.discount}%
                </Badge>
              )}
            </div>

            {game.screenshots && game.screenshots.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {game.screenshots.map((screenshot, index) => (
                  <div
                    key={index}
                    className="aspect-video rounded-md overflow-hidden bg-muted"
                  >
                    <img
                      src={screenshot}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-heading font-semibold mb-3">
                  Descrição
                </h2>
                <p
                  className="text-muted-foreground leading-relaxed"
                  data-testid="text-description"
                >
                  {game.description}
                </p>
              </div>

              {game.platform && game.platform.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Plataformas</h3>
                  <div className="flex flex-wrap gap-2">
                    {game.platform.map((platform) => (
                      <Badge key={platform} variant="secondary">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-primary/5 border border-primary/20 rounded-md p-4">
                <p className="text-sm font-semibold text-primary mb-1">
                  Entrega Imediata
                </p>
                <p className="text-sm text-muted-foreground">
                  Após a confirmação do pagamento, a chave do jogo será enviada
                  automaticamente para seu email.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="space-y-6">
                <div>
                  <h1
                    className="text-2xl font-heading font-bold mb-2"
                    data-testid="text-game-title"
                  >
                    {game.title}
                  </h1>

                  {/* --- ALTERAÇÃO AQUI: Exibe múltiplas categorias --- */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {game.category?.split(",").map((cat, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        data-testid={`badge-category-${index}`}
                      >
                        {cat.trim()}
                      </Badge>
                    ))}
                  </div>
                  {/* ------------------------------------------------ */}
                </div>

                <div>
                  {game.discount > 0 && (
                    <p
                      className="text-lg text-muted-foreground line-through mb-1"
                      data-testid="text-original-price"
                    >
                      {formatPrice(game.price)}
                    </p>
                  )}
                  <p
                    className="text-3xl font-bold text-primary"
                    data-testid="text-final-price"
                  >
                    {formatPrice(game.finalPrice || game.price)}
                  </p>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="w-full"
                  size="lg"
                  data-testid="button-add-to-cart"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Adicionar ao Carrinho
                </Button>

                <div className="text-sm text-muted-foreground space-y-2">
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-success rounded-full"></span>
                    Entrega imediata por email
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Pagamento seguro via Mercado Pago
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-warning rounded-full"></span>
                    Suporte 24/7
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
