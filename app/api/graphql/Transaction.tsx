// const API_URL = "http://ken-web.local/graphql";

// export async function addToCart(productId: number, quantity: number = 1) {
//   const query = `
//     mutation AddToCart($productId: Int!, $quantity: Int!) {
//       addToCart(input: {
//         productId: $productId
//         quantity: $quantity
//       }) {
//         cart {
//           contents {
//             nodes {
//               quantity
//               product {
//                 node {
//                   id
//                   name
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   `;

//   const res = await fetch(API_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     credentials: "include", // 🔥 WAJIB (biar cookie jalan)
//     body: JSON.stringify({
//       query,
//       variables: { productId, quantity },
//     }),
//   });

//   const json = await res.json();

//   if (json.errors) {
//     console.error(json.errors);
//     throw new Error("Add to cart failed");
//   }
//  console.log("🔥 ADD TO CART GRAPHQL RESULT DETAIL PRODUCT:", JSON.stringify(json, null, 2));
//   return json.data.addToCart.cart;
// }

// export async function getCart() {
//   const query = `
//     query GetCart {
//       cart {
//         contents {
//           nodes {
//             key
//             quantity
//             product {
//               node {
//                 id
//                 name
//                 slug
//                 ... on SimpleProduct {
//                   price(format: RAW)
//                   image {
//                     sourceUrl
//                   }
//                 }
//               }
//             }
//           }
//         }
//         subtotal
//         total
//       }
//     }
//   `;

//   const res = await fetch(API_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     credentials: "include", // 🔥 WAJIB
//     body: JSON.stringify({ query }),
//   });

//   const json = await res.json();
//     console.log("🔥 GET CART GRAPHQL RESULT DETAIL PRODUCT:", JSON.stringify(json, null, 2));
//   return json.data.cart;
// }

// export async function updateCartItem(key: string, quantity: number) {
//   const mutation = `
//     mutation UpdateQty($items: [CartItemQuantityInput!]!) {
//       updateItemQuantities(input: {
//         items: $items
//       }) {
//         cart {
//           total
//         }
//       }
//     }
//   `;

//   const res = await fetch("http://ken-web.local/graphql", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     credentials: "include",
//     body: JSON.stringify({
//       query: mutation,
//       variables: {
//         items: [{ key, quantity }],
//       },
//     }),
//   });

//   const json = await res.json();
//   return json.data;
// }

// export async function removeFromCart(keys: string[]) {
//   const mutation = `
//     mutation RemoveItem($keys: [ID!]!) {
//       removeItemsFromCart(input: {
//         keys: $keys
//       }) {
//         cart {
//           total
//         }
//       }
//     }
//   `;

//   const res = await fetch("http://ken-web.local/graphql", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     credentials: "include", // 🔥 penting
//     body: JSON.stringify({
//       query: mutation,
//       variables: { keys },
//     }),
//   });

//   const json = await res.json();
//   return json.data;
// }

// Proxy via Next.js API route — browser tidak perlu resolve ken-web.local langsung
// Taruh route.ts di: app/api/graphql/route.ts
const API_URL = "/api/wp";

// ── Session token manager ─────────────────────────────────────────
const SESSION_KEY = "woo_session_token";

function getSessionToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

function saveSessionToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, token);
}

// ── Base fetch wrapper ────────────────────────────────────────────
async function gqlFetch(body: object) {
  const token = getSessionToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["woocommerce-session"] = `Session ${token}`;
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  // Simpan token baru dari response
  const newToken = res.headers.get("woocommerce-session");
  if (newToken) {
    saveSessionToken(newToken);
  }

  return res.json();
}

// ── addToCart ─────────────────────────────────────────────────────
export async function addToCart(productId: number, quantity: number = 1) {
  const query = `
    mutation AddToCart($productId: Int!, $quantity: Int!) {
      addToCart(input: {
        productId: $productId
        quantity: $quantity
      }) {
        cart {
          contents {
            nodes {
              key
              quantity
              product {
                node {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
  `;

  const json = await gqlFetch({ query, variables: { productId, quantity } });

  if (json.errors) {
    console.error("addToCart errors:", json.errors);
    throw new Error("Add to cart failed");
  }

  console.log("🛒 addToCart result:", JSON.stringify(json, null, 2));
  return json.data.addToCart.cart;
}

// ── getCart ───────────────────────────────────────────────────────
export async function getCart() {
  const query = `
    query GetCart {
      cart {
        contents {
          nodes {
            key
            quantity
            product {
              node {
                id
                name
                slug
                ... on SimpleProduct {
                  price(format: RAW)
                  image {
                    sourceUrl
                  }
                }
              }
            }
          }
        }
        subtotal
        total
        appliedCoupons {
          code
          discountAmount
        }
      }
    }
  `;

  const json = await gqlFetch({ query });

  console.log("🛒 getCart result:", JSON.stringify(json, null, 2));
  return json.data.cart;
}

// ── updateCartItem ────────────────────────────────────────────────
export async function updateCartItem(key: string, quantity: number) {
  const mutation = `
    mutation UpdateQty($items: [CartItemQuantityInput!]!) {
      updateItemQuantities(input: {
        items: $items
      }) {
        cart {
          total
        }
      }
    }
  `;

  const json = await gqlFetch({
    query: mutation,
    variables: { items: [{ key, quantity }] },
  });

  return json.data;
}

// ── removeFromCart ────────────────────────────────────────────────
export async function removeFromCart(keys: string[]) {
  const mutation = `
    mutation RemoveItem($keys: [ID!]!) {
      removeItemsFromCart(input: {
        keys: $keys
      }) {
        cart {
          total
        }
      }
    }
  `;

  const json = await gqlFetch({ query: mutation, variables: { keys } });
  return json.data;
}

export async function applyCoupon(code: string) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        mutation ApplyCoupon {
          applyCoupon(input: { code: "${code}" }) {
            cart {
              subtotal
              total
              discountTotal
              appliedCoupons {
                code
                discountAmount
              }
            }
          }
        }
      `,
    }),
  });

  const json = await res.json();
  return json.data.applyCoupon.cart;
}