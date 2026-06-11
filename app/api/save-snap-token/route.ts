import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { orderId, snapToken } = await req.json();

    if (!orderId || !snapToken) {
      return NextResponse.json({ error: "orderId and snapToken required" }, { status: 400 });
    }

    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
    const consumerKey = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
    const consumerSecret = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;

    if (!wpUrl || !consumerKey || !consumerSecret) {
      return NextResponse.json({ error: "WooCommerce credentials not configured" }, { status: 500 });
    }

    // Simpan snap_token ke order meta_data
    const res = await fetch(
      `${wpUrl}/wp-json/wc/v3/orders/${orderId}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meta_data: [
            {
              key: "_midtrans_snap_token",
              value: snapToken,
            },
          ],
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.message || "Failed to save snap token" }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Save snap token error:", e);
    return NextResponse.json({ error: e.message || "Internal server error" }, { status: 500 });
  }
}
