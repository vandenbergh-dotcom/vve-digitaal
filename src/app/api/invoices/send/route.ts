import { NextResponse } from "next/server";

interface InvoiceEmailRequest {
  invoice: {
    invoice_number: string;
    member_name: string;
    period: string;
    items: { description: string; quantity: number; unit_price: number; total: number }[];
    total: number;
    issue_date: string;
    due_date: string;
  };
  to_email: string;
  vve_name: string;
  vve_iban?: string;
}

function generateInvoiceEmailHtml(
  invoice: InvoiceEmailRequest["invoice"],
  vveName: string,
  vveIban?: string
): string {
  const itemRows = invoice.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${item.description}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">&euro;${item.unit_price.toFixed(2)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">&euro;${item.total.toFixed(2)}</td>
      </tr>`
    )
    .join("");

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
  };

  return `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:#1e40af;color:white;padding:24px;border-radius:8px 8px 0 0;">
      <h1 style="margin:0;font-size:20px;">${vveName}</h1>
      <p style="margin:4px 0 0;font-size:14px;opacity:0.9;">Factuur ${invoice.invoice_number}</p>
    </div>
    <div style="background:white;padding:24px;border:1px solid #e5e7eb;border-top:none;">
      <div style="display:flex;justify-content:space-between;margin-bottom:24px;">
        <div>
          <p style="margin:0;font-size:14px;color:#6b7280;">Aan</p>
          <p style="margin:4px 0 0;font-weight:600;">${invoice.member_name}</p>
        </div>
        <div style="text-align:right;">
          <p style="margin:0;font-size:14px;color:#6b7280;">Factuurdatum: ${formatDate(invoice.issue_date)}</p>
          <p style="margin:4px 0 0;font-size:14px;color:#6b7280;">Vervaldatum: ${formatDate(invoice.due_date)}</p>
        </div>
      </div>

      <p style="font-size:14px;color:#374151;">Geachte ${invoice.member_name},</p>
      <p style="font-size:14px;color:#374151;">Hierbij ontvangt u de factuur voor de servicekosten van ${invoice.period}.</p>

      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <thead>
          <tr style="background:#f9fafb;">
            <th style="padding:8px 12px;text-align:left;font-size:13px;color:#6b7280;border-bottom:2px solid #e5e7eb;">Omschrijving</th>
            <th style="padding:8px 12px;text-align:center;font-size:13px;color:#6b7280;border-bottom:2px solid #e5e7eb;">Aantal</th>
            <th style="padding:8px 12px;text-align:right;font-size:13px;color:#6b7280;border-bottom:2px solid #e5e7eb;">Prijs</th>
            <th style="padding:8px 12px;text-align:right;font-size:13px;color:#6b7280;border-bottom:2px solid #e5e7eb;">Totaal</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding:12px;text-align:right;font-weight:700;font-size:15px;">Totaal</td>
            <td style="padding:12px;text-align:right;font-weight:700;font-size:15px;">&euro;${invoice.total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="margin:0;font-weight:600;font-size:14px;color:#1e40af;">Betaalinstructies</p>
        <p style="margin:8px 0 0;font-size:14px;color:#374151;">
          Gelieve het bedrag van <strong>&euro;${invoice.total.toFixed(2)}</strong> over te maken naar:<br>
          ${vveIban ? `IBAN: <strong>${vveIban}</strong><br>` : ""}
          t.n.v. <strong>${vveName}</strong><br>
          o.v.v. <strong>${invoice.invoice_number}</strong>
        </p>
        <p style="margin:8px 0 0;font-size:13px;color:#6b7280;">De uiterste betaaldatum is ${formatDate(invoice.due_date)}.</p>
      </div>

      <p style="font-size:14px;color:#374151;">Met vriendelijke groet,<br>Het bestuur van ${vveName}</p>
    </div>
    <div style="padding:16px;text-align:center;font-size:12px;color:#9ca3af;border-radius:0 0 8px 8px;">
      <p style="margin:0;">Verzonden via VvE Digitaal</p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(request: Request) {
  try {
    const body: InvoiceEmailRequest = await request.json();
    const { invoice, to_email, vve_name, vve_iban } = body;

    if (!invoice || !to_email) {
      return NextResponse.json(
        { error: "Factuurgegevens en e-mailadres zijn verplicht." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: true,
        simulated: true,
        message: `Factuur ${invoice.invoice_number} zou verzonden worden naar ${to_email}. Configureer RESEND_API_KEY om e-mails daadwerkelijk te versturen.`,
      });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const html = generateInvoiceEmailHtml(invoice, vve_name, vve_iban);

    const { data, error } = await resend.emails.send({
      from: `${vve_name} <facturen@vveapp.com>`,
      to: to_email,
      subject: `Factuur ${invoice.invoice_number} - ${vve_name}`,
      html,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, email_id: data?.id });
  } catch (err) {
    console.error("Invoice email error:", err);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het verzenden." },
      { status: 500 }
    );
  }
}
