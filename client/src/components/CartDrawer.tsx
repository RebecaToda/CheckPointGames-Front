import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { Link } from 'wouter';

export function CartDrawer({ children }: { children: React.ReactNode }) {
  const { items, removeItem, updateQuantity, total } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrinho de Compras
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full mt-6">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground" data-testid="text-empty-cart">
                  Seu carrinho está vazio
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto space-y-4">
                {items.map((item) => (
                  <div
                    key={item.game.id}
                    className="flex gap-4"
                    data-testid={`cart-item-${item.game.id}`}
                  >
                    <img
                      src={item.game.coverImage}
                      alt={item.game.title}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium line-clamp-2 mb-1" data-testid={`text-cart-title-${item.game.id}`}>
                        {item.game.title}
                      </h4>
                      <p className="text-sm font-bold text-primary" data-testid={`text-cart-price-${item.game.id}`}>
                        {formatPrice(item.game.finalPrice || item.game.price)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.game.id, item.quantity - 1)}
                          data-testid={`button-decrease-${item.game.id}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm w-8 text-center" data-testid={`text-quantity-${item.game.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.game.id, item.quantity + 1)}
                          data-testid={`button-increase-${item.game.id}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 ml-auto"
                          onClick={() => removeItem(item.game.id)}
                          data-testid={`button-remove-${item.game.id}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary" data-testid="text-cart-total">
                    {formatPrice(total)}
                  </span>
                </div>
                <Button asChild className="w-full" size="lg" data-testid="button-checkout">
                  <Link href="/checkout">Finalizar Compra</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
