import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/components/ThemeProvider";

// Client Pages
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import GameDetail from "@/pages/GameDetail";
import Checkout from "@/pages/Checkout";
import Orders from "@/pages/Orders";
import PaymentCallback from "@/pages/PaymentCallback";
import NotFound from "@/pages/not-found";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminGames from "@/pages/admin/Games";
import AdminOrders from "@/pages/admin/Orders";
import AdminKeys from "@/pages/admin/Keys";
import AdminUsers from "@/pages/admin/Users";

function Router() {
  return (
    <Switch>
      {/* Client Routes */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/game/:id" component={GameDetail} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/cart" component={Checkout} />
      <Route path="/orders" component={Orders} />
      <Route path="/payment/callback" component={PaymentCallback} />

      {/* Admin Routes */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/games" component={AdminGames} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/admin/keys" component={AdminKeys} />
      <Route path="/admin/users" component={AdminUsers} />

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider>
            <CartProvider>
              <Router />
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
