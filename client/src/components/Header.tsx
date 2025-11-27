import { Link, useLocation } from "wouter";
import { ShoppingCart, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { ThemeToggle } from "./ThemeToggle";
import { CartDrawer } from "./CartDrawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [location] = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();

  // Função para pegar as iniciais do nome
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-3 hover-elevate active-elevate-2 rounded-md px-3 py-2 -ml-3 cursor-pointer">
              <div className="text-2xl font-heading font-bold text-primary">
                CheckPoint Games
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {!location.startsWith("/admin") && (
              <CartDrawer>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  data-testid="button-cart"
                >
                  {/* AUMENTEI O ÍCONE DO CARRINHO AQUI (h-6 w-6) */}
                  <ShoppingCart className="h-6 w-6" />
                  {itemCount > 0 && (
                    <Badge
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      data-testid="text-cart-count"
                    >
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </CartDrawer>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {/* AUMENTEI O AVATAR TAMBÉM (h-10 w-10) PARA FICAR PROPORCIONAL */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-10 w-10"
                    data-testid="button-user-menu"
                  >
                    <Avatar className="h-9 w-9">
                      {" "}
                      {/* Aumentei a imagem interna para h-9 w-9 */}
                      <AvatarImage src={user?.profileImage} alt={user?.name} />
                      <AvatarFallback>
                        {user?.name ? (
                          getInitials(user.name)
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p
                      className="text-sm font-medium truncate"
                      data-testid="text-user-name"
                    >
                      {user?.name}
                    </p>
                    <p
                      className="text-xs text-muted-foreground truncate"
                      data-testid="text-user-email"
                    >
                      {user?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      Meu Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/admin"
                          data-testid="link-admin"
                          className="cursor-pointer"
                        >
                          Painel Admin
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link
                      href="/orders"
                      data-testid="link-orders"
                      className="cursor-pointer"
                    >
                      Meus Pedidos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    data-testid="button-logout"
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild data-testid="button-login">
                <Link href="/login">Entrar</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
