import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Use in server components / route handlers
export async function getSession() {
  return getServerSession(authOptions);
}

// Authenticated GraphQL fetch — attaches WP authToken if available
export async function gqlFetch<T = any>(
  query: string,
  variables?: Record<string, any>,
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(
    process.env.NEXT_PUBLIC_WORDPRESS_URL + "/graphql",
    {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error(`GraphQL fetch failed: ${res.status}`);

  const json = await res.json();

  if (json.errors) {
    console.error("GraphQL errors:", json.errors);
    throw new Error(json.errors[0]?.message || "GraphQL error");
  }

  return json.data;
}

// Server-side: get authenticated gqlFetch automatically
export async function authedGql<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  const session = await getSession();
  return gqlFetch<T>(query, variables, session?.authToken);
}