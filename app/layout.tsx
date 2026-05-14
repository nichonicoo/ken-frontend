import Header from "@/components/Header";
import Footer from "@/components/Footer";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html>
      <body>
        <Header />
        {/* kasih spacing biar konten gak ketutup header */}
        <main style={{ paddingTop: "100px" }}>
          {children}
        </main>
        <Footer />
      </body>
      {/* <Footer /> */}
    </html>
  );
}