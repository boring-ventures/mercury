"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Bell, Settings, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationItem } from "./notification-item";
import {
  useNotifications,
  useMarkNotificationsRead,
  useUnreadNotificationCount,
} from "@/hooks/use-notifications";
import { NotificationFilters, Notification } from "@/types/notifications";

interface NotificationMetadata {
  path?: string;
  requestId?: string;
  petitionId?: string;
  solicitudId?: string;
  userId?: string;
  context?: "admin" | "importador";
  userRole?: "SUPERADMIN" | "IMPORTADOR";
  [key: string]: unknown;
}

interface NotificationDropdownProps {
  className?: string;
}

export const NotificationDropdown = ({
  className,
}: NotificationDropdownProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  // Show all notifications (read and unread) with limit of 3
  const [filters] = useState<NotificationFilters>({ limit: 3 });

  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const { data: notificationsData, isLoading } = useNotifications(filters);
  const { markAsRead, isLoading: isMarkingRead } = useMarkNotificationsRead();

  const notifications = useMemo(() => {
    return notificationsData?.notifications || [];
  }, [notificationsData?.notifications]);

  const totalNotifications = notificationsData?.pagination?.total || 0;
  const hasMoreNotifications = totalNotifications > 3;
  const hasUnread = unreadCount > 0;

  // Auto-mark displayed notifications as read when dropdown opens
  useEffect(() => {
    if (isOpen && notifications.length > 0 && !isLoading) {
      // Get unread notifications from the currently displayed ones
      const unreadDisplayedNotifications = notifications.filter(
        (notification: Notification) => !notification.read
      );

      if (unreadDisplayedNotifications.length > 0) {
        // Mark the displayed unread notifications as read
        const notificationIds = unreadDisplayedNotifications.map(
          (notification: Notification) => notification.id
        );
        markAsRead({ notificationIds });
      }
    }
  }, [isOpen, notifications, isLoading, markAsRead]);

  const handleMarkAllAsRead = () => {
    markAsRead({ markAll: true });
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead({ notificationIds: [notificationId] });
  };

  const handleNotificationClick = (notification: Notification) => {
    // Close dropdown
    setIsOpen(false);

    // Navigate based on notification metadata or type
    const metadata = notification.metadata as NotificationMetadata;

    if (metadata?.path) {
      // If notification has a specific path in metadata
      router.push(metadata.path);
    } else if (metadata?.requestId) {
      // For request-related notifications - these are actually solicitudes
      // Route to admin solicitudes by default, or based on user context
      if (
        metadata?.context === "importador" ||
        metadata?.userRole === "IMPORTADOR"
      ) {
        router.push(`/importador/solicitudes/${metadata.requestId}`);
      } else {
        router.push(`/admin/solicitudes/${metadata.requestId}`);
      }
    } else if (metadata?.petitionId) {
      // For petition-related notifications
      router.push(`/petitions/${metadata.petitionId}`);
    } else if (metadata?.solicitudId) {
      // For solicitud-related notifications - route based on context or role
      if (
        metadata?.context === "admin" ||
        metadata?.userRole === "SUPERADMIN"
      ) {
        router.push(`/admin/solicitudes/${metadata.solicitudId}`);
      } else if (
        metadata?.context === "importador" ||
        metadata?.userRole === "IMPORTADOR"
      ) {
        router.push(`/importador/solicitudes/${metadata.solicitudId}`);
      } else {
        // Default to admin if no context specified
        router.push(`/admin/solicitudes/${metadata.solicitudId}`);
      }
    } else if (metadata?.userId) {
      // For user-related notifications (admin)
      router.push(`/admin/users/${metadata.userId}`);
    } else {
      // Default fallback - go to notifications page
      router.push("/dashboard/notifications");
    }
  };

  const handleSettingsClick = () => {
    setIsOpen(false);
    router.push("/dashboard/notifications");
  };

  const handleViewAllClick = () => {
    setIsOpen(false);
    router.push("/dashboard/notifications");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`relative p-2 h-9 w-9 ${className}`}
          aria-label="Notificaciones"
        >
          <Bell className="h-4 w-4" />
          {hasUnread && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end" sideOffset={5}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-sm">Notificaciones</h3>
          <div className="flex items-center gap-2">
            {hasUnread && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={isMarkingRead}
                className="text-xs h-7 px-2"
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Marcar todas como leídas
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={handleSettingsClick}
              title="Configurar notificaciones"
            >
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Content with proper height constraints */}
        <div className="max-h-[60vh] min-h-[200px]">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Bell className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">No tienes notificaciones</p>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="p-2 space-y-2">
                {notifications.map(
                  (notification: Notification, index: number) => (
                    <div key={notification.id}>
                      <div
                        className="cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <NotificationItem
                          notification={notification}
                          showActions={false}
                          onMarkAsRead={handleMarkAsRead}
                        />
                      </div>
                      {index < notifications.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  )
                )}

                {/* Show prompt if there are more notifications */}
                {hasMoreNotifications && (
                  <>
                    <Separator className="my-2" />
                    <div className="p-2 text-center">
                      <p className="text-xs text-gray-500 mb-2">
                        Tienes {totalNotifications - 3} notificaciones más
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                        onClick={handleViewAllClick}
                      >
                        Ver todas las notificaciones
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Footer - only show if there are notifications but no "more" prompt was shown */}
        {notifications.length > 0 && !hasMoreNotifications && (
          <>
            <Separator />
            <div className="p-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-sm"
                onClick={handleViewAllClick}
              >
                Ver todas las notificaciones
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};
