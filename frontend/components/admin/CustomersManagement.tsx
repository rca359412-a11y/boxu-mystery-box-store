import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomersManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Clients</h1>
        <p className="text-gray-600">Gérez vos clients</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Fonctionnalité en développement
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
