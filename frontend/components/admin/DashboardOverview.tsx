import { useQuery } from "@tanstack/react-query";
import { Package, Users, TrendingUp, DollarSign } from "lucide-react";
import backend from "~backend/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardOverview() {
  const { data: ordersData } = useQuery({
    queryKey: ["orders"],
    queryFn: () => backend.orders.list({})
  });

  const { data: settingsData } = useQuery({
    queryKey: ["settings"],
    queryFn: () => backend.settings.getSettings()
  });

  const orders = ordersData?.orders || [];
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const pendingOrders = orders.filter(order => order.status === "processing").length;
  const deliveredOrders = orders.filter(order => order.status === "delivered").length;

  const stats = [
    {
      title: "Total des Commandes",
      value: orders.length.toString(),
      icon: Package,
      description: "Toutes les commandes"
    },
    {
      title: "Commandes en Attente",
      value: pendingOrders.toString(),
      icon: TrendingUp,
      description: "À traiter"
    },
    {
      title: "Commandes Livrées",
      value: deliveredOrders.toString(),
      icon: Users,
      description: "Complétées"
    },
    {
      title: "Chiffre d'Affaires",
      value: `${(totalRevenue / 1000).toFixed(3)} TND`,
      icon: DollarSign,
      description: "Total des ventes"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Vue d'ensemble de votre boutique</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-600">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Commandes Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{order.customerName}</div>
                  <div className="text-sm text-gray-600">{order.governorate}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{(order.totalPrice / 1000).toFixed(3)} TND</div>
                  <div className={`text-sm px-2 py-1 rounded-full ${
                    order.status === "processing" ? "bg-yellow-100 text-yellow-800" :
                    order.status === "delivered" ? "bg-green-100 text-green-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {order.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
