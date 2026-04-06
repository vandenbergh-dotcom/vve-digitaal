import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const params = new URLSearchParams(body);
    const paymentId = params.get("id");

    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID missing" }, { status: 400 });
    }

    const apiKey = process.env.MOLLIE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ received: true, simulated: true });
    }

    const { createMollieClient } = await import("@mollie/api-client");
    const mollie = createMollieClient({ apiKey });

    const payment = await mollie.payments.get(paymentId);
    const metadata = payment.metadata as {
      vve_id?: string;
      plan?: string;
      customer_id?: string;
    } | null;

    if (payment.status === "paid" && metadata?.vve_id) {
      // Update VvE subscription status in Supabase
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (supabaseUrl && serviceKey) {
        await fetch(`${supabaseUrl}/rest/v1/vves?id=eq.${metadata.vve_id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            subscription_plan: metadata.plan,
            subscription_status: "active",
            mollie_customer_id: metadata.customer_id,
            subscription_started_at: new Date().toISOString(),
          }),
        });
      }

      // If first payment succeeded, create the recurring subscription
      if (payment.sequenceType === "first" && metadata.customer_id && metadata.plan) {
        const planAmounts: Record<string, string> = { plus: "19.00", professional: "49.00" };
        const amount = planAmounts[metadata.plan] || "19.00";

        try {
          await mollie.customerSubscriptions.create({
            customerId: metadata.customer_id,
            amount: { currency: "EUR", value: amount },
            interval: "1 month",
            description: `VvE App - ${metadata.plan} abonnement`,
            webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://vveapp.com"}/api/subscriptions/webhook`,
          });
        } catch (subErr) {
          console.error("Failed to create recurring subscription:", subErr);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Subscription webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
