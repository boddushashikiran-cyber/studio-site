import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendBookingConfirmationEmail } from "@/lib/resend";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (
    !body ||
    typeof body.name !== "string" ||
    typeof body.email !== "string" ||
    typeof body.service_type !== "string" ||
    typeof body.date !== "string" ||
    typeof body.time_slot !== "string"
  ) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const { data: booking, error: insertError } = await supabaseAdmin
    .from("bookings")
    .insert({
      name: body.name.trim(),
      email: body.email.trim(),
      service_type: body.service_type,
      date: body.date,
      time_slot: body.time_slot,
      message: typeof body.message === "string" ? body.message.trim() || null : null,
    })
    .select("id, private_code, date, time_slot")
    .single();

  if (insertError) {
    // Postgres unique-violation code — someone booked this exact slot
    // between the visitor picking it and submitting the form.
    if (insertError.code === "23505") {
      return NextResponse.json({ error: "slot_taken" }, { status: 409 });
    }
    console.error("Failed to create booking:", insertError.message);
    return NextResponse.json({ error: "unknown" }, { status: 500 });
  }

  // A failed email should never fail the booking response — the booking
  // itself already succeeded and is saved. We just log and move on.
  const emailResult = await sendBookingConfirmationEmail({
    to: body.email.trim(),
    name: body.name.trim(),
    serviceType: body.service_type,
    date: body.date,
    timeSlot: body.time_slot,
    privateCode: booking.private_code,
    siteUrl: request.nextUrl.origin,
  });

  return NextResponse.json({
    ok: true,
    privateCode: booking.private_code,
    emailSent: !emailResult.skipped && !("error" in emailResult),
  });
}
