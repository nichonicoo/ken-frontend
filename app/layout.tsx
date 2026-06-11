import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import Script from "next/script";
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
        <Script
          id="midtrans-snap"
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="beforeInteractive"
        />
      </body>
      {/* <Footer /> */}
    </html>
  );
}