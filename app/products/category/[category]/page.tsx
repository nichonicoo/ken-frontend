import { getProductsByCategory } from "@/app/api/graphql/Products";
import ProductCard from "@/components/ProductCard";
import Breadcrumb from "@/components/Breadcrumbs";

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const { category } = await params;
  const products = await getProductsByCategory(category);
  console.log(products)

  const slug = category.toLowerCase();

  // const categoryName = products[0]?.productCategories?.nodes?.[0]?.name || "Category";
  const categoryName =
    products[0]?.productCategories?.nodes?.[0]?.name ||
    formatTitle(slug);
  return (
    <div style={pageWrapper}>
      <div style={container}>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: categoryName },
          ]}
        />

        {/* Judul tetap di kiri relatif terhadap container */}
        <h1 style={titleStyle}>{categoryName}</h1>

        {products.length === 0 ? (
          <div style={emptyStateContainer}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "18px", color: "#0b0b0b", fontWeight: "500" }}>
                No products found in this category.
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
  maxWidth: "1200px", // Lebar maksimal konten agar tidak melebar ke pinggir layar monitor besar
  margin: "0 auto", // Ini yang menjaga seluruh blok konten di tengah layar
  padding: "0 20px"
};

const titleStyle = {
  textAlign: "left" as const, // Menjaga judul kategori tetap di kiri
  fontSize: "32px",
  fontWeight: "bold",
  marginBottom: "30px",
};

const grid = {
  width: "100%",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 140px))",
  gap: "25px",
  justifyContent: "center", // Memusatkan deretan produk jika jumlahnya sedikit
  justifyItems: "center",   // Memusatkan kartu produk di dalam selnya
  margin: "0 auto",
};