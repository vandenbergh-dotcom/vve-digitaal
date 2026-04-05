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
    const metadata = payment.metadata as { invoice_id?: string } | null;

    if (payment.status === "paid" && metadata?.invoice_id) {
      // Update invoice status in Supabase
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (supabaseUrl && serviceKey) {
        await fetch(`${supabaseUrl}/rest/v1/invoices?id=eq.${metadata.invoice_id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            status: "paid",
            paid_date: new Date().toISOString().split("T")[0],
            mollie_payment_id: paymentId,
          }),
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
