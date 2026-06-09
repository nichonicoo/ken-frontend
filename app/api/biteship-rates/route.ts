// app/api/biteship-rates/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { destinationPostalCode, items } = body;

    if (!destinationPostalCode || !items?.length) {
      return NextResponse.json({ error: "destinationPostalCode and items required" }, { status: 400 });
    }

    const apiKey = process.env.BITESHIP_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Biteship API key not configured" }, { status: 500 });
    }

    const originPostalCode = process.env.BITESHIP_ORIGIN_POSTAL_CODE;
    if (!originPostalCode) {
      return NextResponse.json({ error: "Origin postal code not configured" }, { status: 500 });
    }

    const res = await fetch("https://api.biteship.com/v1/rates/couriers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${apiKey}`,
      },
      body: JSON.stringify({
        origin_postal_code: parseInt(originPostalCode),
        destination_postal_code: parseInt(destinationPostalCode),
        // Semua kurir populer Indonesia
        couriers: "jne,jnt,sicepat,anteraja,tiki",
        items: items.map((item: any) => ({
          name: item.name,
          value: item.value || 0,
          quantity: item.quantity || 1,
          weight: item.weight || 1000, // default 1kg dalam gram
        })),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Biteship error:", data);
      return NextResponse.json({ error: data.error || "Biteship error", detail: data }, { status: res.status });
    }

    // Format rates untuk frontend
    const rates = data.pricing?.map((p: any) => ({
      id: `${p.courier_code}_${p.courier_service_code}`,
      courierCode: p.courier_code,
      courierName: p.courier_name,
      serviceCode: p.courier_service_code,
      serviceName: p.courier_service_name,
      description: p.description,
      duration: p.duration,
      price: p.price,
      type: p.type,
    })) || [];

    return NextResponse.json({ rates });
  } catch (e: any) {
    console.error("Biteship rates error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}