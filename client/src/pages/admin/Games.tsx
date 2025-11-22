import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Game, createGameSchema, CreateGameInput } from '@shared/schema';
import { api } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminGames() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const { toast } = useToast();

  const { data: games, isLoading } = useQuery<Game[]>({
    queryKey: ['/api/v1/games/showGames'],
  });

  const form = useForm<CreateGameInput>({
    resolver: zodResolver(createGameSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      discount: 0,
      category: '',
      coverImage: '',
      screenshots: [],
      platform: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateGameInput) => api.post('/api/v1/games/create', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/v1/games/showGames'] });
      toast({ title: 'Jogo criado com sucesso!' });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar jogo',
        description: error.response?.data?.message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateGameInput> }) =>
      api.put(`/api/v1/games/update/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/v1/games/showGames'] });
      toast({ title: 'Jogo atualizado com sucesso!' });
      setIsDialogOpen(false);
      setEditingGame(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar jogo',
        description: error.response?.data?.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/api/v1/games/delete/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/v1/games/showGames'] });
      toast({ title: 'Jogo removido com sucesso!' });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao remover jogo',
        description: error.response?.data?.message,
      });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>
      api.put(`/api/v1/games/updateStatus/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/v1/games/showGames'] });
      toast({ title: 'Status atualizado!' });
    },
  });

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    form.reset({
      title: game.title,
      description: game.description,
      price: game.price,
      discount: game.discount,
      category: game.category,
      coverImage: game.coverImage,
      screenshots: game.screenshots || [],
      platform: game.platform || [],
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: CreateGameInput) => {
    if (editingGame) {
      updateMutation.mutate({ id: editingGame.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">Gestão de Jogos</h1>
            <p className="text-muted-foreground">Adicione, edite ou remova jogos do catálogo</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingGame(null); form.reset(); }} data-testid="button-add-game">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Jogo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingGame ? 'Editar Jogo' : 'Adicionar Novo Jogo'}</DialogTitle>
                <DialogDescription>
                  Preencha os dados do jogo abaixo
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do jogo" data-testid="input-game-title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descrição do jogo..."
                            rows={4}
                            data-testid="input-game-description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço (R$)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              data-testid="input-game-price"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Desconto (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              data-testid="input-game-discount"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: RPG, Ação, Aventura..." data-testid="input-game-category" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL da Capa</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." data-testid="input-game-cover" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      data-testid="button-submit-game"
                    >
                      {editingGame ? 'Atualizar' : 'Criar'} Jogo
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !games || games.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground">
              Nenhum jogo cadastrado ainda
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Capa</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Desconto</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {games.map((game) => (
                  <TableRow key={game.id} data-testid={`game-row-${game.id}`}>
                    <TableCell>
                      <img
                        src={game.coverImage}
                        alt={game.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{game.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{game.category}</Badge>
                    </TableCell>
                    <TableCell>{formatPrice(game.price)}</TableCell>
                    <TableCell>
                      {game.discount > 0 ? (
                        <Badge variant="destructive">{game.discount}%</Badge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={game.status === 0 ? 'default' : 'secondary'}>
                        {game.status === 0 ? 'Ativo' : 'Bloqueado'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => toggleStatusMutation.mutate({
                            id: game.id,
                            status: game.status === 0 ? 1 : 0,
                          })}
                          data-testid={`button-toggle-status-${game.id}`}
                        >
                          {game.status === 0 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(game)}
                          data-testid={`button-edit-${game.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            if (confirm('Tem certeza que deseja remover este jogo?')) {
                              deleteMutation.mutate(game.id);
                            }
                          }}
                          data-testid={`button-delete-${game.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
