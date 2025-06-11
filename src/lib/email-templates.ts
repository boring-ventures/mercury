interface RegistrationConfirmationData {
  companyName: string;
  ruc: string;
  country: string;
  activity: string;
  contactName: string;
  contactPosition: string;
  email: string;
  phone: string;
  bankingDetails: string;
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
    <title>Solicitud de Registro Recibida - Mercury Platform</title>
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
            <h1 class="logo">MERCURY</h1>
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
                    <td class="detail-label">RUC:</td>
                    <td class="detail-value">${data.ruc}</td>
                </tr>
                <tr class="detail-row">
                    <td class="detail-label">País:</td>
                    <td class="detail-value">${data.country}</td>
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
                <tr class="detail-row">
                    <td class="detail-label">Detalles Bancarios:</td>
                    <td class="detail-value">${data.bankingDetails}</td>
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
                <a href="mailto:soporte@mercury.com" class="link">soporte@mercury.com</a>
                e incluya su ID de solicitud <strong>${data.requestId}</strong> en la consulta.
            </p>
            
            <a href="mailto:soporte@mercury.com" class="cta-button">
                Contactar Soporte
            </a>
        </div>

        <!-- Footer -->
        <div class="footer">
            <hr class="divider">
            <p class="footer-text">
                © 2025 Mercury Platform. Todos los derechos reservados.
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
