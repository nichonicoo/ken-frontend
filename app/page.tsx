import { getProducts } from "@/app/api/graphql/page";
import ProductCard from "@/components/ProductCard";
import {getHomeSlider} from "@/app/api/graphql/slider";
import Slider from "@/components/SlideShow";

export default async function Page() {
  const products = await getProducts("small-plants");
  const dataSlider = await getHomeSlider();

  const slides = dataSlider

  return (
  //   <div style={{ padding: "20px" }}>
  //     <main style={{ padding: "20px" }}>
  //     {/* <h1>Homepage Slider</h1> */}
  //     <Slider slides={slides} autoPlayInterval={12000} />

  //   </main>
  //     <h1>Products</h1>
  //     <div style={{
  //       display: "flex",
  //       gap: "20px",
  //       flexWrap: "wrap"
  //     }}>
  //       {products.map((p, i) => (
  //         <ProductCard
  //           key={i}
  //           name={p.name}
  //           price={p.price}
  //           image={p.image?.sourceUrl}
  //           category={
  //             p.productCategories?.nodes?.[0]?.name
  //           }
  //         />
  //       ))}
  //     </div>
  //   </div>
  // );
  <div style={styles.mainWrapper}>
      {/* Slider — full width, no side padding */}
      <Slider slides={dataSlider} autoPlayInterval={12000} />
 
      {/* Products Section */}
      <div style={styles.container}>
        <h1 style={styles.title}>Products</h1>
        <div style={styles.productGrid}>
          {products.map((p, i) => (
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
    </div>
  );
}

const styles = {
  mainWrapper: {
    width: "100%",
    paddingTop: "120px", // Jarak agar tidak tertutup Header fixed
    paddingBottom: "60px",
    backgroundColor: "#fff",
  },
  container: {
    maxWidth: "1200px", // Membatasi lebar agar tidak terlalu melebar di layar besar
    margin: "0 auto",    // KUNCI: Membuat seluruh konten berada di tengah horizontal
    padding: "0 20px",   // Jarak aman agar tidak menempel ke pinggir layar HP
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "40px",
    textAlign: "left" as const, // Bisa diubah ke "center" jika ingin teks judulnya di tengah
    color: "#000",
  },
  productGrid: {
    display: "grid",
    // Mengatur grid agar fleksibel tapi tetap rapi
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "25px",
    justifyItems: "center", // Memastikan setiap card berada di tengah sel grid-nya
  },
};