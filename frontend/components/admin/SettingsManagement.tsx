import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import backend from "~backend/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function SettingsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState({
    shippingPrice: 0,
    productPrice: 0,
  });

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => backend.settings.getSettings(),
    onSuccess: (data) => {
      setSettings({
        shippingPrice: data.settings.shippingPrice / 1000, // Convert to TND
        productPrice: data.settings.productPrice / 1000, // Convert to TND
      });
    }
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data: any) => backend.settings.updateSettings(data),
    onSuccess: () => {
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres ont été mis à jour avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error) => {
      console.error("Update settings error:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateSettingsMutation.mutate({
      shippingPrice: settings.shippingPrice * 1000, // Convert to millimes
      productPrice: settings.productPrice * 1000, // Convert to millimes
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600">Configurez votre boutique</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres de Prix</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="productPrice">Prix du Produit (TND)</Label>
                <Input
                  id="productPrice"
                  type="number"
                  step="0.001"
                  value={settings.productPrice}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    productPrice: parseFloat(e.target.value) || 0 
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shippingPrice">Prix de Livraison (TND)</Label>
                <Input
                  id="shippingPrice"
                  type="number"
                  step="0.001"
                  value={settings.shippingPrice}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    shippingPrice: parseFloat(e.target.value) || 0 
                  }))}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={updateSettingsMutation.isPending}
              className="bg-black text-white hover:bg-gray-800"
            >
              {updateSettingsMutation.isPending ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Méthodes de Livraison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Livraison Standard</h3>
              <p className="text-sm text-gray-600">3-5 jours ouvrables</p>
              <p className="text-sm font-medium">{settings.shippingPrice.toFixed(3)} TND</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
