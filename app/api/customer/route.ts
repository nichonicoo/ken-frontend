import { NextRequest, NextResponse } from "next/server";

const WP_GRAPHQL = process.env.NEXT_PUBLIC_WORDPRESS_URL + "/graphql";

const CUSTOMER_QUERY = `
  query GetCustomer {
    customer {
      databaseId
      firstName
      lastName
      email
      billing {
        phone
        address1
        address2
        city
        postcode
        state
        country
      }
      shipping {
        address1
        address2
        city
        postcode
        state
        country
      }
    }
  }
`;

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Authorization required" }, { status: 401 });
    }

    const wpHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": authHeader,
    };

    const res = await fetch(WP_GRAPHQL, {
      method: "POST",
      headers: wpHeaders,
      body: JSON.stringify({ query: CUSTOMER_QUERY }),
    });

    const data = await res.json();

    if (data.errors) {
      return NextResponse.json({ error: data.errors[0]?.message || "GraphQL error", data }, { status: 500 });
    }

    return NextResponse.json({ customer: data.data?.customer || null });
  } catch (e: any) {
    console.error("Customer API error:", e);
    return NextResponse.json({ error: e.message || "Internal server error" }, { status: 500 });
  }
}
