import "server-only";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.warn(
    "RESEND_API_KEY is missing. Booking confirmation emails will be skipped until it's set in .env.local."
  );
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Resend's shared testing address works with zero setup, but can only
// send to the email you signed up to Resend with, and looks unpolished
// in an inbox. Verify your own domain in Resend and set BOOKING_EMAIL_FROM
// once you're ready for real bookings.
const FROM_ADDRESS = process.env.BOOKING_EMAIL_FROM || "onboarding@resend.dev";

const SERVICE_LABELS: Record<string, string> = {
  "web-design": "Web Design",
  development: "Development",
  branding: "Branding",
  "3d-animation": "3D / Animation",
};

export async function sendBookingConfirmationEmail({
  to,
  name,
  serviceType,
  date,
  timeSlot,
  privateCode,
  siteUrl,
}: {
  to: string;
  name: string;
  serviceType: string;
  date: string;
  timeSlot: string;
  privateCode: string;
  siteUrl: string;
}) {
  if (!resend) {
    console.warn("Skipping confirmation email — RESEND_API_KEY not configured.");
    return { skipped: true as const };
  }

  const prettyDate = new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const serviceLabel = SERVICE_LABELS[serviceType] || serviceType;
  const statusUrl = `${siteUrl}/booking-status/${privateCode}`;

  try {
    const { data, error } = await resend.emails.send({
      from: `Kiran Studios <${FROM_ADDRESS}>`,
      to,
      subject: `Your call is booked — ${prettyDate} at ${timeSlot}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #0F1216;">
          <p style="font-size: 12px; letter-spacing: 0.1em; color: #E8A33D; text-transform: uppercase; margin: 0 0 16px;">
            Kiran Studios
          </p>
          <h1 style="font-size: 22px; margin: 0 0 16px;">Hi ${name}, your call is booked.</h1>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 8px;">
            <strong>${serviceLabel}</strong><br />
            ${prettyDate} at ${timeSlot}
          </p>
          <p style="font-size: 15px; line-height: 1.6; margin: 24px 0;">
            You can check your booking's status anytime using your private link below —
            no account or password needed.
          </p>
          <a href="${statusUrl}" style="display: inline-block; padding: 12px 20px; background: #E8A33D; color: #0F1216; text-decoration: none; font-weight: 600; border-radius: 2px;">
            View my booking
          </a>
          <p style="font-size: 12px; color: #6b7280; margin-top: 32px;">
            This link is private to you — don't share it. If you didn't book this call, you can ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend failed to send booking confirmation:", error);
      return { skipped: false as const, error };
    }
    return { skipped: false as const, data };
  } catch (err) {
    // A failed email should never fail the booking itself — the booking
    // is already saved by the time this runs. Log and move on.
    console.error("Unexpected error sending booking confirmation email:", err);
    return { skipped: false as const, error: err };
  }
}
