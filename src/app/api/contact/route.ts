import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email and message are required" }, { status: 400 });
    }

    await resend.emails.send({
      from: "NovaClub Contact <onboarding@resend.dev>",
      to: "ardalescai@gmail.com",
      replyTo: email,
      subject: `[NovaClub Contact] ${subject || "General enquiry"} — ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3865FF;">New contact message</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666;">Name</td><td style="padding: 8px 0;"><strong>${name}</strong></td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><strong>${email}</strong></td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Subject</td><td style="padding: 8px 0;"><strong>${subject || "General enquiry"}</strong></td></tr>
          </table>
          <hr style="margin: 16px 0; border-color: #eee;" />
          <p style="color: #333; white-space: pre-line;">${message}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}