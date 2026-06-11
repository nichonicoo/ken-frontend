import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html>
      <body>
        <Providers>
        <Header />
        {/* kasih spacing biar konten gak ketutup header */}
        <main style={{ paddingTop: "82px" }}>
          {children}
        </main>
        <Footer />
        </Providers>
      </body>
    </html>
  );
}