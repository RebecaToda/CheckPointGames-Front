import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Game } from '@shared/schema';

interface CartContextType {
  items: CartItem[];
  addItem: (game: Game) => void;
  removeItem: (gameId: number) => void;
  updateQuantity: (gameId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Carregar carrinho do localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Salvar carrinho no localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (game: Game) => {
    setItems(current => {
      const existingItem = current.find(item => item.game.id === game.id);
      
      if (existingItem) {
        return current.map(item =>
          item.game.id === game.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...current, { game, quantity: 1 }];
    });
  };

  const removeItem = (gameId: number) => {
    setItems(current => current.filter(item => item.game.id !== gameId));
  };

  const updateQuantity = (gameId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(gameId);
      return;
    }
    
    setItems(current =>
      current.map(item =>
        item.game.id === gameId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce(
    (sum, item) => sum + (item.game.finalPrice || item.game.price) * item.quantity,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
