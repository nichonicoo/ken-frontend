import { getProductDetail } from "@/app/api/graphql/Products";
import ProductDetails from "@/components/ProductDetail";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const product = await getProductDetail(slug);

  if (!product) {
    notFound(); // Menampilkan halaman 404 jika produk tidak ada
  }
  return (
    <main>
      <ProductDetails product={product} />
    </main>
  );
}
