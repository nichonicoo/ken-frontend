const API_URL = "http://ken-web.local/graphql";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: string;          // current price
  regularPrice?: string;  // original price
  salePrice?: string;     // discount price
  onSale: boolean;
  image?: {
    sourceUrl: string;
    altText?: string;
  } | null;
  productCategories?: {
    nodes: {
      name: string;
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

export async function getProductsAll(): Promise<Product[]> {
  // QUERY DYNAMIC
  const query = `
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

  // console.log("🔥 GRAPHQL RESULT:", JSON.stringify(json, null, 2));

  return json.data.products?.nodes || [];
}

export async function getProductsByCategory(
  categorySlug: string
): Promise<Product[]> {
  const query = `
    query SearchProducts {
        products(where: { category: "${categorySlug}" }) {
            nodes {
            id
            name
            slug
            ... on SimpleProduct {
                price(format: RAW)         
                regularPrice(format: RAW)  
                salePrice(format: RAW)     
                onSale                     
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
    throw new Error("Failed to fetch getProductsByCategory()");
  }

  const json: ProductGraphQLResponse = await res.json();
  // console.log("query search: ", query);
  // console.log("🔥 GRAPHQL RESULT:", JSON.stringify(json, null, 2));
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

type ProductDetail = {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  onSale?: boolean;
  purchasable?: boolean;
  price?: string;
  regularPrice?: string;
  salePrice?: string;
  stockQuantity?: number;
  stockStatus: string;
  averageRating:string;
  image?: {
    sourceUrl: string;
  } | null;
  galleryImages?: {
    nodes: {
      sourceUrl: string;
    }[];
  };
  productCategories?: {
    nodes: {
      name: string;
      slug: string;
    }[];
  };
  upsell?: {
    nodes: Product[];
  };
  reviewCount: number;
  crossSell?: {
    nodes: Product[];
  };
  productCustomFields?: {
    shopeeLink: string;
    tiktokLink: string;
  };
};

export async function getProductDetail(
  slug: string
): Promise<ProductDetail | null> {
  const query = `
    query getProductDetail($slug: ID!) {
      product(id: $slug, idType: SLUG) {
        id
        databaseId
        name
        slug
        description
        shortDescription
        onSale
        purchasable

        ... on SimpleProduct {
          price(format: RAW)
          regularPrice(format: RAW)
          salePrice(format: RAW)
          stockQuantity
          stockStatus
          image {
            sourceUrl
          }
          galleryImages {
            nodes {
              sourceUrl
            }
          }
          productCategories {
            nodes {
              name
              slug
            }
          }
          upsell {
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
          crossSell {
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
          reviewCount
        }
        productCustomFields{
          shopeeLink
          tiktokLink
        }
        averageRating
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
    throw new Error("Failed to fetch getProductDetail()");
  }

  const json = await res.json();

  // console.log("🔥 GRAPHQL RESULT DETAIL PRODUCT:", JSON.stringify(json, null, 2));

  if (json.errors) {
    console.error("GraphQL Error:", json.errors);
    return null;
  }

  return json.data.product;
}

type LatestProduct = {
  id: string;
  databaseId: number;
  name: string;
  slug: string;

  onSale?: boolean;

  price?: string;
  regularPrice?: string;
  salePrice?: string;
  stockQuantity?: number;
  stockStatus: string;

  image?: {
    sourceUrl: string;
  } | null;

  productCategories?: {
    nodes: {
      name: string;
      slug: string;
    }[];
  };
};

export async function getLatestProduct(): Promise<LatestProduct[]>{
  const query = `
  query getLatestProduct {
    products(
      first: 10
      where: {orderby: {field: DATE, order: DESC}, status: "publish", stockStatus: IN_STOCK}
    ) {
      nodes {
        id
        databaseId
        name
        slug
        ... on SimpleProduct {
          id
          name
          date
          price(format: RAW)
          onSale
          regularPrice(format: RAW)
          salePrice(format: RAW)
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

  if (!res.ok) {
    throw new Error("Failed to fetch getLatestProducts()");
  }
  const json = await res.json();
  // console.log(
  //   "🔥 GRAPHQL RESULT LATEST PRODUCTS:",
  //   JSON.stringify(json, null, 2)
  // );

  if (json.errors) {
    console.error("GraphQL Error:", json.errors);
    return [];
  }
  return json.data.products.nodes;
}