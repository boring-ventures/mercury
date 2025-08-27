import { createSystemNotification, notifyAllAdmins } from "@/lib/notifications";
import { generateQuotationNotificationEmail } from "@/lib/email-templates";
import { resend, FROM_EMAIL } from "@/lib/resend";

// Helper to notify when a new request is created
export async function notifyRequestCreated(requestData: {
  requestId: string;
  code: string;
  companyName: string;
  amount: number;
  createdById: string;
}) {
  try {
    // Notify all admins about the new request
    await notifyAllAdmins("REQUEST_CREATED", {
      requestId: requestData.requestId,
      requestCode: requestData.code,
      companyName: requestData.companyName,
      amount: requestData.amount,
    });
  } catch (error) {
    console.error("Error sending request created notification:", error);
  }
}

// Helper to notify when a request is approved
export async function notifyRequestApproved(requestData: {
  requestId: string;
  code: string;
  createdById: string;
}) {
  try {
    // Notify the request creator
    await createSystemNotification(
      "REQUEST_APPROVED",
      requestData.createdById,
      {
        requestId: requestData.requestId,
        requestCode: requestData.code,
      }
    );
  } catch (error) {
    console.error("Error sending request approved notification:", error);
  }
}

// Helper to notify when a request is rejected
export async function notifyRequestRejected(requestData: {
  requestId: string;
  code: string;
  createdById: string;
  reviewNotes?: string;
}) {
  try {
    // Notify the request creator
    await createSystemNotification(
      "REQUEST_REJECTED",
      requestData.createdById,
      {
        requestId: requestData.requestId,
        requestCode: requestData.code,
        reviewNotes: requestData.reviewNotes,
      }
    );
  } catch (error) {
    console.error("Error sending request rejected notification:", error);
  }
}

