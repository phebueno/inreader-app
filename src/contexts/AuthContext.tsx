import {
  authService,
  type LoginCredentials,
  type RegisterData,
  type User,
} from "@/services/auth";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  login: (userData: LoginCredentials) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        const token = authService.getToken();

        if (currentUser && token) {
          const validatedUser = await authService.validateToken();
          setUser({
            id: validatedUser.sub,
            email: validatedUser.email,
            name: validatedUser.name,
          });
        }
      } catch (error) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
        console.error("Erro ao validar token:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const { user } = await authService.login(credentials);
      setUser(user);
      toast.success(`Bem-vindo(a), ${user?.name}!`);
      return true;
    } catch (error: any) {
      console.error("Erro no login:", error);
      toast.error(
        error.normalizedMessage ||
          error.response.data.message ||
          error.message ||
          "Erro interno de servidor!"
      );
      setUser(null);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      await authService.register(userData);
      toast.success(`Conta criada com sucesso, realize login para continuar!`);
      return true;
    } catch (error: any) {
      console.error("Erro no registro:", error);
      toast.error(
        error.normalizedMessage ||
          error.response.data.message ||
          error.message ||
          "Erro interno de servidor!"
      );

      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
  };

  const isAuthenticated = user !== null;

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
