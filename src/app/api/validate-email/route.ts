import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email es requerido" },
        { status: 400 }
      );
    }

    // Check if email exists in registration requests
    const existingRequest = await prisma.registrationRequest.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' }, // Get the most recent request
    });

    // Check if email is associated with an active company
    const existingCompany = await prisma.company.findFirst({
      where: { 
        email,
        status: 'ACTIVE'
      },
    });

    // If there's an active company with this email
    if (existingCompany) {
      return NextResponse.json({
        status: 'ACTIVE_ACCOUNT',
        message: 'Ya existe una cuenta activa con este email. Por favor inicie sesión.',
        canProceed: false
      });
    }

    // If there's a registration request
    if (existingRequest) {
      switch (existingRequest.status) {
        case 'PENDING':
          return NextResponse.json({
            status: 'PENDING',
            message: 'Ya existe una solicitud pendiente con este email. Por favor espere la revisión.',
            canProceed: false,
            requestId: existingRequest.id,
            submittedAt: existingRequest.createdAt
          });
        
        case 'APPROVED':
          return NextResponse.json({
            status: 'APPROVED',
            message: 'Su solicitud ya fue aprobada. Por favor revise su email para las credenciales de acceso.',
            canProceed: false,
            requestId: existingRequest.id
          });
        
        case 'REJECTED':
          return NextResponse.json({
            status: 'REJECTED',
            message: 'Su solicitud anterior fue rechazada. Puede enviar una nueva solicitud.',
            canProceed: true,
            previousRequestId: existingRequest.id,
            rejectionReason: existingRequest.rejectionReason
          });
        
        default:
          return NextResponse.json({
            status: 'UNKNOWN',
            message: 'Estado de solicitud desconocido',
            canProceed: false
          });
      }
    }

    // Email is available for registration
    return NextResponse.json({
      status: 'AVAILABLE',
      message: 'Email disponible para registro',
      canProceed: true
    });

  } catch (error) {
    console.error("Error validating email:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 