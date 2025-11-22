import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginInput, RegisterInput, LoginResponse } from '@shared/schema';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (data: LoginInput) => {
    try {
      const response = await api.post<LoginResponse>('/api/v1/auth/login', data);
      const { token, user: userData } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${userData.name}`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: error.response?.data?.message || "Credenciais inválidas",
      });
      throw error;
    }
  };

  const register = async (data: RegisterInput) => {
    try {
      await api.post('/api/v1/users/createUser', data);
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Faça login para continuar",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: error.response?.data?.message || "Não foi possível criar a conta",
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
