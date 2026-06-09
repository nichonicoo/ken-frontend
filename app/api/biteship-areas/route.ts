// // app/api/biteship-areas/route.ts

// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   const input = req.nextUrl.searchParams.get("input");
//   if (!input || input.length < 2) {
//     return NextResponse.json({ areas: [] });
//   }

//   const apiKey = process.env.BITESHIP_API_KEY;
//   if (!apiKey) {
//     return NextResponse.json({ error: "Biteship API key not configured" }, { status: 500 });
//   }

//   try {
//     const res = await fetch(
//       `https://api.biteship.com/v1/maps/areas?countries=ID&input=${encodeURIComponent(input)}&type=single`,
//       {
//         headers: { Authorization: apiKey },
//         cache: "no-store",
//       }
//     );

//     const data = await res.json();

//     if (!res.ok) {
//       return NextResponse.json({ error: data.error || "Biteship error" }, { status: res.status });
//     }

//     // Format hasil untuk frontend
//     const areas = (data.areas || []).map((a: any) => ({
//       id: a.id,
//       name: a.name,
//       // Nama lengkap: Kecamatan, Kota, Provinsi
//       label: [a.administrative_division_level_4_name, a.administrative_division_level_3_name, a.administrative_division_level_2_name, a.administrative_division_level_1_name]
//         .filter(Boolean)
//         .join(", "),
//       district: a.administrative_division_level_3_name, // Kecamatan
//       city: a.administrative_division_level_2_name,     // Kota/Kabupaten
//       province: a.administrative_division_level_1_name, // Provinsi
//       postalCode: a.postal_code,
//       countryCode: a.country_code,
//     }));

//     return NextResponse.json({ areas });
//   } catch (e: any) {
//     return NextResponse.json({ error: e.message }, { status: 500 });
//   }
// }

// app/api/biteship-areas/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const input = req.nextUrl.searchParams.get("input");
  if (!input || input.length < 2) {
    return NextResponse.json({ areas: [] });
  }

  const apiKey = process.env.BITESHIP_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Biteship API key not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.biteship.com/v1/maps/areas?countries=ID&input=${encodeURIComponent(input)}&type=single`,
      {
        headers: { Authorization: apiKey },
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.error || "Biteship error" }, { status: res.status });
    }

    // Format hasil untuk frontend
    const areas = (data.areas || []).map((a: any) => ({
      id: a.id,
      name: a.name,
      // Nama lengkap: Kecamatan, Kota, Provinsi
      label: [a.administrative_division_level_4_name, a.administrative_division_level_3_name, a.administrative_division_level_2_name, a.administrative_division_level_1_name]
        .filter(Boolean)
        .join(", "),
      district: a.administrative_division_level_3_name, // Kecamatan
      city: a.administrative_division_level_2_name,     // Kota/Kabupaten
      province: a.administrative_division_level_1_name, // Provinsi
      postalCode: String(a.postal_code),
      countryCode: a.country_code,
    }));

    return NextResponse.json({ areas });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}