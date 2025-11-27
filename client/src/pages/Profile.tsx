import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription as CardDesc,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Shield,
  Phone,
  Mail,
  Lock,
  KeyRound,
  Calendar,
  Camera,
} from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const profileSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
    email: z.string().email("Email inválido"),
    number: z.string().min(8, "Telefone inválido"),
    birthDate: z.string().optional(),
    newPassword: z.string().optional(),
    confirmNewPassword: z.string().optional(),
    currentPassword: z
      .string()
      .min(1, "Digite sua senha atual para confirmar as alterações"),
  })
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword.length < 6) {
        return false;
      }
      return true;
    },
    {
      message: "A nova senha deve ter no mínimo 6 caracteres",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      return data.newPassword === data.confirmNewPassword;
    },
    {
      message: "As senhas não conferem",
      path: ["confirmNewPassword"],
    }
  );

type ProfileFormValues = z.infer<typeof profileSchema>;

const formatPhoneNumber = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  return numbers
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d)(\d{4})$/, "$1-$2")
    .slice(0, 15);
};

const calculateAge = (dateString: string) => {
  if (!dateString) return null;
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default function Profile() {
  const { user, isAuthenticated, updateUser } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    undefined
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      number: "",
      birthDate: "",
      newPassword: "",
      confirmNewPassword: "",
      currentPassword: "",
    },
  });

  const watchedBirthDate = form.watch("birthDate");
  const realTimeAge = watchedBirthDate ? calculateAge(watchedBirthDate) : null;

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        number: user.number || "",
        birthDate: (user as any).birthDate || "",
        newPassword: "",
        confirmNewPassword: "",
        currentPassword: "",
      });
      setPreviewImage(user.profileImage);
    }
  }, [user, isAuthenticated, form, setLocation]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Arquivo muito grande",
          description: "A imagem deve ter no máximo 5MB.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    setIsLoading(true);

    try {
      try {
        await api.post("/api/v1/auth/login", {
          email: user.email,
          password: data.currentPassword,
        });
      } catch (e) {
        toast({
          variant: "destructive",
          title: "Senha incorreta",
          description: "A senha atual digitada está incorreta.",
        });
        setIsLoading(false);
        return;
      }

      const passwordToSave =
        data.newPassword && data.newPassword.length >= 6
          ? data.newPassword
          : data.currentPassword;

      let ageToSave = user.age || 0;
      if (data.birthDate) {
        const calc = calculateAge(data.birthDate);
        if (calc !== null) ageToSave = calc;
      }

      const payload = {
        id: user.id,
        name: data.name,
        email: data.email,
        number: data.number,
        password: passwordToSave,
        age: ageToSave,
        birthDate: data.birthDate,
        profileImage: previewImage,
        function: user.isAdmin ? 1 : 0,
        status: user.status || 0,
      };

      await api.post("/api/v1/users/updateUser", payload);

      const updatedUserData = {
        ...user,
        ...data,
        age: ageToSave,
        profileImage: previewImage,
        birthDate: data.birthDate,
      };
      delete updatedUserData.newPassword;
      // @ts-ignore
      delete updatedUserData.confirmNewPassword;
      // @ts-ignore
      delete updatedUserData.currentPassword;

      updateUser(updatedUserData);

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });

      form.setValue("currentPassword", "");
      form.setValue("newPassword", "");
      form.setValue("confirmNewPassword", "");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description:
          error.response?.data?.message ||
          "Verifique seus dados e tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-heading font-bold mb-8">Meu Perfil</h1>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div
                  className="relative group cursor-pointer"
                  onClick={triggerFileInput}
                >
                  <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                    <AvatarImage src={previewImage} className="object-cover" />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white h-8 w-8" />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>

                <div className="text-center sm:text-left">
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDesc>{user.email}</CardDesc>
                  <p className="text-xs text-muted-foreground mt-1">
                    {realTimeAge !== null
                      ? `${realTimeAge} anos`
                      : user.age
                      ? `${user.age} anos`
                      : ""}
                  </p>
                </div>
                {user.isAdmin && (
                  <div className="sm:ml-auto">
                    <span className="inline-flex items-center rounded-full border border-primary px-2.5 py-0.5 text-xs font-semibold text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                      <Shield className="mr-1 h-3 w-3" /> Admin
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                className="pl-9"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    formatPhoneNumber(e.target.value)
                                  )
                                }
                                maxLength={15}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Nascimento</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input type="date" className="pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="pt-4 border-t space-y-4">
                    <h3 className="font-semibold text-sm text-muted-foreground">
                      Alterar Senha (Opcional)
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nova Senha</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="password"
                                  placeholder="Deixe vazio para manter"
                                  className="pl-9"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmNewPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar Nova Senha</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="password"
                                  placeholder="Repita a nova senha"
                                  className="pl-9"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t bg-muted/30 p-4 rounded-md">
                    <FormField
                      control={form.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-primary">
                            Senha Atual (Obrigatório)
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-primary" />
                              <Input
                                type="password"
                                placeholder="Digite sua senha atual para confirmar"
                                className="pl-9 border-primary/20 focus-visible:ring-primary"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Para sua segurança, digite sua senha atual para
                            salvar qualquer alteração.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation("/")}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
