import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Clock, CheckCircle, AlertTriangle } from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "order",
    title: "Nouvelle commande",
    message: "Commande #1234 reçue de Ahmed Ben Ali",
    time: "Il y a 5 minutes",
    priority: "high",
    icon: Bell
  },
  {
    id: 2,
    type: "reminder",
    title: "Rappel de livraison",
    message: "5 commandes en attente de traitement",
    time: "Il y a 1 heure",
    priority: "medium",
    icon: Clock
  },
  {
    id: 3,
    type: "success",
    title: "Livraison confirmée",
    message: "Commande #1230 livrée avec succès",
    time: "Il y a 2 heures",
    priority: "low",
    icon: CheckCircle
  },
  {
    id: 4,
    type: "warning",
    title: "Stock faible",
    message: "Vérifiez votre inventaire Mystery Box",
    time: "Il y a 3 heures",
    priority: "medium",
    icon: AlertTriangle
  }
];

const tasks = [
  {
    id: 1,
    title: "Traiter les nouvelles commandes",
    description: "3 commandes en attente de traitement",
    completed: false,
    priority: "high"
  },
  {
    id: 2,
    title: "Contacter les clients pour livraison",
    description: "2 clients à contacter pour confirmer l'adresse",
    completed: false,
    priority: "medium"
  },
  {
    id: 3,
    title: "Mettre à jour les prix de livraison",
    description: "Révision des prix pour les nouvelles zones",
    completed: true,
    priority: "low"
  },
  {
    id: 4,
    title: "Configurer Facebook Pixel",
    description: "Ajouter le suivi des conversions",
    completed: false,
    priority: "medium"
  }
];

export default function ClionDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Clion</h1>
        <p className="text-gray-600">Centre de notifications et de tâches</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <div 
                    key={notification.id} 
                    className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className={`p-2 rounded-full ${
                      notification.priority === "high" ? "bg-red-100 text-red-600" :
                      notification.priority === "medium" ? "bg-yellow-100 text-yellow-600" :
                      "bg-green-100 text-green-600"
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{notification.title}</div>
                      <div className="text-sm text-gray-600">{notification.message}</div>
                      <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Tâches à faire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`flex items-start gap-3 p-3 border rounded-lg ${
                    task.completed ? "bg-green-50 border-green-200" : "hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-4 h-4 rounded border-2 mt-1 ${
                    task.completed 
                      ? "bg-green-500 border-green-500" 
                      : "border-gray-300"
                  }`}>
                    {task.completed && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm ${
                      task.completed ? "line-through text-gray-500" : ""
                    }`}>
                      {task.title}
                    </div>
                    <div className="text-sm text-gray-600">{task.description}</div>
                    <div className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${
                      task.priority === "high" ? "bg-red-100 text-red-600" :
                      task.priority === "medium" ? "bg-yellow-100 text-yellow-600" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {task.priority === "high" ? "Priorité haute" :
                       task.priority === "medium" ? "Priorité moyenne" :
                       "Priorité basse"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">3</div>
                <div className="text-sm text-gray-600">Notifications urgentes</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">4</div>
                <div className="text-sm text-gray-600">Tâches en attente</div>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-sm text-gray-600">Tâches complétées</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
