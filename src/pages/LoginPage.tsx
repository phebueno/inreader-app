import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, FileText, Lock, Mail, User } from "lucide-react";
import { RegisterForm } from "@/components/RegisterForm";
import { LoginForm } from "@/components/LoginForm";

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      login({
        email: loginForm.email,
        name: loginForm.email.split("@")[0],
      });
      //TODO: IMPLEMENTAR CHAMADA REAL DE LOGIN
      setIsLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerForm.password !== registerForm.confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      login({
        email: registerForm.email,
        name: registerForm.name,
      });
      setIsLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl">InReader</h1>
          </div>
          <p className="text-muted-foreground">
            Plataforma de transcrição e análise inteligente
          </p>
        </div>
        <Card className="p-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Registrar</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-4">
              <LoginForm />
              <div className="text-center">
                <Button variant="link" className="text-sm">
                  Esqueceu a senha?
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="register" className="space-y-4">
              <RegisterForm />
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Ao criar uma conta, você concorda com nossos{" "}
                  <Button variant="link" className="text-xs p-0 h-auto">
                    Termos de Uso
                  </Button>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
