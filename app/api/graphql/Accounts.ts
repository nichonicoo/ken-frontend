// const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL + "/graphql";

// async function gql(query: string, variables?: Record<string, any>, token?: string) {
//   const headers: Record<string, string> = { "Content-Type": "application/json" };
//   if (token) headers["Authorization"] = `Bearer ${token}`;

//   const res = await fetch(WP_URL, {
//     method: "POST",
//     headers,
//     body: JSON.stringify({ query, variables }),
//     cache: "no-store",
//   });

//   const json = await res.json();
//   if (json.errors) throw new Error(json.errors[0]?.message || "GraphQL error");
//   return json.data;
// }

// // ─── Get customer profile + orders ───────────────────────────────────────────
// const CUSTOMER_QUERY = `
//   query GetCustomer {
//     customer {
//       databaseId
//       firstName
//       lastName
//       email
//       billing {
//         phone
//         address1
//         address2
//         city
//         postcode
//         state
//         country
//       }
//       orders {
//         nodes {
//           databaseId
//           orderNumber
//           status
//           date
//           total
//           lineItems {
//             nodes {
//               productId
//               quantity
//               total
//               product {
//                 node {
//                   name
//                   image {
//                     sourceUrl
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `;

// export async function getCustomer(token: string) {
//   const data = await gql(CUSTOMER_QUERY, undefined, token);
//   return data?.customer || null;
// }

// // ─── Update customer profile ──────────────────────────────────────────────────
// const UPDATE_CUSTOMER_MUTATION = `
//   mutation UpdateCustomer(
//     $firstName: String
//     $lastName: String
//     $billing: CustomerAddressInput
//   ) {
//     updateCustomer(input: {
//       firstName: $firstName
//       lastName: $lastName
//       billing: $billing
//     }) {
//       customer {
//         firstName
//         lastName
//         billing {
//           phone
//           address1
//           city
//           postcode
//         }
//       }
//     }
//   }
// `;

// export async function updateCustomer(
//   token: string,
//   input: {
//     firstName?: string;
//     lastName?: string;
//     billing?: {
//       phone?: string;
//       address1?: string;
//       address2?: string;
//       city?: string;
//       postcode?: string;
//       state?: string;
//       country?: string;
//     };
//   }
// ) {
//   const data = await gql(UPDATE_CUSTOMER_MUTATION, input, token);
//   return data?.updateCustomer?.customer || null;
// }
const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL + "/graphql";

async function gql(query: string, variables?: Record<string, any>, token?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
//   if (token) headers["Authorization"] = `${token}`;

  const res = await fetch(WP_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message || "GraphQL error");
  return json.data;
}

// ─── Get customer profile + orders ───────────────────────────────────────────
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
      orders {
        nodes {
          databaseId
          orderNumber
          status
          date
          total(format: RAW)
          subtotal(format: RAW)
          shippingTotal(format: RAW)
          discountTotal(format: RAW)
          paymentMethodTitle
          shipping {
            firstName
            lastName
            address1
            address2
            city
            state
            postcode
            country
          }
          billing {
            firstName
            lastName
            address1
            address2
            city
            state
            postcode
            country
          }
          shippingLines {
            nodes {
              methodTitle
              total
            }
          }
          lineItems {
            nodes {
              productId
              quantity
              total
              product {
                node {
                  name
                  image {
                    sourceUrl
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getCustomer(token: string) {
  const data = await gql(CUSTOMER_QUERY, undefined, token);

  return data?.customer || null;
}

// ─── Update customer profile + addresses ─────────────────────────────────────
const UPDATE_CUSTOMER_MUTATION = `
  mutation UpdateCustomer(
    $firstName: String
    $lastName: String
    $billing: CustomerAddressInput
    $shipping: CustomerAddressInput
  ) {
    updateCustomer(input: {
      firstName: $firstName
      lastName: $lastName
      billing: $billing
      shipping: $shipping
    }) {
      customer {
        firstName
        lastName
        billing {
          phone
          address1
          city
          postcode
          state
        }
        shipping {
          address1
          city
          postcode
          state
        }
      }
    }
  }
`;

type AddressInput = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  postcode?: string;
  state?: string;
  country?: string;
};

export async function updateCustomer(
  token: string,
  input: {
    firstName?: string;
    lastName?: string;
    billing?: AddressInput;
    shipping?: AddressInput;
  }
) {
  const data = await gql(UPDATE_CUSTOMER_MUTATION, input, token);
  return data?.updateCustomer?.customer || null;
}