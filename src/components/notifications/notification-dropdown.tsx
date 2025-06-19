"use client";

import { useState } from "react";
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

interface NotificationDropdownProps {
  className?: string;
}

export const NotificationDropdown = ({
  className,
}: NotificationDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters] = useState<NotificationFilters>({ limit: 10 });

  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const { data: notificationsData, isLoading } = useNotifications(filters);
  const { markAsRead, isLoading: isMarkingRead } = useMarkNotificationsRead();

  const notifications = notificationsData?.notifications || [];
  const hasUnread = unreadCount > 0;

  const handleMarkAllAsRead = () => {
    markAsRead({ markAll: true });
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead({ notificationIds: [notificationId] });
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
                Marcar todas
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => {
                setIsOpen(false);
                // Navigate to notifications page
                window.location.href = "/dashboard/notifications";
              }}
            >
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-96">
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
                      <NotificationItem
                        notification={notification}
                        showActions={false}
                        onMarkAsRead={handleMarkAsRead}
                      />
                      {index < notifications.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  )
                )}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-sm"
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = "/dashboard/notifications";
                }}
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
