// app/api/midtrans-token/route.ts
// Ambil snap_token dari WooCommerce order meta

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("order_id");
  if (!orderId) return NextResponse.json({ error: "order_id required" }, { status: 400 });

  // Hit WooCommerce REST API untuk get order meta
  const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const consumerKey = process.env.WC_CONSUMER_KEY;
  const consumerSecret = process.env.WC_CONSUMER_SECRET;

  try {
    const res = await fetch(
      `${wpUrl}/wp-json/wc/v3/orders/${orderId}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`,
      { cache: "no-store" }
    );
    const order = await res.json();

    // Midtrans plugin simpan snap_token di meta_data
    const snapTokenMeta = order.meta_data?.find(
      (m: any) => m.key === "_midtrans_snap_token" || m.key === "snap_token"
    );

    if (!snapTokenMeta?.value) {
      return NextResponse.json({ error: "Snap token not found" }, { status: 404 });
    }

    return NextResponse.json({ snap_token: snapTokenMeta.value });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}