import { createSystemNotification, notifyAllAdmins } from "@/lib/notifications";

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
      },
    });

    // Notify all company users
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
