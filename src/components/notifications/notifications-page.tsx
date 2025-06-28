"use client";

import { useState } from "react";
import { Bell, Filter, CheckCheck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { NotificationItem } from "./notification-item";
import { CreateNotificationDialog } from "./create-notification-dialog";
import {
  useNotifications,
  useMarkNotificationsRead,
  useNotificationStats,
} from "@/hooks/use-notifications";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  NotificationFilters,
  NotificationType,
  Notification,
} from "@/types/notifications";

export const NotificationsPage = () => {
  const [filters, setFilters] = useState<NotificationFilters>({
    page: 1,
    limit: 20,
  });
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    []
  );
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { profile } = useCurrentUser();
  const { data: notificationsData, isLoading } = useNotifications(filters);
  const { data: stats } = useNotificationStats();
  const { markAsRead, isLoading: isMarkingRead } = useMarkNotificationsRead();

  const notifications = notificationsData?.notifications || [];
  const pagination = notificationsData?.pagination;
  const isAdmin = profile?.role === "SUPERADMIN";

  const handleFilterChange = (
    key: keyof NotificationFilters,
    value: string | boolean | number | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when changing filters
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleMarkAllAsRead = () => {
    markAsRead({ markAll: true });
  };

  const handleMarkSelectedAsRead = () => {
    if (selectedNotifications.length > 0) {
      markAsRead({ notificationIds: selectedNotifications });
      setSelectedNotifications([]);
    }
  };

  const handleSelectNotification = (
    notificationId: string,
    selected: boolean
  ) => {
    if (selected) {
      setSelectedNotifications((prev) => [...prev, notificationId]);
    } else {
      setSelectedNotifications((prev) =>
        prev.filter((id) => id !== notificationId)
      );
    }
  };

  const handleSelectAll = () => {
    const unreadNotifications = notifications
      .filter((n: Notification) => !n.read)
      .map((n: Notification) => n.id);
    setSelectedNotifications(unreadNotifications);
  };

  const unreadNotifications = notifications.filter(
    (n: Notification) => !n.read
  );
  const hasUnread = unreadNotifications.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
          <p className="text-gray-600">
            Administra y revisa todas tus notificaciones
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Notificación
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{stats?.total || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Bell className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">No leídas</p>
                  <p className="text-2xl font-bold">{stats?.unread || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Leídas</p>
                  <p className="text-2xl font-bold">
                    {(stats?.total || 0) - (stats?.unread || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Filter className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Advertencias</p>
                  <p className="text-2xl font-bold">
                    {stats?.byType?.[NotificationType.WARNING] || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filtros</CardTitle>
            <div className="flex items-center gap-2">
              {selectedNotifications.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleMarkSelectedAsRead}
                  disabled={isMarkingRead}
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Marcar seleccionadas ({selectedNotifications.length})
                </Button>
              )}
              {hasUnread && (
                <Button size="sm" onClick={handleSelectAll}>
                  Seleccionar no leídas
                </Button>
              )}
              {hasUnread && (
                <Button
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={isMarkingRead}
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Marcar todas como leídas
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select
              value={filters.read?.toString() || "all"}
              onValueChange={(value) =>
                handleFilterChange(
                  "read",
                  value === "all" ? undefined : value === "true"
                )
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="false">No leídas</SelectItem>
                <SelectItem value="true">Leídas</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.type || "all"}
              onValueChange={(value) =>
                handleFilterChange("type", value === "all" ? undefined : value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value={NotificationType.INFO}>Info</SelectItem>
                <SelectItem value={NotificationType.SUCCESS}>Éxito</SelectItem>
                <SelectItem value={NotificationType.WARNING}>
                  Advertencia
                </SelectItem>
                <SelectItem value={NotificationType.ERROR}>Error</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.limit?.toString() || "20"}
              onValueChange={(value) =>
                handleFilterChange("limit", parseInt(value))
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Por página" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones
            {pagination && (
              <Badge variant="outline">
                {pagination.page} de {pagination.pages} páginas
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Bell className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay notificaciones
              </h3>
              <p className="text-gray-500">
                No se encontraron notificaciones con los filtros seleccionados.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification: Notification) => (
                <div key={notification.id} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={(e) =>
                      handleSelectNotification(
                        notification.id,
                        e.target.checked
                      )
                    }
                    className="mt-4 h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <NotificationItem
                      notification={notification}
                      showActions={true}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Anterior
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={pagination.page === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
          >
            Siguiente
          </Button>
        </div>
      )}

      {/* Create Notification Dialog */}
      {showCreateDialog && (
        <CreateNotificationDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      )}
    </div>
  );
};
