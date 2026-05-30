import { getProducts, searchProductsAll } from "@/app/api/graphql/front_api";
import ProductCard from "@/components/ProductCard";
import Breadcrumb from "@/components/Breadcrumbs";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || "";

  const products = search
    ? await searchProductsAll(search)
    : await getProducts();

  // console.log("SEARCH PARAM:", search);

  // console.log("products: ", products);

  return (
    <div style={pageWrapper}>
          <div style={container}>
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Products", href: "/products" },
                // { label: "All Products" },
                search ? { label: `Hasil Pencarian untuk: '${search}'` } : { label: "All Products" },
              ]}
            />
    
            {/* judul di kiri ikut container */}
            <h1 style={titleStyle} className={cormorant.className}>
              {search ? `Hasil Pencarian untuk: '${search}'` : "All Products"}
            </h1>
    
            {products.length === 0 ? (
              <div style={emptyStateContainer}>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "18px", color: "#0b0b0b", fontWeight: "500" }}>
                    No products found {search && `for "${search}"`}
                  </p>
                  <a href="/products" style={backLink}>Browse all products</a>
                </div>
              </div>
            ) : (
              <div style={grid}>
                {products.map((p: any, i: number) => (
                  <ProductCard
                    key={i}
                    name={p.name}
                    slug={p.slug}
                    price={p.price}
                    regularPrice={p.regularPrice}
                    salePrice={p.salePrice}
                    onSale={p.onSale}
                    image={p.image?.sourceUrl}
                    category={p.productCategories?.nodes?.[0]?.name}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
  );
}

const formatTitle = (slug: string) =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const emptyStateContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "50vh", // Mengambil setengah tinggi layar agar pas di tengah vertikal
  width: "100%",
};
const backLink = {
  display: "inline-block",
  marginTop: "15px",
  color: "#6bc1c6",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "14px",
  border: "1px solid #6bc1c6",
  padding: "8px 20px",
  borderRadius: "20px",
};

const pageWrapper = {
  width: "100%",
  display: "flex",
  justifyContent: "center", // Memastikan container utama ada di tengah layar
  padding: "40px 20px",
};

const container = {
  width: "100%",
  maxWidth: "1200px", 
  margin: "0 auto", 
  padding: "0 20px"
};

const titleStyle = {
  textAlign: "left" as const, 
  fontSize: "32px",
  fontWeight: "bold",
  marginBottom: "30px",
};

const grid = {
  width: "100%",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 140px))",
  gap: "25px",
  justifyContent: "center", 
  justifyItems: "center",
  margin: "0 auto",
};