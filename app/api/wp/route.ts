import { NextRequest, NextResponse } from "next/server";

const WP_GRAPHQL = process.env.NEXT_PUBLIC_WORDPRESS_URL + "/graphql";;

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Forward woocommerce-session header dari browser ke WordPress
  const sessionToken = req.headers.get("woocommerce-session");

  const wpHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (sessionToken) {
    wpHeaders["woocommerce-session"] = sessionToken;
  }

  const wpRes = await fetch(WP_GRAPHQL, {
    method: "POST",
    headers: wpHeaders,
    body: JSON.stringify(body),
  });

  const data = await wpRes.json();

  // Forward woocommerce-session header dari WordPress ke browser
  const newSessionToken = wpRes.headers.get("woocommerce-session");

  const response = NextResponse.json(data);

  if (newSessionToken) {
    response.headers.set("woocommerce-session", newSessionToken);
    // Expose header ke browser
    response.headers.set("Access-Control-Expose-Headers", "woocommerce-session");
  }

  return response;
}