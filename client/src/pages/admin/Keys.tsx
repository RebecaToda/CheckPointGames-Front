import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GameKey, Game } from "@shared/schema";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Key as KeyIcon, CheckCircle, XCircle, Ban } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const addKeysSchema = z.object({
  gameId: z.string().min(1, "Selecione um jogo"),
  keys: z.string().min(1, "Adicione pelo menos uma chave"),
});

type AddKeysInput = z.infer<typeof addKeysSchema>;

export default function AdminKeys() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [gameFilter, setGameFilter] = useState<string>("all");
  const { toast } = useToast();

  const { data: keys, isLoading: keysLoading } = useQuery<GameKey[]>({
    queryKey: ["/api/v1/gamekeys/showGameKeys"],
  });

  const { data: games } = useQuery<Game[]>({
    queryKey: ["/api/v1/games/showGames"],
  });

  const form = useForm<AddKeysInput>({
    resolver: zodResolver(addKeysSchema),
    defaultValues: {
      gameId: "",
      keys: "",
    },
  });

  const addKeysMutation = useMutation({
    mutationFn: (data: { gameId: number; keys: string[] }) =>
      api.post("/api/v1/gamekeys/createGameKeys", data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/v1/gamekeys/showGameKeys"],
      });
      toast({ title: "Chaves adicionadas com sucesso!" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar chaves",
        description: error.response?.data?.message,
      });
    },
  });

  const handleSubmit = (data: AddKeysInput) => {
    const keysList = data.keys
      .split("\n")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);
  };

  const filteredKeys =
    keys?.filter((key) => {
      if (statusFilter !== "all" && key.status !== parseInt(statusFilter)) {
        return false;
      }

      if (gameFilter !== "all" && key.gameId !== parseInt(gameFilter)) {
        return false;
      }
      return true;
    }) || [];

  const getStatusInfo = (status: number) => {
    switch (status) {
      case 0:
        return {
          label: "Ativo",
          icon: CheckCircle,
          variant: "default" as const,
        };
      case 1:
        return { label: "Usado", icon: XCircle, variant: "secondary" as const };
      case 2:
        return {
          label: "Cancelado",
          icon: Ban,
          variant: "destructive" as const,
        };
      default:
        return {
          label: "Desconhecido",
          icon: KeyIcon,
          variant: "secondary" as const,
        };
    }
  };

  const statsActive = keys?.filter((k) => k.status === 0).length || 0;
  const statsUsed = keys?.filter((k) => k.status === 1).length || 0;
  const statsCancelled = keys?.filter((k) => k.status === 2).length || 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">
              Gestão de Chaves
            </h1>
            <p className="text-muted-foreground">
              Adicione e gerencie chaves de jogos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chaves Ativas</p>
                <p className="text-2xl font-bold text-success">{statsActive}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chaves Usadas</p>
                <p className="text-2xl font-bold">{statsUsed}</p>
              </div>
              <XCircle className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Canceladas</p>
                <p className="text-2xl font-bold text-destructive">
                  {statsCancelled}
                </p>
              </div>
              <Ban className="h-8 w-8 text-destructive" />
            </div>
          </Card>
        </div>

        <div className="flex gap-4">
          <Select value={gameFilter} onValueChange={setGameFilter}>
            <SelectTrigger className="w-64" data-testid="select-game-filter">
              <SelectValue placeholder="Filtrar por jogo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os jogos</SelectItem>
              {games?.map((game) => (
                <SelectItem key={game.id} value={game.id.toString()}>
                  {game.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger
              className="w-48"
              data-testid="select-key-status-filter"
            >
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="0">Ativas</SelectItem>
              <SelectItem value="1">Usadas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          {keysLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredKeys.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground">
              Nenhuma chave encontrada
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Jogo</TableHead>
                  <TableHead>Chave</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKeys.map((key) => {
                  const statusInfo = getStatusInfo(key.status);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">#{key.id}</TableCell>

                      <TableCell>
                        {key.gameTitle || `Jogo #${key.gameId}`}
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {key.key}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={statusInfo.variant}
                          className="flex items-center gap-1 w-fit"
                        >
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
