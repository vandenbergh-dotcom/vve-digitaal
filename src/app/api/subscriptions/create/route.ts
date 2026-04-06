import { NextResponse } from "next/server";

const PLANS: Record<string, { amount: string; description: string; interval: string }> = {
  plus: { amount: "19.00", description: "VvE App - Plus abonnement", interval: "1 month" },
  professional: { amount: "49.00", description: "VvE App - Professional abonnement", interval: "1 month" },
};

export async function POST(request: Request) {
  try {
    const { plan, vve_id, vve_name, customer_email } = await request.json();

    if (!plan || !PLANS[plan]) {
      return NextResponse.json({ error: "Ongeldig abonnement." }, { status: 400 });
    }

    const apiKey = process.env.MOLLIE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: true,
        simulated: true,
        message: `Abonnement ${plan} zou aangemaakt worden. Configureer MOLLIE_API_KEY.`,
      });
    }

    const { createMollieClient } = await import("@mollie/api-client");
    const mollie = createMollieClient({ apiKey });

    const planConfig = PLANS[plan];
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vveapp.com";

    // Create a Mollie customer first
    const customer = await mollie.customers.create({
      name: vve_name || "VvE",
      email: customer_email,
      metadata: { vve_id, plan },
    });

    // Create first payment
    const payment = await mollie.payments.create({
      amount: { currency: "EUR", value: planConfig.amount },
      description: planConfig.description,
      redirectUrl: `${appUrl}/dashboard/abonnement?status=success`,
      webhookUrl: `${appUrl}/api/subscriptions/webhook`,
      customerId: customer.id,
      metadata: { vve_id, plan, customer_id: customer.id },
    });

    return NextResponse.json({
      success: true,
      checkout_url: payment.getCheckoutUrl(),
      payment_id: payment.id,
      customer_id: customer.id,
    });
  } catch (err) {
    console.error("Subscription creation error:", err);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het aanmaken van het abonnement." },
      { status: 500 }
    );
  }
}
