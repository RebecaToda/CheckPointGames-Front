import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { GameCard } from '@/components/GameCard';
import { Filters } from '@/components/Filters';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { Game, GameFilters } from '@shared/schema';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function Home() {
  const [filters, setFilters] = useState<GameFilters>({});

  const { data: games, isLoading, error } = useQuery<Game[]>({
    queryKey: ['/api/v1/games/showActivityGames'],
  });

  const categories = games
    ? Array.from(new Set(games.map(g => g.category)))
    : [];

  const filteredGames = games?.filter(game => {
    if (filters.search && !game.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.category && game.category !== filters.category) {
      return false;
    }
    const price = game.finalPrice || game.price;
    if (filters.minPrice !== undefined && price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && price > filters.maxPrice) {
      return false;
    }
    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/20 via-background to-background border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-4" data-testid="text-hero-title">
              Sua Loja de Jogos Digitais
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6">
              Keys de jogos com entrega imediata e pagamento seguro via Mercado Pago
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-md">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>Entrega Imediata</span>
              </div>
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-md">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Pagamento Seguro</span>
              </div>
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-md">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span>Melhores Preços</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-24 bg-card p-6 rounded-md border">
              <h2 className="font-semibold text-lg mb-4">Filtros</h2>
              <Filters onFilterChange={setFilters} categories={categories} />
            </div>
          </aside>

          {/* Games Grid */}
          <div className="flex-1">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Erro ao carregar jogos. Tente novamente mais tarde.
                </AlertDescription>
              </Alert>
            )}

            <div className="mb-4">
              <h2 className="text-2xl font-heading font-bold">
                {filters.search || filters.category
                  ? `Resultados (${filteredGames.length})`
                  : 'Todos os Jogos'}
              </h2>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-video w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredGames.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  Nenhum jogo encontrado com os filtros selecionados
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
