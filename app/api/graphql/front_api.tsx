const API_URL =  process.env.NEXT_PUBLIC_WORDPRESS_URL + "/graphql";

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
            id
            name
            slug
            ... on SimpleProduct {
                price(format: RAW)         
                regularPrice(format: RAW)  
                salePrice(format: RAW)     
                onSale
                stockStatus                     
                image {
                sourceUrl
                altText
                }
                productCategories {
                nodes {
                    name
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
            id
            name
            slug
            ... on SimpleProduct {
                price(format: RAW)         
                regularPrice(format: RAW)  
                salePrice(format: RAW)     
                onSale
                stockStatus                     
                image {
                sourceUrl
                altText
                }
                productCategories {
                nodes {
                    name
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

type CategorySpecific = {
  id: string;
  name: string;
  slug: string;
  count?: number;
  image: {
    sourceUrl: string;
  } | null;
};

export async function getCategoriesSpecific(slug: string): Promise<CategorySpecific | null> {
  const query = `
    query GetCategory($slug: ID!) {
      productCategory(id: $slug, idType: SLUG) {
        id
        name
        slug
        count
        image {
          sourceUrl
        }
      }
    }
  `;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { slug },
    }),
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

  return json.data.productCategory;
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

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { search: keyword } }),
    cache: "no-store",
  });

  const json = await res.json();
  return json.data.products.nodes;
}

export async function searchProductsAll(keyword: string) {
  const query = `
    query SearchProducts($search: String!) {
      products(where: { search: $search }) {
        nodes {
          id
          name
          slug
          ... on SimpleProduct {
            price(format: RAW)
            regularPrice(format: RAW)
            salePrice(format: RAW)
            onSale
            stockStatus
            image {
              sourceUrl
              altText
            }
            productCategories {
              nodes {
                name
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { search: keyword } }),
    cache: "no-store",
  });

  const json = await res.json();
  return json.data.products.nodes;
}

export type Banner = {
  title: string;
  homeBanner1Fields: {
    heading?: string;
    sub?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    image?: {
      node?: {
        sourceUrl: string;
        altText?: string;
      };
    };
  };
};

type BannerResponse = {
  data: {
    homeBanners1: {
      nodes: Banner[];
    };
  };
};

export async function getHomeBanners(): Promise<Banner[]> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query GetHomeBanners {
          homeBanners1 {
            nodes {
              title
              homeBanner1Fields {
                heading
                sub
                description
                buttonText
                buttonLink
                image {
                  node {
                    sourceUrl
                    altText
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

  const json: BannerResponse = await res.json();

  // console.log("🔥 BANNERS:", JSON.stringify(json, null, 2));

  // ✅ FIX DI SINI
  return json?.data?.homeBanners1?.nodes;
}

export async function getBestSellerProducts() {
  const query = `
    query GetBestSellerProducts {
      products(
        first: 10
        where: {
          orderby: { field: TOTAL_SALES, order: DESC }
        }
      ) {
        nodes {
          id
          databaseId
          name
          slug

          ... on SimpleProduct {
            price(format: RAW)
            regularPrice(format: RAW)
            salePrice(format: RAW)
            totalSales

            image {
              sourceUrl
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

  const json = await res.json();

  if (json.errors) {
    console.error(json.errors);
    return [];
  }

  return json.data.products.nodes;
}