// app/api/midtrans-token/route.ts
// Generate Midtrans Snap token atau ambil dari WooCommerce order meta

import { NextRequest, NextResponse } from "next/server";

const MIDTRANS_API_URL = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY?.startsWith("SB-")
  ? "https://app.sandbox.midtrans.com/snap/v1/transactions"
  : "https://app.midtrans.com/snap/v1/transactions";

// POST — Generate Snap token via Midtrans API langsung
export async function POST(req: NextRequest) {
  try {
    const { orderId, grossAmount, firstName, lastName, email, phone } = await req.json();

    if (!orderId || !grossAmount) {
      return NextResponse.json({ error: "orderId and grossAmount required" }, { status: 400 });
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      return NextResponse.json({ error: "MIDTRANS_SERVER_KEY not configured" }, { status: 500 });
    }

    const body = {
      transaction_details: {
        order_id: String(orderId),
        gross_amount: Math.round(grossAmount),
      },
      customer_details: {
        first_name: firstName || "",
        last_name: lastName || "",
        email: email || "",
        phone: phone || "",
      },
    };

    const res = await fetch(MIDTRANS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Basic " + Buffer.from(serverKey + ":").toString("base64"),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok || data.error_messages) {
      return NextResponse.json(
        { error: data.error_messages?.[0] || "Midtrans request failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ snap_token: data.token });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Internal server error" }, { status: 500 });
  }
}

// GET — Ambil snap_token dari WooCommerce order meta (fallback)
export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("order_id");
  if (!orderId) return NextResponse.json({ error: "order_id required" }, { status: 400 });

  const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const consumerKey = process.env.WC_CONSUMER_KEY;
  const consumerSecret = process.env.WC_CONSUMER_SECRET;

  try {
    const res = await fetch(
      `${wpUrl}/wp-json/wc/v3/orders/${orderId}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`,
      { cache: "no-store" }
    );
    const order = await res.json();

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