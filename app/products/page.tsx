import { getProducts } from "@/app/api/graphql/page";
import ProductCard from "@/components/ProductCard";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div style={{ padding: "20px" }}>
      <h1>All Products</h1>

      <div style={grid}>
        {products.map((p: any, i: number) => (
          <ProductCard
            key={i}
            name={p.name}
            slug={p.slug}
            price={p.price}
            image={p.image?.sourceUrl}
            category={p.productCategories?.nodes?.[0]?.name}
          />
        ))}
      </div>
    </div>
  );
}

const grid = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "20px",
};