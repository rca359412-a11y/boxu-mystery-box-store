import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import backend from "~backend/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function CustomerLoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: ""
  });

  const loginMutation = useMutation({
    mutationFn: (data: { email: string; password: string }) => 
      backend.auth.customerLogin(data),
    onSuccess: (data) => {
      localStorage.setItem("customerToken", data.token);
      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${data.user.name} !`,
      });
      navigate("/");
    },
    onError: (error) => {
      console.error("Login error:", error);
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect.",
        variant: "destructive",
      });
    }
  });

  const registerMutation = useMutation({
    mutationFn: (data: { name: string; email: string; password: string }) => 
      backend.auth.customerRegister(data),
    onSuccess: (data) => {
      localStorage.setItem("customerToken", data.token);
      toast({
        title: "Compte créé avec succès",
        description: `Bienvenue ${data.user.name} !`,
      });
      navigate("/");
    },
    onError: (error: any) => {
      console.error("Register error:", error);
      const message = error.message?.includes("already registered") 
        ? "Cet email est déjà utilisé." 
        : "Erreur lors de la création du compte.";
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      loginMutation.mutate({
        email: credentials.email,
        password: credentials.password
      });
    } else {
      if (!credentials.name.trim()) {
        toast({
          title: "Champ requis",
          description: "Veuillez entrer votre nom.",
          variant: "destructive",
        });
        return;
      }
      registerMutation.mutate(credentials);
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="text-white hover:bg-white/10 mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <Card className="border-2 border-white/20 bg-white/5 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="text-white text-3xl font-bold mb-4">Boxu</div>
            <CardTitle className="text-white text-xl">
              {isLogin ? "Connexion Client" : "Créer un Compte"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Nom complet</Label>
                  <Input
                    id="name"
                    value={credentials.name}
                    onChange={(e) => setCredentials(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Votre nom complet"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-white text-black hover:bg-gray-100"
                disabled={isLoading}
              >
                {isLoading 
                  ? (isLogin ? "Connexion..." : "Création...") 
                  : (isLogin ? "Se connecter" : "Créer un compte")
                }
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setCredentials({ name: "", email: "", password: "" });
                }}
                className="text-white/80 hover:text-white text-sm underline"
              >
                {isLogin 
                  ? "Pas de compte ? Créer un compte" 
                  : "Déjà un compte ? Se connecter"
                }
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Admin Info */}
        <div className="mt-8 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/20">
          <h3 className="text-white font-semibold mb-2">Informations Admin :</h3>
          <div className="text-gray-300 text-sm space-y-1">
            <p><span className="font-medium">Utilisateur:</span> admin</p>
            <p><span className="font-medium">Mot de passe:</span> admin123</p>
            <p className="text-xs text-gray-400 mt-2">
              Utilisez ces identifiants pour accéder à l'interface d'administration à /admin/login
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