// Helper to notify when a quotation is received
export async function notifyQuotationReceived(quotationData: {
  quotationId: string;
  code: string;
  requestId: string;
  companyId: string;
  amount: number;
  currency?: string;
  totalInBs?: number;
  exchangeRate?: number;
  validUntil?: string;
  createdBy?: string;
  createdAt?: string;
  companyName?: string;
  requestCode?: string;
  status?: string;
}) {
  try {
    // Get the company's users to notify
    const prisma = (await import("@/lib/prisma")).default;
    const companyUsers = await prisma.profile.findMany({
      where: {
        companyId: quotationData.companyId,
        status: "ACTIVE",
      },
      select: {
        id: true,
        email: true,
      },
    });

    // Notify all company users (in-app notification)
    await Promise.all(
      companyUsers.map((user) =>
        createSystemNotification("QUOTATION_RECEIVED", user.id, {
          quotationId: quotationData.quotationId,
          quotationCode: quotationData.code,
          requestId: quotationData.requestId,
          amount: quotationData.amount,
        })
      )
    );

    // Send email notifications to users with email addresses (only for SENT quotations)
    const usersWithEmail = companyUsers.filter((user) => user.email);

    if (
      usersWithEmail.length > 0 &&
      quotationData.createdBy &&
      quotationData.status === "SENT"
    ) {
      // Generate email content
      const emailHtml = generateQuotationNotificationEmail({
        companyName: quotationData.companyName || "Empresa",
        requestCode: quotationData.requestCode || "N/A",
        quotationCode: quotationData.code,
        amount: quotationData.amount.toString(),
        currency: quotationData.currency || "USD",
        totalInBs: quotationData.totalInBs?.toString() || "0",
        exchangeRate: quotationData.exchangeRate?.toString() || "0",
        validUntil: quotationData.validUntil || new Date().toISOString(),
        createdBy: quotationData.createdBy,
        createdAt: quotationData.createdAt || new Date().toISOString(),
        link: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/importador/solicitudes/${quotationData.requestId}`,
      });

      // Send emails to all users with email addresses
      await Promise.all(
        usersWithEmail.map(async (user) => {
          try {
            await resend.emails.send({
              from: FROM_EMAIL,
              to: user.email!,
              subject: `Nueva Cotización Disponible - ${quotationData.code} (Solicitud: ${quotationData.requestCode || "N/A"})`,
              html: emailHtml,
            });
            console.log(
              `Quotation notification email sent to ${user.email} for quotation ${quotationData.code}`
            );
          } catch (emailError) {
            console.error(`Error sending email to ${user.email}:`, emailError);
          }
        })
      );
    }
  } catch (error) {
    console.error("Error sending quotation received notification:", error);
  }
}

// Helper to notify when a contract is signed
export async function notifyContractSigned(contractData: {
  contractId: string;
  code: string;
  companyId: string;
  title: string;
}) {
  try {
    // Get the company's users to notify
    const prisma = (await import("@/lib/prisma")).default;
    const companyUsers = await prisma.profile.findMany({
      where: {
        companyId: contractData.companyId,
        status: "ACTIVE",
      },
      select: {
        id: true,
      },
    });

    // Notify all company users
    await Promise.all(
      companyUsers.map((user) =>
        createSystemNotification("CONTRACT_SIGNED", user.id, {
          contractId: contractData.contractId,
          contractCode: contractData.code,
          title: contractData.title,
        })
      )
    );

    // Also notify admins
    await notifyAllAdmins("CONTRACT_SIGNED", {
      contractId: contractData.contractId,
      contractCode: contractData.code,
      title: contractData.title,
    });
  } catch (error) {
    console.error("Error sending contract signed notification:", error);
  }
}

// Helper to notify when a payment is received
export async function notifyPaymentReceived(paymentData: {
  paymentId: string;
  code: string;
  companyId: string;
  amount: number;
  type: string;
}) {
  try {
    // Get the company's users to notify
    const prisma = (await import("@/lib/prisma")).default;
    const companyUsers = await prisma.profile.findMany({
      where: {
        companyId: paymentData.companyId,
        status: "ACTIVE",
      },
      select: {
        id: true,
      },
    });

    // Notify all company users
    await Promise.all(
      companyUsers.map((user) =>
        createSystemNotification("PAYMENT_RECEIVED", user.id, {
          paymentId: paymentData.paymentId,
          paymentCode: paymentData.code,
          amount: paymentData.amount,
          type: paymentData.type,
        })
      )
    );

    // Also notify admins
    await notifyAllAdmins("PAYMENT_RECEIVED", {
      paymentId: paymentData.paymentId,
      paymentCode: paymentData.code,
      amount: paymentData.amount,
      type: paymentData.type,
    });
  } catch (error) {
    console.error("Error sending payment received notification:", error);
  }
}

// Helper to notify when a document is approved
export async function notifyDocumentApproved(documentData: {
  documentId: string;
  filename: string;
  type: string;
  companyId?: string;
  requestId?: string;
}) {
  try {
    if (documentData.companyId) {
      // Get the company's users to notify
      const prisma = (await import("@/lib/prisma")).default;
      const companyUsers = await prisma.profile.findMany({
        where: {
          companyId: documentData.companyId,
          status: "ACTIVE",
        },
        select: {
          id: true,
        },
      });

      // Notify all company users
      await Promise.all(
        companyUsers.map((user) =>
          createSystemNotification("DOCUMENT_APPROVED", user.id, {
            documentId: documentData.documentId,
            filename: documentData.filename,
            type: documentData.type,
            requestId: documentData.requestId,
          })
        )
      );
    }
  } catch (error) {
    console.error("Error sending document approved notification:", error);
  }
}

// Helper to notify when a document is rejected
export async function notifyDocumentRejected(documentData: {
  documentId: string;
  filename: string;
  type: string;
  companyId?: string;
  requestId?: string;
  reviewNotes?: string;
}) {
  try {
    if (documentData.companyId) {
      // Get the company's users to notify
      const prisma = (await import("@/lib/prisma")).default;
      const companyUsers = await prisma.profile.findMany({
        where: {
          companyId: documentData.companyId,
          status: "ACTIVE",
        },
        select: {
          id: true,
        },
      });

      // Notify all company users
      await Promise.all(
        companyUsers.map((user) =>
          createSystemNotification("DOCUMENT_REJECTED", user.id, {
            documentId: documentData.documentId,
            filename: documentData.filename,
            type: documentData.type,
            requestId: documentData.requestId,
            reviewNotes: documentData.reviewNotes,
          })
        )
      );
    }
  } catch (error) {
    console.error("Error sending document rejected notification:", error);
  }
}

// Helper to notify when a registration is approved
export async function notifyRegistrationApproved(registrationData: {
  registrationId: string;
  companyName: string;
  email: string;
  companyId?: string;
}) {
  try {
    if (registrationData.companyId) {
      // Get the company's users to notify
      const prisma = (await import("@/lib/prisma")).default;
      const companyUsers = await prisma.profile.findMany({
        where: {
          companyId: registrationData.companyId,
          status: "ACTIVE",
        },
        select: {
          id: true,
        },
      });

      // Notify all company users
      await Promise.all(
        companyUsers.map((user) =>
          createSystemNotification("REGISTRATION_APPROVED", user.id, {
            registrationId: registrationData.registrationId,
            companyName: registrationData.companyName,
          })
        )
      );
    }
  } catch (error) {
    console.error("Error sending registration approved notification:", error);
  }
}

// Helper to notify when a registration is rejected
export async function notifyRegistrationRejected(registrationData: {
  registrationId: string;
  companyName: string;
  email: string;
  rejectionReason?: string;
}) {
  try {
    // For rejected registrations, we can't notify through the app since they don't have accounts
    // This would typically be handled through email notifications
    console.log(
      "Registration rejected notification would be sent via email to:",
      registrationData.email
    );
  } catch (error) {
    console.error("Error sending registration rejected notification:", error);
  }
}

// Export all notification helpers
export const NotificationEvents = {
  notifyRequestCreated,
  notifyRequestApproved,
  notifyRequestRejected,
  notifyQuotationReceived,
  notifyContractSigned,
  notifyPaymentReceived,
  notifyDocumentApproved,
  notifyDocumentRejected,
  notifyRegistrationApproved,
  notifyRegistrationRejected,
};
