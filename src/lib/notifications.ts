import prisma from "@/lib/prisma";
import {
  NotificationType,
  SystemNotificationTemplates,
  CreateNotificationData,
} from "@/types/notifications";

// Notification templates for different system events
export const NOTIFICATION_TEMPLATES: SystemNotificationTemplates = {
  REQUEST_CREATED: {
    title: "Nueva Solicitud Creada",
    message: "Se ha creado una nueva solicitud que requiere revisión",
    type: NotificationType.INFO,
  },
  REQUEST_APPROVED: {
    title: "Solicitud Aprobada",
    message: "Su solicitud ha sido aprobada y está en proceso",
    type: NotificationType.SUCCESS,
  },
  REQUEST_REJECTED: {
    title: "Solicitud Rechazada",
    message:
      "Su solicitud ha sido rechazada. Revise los comentarios para más detalles",
    type: NotificationType.WARNING,
  },
  QUOTATION_RECEIVED: {
    title: "Nueva Cotización Recibida",
    message: "Ha recibido una nueva cotización para su solicitud",
    type: NotificationType.INFO,
  },
  CONTRACT_SIGNED: {
    title: "Contrato Firmado",
    message: "El contrato ha sido firmado exitosamente",
    type: NotificationType.SUCCESS,
  },
  PAYMENT_RECEIVED: {
    title: "Pago Recibido",
    message: "Se ha registrado un nuevo pago",
    type: NotificationType.SUCCESS,
  },
  DOCUMENT_APPROVED: {
    title: "Documento Aprobado",
    message: "Su documento ha sido aprobado",
    type: NotificationType.SUCCESS,
  },
  DOCUMENT_REJECTED: {
    title: "Documento Rechazado",
    message: "Su documento ha sido rechazado. Revise los comentarios",
    type: NotificationType.WARNING,
  },
  REGISTRATION_APPROVED: {
    title: "Registro Aprobado",
    message: "Su solicitud de registro ha sido aprobada",
    type: NotificationType.SUCCESS,
  },
  REGISTRATION_REJECTED: {
    title: "Registro Rechazado",
    message: "Su solicitud de registro ha sido rechazada",
    type: NotificationType.ERROR,
  },
};

// Create a single notification
export async function createNotification(
  data: CreateNotificationData & { profileId: string }
) {
  try {
    const notification = await prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        type: data.type || NotificationType.INFO,
        metadata: data.metadata
          ? JSON.parse(JSON.stringify(data.metadata))
          : null,
        profileId: data.profileId,
      },
      include: {
        profile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw new Error("Failed to create notification");
  }
}

// Create bulk notifications for multiple users
export async function createBulkNotifications(
  data: CreateNotificationData & { profileIds: string[] }
) {
  try {
    const notifications = await prisma.notification.createMany({
      data: data.profileIds.map((profileId) => ({
        title: data.title,
        message: data.message,
        type: data.type || NotificationType.INFO,
        metadata: data.metadata
          ? JSON.parse(JSON.stringify(data.metadata))
          : null,
        profileId,
      })),
    });

    return notifications;
  } catch (error) {
    console.error("Error creating bulk notifications:", error);
    throw new Error("Failed to create bulk notifications");
  }
}

// Create notification from template
export async function createSystemNotification(
  templateKey: keyof SystemNotificationTemplates,
  profileId: string,
  metadata?: Record<string, unknown>
) {
  const template = NOTIFICATION_TEMPLATES[templateKey];

  return createNotification({
    ...template,
    profileId,
    metadata,
  });
}

// Create notification for all admins
export async function notifyAllAdmins(
  templateKey: keyof SystemNotificationTemplates,
  metadata?: Record<string, unknown>
) {
  try {
    // Get all admin profiles
    const adminProfiles = await prisma.profile.findMany({
      where: {
        role: "SUPERADMIN",
        status: "ACTIVE",
      },
      select: {
        id: true,
      },
    });

    if (adminProfiles.length === 0) {
      return null;
    }

    const template = NOTIFICATION_TEMPLATES[templateKey];

    return createBulkNotifications({
      ...template,
      profileIds: adminProfiles.map((profile) => profile.id),
      metadata,
    });
  } catch (error) {
    console.error("Error notifying admins:", error);
    throw new Error("Failed to notify admins");
  }
}

// Get notification statistics for a user
export async function getNotificationStats(profileId: string) {
  try {
    const stats = await prisma.notification.groupBy({
      by: ["type"],
      where: {
        profileId,
      },
      _count: {
        id: true,
      },
    });

    const unreadCount = await prisma.notification.count({
      where: {
        profileId,
        read: false,
      },
    });

    const totalCount = await prisma.notification.count({
      where: {
        profileId,
      },
    });

    const byType = stats.reduce(
      (acc, stat) => {
        acc[stat.type as NotificationType] = stat._count.id;
        return acc;
      },
      {} as Record<NotificationType, number>
    );

    return {
      total: totalCount,
      unread: unreadCount,
      byType,
    };
  } catch (error) {
    console.error("Error getting notification stats:", error);
    throw new Error("Failed to get notification stats");
  }
}

// Mark notifications as read
export async function markNotificationsAsRead(
  notificationIds: string[],
  profileId: string
) {
  try {
    return await prisma.notification.updateMany({
      where: {
        id: {
          in: notificationIds,
        },
        profileId, // Ensure user can only mark their own notifications
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    throw new Error("Failed to mark notifications as read");
  }
}

// Mark all notifications as read for a user
export async function markAllNotificationsAsRead(profileId: string) {
  try {
    return await prisma.notification.updateMany({
      where: {
        profileId,
        read: false,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw new Error("Failed to mark all notifications as read");
  }
}
