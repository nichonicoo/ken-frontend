import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const orderId = req.nextUrl.searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ error: "orderId required" }, { status: 400 });
    }

    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
    const consumerKey = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
    const consumerSecret = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;

    if (!wpUrl || !consumerKey || !consumerSecret) {
      return NextResponse.json({ error: "WooCommerce credentials not configured" }, { status: 500 });
    }

    const res = await fetch(
      `${wpUrl}/wp-json/wc/v3/orders/${orderId}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`,
      { cache: "no-store" }
    );

    const order = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: order.message || "Order not found" }, { status: res.status });
    }

    // Cari snap_token di meta_data
    const snapTokenMeta = order.meta_data?.find(
      (m: any) => m.key === "_midtrans_snap_token"
    );

    if (!snapTokenMeta?.value) {
      return NextResponse.json({ error: "Snap token not found for this order" }, { status: 404 });
    }

    return NextResponse.json({ snap_token: snapTokenMeta.value });
  } catch (e: any) {
    console.error("Get snap token error:", e);
    return NextResponse.json({ error: e.message || "Internal server error" }, { status: 500 });
  }
}
