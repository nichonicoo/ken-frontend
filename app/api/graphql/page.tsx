const API_URL = "http://ken-web.local/graphql";

type Product = {
  name: string;
  slug: string;
  price: string;
  image: {
    sourceUrl: string;
  };
  productCategories?: {
    nodes: {
      name: string;
      slug: string;
    }[];
  };
};

type ProductGraphQLResponse = {
  data: {
    products: {
      nodes: Product[];
    };
    productCategory?: {
      products: {
        nodes: Product[];
      };
    };
  };
};

type Slide = {
  title: string;
  sliderFields: {
    slideImageLink?: string;
    slideOrderNumber: number;
    sliderType: string;
    slideImageHomes: {
      node: {
        sourceUrl: string;
      };
    };
  };
};

type SliderGraphQLResponse = {
  data: {
    sliderHomes: {
      nodes: Slide[];
    };
  };
};

export async function getProducts(
  categorySlug?: string
): Promise<Product[]> {
  // QUERY DYNAMIC
  const query = categorySlug
    ? `
      query Products {
        productCategory(id: "${categorySlug}", idType: SLUG) {
          products {
            nodes {
              name
              slug
              ... on SimpleProduct {
                price
                image {
                  sourceUrl
                }
                productCategories {
                  nodes {
                    name
                    slug
                  }
                }
              }
            }
          }
        }
      }
    `
    : `
      query Products {
        products {
          nodes {
            name
            slug
            ... on SimpleProduct {
              price
              image {
                sourceUrl
              }
              productCategories {
                nodes {
                  name
                  slug
                }
              }
            }
          }
        }
      }
    `;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch getProducts()");
  }
  const json: ProductGraphQLResponse = await res.json();

  // kalau category specific
  if (categorySlug) {
    return json.data.productCategory?.products.nodes || [];
  }
  // kalau all products
  return json.data.products?.nodes || [];
}

export async function getSlides(): Promise<Slide[]> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        {
          sliderHomes {
            nodes {
              title
              sliderFields {
                slideImageLink
                slideOrderNumber
                sliderType
                slideImageHomes {
                  node {
                    sourceUrl
                  }
                }
              }
            }
          }
        }
      `,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch getSlides() GraphQL");
  }
  const json: SliderGraphQLResponse = await res.json();

  return json.data.sliderHomes.nodes;
}

type Category = {
  id: string;
  name: string;
  slug: string;
  count?: number;
};

export async function getCategories(): Promise<Category[]> {
  const query = `
    query GetCategories {
      productCategories(
        where: { hideEmpty: true }
        first: 20
      ) {
        nodes {
          id
          name
          slug
          count
        }
      }
    }
  `;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const json = await res.json();

  // 🔥 error handling GraphQL
  if (json.errors) {
    console.error("GraphQL Errors:", json.errors);
    throw new Error("GraphQL error when fetching categories");
  }

  return json.data.productCategories.nodes || [];
}

export async function searchProducts(keyword: string) {
  const query = `
    query SearchProducts($search: String!) {
      products(where: { search: $search }, first: 10) {
        nodes {
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
  `;

  const res = await fetch("http://ken-web.local/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { search: keyword } }),
    cache: "no-store",
  });

  const json = await res.json();
  return json.data.products.nodes;
}
