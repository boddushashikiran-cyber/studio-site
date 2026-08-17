import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest) {
  // Vercel sends this automatically for scheduled cron invocations —
  // verifying it stops anyone else from hitting this public URL and
  // wiping bookings on demand.
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: bookings, error } = await supabaseAdmin
    .from("bookings")
    .select("id, date, time_slot");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const now = new Date();
  const expired = (bookings ?? []).filter((b) => {
    const slotEnd = new Date(`${b.date}T${b.time_slot}:00`);
    return slotEnd.getTime() < now.getTime();
  });

  if (expired.length === 0) {
    return NextResponse.json({ deleted: 0 });
  }

  const expiredIds = expired.map((b) => b.id);

  const { error: deleteError } = await supabaseAdmin
    .from("bookings")
    .delete()
    .in("id", expiredIds);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  // Clean up the matching slot locks too, so the (now past) date/time
  // doesn't linger in that table indefinitely.
  for (const b of expired) {
    await supabaseAdmin
      .from("slot_locks")
      .delete()
      .eq("date", b.date)
      .eq("time_slot", b.time_slot);
  }

  return NextResponse.json({ deleted: expired.length });
}
