import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ShoppingCart, Truck, Gift, ChevronDown, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import backend from "~backend/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/components/ui/use-toast";

const tunisianGovernorates = [
  "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan",
  "Bizerte", "Béja", "Jendouba", "Kef", "Siliana", "Kairouan",
  "Kasserine", "Sidi Bouzid", "Sousse", "Monastir", "Mahdia",
  "Sfax", "Gafsa", "Tozeur", "Kebili", "Gabès", "Medenine", "Tataouine"
];

const faqData = [
  {
    question: "Qu'est-ce qu'une Mystery Box ?",
    answer: "Une Mystery Box est une boîte contenant des produits surprises d'une valeur supérieure au prix d'achat. Chaque boîte est unique et soigneusement préparée."
  },
  {
    question: "Combien de temps prend la livraison ?",
    answer: "La livraison prend généralement entre 3 à 5 jours ouvrables dans toute la Tunisie."
  },
  {
    question: "Puis-je retourner ma Mystery Box ?",
    answer: "Les Mystery Box ne peuvent pas être retournées en raison de leur nature surprise. Cependant, nous garantissons une valeur supérieure au prix d'achat."
  },
  {
    question: "Dans quelles régions livrez-vous ?",
    answer: "Nous livrons dans tous les gouvernorats de la Tunisie."
  }
];

export default function HomePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    phone: "",
    governorate: "",
    address: ""
  });

  const { data: productData } = useQuery({
    queryKey: ["mystery-box"],
    queryFn: () => backend.products.getMysteryBox()
  });

  const { data: settingsData } = useQuery({
    queryKey: ["settings"],
    queryFn: () => backend.settings.getSettings()
  });

  const createOrderMutation = useMutation({
    mutationFn: (orderData: any) => backend.orders.create(orderData),
    onSuccess: () => {
      toast({
        title: "Commande créée avec succès !",
        description: "Nous vous contacterons bientôt pour confirmer votre commande.",
      });
      setOrderForm({
        customerName: "",
        phone: "",
        governorate: "",
        address: ""
      });
    },
    onError: (error) => {
      console.error("Order creation error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la création de votre commande.",
        variant: "destructive",
      });
    }
  });

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderForm.customerName || !orderForm.phone || !orderForm.governorate || !orderForm.address) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    const product = productData?.product;
    const settings = settingsData?.settings;

    if (!product || !settings) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les informations du produit.",
        variant: "destructive",
      });
      return;
    }

    createOrderMutation.mutate({
      ...orderForm,
      productId: product.id,
      productPrice: settings.productPrice,
      shippingPrice: settings.shippingPrice
    });
  };

  const product = productData?.product;
  const settings = settingsData?.settings;
  const productPrice = settings?.productPrice || 99000;
  const shippingPrice = settings?.shippingPrice || 8000;
  const totalPrice = productPrice + shippingPrice;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="text-white text-2xl font-bold">
          Boxu
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={() => navigate("/login")}
        >
          <User className="h-6 w-6" />
        </Button>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <div className="text-white space-y-8">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              {product?.name || "Mystery Box - Découvrez la surprise !"}
            </h1>
            
            <div className="bg-white text-black px-6 py-4 rounded-lg inline-block">
              <span className="text-3xl lg:text-4xl font-bold">
                {(productPrice / 1000).toFixed(3)} TND
              </span>
            </div>

            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-6 rounded-full"
              onClick={() => document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Acheter Maintenant
            </Button>

            <div className="space-y-2 text-gray-300">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Livraison dans toute la Tunisie</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Valeur supérieure au prix d'achat</span>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-2xl">
              {product?.video_url ? (
                <video
                  src={product.video_url}
                  autoPlay
                  muted
                  loop
                  className="w-full rounded-xl"
                  poster={product.image_url}
                />
              ) : (
                <img
                  src={product?.image_url || "/mystery-box.jpg"}
                  alt="Mystery Box"
                  className="w-full rounded-xl"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Order Form */}
      <section id="order-form" className="px-6 py-16 bg-white">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-black shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Commandez votre Mystery Box</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitOrder} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom Complet *</Label>
                    <Input
                      id="name"
                      value={orderForm.customerName}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, customerName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      value={orderForm.phone}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="governorate">Gouvernorat *</Label>
                  <Select
                    value={orderForm.governorate}
                    onValueChange={(value) => setOrderForm(prev => ({ ...prev, governorate: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre gouvernorat" />
                    </SelectTrigger>
                    <SelectContent>
                      {tunisianGovernorates.map((gov) => (
                        <SelectItem key={gov} value={gov}>
                          {gov}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse Complète *</Label>
                  <Input
                    id="address"
                    value={orderForm.address}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Rue, ville, code postal..."
                    required
                  />
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Produit:</span>
                    <span>{(productPrice / 1000).toFixed(3)} TND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison:</span>
                    <span>{(shippingPrice / 1000).toFixed(3)} TND</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>{(totalPrice / 1000).toFixed(3)} TND</span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-black text-white hover:bg-gray-800 py-6 text-lg"
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending ? "Traitement..." : "Commander Maintenant"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Steps Section */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <ShoppingCart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">1. Commandez votre Boxu</h3>
              <p className="text-gray-600">Remplissez le formulaire et confirmez votre commande</p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">2. Attendez la livraison</h3>
              <p className="text-gray-600">Livraison en 3-5 jours dans toute la Tunisie</p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Gift className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">3. Découvrez votre surprise</h3>
              <p className="text-gray-600">Ouvrez votre boîte et profitez de vos surprises</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Questions fréquentes</h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <Collapsible key={index} className="border rounded-lg">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50">
                  <span className="font-semibold">{faq.question}</span>
                  <ChevronDown className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4 text-gray-600">
                  {faq.answer}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white px-6 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="text-2xl font-bold">Boxu</div>
          <div className="flex justify-center gap-8 text-sm">
            <a href="#" className="hover:text-gray-300">Conditions d'utilisation</a>
            <a href="#" className="hover:text-gray-300">Politique de retour</a>
            <a href="#" className="hover:text-gray-300">Contact</a>
          </div>
          <div className="text-sm text-gray-400">
            © 2024 Boxu. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
