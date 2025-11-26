import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@shared/schema";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Ban, CheckCircle, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminUsers() {
  const { toast } = useToast();

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/v1/users/showUsers"],
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>
      api.put(`/api/v1/users/updateStatus/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/users/showUsers"] });
      toast({ title: "Status atualizado!" });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: error.response?.data?.message,
      });
    },
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const statsActive = users?.filter((u) => u.status === 0).length || 0;
  const statsBlocked = users?.filter((u) => u.status === 1).length || 0;
  const statsAdmin = users?.filter((u) => u.isAdmin).length || 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">
            Gestão de Usuários
          </h1>
          <p className="text-muted-foreground">
            Visualize e gerencie usuários do sistema
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Usuários Ativos</p>
                <p
                  className="text-2xl font-bold text-success"
                  data-testid="text-users-active"
                >
                  {statsActive}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Usuários Bloqueados
                </p>
                <p
                  className="text-2xl font-bold text-destructive"
                  data-testid="text-users-blocked"
                >
                  {statsBlocked}
                </p>
              </div>
              <Ban className="h-8 w-8 text-destructive" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Administradores</p>
                <p
                  className="text-2xl font-bold text-primary"
                  data-testid="text-users-admin"
                >
                  {statsAdmin}
                </p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </Card>
        </div>

        <Card>
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !users || users.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground">
              Nenhum usuário cadastrado ainda
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} data-testid={`user-row-${user.id}`}>
                    <TableCell className="font-medium">#{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.isAdmin ? (
                        <Badge
                          variant="default"
                          className="flex items-center gap-1 w-fit"
                        >
                          <Shield className="h-3 w-3" />
                          Admin
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Cliente</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === 0 ? "default" : "destructive"}
                      >
                        {user.status === 0 ? "Ativo" : "Bloqueado"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {!user.isAdmin && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            toggleStatusMutation.mutate({
                              id: user.id,
                              status: user.status === 0 ? 1 : 0,
                            })
                          }
                          data-testid={`button-toggle-status-${user.id}`}
                        >
                          {user.status === 0 ? "Bloquear" : "Desbloquear"}
                        </Button>
                      )}
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
