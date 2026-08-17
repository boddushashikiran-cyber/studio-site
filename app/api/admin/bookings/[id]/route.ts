import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getExpectedAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Route Handlers aren't covered by middleware's matcher unless it's
  // /admin/:path* — this one lives under /api, so we check the session
  // cookie again here rather than relying on the page-level gate.
  const expectedToken = await getExpectedAdminToken();
  const cookieToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!expectedToken || cookieToken !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data: booking } = await supabaseAdmin
    .from("bookings")
    .select("date, time_slot")
    .eq("id", id)
    .single();

  const { error } = await supabaseAdmin.from("bookings").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Free up the slot too, so someone else can book it.
  if (booking) {
    await supabaseAdmin
      .from("slot_locks")
      .delete()
      .eq("date", booking.date)
      .eq("time_slot", booking.time_slot);
  }

  return NextResponse.json({ ok: true });
}
