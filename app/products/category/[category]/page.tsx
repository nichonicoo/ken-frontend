import { getProductsByCategory} from "@/app/api/graphql/Products";
import ProductCard from "@/components/ProductCard";
import Breadcrumb from "@/components/Breadcrumbs";
import { Cormorant_Garamond } from "next/font/google";
import { getCategoriesSpecific } from "@/app/api/graphql/front_api";
import CategoryClient from "@/components/CategoryClient";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const { category } = await params;
  const products = await getProductsByCategory(category);
  const categoriesspecific = await getCategoriesSpecific(category)
  // console.log('categories specific: ', categoriesspecific)
  // console.log(products)

  const slug = category.toLowerCase();

  const categoryName =
    products[0]?.productCategories?.nodes?.[0]?.name ||
    formatTitle(slug);

  const heroImage = categoriesspecific?.image?.sourceUrl;
  return (
    <CategoryClient
      products={products}
      categoryName={categoryName}
      heroImage={heroImage}
    />
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
  justifyContent: "center", 
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