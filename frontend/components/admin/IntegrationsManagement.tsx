import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import backend from "~backend/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function IntegrationsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [integrations, setIntegrations] = useState({
    facebookPixelId: "",
    googleAnalyticsId: "",
    googleAdsId: "",
  });

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => backend.settings.getSettings(),
    onSuccess: (data) => {
      setIntegrations({
        facebookPixelId: data.settings.facebookPixelId || "",
        googleAnalyticsId: data.settings.googleAnalyticsId || "",
        googleAdsId: data.settings.googleAdsId || "",
      });
    }
  });

  const updateIntegrationsMutation = useMutation({
    mutationFn: (data: any) => backend.settings.updateSettings(data),
    onSuccess: () => {
      toast({
        title: "Intégrations mises à jour",
        description: "Les intégrations ont été mises à jour avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error) => {
      console.error("Update integrations error:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les intégrations.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateIntegrationsMutation.mutate(integrations);
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Intégrations</h1>
        <p className="text-gray-600">Configurez vos intégrations tierces</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics & Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
                <Input
                  id="facebookPixelId"
                  placeholder="123456789012345"
                  value={integrations.facebookPixelId}
                  onChange={(e) => setIntegrations(prev => ({ 
                    ...prev, 
                    facebookPixelId: e.target.value 
                  }))}
                />
                <p className="text-sm text-gray-600">
                  Utilisé pour le suivi des conversions Facebook
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                <Input
                  id="googleAnalyticsId"
                  placeholder="G-XXXXXXXXXX"
                  value={integrations.googleAnalyticsId}
                  onChange={(e) => setIntegrations(prev => ({ 
                    ...prev, 
                    googleAnalyticsId: e.target.value 
                  }))}
                />
                <p className="text-sm text-gray-600">
                  Votre ID de mesure Google Analytics 4
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="googleAdsId">Google Ads ID</Label>
                <Input
                  id="googleAdsId"
                  placeholder="AW-123456789"
                  value={integrations.googleAdsId}
                  onChange={(e) => setIntegrations(prev => ({ 
                    ...prev, 
                    googleAdsId: e.target.value 
                  }))}
                />
                <p className="text-sm text-gray-600">
                  Votre ID de conversion Google Ads
                </p>
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={updateIntegrationsMutation.isPending}
              className="bg-black text-white hover:bg-gray-800"
            >
              {updateIntegrationsMutation.isPending ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Autres Intégrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Google Sheets</h3>
              <p className="text-sm text-gray-600">Synchronisation automatique des commandes</p>
              <div className="mt-2">
                <Button variant="outline" size="sm">
                  Configurer
                </Button>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">API de Livraison</h3>
              <p className="text-sm text-gray-600">Intégration avec les transporteurs tunisiens</p>
              <div className="mt-2">
                <Button variant="outline" size="sm">
                  Configurer
                </Button>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">SEO</h3>
              <p className="text-sm text-gray-600">Optimisation pour les moteurs de recherche</p>
              <div className="mt-2">
                <Button variant="outline" size="sm">
                  Configurer
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
