import { Game } from '@shared/schema';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(game);
    toast({
      title: "Adicionado ao carrinho",
      description: game.title,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <Link href={`/game/${game.id}`}>
      <Card
        className="group overflow-hidden hover-elevate active-elevate-2 cursor-pointer h-full flex flex-col"
        data-testid={`card-game-${game.id}`}
      >
        <div className="aspect-video relative overflow-hidden bg-muted">
          <img
            src={game.coverImage}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-testid={`img-game-cover-${game.id}`}
          />
          {game.discount > 0 && (
            <Badge
              className="absolute top-2 right-2 bg-destructive text-destructive-foreground font-bold"
              data-testid={`badge-discount-${game.id}`}
            >
              -{game.discount}%
            </Badge>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col gap-3">
          <div className="flex-1">
            <h3
              className="font-semibold text-lg line-clamp-2 mb-1"
              data-testid={`text-game-title-${game.id}`}
            >
              {game.title}
            </h3>
            <Badge variant="secondary" className="text-xs" data-testid={`badge-category-${game.id}`}>
              {game.category}
            </Badge>
          </div>

          <div className="flex items-end justify-between gap-2">
            <div>
              {game.discount > 0 && (
                <p className="text-sm text-muted-foreground line-through" data-testid={`text-original-price-${game.id}`}>
                  {formatPrice(game.price)}
                </p>
              )}
              <p className="text-xl font-bold text-primary" data-testid={`text-final-price-${game.id}`}>
                {formatPrice(game.finalPrice || game.price)}
              </p>
            </div>

            <Button
              size="icon"
              onClick={handleAddToCart}
              data-testid={`button-add-cart-${game.id}`}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
