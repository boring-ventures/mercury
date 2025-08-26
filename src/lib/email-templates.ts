interface RegistrationConfirmationData {
  companyName: string;
  nit: string;
  companyType: string;
  country: string;
  city: string;
  activity: string;
  contactName: string;
  contactPosition: string;
  email: string;
  phone: string;
  requestId: string;
  submittedAt: string;
}

const activityLabels: Record<string, string> = {
  IMPORTACION_GENERAL: "Importación General",
  IMPORTACION_ALIMENTOS: "Importación de Alimentos",
  IMPORTACION_TEXTILES: "Importación de Textiles",
  IMPORTACION_MAQUINARIA: "Importación de Maquinaria",
  IMPORTACION_ELECTRONICA: "Importación de Electrónicos",
  IMPORTACION_VEHICULOS: "Importación de Vehículos",
  COMERCIO_MAYORISTA: "Comercio Mayorista",
  COMERCIO_MINORISTA: "Comercio Minorista",
  OTROS: "Otros",
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const generateRegistrationConfirmationEmail = (
  data: RegistrationConfirmationData
): string => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solicitud de Registro Recibida - NORDEX Platform</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #ffffff;
            color: #1f2937;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .logo {
            color: #f59e0b;
            font-size: 28px;
            font-weight: bold;
            margin: 0;
        }
        .tagline {
            color: #6b7280;
            font-size: 14px;
            margin: 5px 0 0 0;
        }
        .hero-section {
            background: linear-gradient(135deg, #fef9e7 0%, #fef3c7 100%);
            border-radius: 12px;
            padding: 40px 30px;
            text-align: center;
            margin: 30px 0;
        }
        .hero-title {
            color: #1f2937;
            font-size: 28px;
            font-weight: bold;
            margin: 0 0 15px 0;
        }
        .hero-subtitle {
            color: #4b5563;
            font-size: 16px;
            margin: 0 0 25px 0;
        }
        .status-badge {
            background-color: #dcfce7;
            border: 1px solid #bbf7d0;
            color: #166534;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            display: inline-block;
        }
        .details-section {
            background-color: #f9fafb;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
        }
        .section-title {
            color: #1f2937;
            font-size: 22px;
            font-weight: bold;
            margin: 0 0 20px 0;
        }
        .request-id-box {
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px 20px;
            margin: 20px 0;
        }
        .request-id-label {
            color: #6b7280;
            font-size: 14px;
            margin: 0 0 5px 0;
        }
        .request-id-value {
            color: #1f2937;
            font-size: 18px;
            font-weight: bold;
            font-family: 'Courier New', monospace;
            margin: 0;
        }
        .submitted-date {
            color: #6b7280;
            font-size: 14px;
            margin: 0 0 20px 0;
        }
        .subsection-title {
            color: #1f2937;
            font-size: 18px;
            font-weight: 600;
            margin: 25px 0 15px 0;
        }
        .detail-table {
            width: 100%;
            border-collapse: collapse;
        }
        .detail-row {
            border-bottom: 1px solid #f3f4f6;
        }
        .detail-label {
            color: #6b7280;
            font-size: 14px;
            padding: 10px 0;
            width: 40%;
            vertical-align: top;
        }
        .detail-value {
            color: #1f2937;
            font-size: 14px;
            font-weight: 600;
            padding: 10px 0;
            vertical-align: top;
        }
        .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 25px 0;
            border: none;
        }
        .next-steps-section {
            background-color: #f8fafc;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
        }
        .step-item {
            display: flex;
            align-items: flex-start;
            margin: 20px 0;
        }
        .step-number {
            background-color: #f59e0b;
            color: #ffffff;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 14px;
            margin-right: 15px;
            flex-shrink: 0;
        }
        .step-content {
            flex: 1;
        }
        .step-title {
            color: #1f2937;
            font-weight: 600;
            margin: 0 0 5px 0;
        }
        .step-description {
            color: #6b7280;
            font-size: 14px;
            margin: 0;
        }
        .support-section {
            background-color: #fef3c7;
            border: 1px solid #fcd34d;
            border-radius: 12px;
            padding: 25px;
            text-align: center;
            margin: 30px 0;
        }
        .support-title {
            color: #f59e0b;
            font-size: 18px;
            font-weight: 600;
            margin: 0 0 10px 0;
        }
        .support-text {
            color: #6b7280;
            font-size: 14px;
            margin: 0 0 20px 0;
        }
        .cta-button {
            background-color: #f59e0b;
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
            transition: background-color 0.2s;
        }
        .cta-button:hover {
            background-color: #d97706;
        }
        .footer {
            border-top: 1px solid #e5e7eb;
            padding: 25px 0;
            text-align: center;
            margin-top: 40px;
        }
        .footer-text {
            color: #9ca3af;
            font-size: 12px;
            margin: 5px 0;
        }
        .link {
            color: #f59e0b;
            text-decoration: underline;
        }
        @media (max-width: 600px) {
            .container {
                padding: 10px;
            }
            .hero-section {
                padding: 30px 20px;
            }
            .details-section, .next-steps-section, .support-section {
                padding: 20px;
            }
            .hero-title {
                font-size: 24px;
            }
            .detail-table {
                font-size: 13px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1 class="logo">NORDEX</h1>
            <p class="tagline">Plataforma especializada para gestión de envíos internacionales</p>
        </div>

        <!-- Success Message -->
        <div class="hero-section">
            <h2 class="hero-title">¡Solicitud Recibida Exitosamente!</h2>
            <p class="hero-subtitle">
                Hemos recibido su solicitud de registro como importador. 
                Nuestro equipo la revisará en las próximas 24-48 horas.
            </p>
            <div class="status-badge">
                Estado: En Proceso de Verificación
            </div>
        </div>

        <!-- Request Details -->
        <div class="details-section">
            <h3 class="section-title">Detalles de su Solicitud</h3>
            
            <div class="request-id-box">
                <p class="request-id-label">ID de Solicitud:</p>
                <p class="request-id-value">${data.requestId}</p>
            </div>

            <p class="submitted-date">
                Enviado el: ${formatDate(data.submittedAt)}
            </p>

            <hr class="divider">

            <!-- Company Information -->
            <h4 class="subsection-title">📋 Información de la Empresa</h4>
            <table class="detail-table">
                <tr class="detail-row">
                    <td class="detail-label">Nombre de la Empresa:</td>
                    <td class="detail-value">${data.companyName}</td>
                </tr>
                <tr class="detail-row">
                    <td class="detail-label">NIT:</td>
                    <td class="detail-value">${data.nit}</td>
                </tr>
                <tr class="detail-row">
                    <td class="detail-label">Tipo de Empresa:</td>
                    <td class="detail-value">${data.companyType}</td>
                </tr>
                <tr class="detail-row">
                    <td class="detail-label">País:</td>
                    <td class="detail-value">${data.country}</td>
                </tr>
                <tr class="detail-row">
                    <td class="detail-label">Ciudad:</td>
                    <td class="detail-value">${data.city}</td>
                </tr>
                <tr class="detail-row">
                    <td class="detail-label">Actividad Económica:</td>
                    <td class="detail-value">${activityLabels[data.activity] || data.activity}</td>
                </tr>
            </table>

            <hr class="divider">

            <!-- Contact Information -->
            <h4 class="subsection-title">👤 Información de Contacto</h4>
            <table class="detail-table">
                <tr class="detail-row">
                    <td class="detail-label">Nombre de Contacto:</td>
                    <td class="detail-value">${data.contactName}</td>
                </tr>
                <tr class="detail-row">
                    <td class="detail-label">Cargo:</td>
                    <td class="detail-value">${data.contactPosition}</td>
                </tr>
                <tr class="detail-row">
                    <td class="detail-label">Email:</td>
                    <td class="detail-value">${data.email}</td>
                </tr>
                <tr class="detail-row">
                    <td class="detail-label">Teléfono:</td>
                    <td class="detail-value">${data.phone}</td>
                </tr>
            </table>
        </div>

        <!-- Next Steps -->
        <div class="next-steps-section">
            <h3 class="section-title">Próximos Pasos</h3>
            
            <div class="step-item">
                <div class="step-number">1</div>
                <div class="step-content">
                    <p class="step-title">Revisión de Documentos</p>
                    <p class="step-description">
                        Nuestro equipo revisará los documentos enviados y validará la información proporcionada.
                    </p>
                </div>
            </div>

            <div class="step-item">
                <div class="step-number">2</div>
                <div class="step-content">
                    <p class="step-title">Notificación por Email</p>
                    <p class="step-description">
                        Le enviaremos un email con el resultado de la revisión a esta dirección.
                    </p>
                </div>
            </div>

            <div class="step-item">
                <div class="step-number">3</div>
                <div class="step-content">
                    <p class="step-title">Creación de Cuenta</p>
                    <p class="step-description">
                        Una vez aprobada, crearemos su cuenta y le enviaremos las credenciales de acceso.
                    </p>
                </div>
            </div>
        </div>

        <!-- Support Section -->
        <div class="support-section">
            <h4 class="support-title">¿Necesita ayuda?</h4>
            <p class="support-text">
                Si tiene preguntas sobre su solicitud, puede contactarnos en 
                <a href="mailto:soporte@nordex.com" class="link">soporte@nordex.com</a>
                e incluya su ID de solicitud <strong>${data.requestId}</strong> en la consulta.
            </p>
            
                            <a href="mailto:soporte@nordex.com" class="cta-button">
                Contactar Soporte
            </a>
        </div>

        <!-- Footer -->
        <div class="footer">
            <hr class="divider">
            <p class="footer-text">
                © 2025 NORDEX Platform. Todos los derechos reservados.
            </p>
            <p class="footer-text">
                Este es un email automático, por favor no responda a esta dirección.
            </p>
        </div>
    </div>
</body>
</html>
  `;
};

interface AdminNotificationData {
  companyName: string;
  nit: string;
  companyType: string;
  country: string;
  city: string;
  activity: string;
  contactName: string;
  contactPosition: string;
  email: string;
  phone: string;
  requestId: string;
  submittedAt: string;
  documentsCount: number;
}

export const generateAdminNotificationEmail = (
  data: AdminNotificationData
): string => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva Solicitud de Registro - NORDEX Platform</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #ffffff;
            color: #1f2937;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .logo {
            color: #f59e0b;
            font-size: 28px;
            font-weight: bold;
            margin: 0;
        }
        .tagline {
            color: #6b7280;
            font-size: 14px;
            margin: 5px 0 0 0;
        }
        .alert-section {
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            border: 1px solid #fecaca;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
        }
        .alert-title {
            color: #dc2626;
            font-size: 24px;
            font-weight: bold;
            margin: 0 0 15px 0;
        }
        .alert-subtitle {
            color: #4b5563;
            font-size: 16px;
            margin: 0 0 20px 0;
        }
        .priority-badge {
            background-color: #dc2626;
            color: #ffffff;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 600;
            display: inline-block;
            font-size: 14px;
        }
        .details-section {
            background-color: #f9fafb;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
        }
        .section-title {
            color: #1f2937;
            font-size: 22px;
            font-weight: bold;
            margin: 0 0 20px 0;
        }
        .request-id-box {
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px 20px;
            margin: 20px 0;
        }
        .request-id-label {
            color: #6b7280;
            font-size: 14px;
            margin: 0 0 5px 0;
        }
        .request-id-value {
            color: #1f2937;
            font-size: 18px;
            font-weight: bold;
            font-family: 'Courier New', monospace;
            margin: 0;
        }
        .submitted-date {
            color: #6b7280;
            font-size: 14px;
            margin: 0 0 20px 0;
        }
        .subsection-title {
            color: #1f2937;
            font-size: 18px;
            font-weight: 600;
            margin: 25px 0 15px 0;
        }
        .detail-table {
            width: 100%;
            border-collapse: collapse;
        }
        .detail-row {
            border-bottom: 1px solid #f3f4f6;
        }
        .detail-label {
            color: #6b7280;
            font-size: 14px;
            padding: 10px 0;
            width: 40%;
            vertical-align: top;
        }
        .detail-value {
            color: #1f2937;
            font-size: 14px;
            font-weight: 600;
            padding: 10px 0;
            vertical-align: top;
        }
        .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 25px 0;
            border: none;
        }
        .action-section {
            background-color: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
        }
        .action-title {
            color: #0369a1;
            font-size: 20px;
            font-weight: 600;
            margin: 0 0 15px 0;
        }
        .action-text {
            color: #4b5563;
            font-size: 14px;
            margin: 0 0 20px 0;
        }
        .cta-button {
            background-color: #0369a1;
            color: #ffffff;
            padding: 16px 32px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 700;
            font-size: 16px;
            display: inline-block;
            transition: background-color 0.2s;
            text-align: center;
            min-width: 200px;
            box-shadow: 0 2px 4px rgba(3, 105, 161, 0.2);
        }
        .cta-button:hover {
            background-color: #075985;
            box-shadow: 0 4px 8px rgba(3, 105, 161, 0.3);
        }
        .footer {
            border-top: 1px solid #e5e7eb;
            padding: 25px 0;
            text-align: center;
            margin-top: 40px;
        }
        .footer-text {
            color: #9ca3af;
            font-size: 12px;
            margin: 5px 0;
        }
        @media (max-width: 600px) {
            .container {
                padding: 10px;
            }
            .alert-section, .details-section, .action-section {
                padding: 20px;
            }
            .alert-title {
                font-size: 20px;
            }
            .detail-table {
                font-size: 13px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1 class="logo">NORDEX</h1>
            <p class="tagline">Plataforma especializada para gestión de envíos internacionales</p>
        </div>

        <!-- Alert Message -->
        <div class="alert-section">
            <h2 class="alert-title">🚨 Nueva Solicitud de Registro</h2>
            <p class="alert-subtitle">
                Se ha recibido una nueva solicitud de registro que requiere revisión administrativa.
            </p>
            <div class="priority-badge">
                Requiere Atención Inmediata
            </div>
        </div>

        <!-- Request Details -->
        <div class="details-section">
            <h3 class="section-title">Detalles de la Solicitud</h3>
            
            <div class="request-id-box">
                <p class="request-id-label">ID de Solicitud:</p>
                <p class="request-id-value">${data.requestId}</p>
            </div>

            <p class="submitted-date">
                Recibido el: ${formatDate(data.submittedAt)}
            </p>

            <hr class="divider">

            <!-- Company Information -->
            <h4 class="subsection-title">📋 Información de la Empresa</h4>
            <table class="detail-table">
                <tr class="detail-row">
                    <td class="detail-label">Nombre de la Empresa:</td>
                    <td class="detail-value">${data.companyName}</td>
                </tr>
                <tr class="detail-row">
                    <td class="detail-label">NIT:</td>
                    <td class="detail-value">${data.nit}</td>
                </tr>
                <tr class="detail-row">
                    <td class="detail-label">Tipo de Empresa:</td>
                    <td class="detail-value">${data.companyType}</td>
                </tr>
                <tr class="detail-row">
                    <td class="detail-label">País:</td>
                    <td class="detail-value">${data.country}</td>
                </tr>
                <tr class="detail-row">
                    <td class="detail-label">Ciudad:</td>
                    <td class="detail-value">${data.city}</td>
                </tr>
                <tr class="detail-row">
                    <td class="detail-label">Actividad Económica:</td>
                    <td class="detail-value">${activityLabels[data.activity] || data.activity}</td>
                </tr>
            </table>

            <hr class="divider">

            <!-- Contact Information -->
            <h4 class="subsection-title">👤 Información de Contacto</h4>
            <table class="detail-table">
                <tr class="detail-row">
                    <td class="detail-label">Nombre de Contacto:</td>
                    <td class="detail-value">${data.contactName}</td>
                </tr>
                <tr class="detail-row">
                    <td class="detail-label">Cargo:</td>
                    <td class="detail-value">${data.contactPosition}</td>
                </tr>
                <tr class="detail-row">
                    <td class="detail-label">Email:</td>
                    <td class="detail-value">${data.email}</td>
                </tr>
                <tr class="detail-row">
                    <td class="detail-label">Teléfono:</td>
                    <td class="detail-value">${data.phone}</td>
                </tr>
            </table>

            <hr class="divider">

            <!-- Documents Information -->
            <h4 class="subsection-title">📄 Documentos Adjuntos</h4>
            <table class="detail-table">
                <tr class="detail-row">
                    <td class="detail-label">Total de Documentos:</td>
                    <td class="detail-value">${data.documentsCount} archivo(s)</td>
                </tr>
            </table>
        </div>

        <!-- Action Section -->
        <div class="action-section">
            <h3 class="action-title">Acción Requerida</h3>
            <p class="action-text">
                Por favor, revise esta solicitud en el panel de administración y tome la decisión correspondiente 
                (aprobar o rechazar) basándose en la documentación proporcionada y la información de la empresa.
            </p>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/petitions/${data.requestId}" class="cta-button">
                Revisar Solicitud
            </a>
        </div>

        <!-- Footer -->
        <div class="footer">
            <hr class="divider">
            <p class="footer-text">
                © 2025 NORDEX Platform. Todos los derechos reservados.
            </p>
            <p class="footer-text">
                Este es un email automático del sistema de notificaciones.
            </p>
        </div>
    </div>
</body>
</html>
  `;
};

// ============== NEW EMAILS (Quotations / Contracts) ==============

interface QuotationAcceptedAdminData {
  companyName: string;
  requestCode: string;
  quotationCode: string;
  amount: number | string;
  currency: string;
  acceptedAt: string;
  link: string;
}

export const generateQuotationAcceptedAdminEmail = (
  data: QuotationAcceptedAdminData
): string => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cotización Aceptada</title>
  <style>
    body{font-family:Inter,system-ui,Segoe UI,Roboto,Arial,sans-serif;color:#111827;background:#fff;margin:0;padding:0}
    .container{max-width:640px;margin:0 auto;padding:24px}
    .card{border:1px solid #e5e7eb;border-radius:12px;padding:24px;background:#fafafa}
    .title{font-size:20px;font-weight:700;margin:0 0 8px}
    .muted{color:#6b7280;font-size:14px;margin:0 0 16px}
    .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f3f4f6}
    .label{color:#6b7280;font-size:13px}
    .value{font-weight:600;font-size:14px}
    .btn{display:inline-block;margin-top:16px;background:#0369a1;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700}
  </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <p class="title">Cotización aceptada por el importador</p>
        <p class="muted">Revise y genere el contrato correspondiente.</p>
        <div class="row"><span class="label">Empresa</span><span class="value">${data.companyName}</span></div>
        <div class="row"><span class="label">Solicitud</span><span class="value">${data.requestCode}</span></div>
        <div class="row"><span class="label">Cotización</span><span class="value">${data.quotationCode}</span></div>
        <div class="row"><span class="label">Monto</span><span class="value">${data.amount} ${data.currency}</span></div>
        <div class="row"><span class="label">Fecha</span><span class="value">${formatDate(data.acceptedAt)}</span></div>
        <a class="btn" href="${data.link}">Abrir en panel</a>
      </div>
    </div>
  </body>
</html>`;
};

interface QuotationRejectedAdminData {
  companyName: string;
  requestCode: string;
  quotationCode: string;
  amount: number | string;
  currency: string;
  rejectedAt: string;
  reason: string;
  link: string;
}

export const generateQuotationRejectedAdminEmail = (
  data: QuotationRejectedAdminData
): string => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cotización Rechazada</title>
  <style>
    body{font-family:Inter,system-ui,Segoe UI,Roboto,Arial,sans-serif;color:#111827;background:#fff;margin:0;padding:0}
    .container{max-width:640px;margin:0 auto;padding:24px}
    .card{border:1px solid #e5e7eb;border-radius:12px;padding:24px;background:#fafafa}
    .title{font-size:20px;font-weight:700;margin:0 0 8px;color:#dc2626}
    .muted{color:#6b7280;font-size:14px;margin:0 0 16px}
    .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f3f4f6}
    .label{color:#6b7280;font-size:13px}
    .value{font-weight:600;font-size:14px}
    .btn{display:inline-block;margin-top:16px;background:#dc2626;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700}
    .reason-box{background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:16px 0}
    .reason-title{color:#dc2626;font-weight:600;font-size:14px;margin:0 0 8px}
    .reason-text{color:#7f1d1d;font-size:14px;margin:0;line-height:1.5}
  </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <p class="title">❌ Cotización rechazada por el importador</p>
        <p class="muted">Revise los detalles y considere enviar una nueva propuesta.</p>
        
        <div class="reason-box">
          <p class="reason-title">Motivo del rechazo:</p>
          <p class="reason-text">${data.reason}</p>
        </div>
        
        <div class="row"><span class="label">Empresa</span><span class="value">${data.companyName}</span></div>
        <div class="row"><span class="label">Solicitud</span><span class="value">${data.requestCode}</span></div>
        <div class="row"><span class="label">Cotización</span><span class="value">${data.quotationCode}</span></div>
        <div class="row"><span class="label">Monto</span><span class="value">${data.amount} ${data.currency}</span></div>
        <div class="row"><span class="label">Fecha</span><span class="value">${formatDate(data.rejectedAt)}</span></div>
        <a class="btn" href="${data.link}">Revisar en panel</a>
      </div>
    </div>
  </body>
</html>`;
};

interface ContractActivatedData {
  companyName: string;
  contractCode: string;
  title: string;
  amount: number | string;
  currency: string;
  startDate: string;
  endDate: string;
  link: string;
}

export const generateContractActivatedEmail = (
  data: ContractActivatedData
): string => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Contrato Activado</title>
  <style>
    body{font-family:Inter,system-ui,Segoe UI,Roboto,Arial,sans-serif;color:#111827;background:#fff;margin:0;padding:0}
    .container{max-width:640px;margin:0 auto;padding:24px}
    .card{border:1px solid #e5e7eb;border-radius:12px;padding:24px;background:#fafafa}
    .title{font-size:20px;font-weight:700;margin:0 0 8px}
    .muted{color:#6b7280;font-size:14px;margin:0 0 16px}
    .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f3f4f6}
    .label{color:#6b7280;font-size:13px}
    .value{font-weight:600;font-size:14px}
    .btn{display:inline-block;margin-top:16px;background:#0ea5e9;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700}
  </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <p class="title">Su contrato está activo</p>
        <p class="muted">Ya puede revisar el documento y continuar con el proceso.</p>
        <div class="row"><span class="label">Empresa</span><span class="value">${data.companyName}</span></div>
        <div class="row"><span class="label">Contrato</span><span class="value">${data.contractCode}</span></div>
        <div class="row"><span class="label">Título</span><span class="value">${data.title}</span></div>
        <div class="row"><span class="label">Monto</span><span class="value">${data.amount} ${data.currency}</span></div>
        <div class="row"><span class="label">Vigencia</span><span class="value">${formatDate(data.startDate)} - ${formatDate(data.endDate)}</span></div>
        <a class="btn" href="${data.link}">Ver contrato</a>
      </div>
    </div>
  </body>
</html>`;
};

interface ContractGeneratedAdminData {
  contractCode: string;
  quotationCode: string;
  requestCode: string;
  companyName: string;
  amount: number;
  currency: string;
  importerName: string;
  generatedAt: string;
}

export const generateContractGeneratedAdminEmail = (
  data: ContractGeneratedAdminData
): string => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nuevo Contrato Generado</title>
  <style>
    body{font-family:Inter,system-ui,Segoe UI,Roboto,Arial,sans-serif;color:#111827;background:#fff;margin:0;padding:0}
    .container{max-width:640px;margin:0 auto;padding:24px}
    .card{border:1px solid #e5e7eb;border-radius:12px;padding:24px;background:#fafafa}
    .title{font-size:20px;font-weight:700;margin:0 0 8px;color:#059669}
    .muted{color:#6b7280;font-size:14px;margin:0 0 16px}
    .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f3f4f6}
    .label{color:#6b7280;font-size:13px}
    .value{font-weight:600;font-size:14px}
    .btn{display:inline-block;margin-top:16px;background:#059669;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700}
    .highlight{background:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;padding:16px;margin:16px 0}
  </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <p class="title">🆕 Nuevo Contrato Generado</p>
        <p class="muted">Un importador ha generado un nuevo contrato desde una cotización aceptada.</p>
        
        <div class="highlight">
          <p style="margin:0;font-weight:600;color:#059669">El importador ha completado los datos requeridos y generado el contrato automáticamente.</p>
        </div>
        
        <div class="row"><span class="label">Empresa</span><span class="value">${data.companyName}</span></div>
        <div class="row"><span class="label">Importador</span><span class="value">${data.importerName}</span></div>
        <div class="row"><span class="label">Solicitud</span><span class="value">${data.requestCode}</span></div>
        <div class="row"><span class="label">Cotización</span><span class="value">${data.quotationCode}</span></div>
        <div class="row"><span class="label">Contrato</span><span class="value">${data.contractCode}</span></div>
        <div class="row"><span class="label">Monto</span><span class="value">$${data.amount.toLocaleString()} ${data.currency}</span></div>
        <div class="row"><span class="label">Generado el</span><span class="value">${formatDate(data.generatedAt)}</span></div>
        
        <a class="btn" href="/admin/contracts">Revisar Contratos</a>
      </div>
    </div>
  </body>
</html>`;
};

interface ContractAcceptedAdminData {
  contractCode: string;
  quotationCode: string;
  requestCode: string;
  companyName: string;
  amount: number;
  currency: string;
  importerName: string;
  acceptedAt: string;
}

export const generateContractAcceptedAdminEmail = (
  data: ContractAcceptedAdminData
): string => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Contrato Aceptado</title>
  <style>
    body{font-family:Inter,system-ui,Segoe UI,Roboto,Arial,sans-serif;color:#111827;background:#fff;margin:0;padding:0}
    .container{max-width:640px;margin:0 auto;padding:24px}
    .card{border:1px solid #e5e7eb;border-radius:12px;padding:24px;background:#fafafa}
    .title{font-size:20px;font-weight:700;margin:0 0 8px;color:#059669}
    .muted{color:#6b7280;font-size:14px;margin:0 0 16px}
    .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f3f4f6}
    .label{color:#6b7280;font-size:13px}
    .value{font-weight:600;font-size:14px}
    .btn{display:inline-block;margin-top:16px;background:#059669;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700}
    .highlight{background:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;padding:16px;margin:16px 0}
  </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <p class="title">✅ Contrato Aceptado</p>
        <p class="muted">Un importador ha aceptado y firmado el contrato generado.</p>
        
        <div class="highlight">
          <p style="margin:0;font-weight:600;color:#059669">El contrato está ahora activo y listo para proceder con el siguiente paso del proceso.</p>
        </div>
        
        <div class="row"><span class="label">Empresa</span><span class="value">${data.companyName}</span></div>
        <div class="row"><span class="label">Importador</span><span class="value">${data.importerName}</span></div>
        <div class="row"><span class="label">Solicitud</span><span class="value">${data.requestCode}</span></div>
        <div class="row"><span class="label">Cotización</span><span class="value">${data.quotationCode}</span></div>
        <div class="row"><span class="label">Contrato</span><span class="value">${data.contractCode}</span></div>
        <div class="row"><span class="label">Monto</span><span class="value">$${data.amount.toLocaleString()} ${data.currency}</span></div>
        <div class="row"><span class="label">Aceptado el</span><span class="value">${formatDate(data.acceptedAt)}</span></div>
        
        <a class="btn" href="/admin/contracts">Revisar Contratos</a>
      </div>
    </div>
  </body>
</html>`;
};

interface QuotationNotificationData {
  companyName: string;
  requestCode: string;
  quotationCode: string;
  amount: number | string;
  currency: string;
  totalInBs: number | string;
  exchangeRate: number | string;
  validUntil: string;
  createdBy: string;
  createdAt: string;
  link: string;
}

export const generateContractCompletedEmail = (data: {
  importerName: string;
  contractCode: string;
  quotationCode: string;
  requestCode: string;
  companyName: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  completedBy: string;
  completedAt: string;
  link: string;
}): string => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-BO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("es-BO", {
      style: "currency",
      currency: currency === "USD" ? "USD" : "BOB",
    }).format(amount);
  };

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contrato Completado - NORDEX Platform</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background-color: #ffffff;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 10px;
        }
        .subtitle {
          color: #6b7280;
          font-size: 16px;
        }
        .success-icon {
          font-size: 48px;
          color: #10b981;
          margin: 20px 0;
        }
        .main-title {
          color: #1f2937;
          font-size: 24px;
          font-weight: 600;
          margin: 20px 0;
          text-align: center;
        }
        .contract-details {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          padding: 8px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-weight: 600;
          color: #374151;
        }
        .detail-value {
          color: #1f2937;
          text-align: right;
        }
        .cta-button {
          display: inline-block;
          background-color: #2563eb;
          color: #ffffff;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
          text-align: center;
        }
        .cta-button:hover {
          background-color: #1d4ed8;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        .highlight {
          background-color: #dbeafe;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #2563eb;
          margin: 20px 0;
        }
        .date-info {
          background-color: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
        }
        .date-label {
          font-weight: 600;
          color: #166534;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">NORDEX Platform</div>
          <div class="subtitle">Plataforma de Importación y Comercio Exterior</div>
        </div>

        <div style="text-align: center;">
          <div class="success-icon">✅</div>
        </div>

        <h1 class="main-title">¡Contrato Completado Exitosamente!</h1>

        <p>Estimado/a <strong>${data.importerName}</strong>,</p>

        <p>Nos complace informarle que su contrato ha sido completado por nuestro equipo administrativo. El contrato ahora está listo para proceder con la siguiente fase del proceso de importación.</p>

        <div class="highlight">
          <strong>📋 Resumen del Contrato:</strong>
          <p>Su contrato ha sido marcado como <strong>COMPLETED</strong> y está listo para continuar con el flujo de trabajo.</p>
        </div>

        <div class="contract-details">
          <h3 style="margin-top: 0; color: #1f2937;">Detalles del Contrato</h3>
          
          <div class="detail-row">
            <span class="detail-label">Código del Contrato:</span>
            <span class="detail-value"><strong>${data.contractCode}</strong></span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Código de Cotización:</span>
            <span class="detail-value">${data.quotationCode}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Código de Solicitud:</span>
            <span class="detail-value">${data.requestCode}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Empresa:</span>
            <span class="detail-value">${data.companyName}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Monto:</span>
            <span class="detail-value"><strong>${formatCurrency(data.amount, data.currency)}</strong></span>
          </div>
        </div>

        <div class="date-info">
          <h4 style="margin-top: 0; color: #166534;">📅 Fechas del Contrato</h4>
          
          <div class="detail-row">
            <span class="date-label">Fecha de Inicio:</span>
            <span class="detail-value"><strong>${formatDate(data.startDate)}</strong></span>
          </div>
          
          <div class="detail-row">
            <span class="date-label">Fecha de Fin:</span>
            <span class="detail-value"><strong>${formatDate(data.endDate)}</strong></span>
          </div>
        </div>

        <div class="highlight">
          <strong>👤 Completado por:</strong> ${data.completedBy}<br>
          <strong>📅 Fecha de Completado:</strong> ${formatDate(data.completedAt)}
        </div>

        <p><strong>Próximos pasos:</strong></p>
        <ul>
          <li>Su contrato está ahora en estado <strong>COMPLETED</strong></li>
          <li>Puede proceder con la siguiente fase del proceso de importación</li>
          <li>El sistema ha sido actualizado con las fechas del contrato</li>
          <li>Recibirá notificaciones sobre el progreso del proceso</li>
        </ul>

        <div style="text-align: center;">
          <a href="${data.link}" class="cta-button">
            Ver Contrato en la Plataforma
          </a>
        </div>

        <p><strong>¿Tiene alguna pregunta?</strong></p>
        <p>Si tiene alguna consulta sobre su contrato o el proceso de importación, no dude en contactarnos. Estamos aquí para ayudarle en cada paso del proceso.</p>

        <div class="footer">
          <p><strong>NORDEX Platform</strong></p>
          <p>Plataforma de Importación y Comercio Exterior</p>
          <p>Este es un email automático, por favor no responda a este mensaje.</p>
          <p>Si necesita asistencia, contacte a nuestro equipo de soporte.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateQuotationNotificationEmail = (
  data: QuotationNotificationData
): string => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva Cotización Disponible - NORDEX Platform</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #ffffff;
            color: #1f2937;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .logo {
            color: #f59e0b;
            font-size: 28px;
            font-weight: bold;
            margin: 0;
        }
        .tagline {
            color: #6b7280;
            font-size: 14px;
            margin: 5px 0 0 0;
        }
        .hero-section {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-radius: 12px;
            padding: 40px 30px;
            text-align: center;
            margin: 30px 0;
        }
        .hero-title {
            color: #1f2937;
            font-size: 28px;
            font-weight: bold;
            margin: 0 0 15px 0;
        }
        .hero-subtitle {
            color: #4b5563;
            font-size: 16px;
            margin: 0 0 25px 0;
        }
        .status-badge {
            background-color: #dbeafe;
            border: 1px solid #93c5fd;
            color: #1e40af;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            display: inline-block;
        }
        .details-section {
            background-color: #f9fafb;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
        }
        .section-title {
            color: #1f2937;
            font-size: 22px;
            font-weight: bold;
            margin: 0 0 20px 0;
        }
        .quotation-id-box {
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px 20px;
            margin: 20px 0;
        }
        .quotation-id-label {
            color: #6b7280;
            font-size: 14px;
            margin: 0 0 5px 0;
        }
        .quotation-id-value {
            color: #1f2937;
            font-size: 18px;
            font-weight: bold;
            font-family: 'Courier New', monospace;
            margin: 0;
        }
        .created-date {
            color: #6b7280;
            font-size: 14px;
            margin: 0 0 20px 0;
        }
        .subsection-title {
            color: #1f2937;
            font-size: 18px;
            font-weight: 600;
            margin: 25px 0 15px 0;
        }
        .detail-table {
            width: 100%;
            border-collapse: collapse;
        }
        .detail-row {
            border-bottom: 1px solid #f3f4f6;
        }
        .detail-label {
            color: #6b7280;
            font-size: 14px;
            padding: 10px 0;
            width: 40%;
            vertical-align: top;
        }
        .detail-value {
            color: #1f2937;
            font-size: 14px;
            font-weight: 600;
            padding: 10px 0;
            vertical-align: top;
        }
        .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 25px 0;
            border: none;
        }
        .action-section {
            background-color: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
        }
        .action-title {
            color: #0369a1;
            font-size: 20px;
            font-weight: 600;
            margin: 0 0 15px 0;
        }
        .action-text {
            color: #4b5563;
            font-size: 14px;
            margin: 0 0 20px 0;
        }
        .cta-button {
            background-color: #0369a1;
            color: #ffffff;
            padding: 16px 32px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 700;
            font-size: 16px;
            display: inline-block;
            transition: background-color 0.2s;
            text-align: center;
            min-width: 200px;
            box-shadow: 0 2px 4px rgba(3, 105, 161, 0.2);
        }
        .cta-button:hover {
            background-color: #075985;
            box-shadow: 0 4px 8px rgba(3, 105, 161, 0.3);
        }
        .footer {
            border-top: 1px solid #e5e7eb;
            padding: 25px 0;
            text-align: center;
            margin-top: 40px;
        }
        .footer-text {
            color: #9ca3af;
            font-size: 12px;
            margin: 5px 0;
        }
        .link {
            color: #f59e0b;
            text-decoration: underline;
        }
        @media (max-width: 600px) {
            .container {
                padding: 10px;
            }
            .hero-section {
                padding: 30px 20px;
            }
            .details-section, .action-section {
                padding: 20px;
            }
            .hero-title {
                font-size: 24px;
            }
            .detail-table {
                font-size: 13px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1 class="logo">NORDEX</h1>
            <p class="tagline">Plataforma especializada para gestión de envíos internacionales</p>
        </div>

        <!-- Success Message -->
        <div class="hero-section">
            <h2 class="hero-title">💰 Nueva Cotización Disponible</h2>
            <p class="hero-subtitle">
                Se ha generado una nueva cotización para su solicitud de importación. 
                Revise los detalles y proceda con la siguiente etapa del proceso.
            </p>
            <div class="status-badge">
                Estado: Cotización Generada
            </div>
        </div>

        <!-- Quotation Details -->
        <div class="details-section">
            <h3 class="section-title">Detalles de la Cotización</h3>
            
            <div class="quotation-id-box">
                <p class="quotation-id-label">Código de Cotización:</p>
                <p class="quotation-id-value">${data.quotationCode}</p>
            </div>

            <p class="created-date">
                Generada el: ${formatDate(data.createdAt)}
            </p>

            <hr class="divider">

            <!-- Quotation Information -->
            <h4 class="subsection-title">📊 Información de la Cotización</h4>
            <table class="detail-table">
                <tr class="detail-row">
                    <td class="detail-label">Solicitud:</td>
                    <td class="detail-value">${data.requestCode}</td>
                </tr>
                <tr class="detail-row">
                    <td class="detail-label">Monto a Enviar:</td>
                    <td class="detail-value">$${data.amount} ${data.currency}</td>
                </tr>
                <tr class="detail-row">
                    <td class="detail-label">Tipo de Cambio:</td>
                    <td class="detail-value">${data.exchangeRate} BOB/USDT</td>
                </tr>
                <tr class="detail-row">
                    <td class="detail-label">Total en Bolivianos:</td>
                    <td class="detail-value">${data.totalInBs} BOB</td>
                </tr>
                <tr class="detail-row">
                    <td class="detail-label">Válida hasta:</td>
                    <td class="detail-value">${formatDate(data.validUntil)}</td>
                </tr>
                <tr class="detail-row">
                    <td class="detail-label">Generada por:</td>
                    <td class="detail-value">${data.createdBy}</td>
                </tr>
            </table>
        </div>

        <!-- Action Section -->
        <div class="action-section">
            <h3 class="action-title">Acción Requerida</h3>
            <p class="action-text">
                Por favor, revise esta cotización en su panel de importador y tome la decisión correspondiente 
                (aceptar o rechazar) basándose en los términos y condiciones ofrecidos.
            </p>
            
            <a href="${data.link}" class="cta-button">
                Revisar Cotización
            </a>
        </div>

        <!-- Footer -->
        <div class="footer">
            <hr class="divider">
            <p class="footer-text">
                © 2025 NORDEX Platform. Todos los derechos reservados.
            </p>
            <p class="footer-text">
                Este es un email automático del sistema de notificaciones.
            </p>
        </div>
    </div>
</body>
</html>
  `;
};
