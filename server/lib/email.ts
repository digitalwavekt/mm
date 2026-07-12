import { Resend } from "resend";
import { env } from "./env";

let client: Resend | null = null;

function getClient(): Resend | null {
  if (!env.resendApiKey) return null;
  if (!client) client = new Resend(env.resendApiKey);
  return client;
}

/**
 * Notify the business owner when a new contact lead comes in.
 * Silently no-ops (with a console warning) if RESEND_API_KEY or
 * NOTIFY_EMAIL isn't configured, so the contact form still works
 * without email set up.
 */
export async function sendContactLeadNotification(lead: {
  name: string;
  email?: string | null;
  phone?: string | null;
  serviceInterest?: string | null;
  message?: string | null;
}) {
  const resend = getClient();
  if (!resend || !env.notifyEmail) {
    console.warn(
      "[email] RESEND_API_KEY or NOTIFY_EMAIL not set — skipping contact lead email notification.",
    );
    return;
  }

  try {
    await resend.emails.send({
      from: env.emailFrom,
      to: env.notifyEmail,
      replyTo: lead.email || undefined,
      subject: `New enquiry from ${lead.name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>New contact form submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
          ${lead.email ? `<p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>` : ""}
          ${lead.phone ? `<p><strong>Phone:</strong> ${escapeHtml(lead.phone)}</p>` : ""}
          ${lead.serviceInterest ? `<p><strong>Interested in:</strong> ${escapeHtml(lead.serviceInterest)}</p>` : ""}
          ${lead.message ? `<p><strong>Message:</strong><br/>${escapeHtml(lead.message)}</p>` : ""}
        </div>
      `,
    });
  } catch (err) {
    // Never let an email failure break the contact form submission.
    console.error("[email] Failed to send contact lead notification:", err);
  }
}

/**
 * Send a welcome/confirmation email to a new newsletter subscriber.
 */
export async function sendNewsletterWelcome(email: string, siteName = "Mamta Makeover") {
  const resend = getClient();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping newsletter welcome email.");
    return;
  }

  try {
    await resend.emails.send({
      from: env.emailFrom,
      to: email,
      subject: `Welcome to ${siteName}!`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>Thanks for subscribing!</h2>
          <p>You'll be the first to hear about our latest offers, updates and beauty tips from ${escapeHtml(siteName)}.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[email] Failed to send newsletter welcome email:", err);
  }
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
