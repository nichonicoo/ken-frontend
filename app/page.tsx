import { getProducts, getHomeBanners } from "@/app/api/graphql/front_api";
import { getHomeSlider } from "@/app/api/graphql/slider";
import { getLatestProduct } from "./api/graphql/Products";
import Slider from "@/components/SlideShow";
import Carousel from "@/components/Carausell";
import HeroBanner from "@/components/staticBanner";

export default async function Page() {
  const dataSlider = await getHomeSlider();
  const Banners = await getHomeBanners();
  const Banner_1 = Banners.find((b) => b.title === "Home Banner 1");
  const latestProduct = await getLatestProduct();

  return (
    <div style={styles.mainWrapper}>
      {/* hero slider — full bleed, sits flush under fixed navbar */}
      <Slider slides={dataSlider} autoPlayInterval={12000} />

      <Carousel word1="New Arrivals" word2="Just In" products={latestProduct}/>

      {Banner_1 && (
        <div style={styles.bannerWrapper}>
          <HeroBanner data={Banner_1} />
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  mainWrapper: {
    width: "100%",
    // paddingTop match the fixed header height — adjust to header
    // paddingTop: "72px",
    backgroundColor: "#fff",
  },
  bannerWrapper: {
    padding: "0 32px 64px",
    maxWidth: "1400px",
    margin: "0 auto",
    boxSizing: "border-box",
  },
};