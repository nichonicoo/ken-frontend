// const API_URL = "/api/wp";

// async function gqlFetch(body: object) {
//   const token = typeof window !== "undefined" ? localStorage.getItem("woo_session_token") : null;
//   const headers: Record<string, string> = { "Content-Type": "application/json" };
//   if (token) headers["woocommerce-session"] = `Session ${token}`;

//   const res = await fetch(API_URL, {
//     method: "POST",
//     headers,
//     body: JSON.stringify(body),
//   });

//   const newToken = res.headers.get("woocommerce-session");
//   if (newToken && typeof window !== "undefined") localStorage.setItem("woo_session_token", newToken);

//   return res.json();
// }

// // ─── Get available shipping methods (KiriminAja via WooCommerce) ──────────────
// const SHIPPING_QUERY = `
//   query GetShippingMethods(
//     $country: CountriesEnum!
//     $state: String!
//     $city: String!
//     $postcode: String!
//   ) {
//     cart {
//       availableShippingMethods(country: $country, state: $state, city: $city, postcode: $postcode) {
//         packageDetails
//         rates {
//           id
//           instanceId
//           methodId
//           label
//           cost
//         }
//       }
//     }
//   }
// `;

// export async function getShippingMethods(input: {
//   country: string;
//   state: string;
//   city: string;
//   postcode: string;
// }) {
//   const json = await gqlFetch({ query: SHIPPING_QUERY, variables: input });
//   return json.data?.cart?.availableShippingMethods?.[0]?.rates || [];
// }

// // ─── Update shipping method ───────────────────────────────────────────────────
// const UPDATE_SHIPPING_MUTATION = `
//   mutation UpdateShipping($shippingMethod: [String]) {
//     updateShippingMethod(input: { shippingMethods: $shippingMethod }) {
//       cart {
//         total
//         shippingTotal
//       }
//     }
//   }
// `;

// export async function updateShippingMethod(shippingMethod: string) {
//   const json = await gqlFetch({
//     query: UPDATE_SHIPPING_MUTATION,
//     variables: { shippingMethod: [shippingMethod] },
//   });
//   return json.data?.updateShippingMethod?.cart;
// }

// // ─── Checkout + create order ──────────────────────────────────────────────────
// const CHECKOUT_MUTATION = `
//   mutation Checkout($input: CheckoutInput!) {
//     checkout(input: $input) {
//       order {
//         databaseId
//         orderNumber
//         total
//         status
//       }
//       result
//       redirect
//     }
//   }
// `;

// export type CheckoutInput = {
//   billing: {
//     firstName: string;
//     lastName: string;
//     email: string;
//     phone: string;
//     address1: string;
//     address2?: string;
//     city: string;
//     state: string;
//     postcode: string;
//     country: string;
//   };
//   shipping?: {
//     firstName: string;
//     lastName: string;
//     address1: string;
//     address2?: string;
//     city: string;
//     state: string;
//     postcode: string;
//     country: string;
//   };
//   paymentMethod: string;
//   shippingMethod?: string[];
//   shipToDifferentAddress?: boolean;
// };

// export async function checkout(input: CheckoutInput) {
//   const json = await gqlFetch({
//     query: CHECKOUT_MUTATION,
//     variables: { input },
//   });

//   if (json.errors) throw new Error(json.errors[0]?.message || "Checkout failed");
//   return json.data?.checkout;
// }

// // ─── Update order status after Midtrans payment ───────────────────────────────
// export async function updateOrderPayment(orderId: number, transactionId: string) {
//   const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
//   const consumerKey = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
//   const consumerSecret = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;

//   const res = await fetch(
//     `${wpUrl}/wp-json/wc/v3/orders/${orderId}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`,
//     {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         status: "processing",
//         transaction_id: transactionId,
//         payment_method: "midtrans",
//         payment_method_title: "Midtrans",
//       }),
//     }
//   );
//   return res.json();
// }

const API_URL = "/api/wp";

async function gqlFetch(body: object) {
  const token = typeof window !== "undefined" ? localStorage.getItem("woo_session_token") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["woocommerce-session"] = `Session ${token}`;

  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const newToken = res.headers.get("woocommerce-session");
  if (newToken && typeof window !== "undefined") localStorage.setItem("woo_session_token", newToken);

  return res.json();
}

// ─── Get shipping rates via Biteship ─────────────────────────────────────────
export async function getShippingMethods(input: {
  destinationPostalCode: string;
  items: { name: string; value: number; quantity: number; weight: number }[];
}) {
  const res = await fetch("/api/biteship-rates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to get shipping rates");
  if(!res.ok) console.log(res);
  return data.rates || [];
}

// ─── Update shipping method ───────────────────────────────────────────────────
const UPDATE_SHIPPING_MUTATION = `
  mutation UpdateShipping($shippingMethod: [String]) {
    updateShippingMethod(input: { shippingMethods: $shippingMethod }) {
      cart {
        total
        shippingTotal
      }
    }
  }
`;

export async function updateShippingMethod(shippingMethod: string) {
  const json = await gqlFetch({
    query: UPDATE_SHIPPING_MUTATION,
    variables: { shippingMethod: [shippingMethod] },
  });
  return json.data?.updateShippingMethod?.cart;
}

// ─── Checkout + create order ──────────────────────────────────────────────────
const CHECKOUT_MUTATION = `
  mutation Checkout($input: CheckoutInput!) {
    checkout(input: $input) {
      order {
        databaseId
        orderNumber
        total
        status
      }
      result
      redirect
    }
  }
`;

export type CheckoutInput = {
  billing: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  shipping?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  paymentMethod: string;
  shippingMethod?: string[];
  shipToDifferentAddress?: boolean;
};
// Function 1 - checkout order
export async function checkout(input: CheckoutInput) {
  const json = await gqlFetch({
    query: CHECKOUT_MUTATION,
    variables: { input },  // input = parameter dari function ini
  });

  if (json.errors) throw new Error(json.errors[0]?.message || "Checkout failed");
  return json.data?.checkout;
}

// Function 2 - update order setelah bayar (TAMBAHKAN DI BAWAH function checkout)
export async function updateOrderPayment(orderId: number, transactionId: string) {
  const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const consumerKey = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
  const consumerSecret = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;

  const res = await fetch(
    `${wpUrl}/wp-json/wc/v3/orders/${orderId}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "processing",
        transaction_id: transactionId,
        payment_method: "midtrans",
        payment_method_title: "Midtrans",
      }),
    }
  );
  return res.json();
}