"use client";

import { useState } from "react";
import { Bell, Filter, CheckCheck, Plus, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const NotificationsPage = () => {
  const [filters, setFilters] = useState<NotificationFilters>({
    page: 1,
    limit: 20,
  });
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    []
  );
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter notifications based on search term
  const filteredNotifications = notifications.filter(
    (notification: Notification) => {
      const matchesSearch =
        !searchTerm ||
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.type.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    }
  );

  const getTypeLabel = (type: NotificationType) => {
    switch (type) {
      case NotificationType.INFO:
        return "Info";
      case NotificationType.SUCCESS:
        return "Éxito";
      case NotificationType.WARNING:
        return "Advertencia";
      case NotificationType.ERROR:
        return "Error";
      default:
        return type;
    }
  };

  const getTypeBadgeColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.INFO:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case NotificationType.SUCCESS:
        return "bg-green-100 text-green-800 border-green-200";
      case NotificationType.WARNING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case NotificationType.ERROR:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusBadgeColor = (read: boolean) => {
    return read
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
          <p className="text-gray-600 mt-2">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">No leídas</CardTitle>
              <Bell className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats?.unread || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leídas</CardTitle>
              <CheckCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {(stats?.total || 0) - (stats?.unread || 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Advertencias
              </CardTitle>
              <Filter className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats?.byType?.[NotificationType.WARNING] || 0}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Table Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Notificaciones</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredNotifications.length} notificación(es) encontrada(s)
              </p>
            </div>
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
        <CardContent className="space-y-4">
          {/* Search and Filter Row */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por título, mensaje o tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
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
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="false">No leídas</SelectItem>
                <SelectItem value="true">Leídas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando notificaciones...</p>
              </div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay notificaciones
              </h3>
              <p className="text-gray-500">
                No se encontraron notificaciones con los filtros seleccionados.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={
                        selectedNotifications.length ===
                          unreadNotifications.length &&
                        unreadNotifications.length > 0
                      }
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                  </TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Mensaje</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification: Notification) => (
                  <TableRow key={notification.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(
                          notification.id
                        )}
                        onChange={(e) =>
                          handleSelectNotification(
                            notification.id,
                            e.target.checked
                          )
                        }
                        className="h-4 w-4 text-blue-600 rounded border-gray-300"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {notification.title}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={notification.message}>
                        {notification.message}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getTypeBadgeColor(notification.type)}
                        variant="outline"
                      >
                        {getTypeLabel(notification.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusBadgeColor(notification.read)}
                        variant="outline"
                      >
                        {notification.read ? "Leída" : "No leída"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {format(new Date(notification.createdAt), "dd/MM/yyyy", {
                        locale: es,
                      })}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
