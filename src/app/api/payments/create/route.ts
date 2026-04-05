import { NextResponse } from "next/server";

interface CreatePaymentRequest {
  invoice_id: string;
  invoice_number: string;
  amount: number;
  description: string;
  member_name: string;
  redirect_url: string;
}

export async function POST(request: Request) {
  try {
    const body: CreatePaymentRequest = await request.json();
    const { invoice_id, invoice_number, amount, description, member_name, redirect_url } = body;

    if (!invoice_id || !amount || !redirect_url) {
      return NextResponse.json(
        { error: "Factuur-ID, bedrag en redirect URL zijn verplicht." },
        { status: 400 }
      );
    }

    const apiKey = process.env.MOLLIE_API_KEY;

    if (!apiKey) {
      // Simulated payment for demo
      return NextResponse.json({
        success: true,
        simulated: true,
        checkout_url: `${redirect_url}?payment=simulated&invoice=${invoice_id}`,
        message: `Betaallink voor ${invoice_number} zou aangemaakt worden. Configureer MOLLIE_API_KEY voor iDEAL-betalingen.`,
      });
    }

    const { createMollieClient } = await import("@mollie/api-client");
    const mollie = createMollieClient({ apiKey });

    const payment = await mollie.payments.create({
      amount: {
        currency: "EUR",
        value: amount.toFixed(2),
      },
      description: `${invoice_number} - ${description}`,
      redirectUrl: `${redirect_url}?invoice=${invoice_id}`,
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://vvedigitaal.nl"}/api/payments/webhook`,
      metadata: {
        invoice_id,
        invoice_number,
        member_name,
      },
    });

    return NextResponse.json({
      success: true,
      checkout_url: payment.getCheckoutUrl(),
      payment_id: payment.id,
    });
  } catch (err) {
    console.error("Payment creation error:", err);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het aanmaken van de betaling." },
      { status: 500 }
    );
  }
}
