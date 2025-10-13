import { NextRequest, NextResponse } from "next/server";
import { renderToStream, Document } from "@react-pdf/renderer";
import { QuotationPDFDocument } from "@/components/draft-quotation/quotation-pdf-document";
import React from "react";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      date,
      company,
      client,
      amountToSend,
      currency,
      exchangeRate,
      swiftFee,
      correspondentFee,
      interestRate,
      totals,
    } = body;

    // Validate required fields
    if (!date || !company || !client || !amountToSend || !currency || !totals) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate PDF
    const pdfDocument = React.createElement(
      Document,
      {},
      React.createElement(QuotationPDFDocument, {
        date,
        company,
        client,
        amountToSend,
        currency,
        exchangeRate,
        swiftFee,
        correspondentFee,
        interestRate,
        totals,
      })
    );

    const stream = await renderToStream(pdfDocument);

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Cotizacion_Borrador_${new Date().toISOString().split("T")[0]}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
