import { useQuery } from "@tanstack/react-query";
import backend from "~backend/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductsManagement() {
  const { data: productData } = useQuery({
    queryKey: ["mystery-box"],
    queryFn: () => backend.products.getMysteryBox()
  });

  const product = productData?.product;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Produits</h1>
        <p className="text-gray-600">Gérez vos produits</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mystery Box</CardTitle>
        </CardHeader>
        <CardContent>
          {product && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Nom du produit</h3>
                  <p>{product.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Prix</h3>
                  <p>{(product.price / 1000).toFixed(3)} TND</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold">Description</h3>
                <p>{product.description}</p>
              </div>
              
              <div>
                <h3 className="font-semibold">Statut</h3>
                <span className={`px-2 py-1 rounded text-sm ${
                  product.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {product.active ? "Actif" : "Inactif"}
                </span>
              </div>
              
              {product.image_url && (
                <div>
                  <h3 className="font-semibold">Image</h3>
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
