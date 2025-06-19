"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Notification, NotificationType } from "@/types/notifications";
import {
  useUpdateNotification,
  useDeleteNotification,
} from "@/hooks/use-notifications";

interface NotificationItemProps {
  notification: Notification;
  showActions?: boolean;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const typeConfig = {
  [NotificationType.INFO]: {
    icon: Info,
    color: "bg-blue-500",
    badgeVariant: "default" as const,
  },
  [NotificationType.SUCCESS]: {
    icon: CheckCircle,
    color: "bg-green-500",
    badgeVariant: "default" as const,
  },
  [NotificationType.WARNING]: {
    icon: AlertTriangle,
    color: "bg-yellow-500",
    badgeVariant: "secondary" as const,
  },
  [NotificationType.ERROR]: {
    icon: XCircle,
    color: "bg-red-500",
    badgeVariant: "destructive" as const,
  },
};

export const NotificationItem = ({
  notification,
  showActions = true,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { updateNotification, isLoading: isUpdating } = useUpdateNotification();
  const { deleteNotification, isLoading: isDeleting } = useDeleteNotification();

  const config = typeConfig[notification.type];
  const Icon = config.icon;

  const handleMarkAsRead = () => {
    if (notification.read) return;

    if (onMarkAsRead) {
      onMarkAsRead(notification.id);
    } else {
      updateNotification({
        notificationId: notification.id,
        data: { read: true },
      });
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(notification.id);
    } else {
      deleteNotification(notification.id);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: es,
  });

  return (
    <Card
      className={cn(
        "relative transition-all duration-200 hover:shadow-md",
        !notification.read && "bg-blue-50 border-blue-200",
        notification.read && "bg-gray-50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={cn("p-2 rounded-full text-white", config.color)}>
            <Icon className="h-4 w-4" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4
                  className={cn(
                    "text-sm font-medium text-gray-900 mb-1",
                    !notification.read && "font-semibold"
                  )}
                >
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {notification.message}
                </p>
              </div>

              {/* Unread indicator */}
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0" />
              )}
            </div>

            {/* Metadata and timestamp */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <Badge variant={config.badgeVariant} className="text-xs">
                  {notification.type}
                </Badge>
                <span className="text-xs text-gray-500">{timeAgo}</span>
              </div>

              {/* Actions */}
              {showActions && isHovered && (
                <div className="flex items-center gap-1">
                  {!notification.read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleMarkAsRead}
                      disabled={isUpdating}
                      className="h-8 w-8 p-0"
                      title="Marcar como leído"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    title="Eliminar notificación"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading overlay */}
        {(isUpdating || isDeleting) && (
          <div className="absolute inset-0 bg-white bg-opacity-50 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
