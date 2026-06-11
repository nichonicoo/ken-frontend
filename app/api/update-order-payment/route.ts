import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { orderId, transactionId } = await req.json();

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
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "processing",
          transaction_id: transactionId || "",
          payment_method: "midtrans",
          payment_method_title: "Midtrans",
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.message || "WooCommerce update failed", data }, { status: res.status });
    }

    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    console.error("Update order payment error:", e);
    return NextResponse.json({ error: e.message || "Internal server error" }, { status: 500 });
  }
}
