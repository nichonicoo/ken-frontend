import { getProducts, searchProductsAll } from "@/app/api/graphql/front_api";
import AllProductsClient from "./AllProductsClient";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || "";

  const raw = search ? await searchProductsAll(search) : await getProducts();

  // Normalize product data for the client component
  let products = raw.map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    regularPrice: p.regularPrice,
    salePrice: p.salePrice,
    onSale: p.onSale,
    stockStatus: p.stockStatus,
    image: p.image?.sourceUrl,
    category: p.productCategories?.nodes?.[0]?.name,
  }));

  // Client-side fallback filter — WordPress search sometimes returns all products
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(
      (p: { name: string; slug: string; category?: string }) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }

  return <AllProductsClient key={search || "all"} products={products} search={search} />;
}