// // "use client";

// // import { useState, useEffect, useCallback } from "react";
// // import { useSession } from "next-auth/react";
// // import { useRouter } from "next/navigation";
// // import { Cormorant_Garamond } from "next/font/google";
// // import { getCart } from "@/app/api/graphql/Transaction";
// // import { getShippingMethods, updateShippingMethod, checkout } from "@/app/api/graphql/Checkout";

// // const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500"] });

// // // ─── Types ────────────────────────────────────────────────────────────────────
// // type ShippingRate = { id: string; instanceId: number; methodId: string; label: string; cost: string };
// // type CartItem = {
// //   key: string; quantity: number;
// //   product: { node: { name: string; price?: string; image?: { sourceUrl: string } } };
// // };
// // type Cart = { contents: { nodes: CartItem[] }; subtotal: string; total: string; shippingTotal?: string };

// // const fmt = (val?: string) => {
// //   if (!val) return "Rp 0";
// //   const num = parseFloat(val.replace(/[^0-9.]/g, ""));
// //   if (isNaN(num)) return val;
// //   return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
// // };

// // // ─── Step indicator ───────────────────────────────────────────────────────────
// // function Steps({ current }: { current: number }) {
// //   const steps = ["Alamat", "Pengiriman", "Pembayaran"];
// //   return (
// //     <div style={stepStyles.wrap}>
// //       {steps.map((label, i) => (
// //         <div key={label} style={stepStyles.item}>
// //           <div style={{
// //             ...stepStyles.circle,
// //             background: i < current ? "#111" : i === current ? "#111" : "transparent",
// //             borderColor: i <= current ? "#111" : "#e0e0e0",
// //             color: i < current ? "#fff" : i === current ? "#fff" : "#bbb",
// //           }}>
// //             {i < current ? (
// //               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
// //                 <polyline points="20 6 9 17 4 12" />
// //               </svg>
// //             ) : i + 1}
// //           </div>
// //           <span style={{ ...stepStyles.label, color: i <= current ? "#111" : "#bbb" }}>{label}</span>
// //           {i < steps.length - 1 && <div style={{ ...stepStyles.line, background: i < current ? "#111" : "#e0e0e0" }} />}
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }

// // const stepStyles: { [k: string]: React.CSSProperties } = {
// //   wrap: { display: "flex", alignItems: "center", marginBottom: 40 },
// //   item: { display: "flex", alignItems: "center", gap: 8 },
// //   circle: {
// //     width: 28, height: 28, borderRadius: "50%",
// //     borderWidth: "1.5px", borderStyle: "solid",
// //     display: "flex", alignItems: "center", justifyContent: "center",
// //     fontSize: 11, fontWeight: 600,
// //     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
// //     flexShrink: 0,
// //   },
// //   label: { fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", marginRight: 8 },
// //   line: { width: 40, height: 1, marginRight: 8 },
// // };

// // // ─── Input ────────────────────────────────────────────────────────────────────
// // function Field({ label, value, onChange, type = "text", placeholder = "", half = false }: {
// //   label: string; value: string; onChange: (v: string) => void;
// //   type?: string; placeholder?: string; half?: boolean;
// // }) {
// //   return (
// //     <div style={{ gridColumn: half ? "span 1" : "span 2", display: "flex", flexDirection: "column", gap: 6 }}>
// //       <label style={styles.label}>{label}</label>
// //       <input
// //         type={type} value={value} placeholder={placeholder}
// //         onChange={(e) => onChange(e.target.value)}
// //         style={styles.input}
// //         onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; }}
// //         onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; }}
// //       />
// //     </div>
// //   );
// // }

// // // ─── Main ─────────────────────────────────────────────────────────────────────
// // export default function CheckoutPage() {
// //   const { data: session } = useSession();
// //   const router = useRouter();

// //   const [step, setStep] = useState(0);
// //   const [cart, setCart] = useState<Cart | null>(null);
// //   const [cartLoading, setCartLoading] = useState(true);
// //   const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
// //   const [shippingLoading, setShippingLoading] = useState(false);
// //   const [selectedRate, setSelectedRate] = useState("");
// //   const [processing, setProcessing] = useState(false);
// //   const [error, setError] = useState("");

// //   // Form state
// //   const [firstName, setFirstName] = useState("");
// //   const [lastName, setLastName] = useState("");
// //   const [email, setEmail] = useState(session?.user?.email || "");
// //   const [phone, setPhone] = useState("");
// //   const [address1, setAddress1] = useState("");
// //   const [address2, setAddress2] = useState("");
// //   const [city, setCity] = useState("");
// //   const [state, setState] = useState("");
// //   const [postcode, setPostcode] = useState("");

// //   // Prefill email from session
// //   useEffect(() => {
// //     if (session?.user?.email) setEmail(session.user.email);
// //     if (session?.user?.name) {
// //       const parts = session.user.name.split(" ");
// //       setFirstName(parts[0] || "");
// //       setLastName(parts.slice(1).join(" ") || "");
// //     }
// //   }, [session]);

// //   // Fetch cart
// //   useEffect(() => {
// //     getCart()
// //       .then(setCart)
// //       .catch(console.error)
// //       .finally(() => setCartLoading(false));
// //   }, []);

// //   // Fetch shipping rates
// //   const fetchShipping = useCallback(async () => {
// //     if (!city || !postcode) return;
// //     setShippingLoading(true);
// //     try {
// //       const rates = await getShippingMethods({ country: "ID", state, city, postcode });
// //       setShippingRates(rates);
// //       if (rates.length > 0) setSelectedRate(rates[0].id);
// //     } catch (e) {
// //       console.error(e);
// //     }
// //     setShippingLoading(false);
// //   }, [city, postcode, state]);

// //   const handleNextStep = async () => {
// //     setError("");
// //     if (step === 0) {
// //       if (!firstName || !lastName || !email || !phone || !address1 || !city || !postcode) {
// //         setError("Harap lengkapi semua field yang wajib diisi.");
// //         return;
// //       }
// //       await fetchShipping();
// //       setStep(1);
// //     } else if (step === 1) {
// //       if (!selectedRate) {
// //         setError("Pilih metode pengiriman terlebih dahulu.");
// //         return;
// //       }
// //       // Update shipping method in WooCommerce cart
// //       setShippingLoading(true);
// //       try {
// //         await updateShippingMethod(selectedRate);
// //         const updated = await getCart();
// //         setCart(updated);
// //       } catch (e) { console.error(e); }
// //       setShippingLoading(false);
// //       setStep(2);
// //     }
// //   };

// //   const handlePay = async () => {
// //     setProcessing(true);
// //     setError("");

// //     try {
// //       // 1. Create order via WooCommerce checkout (payment method: midtrans)
// //       const result = await checkout({
// //         billing: { firstName, lastName, email, phone, address1, address2, city, state, postcode, country: "ID" },
// //         paymentMethod: "midtrans",
// //         shippingMethod: selectedRate ? [selectedRate] : undefined,
// //       });

// //       if (!result?.order?.databaseId) {
// //         setError("Gagal membuat pesanan. Silakan coba lagi.");
// //         setProcessing(false);
// //         return;
// //       }

// //       const orderId = result.order.databaseId;

// //       // 2. Open Midtrans Snap
// //       if (typeof window !== "undefined" && (window as any).snap) {
// //         // Get snap token from WooCommerce order meta
// //         // Midtrans plugin menyimpan snap_token di order meta
// //         // redirect ke WooCommerce payment page untuk get token
// //         if (result.redirect) {
// //           // Midtrans plugin akan redirect ke payment page yang sudah ada snap token
// //           window.location.href = result.redirect;
// //         } else {
// //           router.push(`/order-confirmation?order=${orderId}`);
// //         }
// //       } else {
// //         // Fallback: redirect ke WooCommerce payment
// //         if (result.redirect) window.location.href = result.redirect;
// //         else router.push(`/order-confirmation?order=${orderId}`);
// //       }
// //     } catch (e: any) {
// //       setError(e.message || "Terjadi kesalahan. Silakan coba lagi.");
// //       setProcessing(false);
// //     }
// //   };

// //   const items = cart?.contents?.nodes || [];

// //   return (
// //     <div style={styles.page}>
// //       <h1 className={cormorant.className} style={styles.pageTitle}>Checkout</h1>
// //       <Steps current={step} />

// //       <div style={styles.layout}>
// //         {/* ── Left: Form ── */}
// //         <div style={styles.formCol}>

// //           {error && <div style={styles.errorBox}><p style={styles.errorText}>{error}</p></div>}

// //           {/* Step 0 — Alamat */}
// //           {step === 0 && (
// //             <div>
// //               <p style={styles.sectionTitle}>Alamat Pengiriman</p>
// //               <div style={styles.formGrid}>
// //                 <Field label="Nama Depan *" value={firstName} onChange={setFirstName} half placeholder="John" />
// //                 <Field label="Nama Belakang *" value={lastName} onChange={setLastName} half placeholder="Doe" />
// //                 <Field label="Email *" value={email} onChange={setEmail} type="email" placeholder="email@contoh.com" />
// //                 <Field label="Nomor Telepon *" value={phone} onChange={setPhone} type="tel" placeholder="08xx-xxxx-xxxx" />
// //                 <Field label="Alamat *" value={address1} onChange={setAddress1} placeholder="Jl. Nama Jalan No. X" />
// //                 <Field label="Alamat 2 (opsional)" value={address2} onChange={setAddress2} placeholder="Apartemen, unit, dll" />
// //                 <Field label="Kota *" value={city} onChange={setCity} half placeholder="Jakarta" />
// //                 <Field label="Kode Pos *" value={postcode} onChange={setPostcode} half placeholder="12345" />
// //                 <Field label="Provinsi" value={state} onChange={setState} placeholder="DKI Jakarta" />
// //               </div>
// //               <button style={styles.nextBtn} onClick={handleNextStep}>
// //                 Lanjut ke Pengiriman →
// //               </button>
// //             </div>
// //           )}

// //           {/* Step 1 — Pengiriman */}
// //           {step === 1 && (
// //             <div>
// //               <p style={styles.sectionTitle}>Metode Pengiriman</p>

// //               {/* Address summary */}
// //               <div style={styles.addressSummary}>
// //                 <p style={styles.addressSummaryText}>
// //                   {address1}, {city}, {postcode}
// //                 </p>
// //                 <button style={styles.editLink} onClick={() => setStep(0)}>Ubah</button>
// //               </div>

// //               {shippingLoading ? (
// //                 <div style={styles.shippingLoading}>Memuat opsi pengiriman...</div>
// //               ) : shippingRates.length === 0 ? (
// //                 // Fallback: flat rate sementara KiriminAja belum terhubung
// //                 <div style={styles.rateList}>
// //                   {[
// //                     { id: "flat_rate:1", label: "Pengiriman Reguler (2–5 hari kerja)", cost: "0" },
// //                   ].map((rate) => (
// //                     <label key={rate.id} style={{
// //                       ...styles.rateItem,
// //                       borderColor: selectedRate === rate.id ? "#111" : "#e0e0e0",
// //                       background: selectedRate === rate.id ? "#fafafa" : "#fff",
// //                     }}
// //                       onClick={() => setSelectedRate(rate.id)}
// //                     >
// //                       <div style={styles.rateRadio}>
// //                         <div style={{ ...styles.rateRadioInner, background: selectedRate === rate.id ? "#111" : "transparent" }} />
// //                       </div>
// //                       <div style={styles.rateInfo}>
// //                         <p style={styles.rateLabel}>{rate.label}</p>
// //                         <p style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>Biaya pengiriman dihitung saat konfirmasi order</p>
// //                       </div>
// //                       <p style={styles.rateCost}>Gratis</p>
// //                     </label>
// //                   ))}
// //                 </div>
// //               ) : (
// //                 <div style={styles.rateList}>
// //                   {shippingRates.map((rate) => (
// //                     <label key={rate.id} style={{
// //                       ...styles.rateItem,
// //                       borderColor: selectedRate === rate.id ? "#111" : "#e0e0e0",
// //                       background: selectedRate === rate.id ? "#fafafa" : "#fff",
// //                     }}>
// //                       <input
// //                         type="radio"
// //                         name="shipping"
// //                         value={rate.id}
// //                         checked={selectedRate === rate.id}
// //                         onChange={() => setSelectedRate(rate.id)}
// //                         style={{ display: "none" }}
// //                       />
// //                       <div style={styles.rateRadio}>
// //                         <div style={{
// //                           ...styles.rateRadioInner,
// //                           background: selectedRate === rate.id ? "#111" : "transparent",
// //                         }} />
// //                       </div>
// //                       <div style={styles.rateInfo}>
// //                         <p style={styles.rateLabel}>{rate.label}</p>
// //                       </div>
// //                       <p style={styles.rateCost}>{fmt(rate.cost)}</p>
// //                     </label>
// //                   ))}
// //                 </div>
// //               )}

// //               <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
// //                 <button style={styles.backBtn} onClick={() => setStep(0)}>← Kembali</button>
// //                 <button style={styles.nextBtn} onClick={handleNextStep} disabled={!selectedRate}>
// //                   Lanjut ke Pembayaran →
// //                 </button>
// //               </div>
// //             </div>
// //           )}

// //           {/* Step 2 — Pembayaran */}
// //           {step === 2 && (
// //             <div>
// //               <p style={styles.sectionTitle}>Konfirmasi & Bayar</p>

// //               {/* Summary */}
// //               <div style={styles.confirmSummary}>
// //                 <div style={styles.confirmRow}>
// //                   <span style={styles.confirmLabel}>Alamat</span>
// //                   <span style={styles.confirmValue}>{address1}, {city}, {postcode}</span>
// //                 </div>
// //                 <div style={styles.confirmRow}>
// //                   <span style={styles.confirmLabel}>Pengiriman</span>
// //                   <span style={styles.confirmValue}>
// //                     {shippingRates.find(r => r.id === selectedRate)?.label || "-"}
// //                   </span>
// //                 </div>
// //                 <div style={styles.confirmRow}>
// //                   <span style={styles.confirmLabel}>Pembayaran</span>
// //                   <span style={styles.confirmValue}>Midtrans (Transfer, QRIS, Kartu)</span>
// //                 </div>
// //               </div>

// //               <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
// //                 <button style={styles.backBtn} onClick={() => setStep(1)}>← Kembali</button>
// //                 <button
// //                   style={{ ...styles.payBtn, opacity: processing ? 0.6 : 1, cursor: processing ? "not-allowed" : "pointer" }}
// //                   onClick={handlePay}
// //                   disabled={processing}
// //                 >
// //                   {processing ? "Memproses..." : `Bayar ${fmt(cart?.total)}`}
// //                 </button>
// //               </div>

// //               <p style={styles.secureNote}>
// //                 🔒 Pembayaran aman diproses oleh Midtrans
// //               </p>
// //             </div>
// //           )}
// //         </div>

// //         {/* ── Right: Order summary ── */}
// //         <div style={styles.summaryCol}>
// //           <p style={styles.summaryTitle}>Ringkasan Pesanan</p>

// //           {cartLoading ? (
// //             <div style={styles.skeletonItem} />
// //           ) : (
// //             <>
// //               <div style={styles.summaryItems}>
// //                 {items.map((item) => (
// //                   <div key={item.key} style={styles.summaryItem}>
// //                     <div style={styles.summaryItemImg}>
// //                       {item.product.node.image?.sourceUrl && (
// //                         <img src={item.product.node.image.sourceUrl} alt={item.product.node.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
// //                       )}
// //                       <span style={styles.summaryItemQty}>{item.quantity}</span>
// //                     </div>
// //                     <p style={styles.summaryItemName}>{item.product.node.name}</p>
// //                     <p style={styles.summaryItemPrice}>{fmt(item.product.node.price)}</p>
// //                   </div>
// //                 ))}
// //               </div>

// //               <div style={styles.summaryDivider} />
// //               <div style={styles.summaryRow}>
// //                 <span style={styles.summaryLabel}>Subtotal</span>
// //                 <span style={styles.summaryValue}>{cart?.subtotal}</span>
// //               </div>
// //               {cart?.shippingTotal && cart.shippingTotal !== "Rp0" && (
// //                 <div style={styles.summaryRow}>
// //                   <span style={styles.summaryLabel}>Ongkir</span>
// //                   <span style={styles.summaryValue}>{cart.shippingTotal}</span>
// //                 </div>
// //               )}
// //               <div style={styles.summaryDivider} />
// //               <div style={styles.summaryRow}>
// //                 <span style={{ ...styles.summaryLabel, fontWeight: 600, color: "#111" }}>Total</span>
// //                 <span style={{ ...styles.summaryValue, fontSize: 16, fontWeight: 600, color: "#111" }}>{cart?.total}</span>
// //               </div>
// //             </>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // ─── Styles ───────────────────────────────────────────────────────────────────
// // const styles: { [key: string]: React.CSSProperties } = {
// //   page: { maxWidth: "1100px", margin: "0 auto", padding: "100px 32px 80px", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
// //   pageTitle: { fontSize: "40px", fontWeight: 400, color: "#111", margin: "0 0 32px", lineHeight: 1 },
// //   layout: { display: "grid", gridTemplateColumns: "1fr 340px", gap: "56px", alignItems: "flex-start" },
// //   formCol: { minWidth: 0 },
// //   sectionTitle: { fontSize: "10px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#aaa", marginBottom: 20 },
// //   formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: 24 },
// //   label: { fontSize: "9px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#aaa" },
// //   input: { width: "100%", padding: "11px 14px", fontSize: "13px", color: "#111", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", background: "#fff", borderWidth: "0.5px", borderStyle: "solid", borderColor: "#e0e0e0", borderRadius: "4px", outline: "none", transition: "border-color 0.15s ease", boxSizing: "border-box" as const },
// //   nextBtn: { height: 48, padding: "0 32px", background: "#111", color: "#fff", border: "none", borderRadius: "4px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, cursor: "pointer", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
// //   backBtn: { height: 48, padding: "0 24px", background: "transparent", color: "#555", border: "0.5px solid #e0e0e0", borderRadius: "4px", fontSize: "11px", fontWeight: 500, cursor: "pointer", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
// //   payBtn: { flex: 1, height: 48, background: "#111", color: "#fff", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 600, letterSpacing: "0.06em", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
// //   errorBox: { background: "#fff5f5", border: "0.5px solid #fca5a5", borderRadius: "4px", padding: "10px 14px", marginBottom: 20 },
// //   errorText: { fontSize: "12px", color: "#dc2626" },
// //   addressSummary: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "#fafafa", borderRadius: "4px", border: "0.5px solid #ebebeb", marginBottom: 20 },
// //   addressSummaryText: { fontSize: "12px", color: "#555" },
// //   editLink: { fontSize: "11px", color: "#6bc1c6", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
// //   shippingLoading: { fontSize: "13px", color: "#aaa", padding: "20px 0" },
// //   shippingEmpty: { padding: "20px 0", display: "flex", flexDirection: "column", gap: 8 },
// //   rateList: { display: "flex", flexDirection: "column", gap: 10 },
// //   rateItem: { display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderWidth: "0.5px", borderStyle: "solid", borderRadius: "6px", cursor: "pointer", transition: "border-color 0.15s ease" },
// //   rateRadio: { width: 18, height: 18, borderRadius: "50%", borderWidth: "1.5px", borderStyle: "solid", borderColor: "#111", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
// //   rateRadioInner: { width: 10, height: 10, borderRadius: "50%", transition: "background 0.15s ease" },
// //   rateInfo: { flex: 1 },
// //   rateLabel: { fontSize: "13px", fontWeight: 500, color: "#111" },
// //   rateCost: { fontSize: "13px", fontWeight: 500, color: "#111" },
// //   confirmSummary: { display: "flex", flexDirection: "column", gap: 0, border: "0.5px solid #ebebeb", borderRadius: "6px", overflow: "hidden" },
// //   confirmRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: "0.5px solid #f0f0f0" },
// //   confirmLabel: { fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#aaa" },
// //   confirmValue: { fontSize: "13px", color: "#111", maxWidth: "60%", textAlign: "right" as const },
// //   secureNote: { fontSize: "11px", color: "#aaa", marginTop: 16, textAlign: "center" as const },

// //   // Summary col
// //   summaryCol: { background: "#fafafa", border: "0.5px solid #ebebeb", borderRadius: "8px", padding: "24px", position: "sticky", top: "120px" },
// //   summaryTitle: { fontSize: "10px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#aaa", marginBottom: 20 },
// //   summaryItems: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 },
// //   summaryItem: { display: "flex", alignItems: "center", gap: 12 },
// //   summaryItemImg: { position: "relative", width: 48, height: 48, borderRadius: "6px", overflow: "hidden", background: "#f5f3ef", flexShrink: 0 },
// //   summaryItemQty: { position: "absolute", top: -6, right: -6, background: "#555", color: "#fff", fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
// //   summaryItemName: { flex: 1, fontSize: 12, color: "#111", fontWeight: 500, lineHeight: 1.4 },
// //   summaryItemPrice: { fontSize: 12, color: "#888", flexShrink: 0 },
// //   summaryDivider: { borderTop: "0.5px solid #ebebeb", margin: "12px 0" },
// //   summaryRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
// //   summaryLabel: { fontSize: 12, color: "#888" },
// //   summaryValue: { fontSize: 13, color: "#555" },
// //   skeletonItem: { height: 60, background: "#f0f0f0", borderRadius: 6 },
// // };



// // "use client";

// // import { useState, useEffect, useCallback } from "react";
// // import { useSession } from "next-auth/react";
// // import { useRouter } from "next/navigation";
// // import { Cormorant_Garamond } from "next/font/google";
// // import { getCart } from "@/app/api/graphql/Transaction";
// // import { getShippingMethods, updateShippingMethod, checkout } from "@/app/api/graphql/Checkout";

// // const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500"] });

// // // ─── Types ────────────────────────────────────────────────────────────────────
// // type ShippingRate = { id: string; instanceId: number; methodId: string; label: string; cost: string };
// // type CartItem = {
// //   key: string; quantity: number;
// //   product: { node: { name: string; price?: string; image?: { sourceUrl: string } } };
// // };
// // type Cart = { contents: { nodes: CartItem[] }; subtotal: string; total: string; shippingTotal?: string };

// // const fmt = (val?: string) => {
// //   if (!val) return "Rp 0";
// //   const num = parseFloat(val.replace(/[^0-9.]/g, ""));
// //   if (isNaN(num)) return val;
// //   return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
// // };

// // // ─── Step indicator ───────────────────────────────────────────────────────────
// // function Steps({ current }: { current: number }) {
// //   const steps = ["Alamat", "Pengiriman", "Pembayaran"];
// //   return (
// //     <div style={stepStyles.wrap}>
// //       {steps.map((label, i) => (
// //         <div key={label} style={stepStyles.item}>
// //           <div style={{
// //             ...stepStyles.circle,
// //             background: i < current ? "#111" : i === current ? "#111" : "transparent",
// //             borderColor: i <= current ? "#111" : "#e0e0e0",
// //             color: i < current ? "#fff" : i === current ? "#fff" : "#bbb",
// //           }}>
// //             {i < current ? (
// //               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
// //                 <polyline points="20 6 9 17 4 12" />
// //               </svg>
// //             ) : i + 1}
// //           </div>
// //           <span style={{ ...stepStyles.label, color: i <= current ? "#111" : "#bbb" }}>{label}</span>
// //           {i < steps.length - 1 && <div style={{ ...stepStyles.line, background: i < current ? "#111" : "#e0e0e0" }} />}
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }

// // const stepStyles: { [k: string]: React.CSSProperties } = {
// //   wrap: { display: "flex", alignItems: "center", marginBottom: 40 },
// //   item: { display: "flex", alignItems: "center", gap: 8 },
// //   circle: {
// //     width: 28, height: 28, borderRadius: "50%",
// //     borderWidth: "1.5px", borderStyle: "solid",
// //     display: "flex", alignItems: "center", justifyContent: "center",
// //     fontSize: 11, fontWeight: 600,
// //     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
// //     flexShrink: 0,
// //   },
// //   label: { fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", marginRight: 8 },
// //   line: { width: 40, height: 1, marginRight: 8 },
// // };

// // // ─── Input ────────────────────────────────────────────────────────────────────
// // function Field({ label, value, onChange, type = "text", placeholder = "", half = false }: {
// //   label: string; value: string; onChange: (v: string) => void;
// //   type?: string; placeholder?: string; half?: boolean;
// // }) {
// //   return (
// //     <div style={{ gridColumn: half ? "span 1" : "span 2", display: "flex", flexDirection: "column", gap: 6 }}>
// //       <label style={styles.label}>{label}</label>
// //       <input
// //         type={type} value={value} placeholder={placeholder}
// //         onChange={(e) => onChange(e.target.value)}
// //         style={styles.input}
// //         onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; }}
// //         onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; }}
// //       />
// //     </div>
// //   );
// // }

// // // ─── Main ─────────────────────────────────────────────────────────────────────
// // export default function CheckoutPage() {
// //   const { data: session } = useSession();
// //   const router = useRouter();

// //   const [step, setStep] = useState(0);
// //   const [cart, setCart] = useState<Cart | null>(null);
// //   const [cartLoading, setCartLoading] = useState(true);
// //   const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
// //   const [shippingLoading, setShippingLoading] = useState(false);
// //   const [selectedRate, setSelectedRate] = useState("");
// //   const [processing, setProcessing] = useState(false);
// //   const [error, setError] = useState("");

// //   // Form state
// //   const [firstName, setFirstName] = useState("");
// //   const [lastName, setLastName] = useState("");
// //   const [email, setEmail] = useState(session?.user?.email || "");
// //   const [phone, setPhone] = useState("");
// //   const [address1, setAddress1] = useState("");
// //   const [address2, setAddress2] = useState("");
// //   const [city, setCity] = useState("");
// //   const [state, setState] = useState("");
// //   const [postcode, setPostcode] = useState("");

// //   // Prefill email from session
// //   useEffect(() => {
// //     if (session?.user?.email) setEmail(session.user.email);
// //     if (session?.user?.name) {
// //       const parts = session.user.name.split(" ");
// //       setFirstName(parts[0] || "");
// //       setLastName(parts.slice(1).join(" ") || "");
// //     }
// //   }, [session]);

// //   // Fetch cart
// //   useEffect(() => {
// //     getCart()
// //       .then(setCart)
// //       .catch(console.error)
// //       .finally(() => setCartLoading(false));
// //   }, []);

// //   // Fetch shipping rates
// //   const fetchShipping = useCallback(async () => {
// //     if (!city || !postcode) return;
// //     setShippingLoading(true);
// //     try {
// //       const rates = await getShippingMethods({ country: "ID", state, city, postcode });
// //       setShippingRates(rates);
// //       if (rates.length > 0) setSelectedRate(rates[0].id);
// //     } catch (e) {
// //       console.error(e);
// //     }
// //     setShippingLoading(false);
// //   }, [city, postcode, state]);

// //   const handleNextStep = async () => {
// //     setError("");
// //     if (step === 0) {
// //       if (!firstName || !lastName || !email || !phone || !address1 || !city || !postcode) {
// //         setError("Harap lengkapi semua field yang wajib diisi.");
// //         return;
// //       }
// //       await fetchShipping();
// //       setStep(1);
// //     } else if (step === 1) {
// //       if (!selectedRate) {
// //         setError("Pilih metode pengiriman terlebih dahulu.");
// //         return;
// //       }
// //       // Update shipping method in WooCommerce cart
// //       setShippingLoading(true);
// //       try {
// //         await updateShippingMethod(selectedRate);
// //         const updated = await getCart();
// //         setCart(updated);
// //       } catch (e) { console.error(e); }
// //       setShippingLoading(false);
// //       setStep(2);
// //     }
// //   };

// //   const handlePay = async () => {
// //     setProcessing(true);
// //     setError("");


// //     try {
// //       // 1. Create order via WooCommerce
// //       const result = await checkout({
// //         billing: { firstName, lastName, email, phone, address1, address2, city, state, postcode, country: "ID" },
// //         paymentMethod: "midtrans",
// //         shippingMethod: selectedRate ? [selectedRate] : undefined,
// //       });

// //       if (!result?.order?.databaseId) {
// //         setError("Gagal membuat pesanan. Silakan coba lagi.");
// //         setProcessing(false);
// //         return;
// //       }

// //       const orderId = result.order.databaseId;

// //       // 2. Get snap token dari WooCommerce order meta
// //       const tokenRes = await fetch(`/api/midtrans-token?order_id=${orderId}`);
// //       const tokenData = await tokenRes.json();

// //       if (!tokenData.snap_token) {
// //         // Fallback: redirect ke WooCommerce payment page
// //         if (result.redirect) window.location.href = result.redirect;
// //         else router.push(`/order-confirmation?order=${orderId}`);
// //         return;
// //       }

// //       // 3. Open Midtrans Snap popup
// //       const snap = (window as any).snap;
// //       if (!snap) {
// //         setError("Midtrans Snap belum dimuat. Refresh halaman dan coba lagi.");
// //         setProcessing(false);
// //         return;
// //       }

// //         console.log("snap object:", snap);
// //         console.log("snap_token:", tokenData);

// //       snap.pay(tokenData.snap_token, {
// //         onSuccess: () => {
// //           router.push(`/order-confirmation?order=${orderId}`);
// //         },
// //         onPending: () => {
// //           router.push(`/order-confirmation?order=${orderId}&status=pending`);
// //         },
// //         onError: () => {
// //           setError("Pembayaran gagal. Silakan coba lagi.");
// //           setProcessing(false);
// //         },
// //         onClose: () => {
// //           // User tutup popup tanpa bayar
// //           setProcessing(false);
// //         },
// //       });

// //     } catch (e: any) {
// //       setError(e.message || "Terjadi kesalahan. Silakan coba lagi.");
// //       setProcessing(false);
// //     }
// //   };

// //   const items = cart?.contents?.nodes || [];

// //   return (
// //     <div style={styles.page}>
// //       <h1 className={cormorant.className} style={styles.pageTitle}>Checkout</h1>
// //       <Steps current={step} />

// //       <div style={styles.layout}>
// //         {/* ── Left: Form ── */}
// //         <div style={styles.formCol}>

// //           {error && <div style={styles.errorBox}><p style={styles.errorText}>{error}</p></div>}

// //           {/* Step 0 — Alamat */}
// //           {step === 0 && (
// //             <div>
// //               <p style={styles.sectionTitle}>Alamat Pengiriman</p>
// //               <div style={styles.formGrid}>
// //                 <Field label="Nama Depan *" value={firstName} onChange={setFirstName} half placeholder="John" />
// //                 <Field label="Nama Belakang *" value={lastName} onChange={setLastName} half placeholder="Doe" />
// //                 <Field label="Email *" value={email} onChange={setEmail} type="email" placeholder="email@contoh.com" />
// //                 <Field label="Nomor Telepon *" value={phone} onChange={setPhone} type="tel" placeholder="08xx-xxxx-xxxx" />
// //                 <Field label="Alamat *" value={address1} onChange={setAddress1} placeholder="Jl. Nama Jalan No. X" />
// //                 <Field label="Alamat 2 (opsional)" value={address2} onChange={setAddress2} placeholder="Apartemen, unit, dll" />
// //                 <Field label="Kota *" value={city} onChange={setCity} half placeholder="Jakarta" />
// //                 <Field label="Kode Pos *" value={postcode} onChange={setPostcode} half placeholder="12345" />
// //                 <Field label="Provinsi" value={state} onChange={setState} placeholder="DKI Jakarta" />
// //               </div>
// //               <button style={styles.nextBtn} onClick={handleNextStep}>
// //                 Lanjut ke Pengiriman →
// //               </button>
// //             </div>
// //           )}

// //           {/* Step 1 — Pengiriman */}
// //           {step === 1 && (
// //             <div>
// //               <p style={styles.sectionTitle}>Metode Pengiriman</p>

// //               {/* Address summary */}
// //               <div style={styles.addressSummary}>
// //                 <p style={styles.addressSummaryText}>
// //                   {address1}, {city}, {postcode}
// //                 </p>
// //                 <button style={styles.editLink} onClick={() => setStep(0)}>Ubah</button>
// //               </div>

// //               {shippingLoading ? (
// //                 <div style={styles.shippingLoading}>Memuat opsi pengiriman...</div>
// //               ) : shippingRates.length === 0 ? (
// //                 // Fallback: flat rate sementara KiriminAja belum terhubung
// //                 <div style={styles.rateList}>
// //                   {[
// //                     { id: "flat_rate:1", label: "Pengiriman Reguler (2–5 hari kerja)", cost: "0" },
// //                   ].map((rate) => (
// //                     <label key={rate.id} style={{
// //                       ...styles.rateItem,
// //                       borderColor: selectedRate === rate.id ? "#111" : "#e0e0e0",
// //                       background: selectedRate === rate.id ? "#fafafa" : "#fff",
// //                     }}
// //                       onClick={() => setSelectedRate(rate.id)}
// //                     >
// //                       <div style={styles.rateRadio}>
// //                         <div style={{ ...styles.rateRadioInner, background: selectedRate === rate.id ? "#111" : "transparent" }} />
// //                       </div>
// //                       <div style={styles.rateInfo}>
// //                         <p style={styles.rateLabel}>{rate.label}</p>
// //                         <p style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>Biaya pengiriman dihitung saat konfirmasi order</p>
// //                       </div>
// //                       <p style={styles.rateCost}>Gratis</p>
// //                     </label>
// //                   ))}
// //                 </div>
// //               ) : (
// //                 <div style={styles.rateList}>
// //                   {shippingRates.map((rate) => (
// //                     <label key={rate.id} style={{
// //                       ...styles.rateItem,
// //                       borderColor: selectedRate === rate.id ? "#111" : "#e0e0e0",
// //                       background: selectedRate === rate.id ? "#fafafa" : "#fff",
// //                     }}>
// //                       <input
// //                         type="radio"
// //                         name="shipping"
// //                         value={rate.id}
// //                         checked={selectedRate === rate.id}
// //                         onChange={() => setSelectedRate(rate.id)}
// //                         style={{ display: "none" }}
// //                       />
// //                       <div style={styles.rateRadio}>
// //                         <div style={{
// //                           ...styles.rateRadioInner,
// //                           background: selectedRate === rate.id ? "#111" : "transparent",
// //                         }} />
// //                       </div>
// //                       <div style={styles.rateInfo}>
// //                         <p style={styles.rateLabel}>{rate.label}</p>
// //                       </div>
// //                       <p style={styles.rateCost}>{fmt(rate.cost)}</p>
// //                     </label>
// //                   ))}
// //                 </div>
// //               )}

// //               <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
// //                 <button style={styles.backBtn} onClick={() => setStep(0)}>← Kembali</button>
// //                 <button style={styles.nextBtn} onClick={handleNextStep} disabled={!selectedRate}>
// //                   Lanjut ke Pembayaran →
// //                 </button>
// //               </div>
// //             </div>
// //           )}

// //           {/* Step 2 — Pembayaran */}
// //           {step === 2 && (
// //             <div>
// //               <p style={styles.sectionTitle}>Konfirmasi & Bayar</p>

// //               {/* Summary */}
// //               <div style={styles.confirmSummary}>
// //                 <div style={styles.confirmRow}>
// //                   <span style={styles.confirmLabel}>Alamat</span>
// //                   <span style={styles.confirmValue}>{address1}, {city}, {postcode}</span>
// //                 </div>
// //                 <div style={styles.confirmRow}>
// //                   <span style={styles.confirmLabel}>Pengiriman</span>
// //                   <span style={styles.confirmValue}>
// //                     {shippingRates.find(r => r.id === selectedRate)?.label || "-"}
// //                   </span>
// //                 </div>
// //                 <div style={styles.confirmRow}>
// //                   <span style={styles.confirmLabel}>Pembayaran</span>
// //                   <span style={styles.confirmValue}>Midtrans (Transfer, QRIS, Kartu)</span>
// //                 </div>
// //               </div>

// //               <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
// //                 <button style={styles.backBtn} onClick={() => setStep(1)}>← Kembali</button>
// //                 <button
// //                   style={{ ...styles.payBtn, opacity: processing ? 0.6 : 1, cursor: processing ? "not-allowed" : "pointer" }}
// //                   onClick={handlePay}
// //                   disabled={processing}
// //                 >
// //                   {processing ? "Memproses..." : `Bayar ${cart?.total || ""}`}
// //                 </button>
// //               </div>

// //               <p style={styles.secureNote}>
// //                 🔒 Pembayaran aman diproses oleh Midtrans
// //               </p>
// //             </div>
// //           )}
// //         </div>

// //         {/* ── Right: Order summary ── */}
// //         <div style={styles.summaryCol}>
// //           <p style={styles.summaryTitle}>Ringkasan Pesanan</p>

// //           {cartLoading ? (
// //             <div style={styles.skeletonItem} />
// //           ) : (
// //             <>
// //               <div style={styles.summaryItems}>
// //                 {items.map((item) => (
// //                   <div key={item.key} style={styles.summaryItem}>
// //                     <div style={styles.summaryItemImg}>
// //                       {item.product.node.image?.sourceUrl && (
// //                         <img src={item.product.node.image.sourceUrl} alt={item.product.node.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
// //                       )}
// //                       <span style={styles.summaryItemQty}>{item.quantity}</span>
// //                     </div>
// //                     <p style={styles.summaryItemName}>{item.product.node.name}</p>
// //                     <p style={styles.summaryItemPrice}>{fmt(item.product.node.price)}</p>
// //                   </div>
// //                 ))}
// //               </div>

// //               <div style={styles.summaryDivider} />
// //               <div style={styles.summaryRow}>
// //                 <span style={styles.summaryLabel}>Subtotal</span>
// //                 <span style={styles.summaryValue}>{cart?.subtotal}</span>
// //               </div>
// //               {cart?.shippingTotal && cart.shippingTotal !== "Rp0" && (
// //                 <div style={styles.summaryRow}>
// //                   <span style={styles.summaryLabel}>Ongkir</span>
// //                   <span style={styles.summaryValue}>{cart.shippingTotal}</span>
// //                 </div>
// //               )}
// //               <div style={styles.summaryDivider} />
// //               <div style={styles.summaryRow}>
// //                 <span style={{ ...styles.summaryLabel, fontWeight: 600, color: "#111" }}>Total</span>
// //                 <span style={{ ...styles.summaryValue, fontSize: 16, fontWeight: 600, color: "#111" }}>{cart?.total}</span>
// //               </div>
// //             </>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // ─── Styles ───────────────────────────────────────────────────────────────────
// // const styles: { [key: string]: React.CSSProperties } = {
// //   page: { maxWidth: "1100px", margin: "0 auto", padding: "100px 32px 80px", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
// //   pageTitle: { fontSize: "40px", fontWeight: 400, color: "#111", margin: "0 0 32px", lineHeight: 1 },
// //   layout: { display: "grid", gridTemplateColumns: "1fr 340px", gap: "56px", alignItems: "flex-start" },
// //   formCol: { minWidth: 0 },
// //   sectionTitle: { fontSize: "10px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#aaa", marginBottom: 20 },
// //   formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: 24 },
// //   label: { fontSize: "9px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#aaa" },
// //   input: { width: "100%", padding: "11px 14px", fontSize: "13px", color: "#111", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", background: "#fff", borderWidth: "0.5px", borderStyle: "solid", borderColor: "#e0e0e0", borderRadius: "4px", outline: "none", transition: "border-color 0.15s ease", boxSizing: "border-box" as const },
// //   nextBtn: { height: 48, padding: "0 32px", background: "#111", color: "#fff", border: "none", borderRadius: "4px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, cursor: "pointer", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
// //   backBtn: { height: 48, padding: "0 24px", background: "transparent", color: "#555", border: "0.5px solid #e0e0e0", borderRadius: "4px", fontSize: "11px", fontWeight: 500, cursor: "pointer", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
// //   payBtn: { flex: 1, height: 48, background: "#111", color: "#fff", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 600, letterSpacing: "0.06em", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
// //   errorBox: { background: "#fff5f5", border: "0.5px solid #fca5a5", borderRadius: "4px", padding: "10px 14px", marginBottom: 20 },
// //   errorText: { fontSize: "12px", color: "#dc2626" },
// //   addressSummary: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "#fafafa", borderRadius: "4px", border: "0.5px solid #ebebeb", marginBottom: 20 },
// //   addressSummaryText: { fontSize: "12px", color: "#555" },
// //   editLink: { fontSize: "11px", color: "#6bc1c6", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
// //   shippingLoading: { fontSize: "13px", color: "#aaa", padding: "20px 0" },
// //   shippingEmpty: { padding: "20px 0", display: "flex", flexDirection: "column", gap: 8 },
// //   rateList: { display: "flex", flexDirection: "column", gap: 10 },
// //   rateItem: { display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderWidth: "0.5px", borderStyle: "solid", borderRadius: "6px", cursor: "pointer", transition: "border-color 0.15s ease" },
// //   rateRadio: { width: 18, height: 18, borderRadius: "50%", borderWidth: "1.5px", borderStyle: "solid", borderColor: "#111", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
// //   rateRadioInner: { width: 10, height: 10, borderRadius: "50%", transition: "background 0.15s ease" },
// //   rateInfo: { flex: 1 },
// //   rateLabel: { fontSize: "13px", fontWeight: 500, color: "#111" },
// //   rateCost: { fontSize: "13px", fontWeight: 500, color: "#111" },
// //   confirmSummary: { display: "flex", flexDirection: "column", gap: 0, border: "0.5px solid #ebebeb", borderRadius: "6px", overflow: "hidden" },
// //   confirmRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: "0.5px solid #f0f0f0" },
// //   confirmLabel: { fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#aaa" },
// //   confirmValue: { fontSize: "13px", color: "#111", maxWidth: "60%", textAlign: "right" as const },
// //   secureNote: { fontSize: "11px", color: "#aaa", marginTop: 16, textAlign: "center" as const },

// //   // Summary col
// //   summaryCol: { background: "#fafafa", border: "0.5px solid #ebebeb", borderRadius: "8px", padding: "24px", position: "sticky", top: "120px" },
// //   summaryTitle: { fontSize: "10px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#aaa", marginBottom: 20 },
// //   summaryItems: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 },
// //   summaryItem: { display: "flex", alignItems: "center", gap: 12 },
// //   summaryItemImg: { position: "relative", width: 48, height: 48, borderRadius: "6px", overflow: "hidden", background: "#f5f3ef", flexShrink: 0 },
// //   summaryItemQty: { position: "absolute", top: -6, right: -6, background: "#555", color: "#fff", fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
// //   summaryItemName: { flex: 1, fontSize: 12, color: "#111", fontWeight: 500, lineHeight: 1.4 },
// //   summaryItemPrice: { fontSize: 12, color: "#888", flexShrink: 0 },
// //   summaryDivider: { borderTop: "0.5px solid #ebebeb", margin: "12px 0" },
// //   summaryRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
// //   summaryLabel: { fontSize: 12, color: "#888" },
// //   summaryValue: { fontSize: 13, color: "#555" },
// //   skeletonItem: { height: 60, background: "#f0f0f0", borderRadius: 6 },
// // };

// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { Cormorant_Garamond } from "next/font/google";
// import { getCart } from "@/app/api/graphql/Transaction";
// import { getShippingMethods, updateShippingMethod, checkout, updateOrderPayment } from "@/app/api/graphql/Checkout";

// const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500"] });

// // ─── Types ────────────────────────────────────────────────────────────────────
// type ShippingRate = { id: string; instanceId: number; methodId: string; label: string; cost: string };
// type CartItem = {
//   key: string; quantity: number;
//   product: { node: { name: string; price?: string; image?: { sourceUrl: string } } };
// };
// type Cart = { contents: { nodes: CartItem[] }; subtotal: string; total: string; shippingTotal?: string };

// const fmt = (val?: string) => {
//   if (!val) return "Rp 0";
//   const num = parseFloat(val.replace(/[^0-9.]/g, ""));
//   if (isNaN(num)) return val;
//   return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
// };

// // ─── Step indicator ───────────────────────────────────────────────────────────
// function Steps({ current }: { current: number }) {
//   const steps = ["Alamat", "Pengiriman", "Pembayaran"];
//   return (
//     <div style={stepStyles.wrap}>
//       {steps.map((label, i) => (
//         <div key={label} style={stepStyles.item}>
//           <div style={{
//             ...stepStyles.circle,
//             background: i < current ? "#111" : i === current ? "#111" : "transparent",
//             borderColor: i <= current ? "#111" : "#e0e0e0",
//             color: i < current ? "#fff" : i === current ? "#fff" : "#bbb",
//           }}>
//             {i < current ? (
//               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
//                 <polyline points="20 6 9 17 4 12" />
//               </svg>
//             ) : i + 1}
//           </div>
//           <span style={{ ...stepStyles.label, color: i <= current ? "#111" : "#bbb" }}>{label}</span>
//           {i < steps.length - 1 && <div style={{ ...stepStyles.line, background: i < current ? "#111" : "#e0e0e0" }} />}
//         </div>
//       ))}
//     </div>
//   );
// }

// const stepStyles: { [k: string]: React.CSSProperties } = {
//   wrap: { display: "flex", alignItems: "center", marginBottom: 40 },
//   item: { display: "flex", alignItems: "center", gap: 8 },
//   circle: {
//     width: 28, height: 28, borderRadius: "50%",
//     borderWidth: "1.5px", borderStyle: "solid",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     fontSize: 11, fontWeight: 600,
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//     flexShrink: 0,
//   },
//   label: { fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", marginRight: 8 },
//   line: { width: 40, height: 1, marginRight: 8 },
// };

// // ─── Input ────────────────────────────────────────────────────────────────────
// function Field({ label, value, onChange, type = "text", placeholder = "", half = false }: {
//   label: string; value: string; onChange: (v: string) => void;
//   type?: string; placeholder?: string; half?: boolean;
// }) {
//   return (
//     <div style={{ gridColumn: half ? "span 1" : "span 2", display: "flex", flexDirection: "column", gap: 6 }}>
//       <label style={styles.label}>{label}</label>
//       <input
//         type={type} value={value} placeholder={placeholder}
//         onChange={(e) => onChange(e.target.value)}
//         style={styles.input}
//         onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; }}
//         onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; }}
//       />
//     </div>
//   );
// }

// // ─── Main ─────────────────────────────────────────────────────────────────────
// export default function CheckoutPage() {
//   const { data: session } = useSession();
//   const router = useRouter();

//   const [step, setStep] = useState(0);
//   const [cart, setCart] = useState<Cart | null>(null);
//   const [cartLoading, setCartLoading] = useState(true);
//   const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
//   const [shippingLoading, setShippingLoading] = useState(false);
//   const [selectedRate, setSelectedRate] = useState("");
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState("");

//   // Form state
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState(session?.user?.email || "");
//   const [phone, setPhone] = useState("");
//   const [address1, setAddress1] = useState("");
//   const [address2, setAddress2] = useState("");
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");
//   const [postcode, setPostcode] = useState("");

//   // Prefill email from session
//   useEffect(() => {
//     if (session?.user?.email) setEmail(session.user.email);
//     if (session?.user?.name) {
//       const parts = session.user.name.split(" ");
//       setFirstName(parts[0] || "");
//       setLastName(parts.slice(1).join(" ") || "");
//     }
//   }, [session]);

//   // Fetch cart
//   useEffect(() => {
//     getCart()
//       .then(setCart)
//       .catch(console.error)
//       .finally(() => setCartLoading(false));
//   }, []);

//   // Fetch shipping rates
//   const fetchShipping = useCallback(async () => {
//     if (!city || !postcode) return;
//     setShippingLoading(true);
//     try {
//       const rates = await getShippingMethods({ country: "ID", state, city, postcode });
//       setShippingRates(rates);
//       if (rates.length > 0) setSelectedRate(rates[0].id);
//     } catch (e) {
//       console.error(e);
//     }
//     setShippingLoading(false);
//   }, [city, postcode, state]);

//   const handleNextStep = async () => {
//     setError("");
//     if (step === 0) {
//       if (!firstName || !lastName || !email || !phone || !address1 || !city || !postcode) {
//         setError("Harap lengkapi semua field yang wajib diisi.");
//         return;
//       }
//       await fetchShipping();
//       setStep(1);
//     } else if (step === 1) {
//       if (!selectedRate) {
//         setError("Pilih metode pengiriman terlebih dahulu.");
//         return;
//       }
//       // Update shipping method in WooCommerce cart
//       setShippingLoading(true);
//       try {
//         await updateShippingMethod(selectedRate);
//         const updated = await getCart();
//         setCart(updated);
//       } catch (e) { console.error(e); }
//       setShippingLoading(false);
//       setStep(2);
//     }
//   };

//   const handlePay = async () => {
//     setProcessing(true);
//     setError("");

//     try {
//       // 1. Create order via WooCommerce dengan midtrans
//       const result = await checkout({
//         billing: { firstName, lastName, email, phone, address1, address2, city, state, postcode, country: "ID" },
//         paymentMethod: "midtrans",
//         shippingMethod: selectedRate ? [selectedRate] : undefined,
//       });

//       if (!result?.order?.databaseId) {
//         setError("Gagal membuat pesanan. Silakan coba lagi.");
//         setProcessing(false);
//         return;
//       }

//       const orderId = result.order.databaseId;

//       // 2. Cek apakah snap_token ada di redirect URL
//       // WooCommerce Midtrans plugin taruh token di: /checkout/order-pay/ID/?key=xxx&snap_token=xxx
//       let snapToken: string | null = null;

//       if (result.redirect) {
//         try {
//           const redirectUrl = new URL(result.redirect);
//           snapToken = redirectUrl.searchParams.get("snap_token");
//         } catch (e) {
//           console.error("Failed to parse redirect URL:", e);
//         }
//       }

//       // 3. Kalau tidak dapat dari redirect, generate sendiri via API
//       if (!snapToken) {
//         const rawTotal = result.order.total || cart?.total || "0";
//         const grossAmount = parseFloat(String(rawTotal).replace(/[^0-9.]/g, ""));

//         const tokenRes = await fetch("/api/midtrans-token", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ orderId, grossAmount, firstName, lastName, email, phone }),
//         });
//         const tokenData = await tokenRes.json();
//         snapToken = tokenData.snap_token || null;
//       }

//       if (!snapToken) {
//         setError("Gagal memuat pembayaran. Silakan coba lagi.");
//         setProcessing(false);
//         return;
//       }

//       // 4. Open Midtrans Snap popup — jangan redirect ke WordPress
//       const snap = (window as any).snap;
//       if (!snap) {
//         setError("Midtrans Snap belum dimuat. Refresh dan coba lagi.");
//         setProcessing(false);
//         return;
//       }

//       snap.pay(snapToken, {
//         onSuccess: async (result: any) => {
//           // Update order di WooCommerce: set status processing + transaction ID
//           try {
//             await updateOrderPayment(orderId, result.transaction_id || "");
//           } catch (e) {
//             console.error("Failed to update order:", e);
//           }
//           router.push(`/order-confirmation?order=${orderId}`);
//         },
//         onPending: () => {
//           router.push(`/order-confirmation?order=${orderId}&status=pending`);
//         },
//         onError: () => {
//           setError("Pembayaran gagal. Silakan coba lagi.");
//           setProcessing(false);
//         },
//         onClose: () => {
//           setProcessing(false);
//         },
//       });

//     } catch (e: any) {
//       setError(e.message || "Terjadi kesalahan. Silakan coba lagi.");
//       setProcessing(false);
//     }
//   };

//   const items = cart?.contents?.nodes || [];

//   return (
//     <div style={styles.page}>
//       <h1 className={cormorant.className} style={styles.pageTitle}>Checkout</h1>
//       <Steps current={step} />

//       <div style={styles.layout}>
//         {/* ── Left: Form ── */}
//         <div style={styles.formCol}>

//           {error && <div style={styles.errorBox}><p style={styles.errorText}>{error}</p></div>}

//           {/* Step 0 — Alamat */}
//           {step === 0 && (
//             <div>
//               <p style={styles.sectionTitle}>Alamat Pengiriman</p>
//               <div style={styles.formGrid}>
//                 <Field label="Nama Depan *" value={firstName} onChange={setFirstName} half placeholder="John" />
//                 <Field label="Nama Belakang *" value={lastName} onChange={setLastName} half placeholder="Doe" />
//                 <Field label="Email *" value={email} onChange={setEmail} type="email" placeholder="email@contoh.com" />
//                 <Field label="Nomor Telepon *" value={phone} onChange={setPhone} type="tel" placeholder="08xx-xxxx-xxxx" />
//                 <Field label="Alamat *" value={address1} onChange={setAddress1} placeholder="Jl. Nama Jalan No. X" />
//                 <Field label="Alamat 2 (opsional)" value={address2} onChange={setAddress2} placeholder="Apartemen, unit, dll" />
//                 <Field label="Kota *" value={city} onChange={setCity} half placeholder="Jakarta" />
//                 <Field label="Kode Pos *" value={postcode} onChange={setPostcode} half placeholder="12345" />
//                 <Field label="Provinsi" value={state} onChange={setState} placeholder="DKI Jakarta" />
//               </div>
//               <button style={styles.nextBtn} onClick={handleNextStep}>
//                 Lanjut ke Pengiriman →
//               </button>
//             </div>
//           )}

//           {/* Step 1 — Pengiriman */}
//           {step === 1 && (
//             <div>
//               <p style={styles.sectionTitle}>Metode Pengiriman</p>

//               {/* Address summary */}
//               <div style={styles.addressSummary}>
//                 <p style={styles.addressSummaryText}>
//                   {address1}, {city}, {postcode}
//                 </p>
//                 <button style={styles.editLink} onClick={() => setStep(0)}>Ubah</button>
//               </div>

//               {shippingLoading ? (
//                 <div style={styles.shippingLoading}>Memuat opsi pengiriman...</div>
//               ) : shippingRates.length === 0 ? (
//                 // Fallback: flat rate sementara KiriminAja belum terhubung
//                 <div style={styles.rateList}>
//                   {[
//                     { id: "flat_rate:1", label: "Pengiriman Reguler (2–5 hari kerja)", cost: "0" },
//                   ].map((rate) => (
//                     <label key={rate.id} style={{
//                       ...styles.rateItem,
//                       borderColor: selectedRate === rate.id ? "#111" : "#e0e0e0",
//                       background: selectedRate === rate.id ? "#fafafa" : "#fff",
//                     }}
//                       onClick={() => setSelectedRate(rate.id)}
//                     >
//                       <div style={styles.rateRadio}>
//                         <div style={{ ...styles.rateRadioInner, background: selectedRate === rate.id ? "#111" : "transparent" }} />
//                       </div>
//                       <div style={styles.rateInfo}>
//                         <p style={styles.rateLabel}>{rate.label}</p>
//                         <p style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>Biaya pengiriman dihitung saat konfirmasi order</p>
//                       </div>
//                       <p style={styles.rateCost}>Gratis</p>
//                     </label>
//                   ))}
//                 </div>
//               ) : (
//                 <div style={styles.rateList}>
//                   {shippingRates.map((rate) => (
//                     <label key={rate.id} style={{
//                       ...styles.rateItem,
//                       borderColor: selectedRate === rate.id ? "#111" : "#e0e0e0",
//                       background: selectedRate === rate.id ? "#fafafa" : "#fff",
//                     }}>
//                       <input
//                         type="radio"
//                         name="shipping"
//                         value={rate.id}
//                         checked={selectedRate === rate.id}
//                         onChange={() => setSelectedRate(rate.id)}
//                         style={{ display: "none" }}
//                       />
//                       <div style={styles.rateRadio}>
//                         <div style={{
//                           ...styles.rateRadioInner,
//                           background: selectedRate === rate.id ? "#111" : "transparent",
//                         }} />
//                       </div>
//                       <div style={styles.rateInfo}>
//                         <p style={styles.rateLabel}>{rate.label}</p>
//                       </div>
//                       <p style={styles.rateCost}>{fmt(rate.cost)}</p>
//                     </label>
//                   ))}
//                 </div>
//               )}

//               <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
//                 <button style={styles.backBtn} onClick={() => setStep(0)}>← Kembali</button>
//                 <button style={styles.nextBtn} onClick={handleNextStep} disabled={!selectedRate}>
//                   Lanjut ke Pembayaran →
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Step 2 — Pembayaran */}
//           {step === 2 && (
//             <div>
//               <p style={styles.sectionTitle}>Konfirmasi & Bayar</p>

//               {/* Summary */}
//               <div style={styles.confirmSummary}>
//                 <div style={styles.confirmRow}>
//                   <span style={styles.confirmLabel}>Alamat</span>
//                   <span style={styles.confirmValue}>{address1}, {city}, {postcode}</span>
//                 </div>
//                 <div style={styles.confirmRow}>
//                   <span style={styles.confirmLabel}>Pengiriman</span>
//                   <span style={styles.confirmValue}>
//                     {shippingRates.find(r => r.id === selectedRate)?.label || "-"}
//                   </span>
//                 </div>
//                 <div style={styles.confirmRow}>
//                   <span style={styles.confirmLabel}>Pembayaran</span>
//                   <span style={styles.confirmValue}>Midtrans (Transfer, QRIS, Kartu)</span>
//                 </div>
//               </div>

//               <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
//                 <button style={styles.backBtn} onClick={() => setStep(1)}>← Kembali</button>
//                 <button
//                   style={{ ...styles.payBtn, opacity: processing ? 0.6 : 1, cursor: processing ? "not-allowed" : "pointer" }}
//                   onClick={handlePay}
//                   disabled={processing}
//                 >
//                   {processing ? "Memproses..." : `Bayar ${cart?.total || ""}`}
//                 </button>
//               </div>

//               <p style={styles.secureNote}>
//                 🔒 Pembayaran aman diproses oleh Midtrans
//               </p>
//             </div>
//           )}
//         </div>

//         {/* ── Right: Order summary ── */}
//         <div style={styles.summaryCol}>
//           <p style={styles.summaryTitle}>Ringkasan Pesanan</p>

//           {cartLoading ? (
//             <div style={styles.skeletonItem} />
//           ) : (
//             <>
//               <div style={styles.summaryItems}>
//                 {items.map((item) => (
//                   <div key={item.key} style={styles.summaryItem}>
//                     <div style={styles.summaryItemImg}>
//                       {item.product.node.image?.sourceUrl && (
//                         <img src={item.product.node.image.sourceUrl} alt={item.product.node.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                       )}
//                       <span style={styles.summaryItemQty}>{item.quantity}</span>
//                     </div>
//                     <p style={styles.summaryItemName}>{item.product.node.name}</p>
//                     <p style={styles.summaryItemPrice}>{fmt(item.product.node.price)}</p>
//                   </div>
//                 ))}
//               </div>

//               <div style={styles.summaryDivider} />
//               <div style={styles.summaryRow}>
//                 <span style={styles.summaryLabel}>Subtotal</span>
//                 <span style={styles.summaryValue}>{cart?.subtotal}</span>
//               </div>
//               {cart?.shippingTotal && cart.shippingTotal !== "Rp0" && (
//                 <div style={styles.summaryRow}>
//                   <span style={styles.summaryLabel}>Ongkir</span>
//                   <span style={styles.summaryValue}>{cart.shippingTotal}</span>
//                 </div>
//               )}
//               <div style={styles.summaryDivider} />
//               <div style={styles.summaryRow}>
//                 <span style={{ ...styles.summaryLabel, fontWeight: 600, color: "#111" }}>Total</span>
//                 <span style={{ ...styles.summaryValue, fontSize: 16, fontWeight: 600, color: "#111" }}>{cart?.total}</span>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Styles ───────────────────────────────────────────────────────────────────
// const styles: { [key: string]: React.CSSProperties } = {
//   page: { maxWidth: "1100px", margin: "0 auto", padding: "100px 32px 80px", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
//   pageTitle: { fontSize: "40px", fontWeight: 400, color: "#111", margin: "0 0 32px", lineHeight: 1 },
//   layout: { display: "grid", gridTemplateColumns: "1fr 340px", gap: "56px", alignItems: "flex-start" },
//   formCol: { minWidth: 0 },
//   sectionTitle: { fontSize: "10px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#aaa", marginBottom: 20 },
//   formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: 24 },
//   label: { fontSize: "9px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#aaa" },
//   input: { width: "100%", padding: "11px 14px", fontSize: "13px", color: "#111", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", background: "#fff", borderWidth: "0.5px", borderStyle: "solid", borderColor: "#e0e0e0", borderRadius: "4px", outline: "none", transition: "border-color 0.15s ease", boxSizing: "border-box" as const },
//   nextBtn: { height: 48, padding: "0 32px", background: "#111", color: "#fff", border: "none", borderRadius: "4px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, cursor: "pointer", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
//   backBtn: { height: 48, padding: "0 24px", background: "transparent", color: "#555", border: "0.5px solid #e0e0e0", borderRadius: "4px", fontSize: "11px", fontWeight: 500, cursor: "pointer", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
//   payBtn: { flex: 1, height: 48, background: "#111", color: "#fff", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 600, letterSpacing: "0.06em", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
//   errorBox: { background: "#fff5f5", border: "0.5px solid #fca5a5", borderRadius: "4px", padding: "10px 14px", marginBottom: 20 },
//   errorText: { fontSize: "12px", color: "#dc2626" },
//   addressSummary: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "#fafafa", borderRadius: "4px", border: "0.5px solid #ebebeb", marginBottom: 20 },
//   addressSummaryText: { fontSize: "12px", color: "#555" },
//   editLink: { fontSize: "11px", color: "#6bc1c6", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
//   shippingLoading: { fontSize: "13px", color: "#aaa", padding: "20px 0" },
//   shippingEmpty: { padding: "20px 0", display: "flex", flexDirection: "column", gap: 8 },
//   rateList: { display: "flex", flexDirection: "column", gap: 10 },
//   rateItem: { display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderWidth: "0.5px", borderStyle: "solid", borderRadius: "6px", cursor: "pointer", transition: "border-color 0.15s ease" },
//   rateRadio: { width: 18, height: 18, borderRadius: "50%", borderWidth: "1.5px", borderStyle: "solid", borderColor: "#111", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
//   rateRadioInner: { width: 10, height: 10, borderRadius: "50%", transition: "background 0.15s ease" },
//   rateInfo: { flex: 1 },
//   rateLabel: { fontSize: "13px", fontWeight: 500, color: "#111" },
//   rateCost: { fontSize: "13px", fontWeight: 500, color: "#111" },
//   confirmSummary: { display: "flex", flexDirection: "column", gap: 0, border: "0.5px solid #ebebeb", borderRadius: "6px", overflow: "hidden" },
//   confirmRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: "0.5px solid #f0f0f0" },
//   confirmLabel: { fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#aaa" },
//   confirmValue: { fontSize: "13px", color: "#111", maxWidth: "60%", textAlign: "right" as const },
//   secureNote: { fontSize: "11px", color: "#aaa", marginTop: 16, textAlign: "center" as const },

//   // Summary col
//   summaryCol: { background: "#fafafa", border: "0.5px solid #ebebeb", borderRadius: "8px", padding: "24px", position: "sticky", top: "120px" },
//   summaryTitle: { fontSize: "10px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#aaa", marginBottom: 20 },
//   summaryItems: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 },
//   summaryItem: { display: "flex", alignItems: "center", gap: 12 },
//   summaryItemImg: { position: "relative", width: 48, height: 48, borderRadius: "6px", overflow: "hidden", background: "#f5f3ef", flexShrink: 0 },
//   summaryItemQty: { position: "absolute", top: -6, right: -6, background: "#555", color: "#fff", fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
//   summaryItemName: { flex: 1, fontSize: 12, color: "#111", fontWeight: 500, lineHeight: 1.4 },
//   summaryItemPrice: { fontSize: 12, color: "#888", flexShrink: 0 },
//   summaryDivider: { borderTop: "0.5px solid #ebebeb", margin: "12px 0" },
//   summaryRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
//   summaryLabel: { fontSize: 12, color: "#888" },
//   summaryValue: { fontSize: 13, color: "#555" },
//   skeletonItem: { height: 60, background: "#f0f0f0", borderRadius: 6 },
// };


// ke-2
// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { Cormorant_Garamond } from "next/font/google";
// import { getCart } from "@/app/api/graphql/Transaction";
// import { getShippingMethods, updateShippingMethod, checkout, updateOrderPayment } from "@/app/api/graphql/Checkout";

// const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500"] });

// // ─── Types ────────────────────────────────────────────────────────────────────
// type ShippingRate = {
//   id: string;
//   courierCode: string;
//   courierName: string;
//   serviceCode: string;
//   serviceName: string;
//   description?: string;
//   duration?: string;
//   price: number;
//   type?: string;
// };
// type CartItem = {
//   key: string; quantity: number;
//   product: { node: { name: string; price?: string; image?: { sourceUrl: string } } };
// };
// type Cart = { contents: { nodes: CartItem[] }; subtotal: string; total: string; shippingTotal?: string };

// const fmt = (val?: string) => {
//   if (!val) return "Rp 0";
//   const num = parseFloat(val.replace(/[^0-9.]/g, ""));
//   if (isNaN(num)) return val;
//   return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
// };

// // ─── Step indicator ───────────────────────────────────────────────────────────
// function Steps({ current }: { current: number }) {
//   const steps = ["Alamat", "Pengiriman", "Pembayaran"];
//   return (
//     <div style={stepStyles.wrap}>
//       {steps.map((label, i) => (
//         <div key={label} style={stepStyles.item}>
//           <div style={{
//             ...stepStyles.circle,
//             background: i < current ? "#111" : i === current ? "#111" : "transparent",
//             borderColor: i <= current ? "#111" : "#e0e0e0",
//             color: i < current ? "#fff" : i === current ? "#fff" : "#bbb",
//           }}>
//             {i < current ? (
//               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
//                 <polyline points="20 6 9 17 4 12" />
//               </svg>
//             ) : i + 1}
//           </div>
//           <span style={{ ...stepStyles.label, color: i <= current ? "#111" : "#bbb" }}>{label}</span>
//           {i < steps.length - 1 && <div style={{ ...stepStyles.line, background: i < current ? "#111" : "#e0e0e0" }} />}
//         </div>
//       ))}
//     </div>
//   );
// }

// const stepStyles: { [k: string]: React.CSSProperties } = {
//   wrap: { display: "flex", alignItems: "center", marginBottom: 40 },
//   item: { display: "flex", alignItems: "center", gap: 8 },
//   circle: {
//     width: 28, height: 28, borderRadius: "50%",
//     borderWidth: "1.5px", borderStyle: "solid",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     fontSize: 11, fontWeight: 600,
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//     flexShrink: 0,
//   },
//   label: { fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", marginRight: 8 },
//   line: { width: 40, height: 1, marginRight: 8 },
// };

// // ─── Input ────────────────────────────────────────────────────────────────────
// function Field({ label, value, onChange, type = "text", placeholder = "", half = false }: {
//   label: string; value: string; onChange: (v: string) => void;
//   type?: string; placeholder?: string; half?: boolean;
// }) {
//   return (
//     <div style={{ gridColumn: half ? "span 1" : "span 2", display: "flex", flexDirection: "column", gap: 6 }}>
//       <label style={styles.label}>{label}</label>
//       <input
//         type={type} value={value} placeholder={placeholder}
//         onChange={(e) => onChange(e.target.value)}
//         style={styles.input}
//         onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; }}
//         onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; }}
//       />
//     </div>
//   );
// }

// // ─── Main ─────────────────────────────────────────────────────────────────────
// export default function CheckoutPage() {
//   const { data: session } = useSession();
//   const router = useRouter();

//   const [step, setStep] = useState(0);
//   const [cart, setCart] = useState<Cart | null>(null);
//   const [cartLoading, setCartLoading] = useState(true);
//   const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
//   const [shippingLoading, setShippingLoading] = useState(false);
//   const [selectedRate, setSelectedRate] = useState("");
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState("");

//   // Form state
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState(session?.user?.email || "");
//   const [phone, setPhone] = useState("");
//   const [address1, setAddress1] = useState("");
//   const [address2, setAddress2] = useState("");
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");
//   const [postcode, setPostcode] = useState("");

//   // Prefill email from session
//   useEffect(() => {
//     if (session?.user?.email) setEmail(session.user.email);
//     if (session?.user?.name) {
//       const parts = session.user.name.split(" ");
//       setFirstName(parts[0] || "");
//       setLastName(parts.slice(1).join(" ") || "");
//     }
//   }, [session]);

//   // Fetch cart
//   useEffect(() => {
//     getCart()
//       .then(setCart)
//       .catch(console.error)
//       .finally(() => setCartLoading(false));
//   }, []);

//   // Fetch shipping rates dari Biteship
//   const fetchShipping = useCallback(async () => {
//     if (!postcode) return;
//     setShippingLoading(true);
//     try {
//       const cartItems = cart?.contents?.nodes || [];
//       const items = cartItems.map((item) => ({
//         name: item.product.node.name,
//         value: parseFloat((item.product.node.price || "0").replace(/[^0-9.]/g, "")),
//         weight: 1000, // default 1kg — TODO: ambil dari product weight jika ada
//         quantity: item.quantity,
//       }));

//       if (items.length === 0) {
//         items.push({ name: "Produk", value: 0, weight: 1000, quantity: 1 });
//       }

//       const rates = await getShippingMethods({
//         destinationPostalCode: postcode,
//         items,
//       });

//       setShippingRates(rates);
//       if (rates.length > 0) setSelectedRate(rates[0].id);
//     } catch (e) {
//       console.error("Biteship error:", e);
//     }
//     setShippingLoading(false);
//   }, [postcode, cart]);

//   const handleNextStep = async () => {
//     setError("");
//     if (step === 0) {
//       if (!firstName || !lastName || !email || !phone || !address1 || !city || !postcode) {
//         setError("Harap lengkapi semua field yang wajib diisi.");
//         return;
//       }
//       await fetchShipping();
//       setStep(1);
//     } else if (step === 1) {
//       if (!selectedRate) {
//         setError("Pilih metode pengiriman terlebih dahulu.");
//         return;
//       }
//       // Update shipping method in WooCommerce cart
//       setShippingLoading(true);
//       try {
//         await updateShippingMethod(selectedRate);
//         const updated = await getCart();
//         setCart(updated);
//       } catch (e) { console.error(e); }
//       setShippingLoading(false);
//       setStep(2);
//     }
//   };

//   const handlePay = async () => {
//     setProcessing(true);
//     setError("");

//     try {
//       // 1. Create order via WooCommerce dengan midtrans
//       const result = await checkout({
//         billing: { firstName, lastName, email, phone, address1, address2, city, state, postcode, country: "ID" },
//         paymentMethod: "midtrans",
//         shippingMethod: selectedRate ? [selectedRate] : undefined,
//       });

//       if (!result?.order?.databaseId) {
//         setError("Gagal membuat pesanan. Silakan coba lagi.");
//         setProcessing(false);
//         return;
//       }

//       const orderId = result.order.databaseId;

//       // 2. Cek apakah snap_token ada di redirect URL
//       // WooCommerce Midtrans plugin taruh token di: /checkout/order-pay/ID/?key=xxx&snap_token=xxx
//       let snapToken: string | null = null;

//       if (result.redirect) {
//         try {
//           const redirectUrl = new URL(result.redirect);
//           snapToken = redirectUrl.searchParams.get("snap_token");
//         } catch (e) {
//           console.error("Failed to parse redirect URL:", e);
//         }
//       }

//       // 3. Kalau tidak dapat dari redirect, generate sendiri via API
//       if (!snapToken) {
//         const rawTotal = result.order.total || cart?.total || "0";
//         const grossAmount = parseFloat(String(rawTotal).replace(/[^0-9.]/g, ""));

//         const tokenRes = await fetch("/api/midtrans-token", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ orderId, grossAmount, firstName, lastName, email, phone }),
//         });
//         const tokenData = await tokenRes.json();
//         snapToken = tokenData.snap_token || null;
//       }

//       if (!snapToken) {
//         setError("Gagal memuat pembayaran. Silakan coba lagi.");
//         setProcessing(false);
//         return;
//       }

//       // 4. Open Midtrans Snap popup — jangan redirect ke WordPress
//       const snap = (window as any).snap;
//       if (!snap) {
//         setError("Midtrans Snap belum dimuat. Refresh dan coba lagi.");
//         setProcessing(false);
//         return;
//       }

//       snap.pay(snapToken, {
//         onSuccess: async (result: any) => {
//           // Update order di WooCommerce: set status processing + transaction ID
//           try {
//             await updateOrderPayment(orderId, result.transaction_id || "");
//           } catch (e) {
//             console.error("Failed to update order:", e);
//           }
//           router.push(`/order-confirmation?order=${orderId}`);
//         },
//         onPending: () => {
//           router.push(`/order-confirmation?order=${orderId}&status=pending`);
//         },
//         onError: () => {
//           setError("Pembayaran gagal. Silakan coba lagi.");
//           setProcessing(false);
//         },
//         onClose: () => {
//           setProcessing(false);
//         },
//       });

//     } catch (e: any) {
//       setError(e.message || "Terjadi kesalahan. Silakan coba lagi.");
//       setProcessing(false);
//     }
//   };

//   const items = cart?.contents?.nodes || [];

//   return (
//     <div style={styles.page}>
//       <h1 className={cormorant.className} style={styles.pageTitle}>Checkout</h1>
//       <Steps current={step} />

//       <div style={styles.layout}>
//         {/* ── Left: Form ── */}
//         <div style={styles.formCol}>

//           {error && <div style={styles.errorBox}><p style={styles.errorText}>{error}</p></div>}

//           {/* Step 0 — Alamat */}
//           {step === 0 && (
//             <div>
//               <p style={styles.sectionTitle}>Alamat Pengiriman</p>
//               <div style={styles.formGrid}>
//                 <Field label="Nama Depan *" value={firstName} onChange={setFirstName} half placeholder="John" />
//                 <Field label="Nama Belakang *" value={lastName} onChange={setLastName} half placeholder="Doe" />
//                 <Field label="Email *" value={email} onChange={setEmail} type="email" placeholder="email@contoh.com" />
//                 <Field label="Nomor Telepon *" value={phone} onChange={setPhone} type="tel" placeholder="08xx-xxxx-xxxx" />
//                 <Field label="Alamat *" value={address1} onChange={setAddress1} placeholder="Jl. Nama Jalan No. X" />
//                 <Field label="Alamat 2 (opsional)" value={address2} onChange={setAddress2} placeholder="Apartemen, unit, dll" />
//                 <Field label="Kota *" value={city} onChange={setCity} half placeholder="Jakarta" />
//                 <Field label="Kode Pos *" value={postcode} onChange={setPostcode} half placeholder="12345" />
//                 <Field label="Provinsi" value={state} onChange={setState} placeholder="DKI Jakarta" />
//               </div>
//               <button style={styles.nextBtn} onClick={handleNextStep}>
//                 Lanjut ke Pengiriman →
//               </button>
//             </div>
//           )}

//           {/* Step 1 — Pengiriman */}
//           {step === 1 && (
//             <div>
//               <p style={styles.sectionTitle}>Metode Pengiriman</p>

//               {/* Address summary */}
//               <div style={styles.addressSummary}>
//                 <p style={styles.addressSummaryText}>
//                   {address1}, {city}, {postcode}
//                 </p>
//                 <button style={styles.editLink} onClick={() => setStep(0)}>Ubah</button>
//               </div>

//               {shippingLoading ? (
//                 <div style={styles.shippingLoading}>Memuat opsi pengiriman...</div>
//               ) : shippingRates.length === 0 ? (
//                 // Fallback: flat rate sementara KiriminAja belum terhubung
//                 <div style={styles.rateList}>
//                   {[
//                     { id: "flat_rate:1", label: "Pengiriman Reguler (2–5 hari kerja)", cost: "0" },
//                   ].map((rate) => (
//                     <label key={rate.id} style={{
//                       ...styles.rateItem,
//                       borderColor: selectedRate === rate.id ? "#111" : "#e0e0e0",
//                       background: selectedRate === rate.id ? "#fafafa" : "#fff",
//                     }}
//                       onClick={() => setSelectedRate(rate.id)}
//                     >
//                       <div style={styles.rateRadio}>
//                         <div style={{ ...styles.rateRadioInner, background: selectedRate === rate.id ? "#111" : "transparent" }} />
//                       </div>
//                       <div style={styles.rateInfo}>
//                         <p style={styles.rateLabel}>{rate.label}</p>
//                         <p style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>Biaya pengiriman dihitung saat konfirmasi order</p>
//                       </div>
//                       <p style={styles.rateCost}>Gratis</p>
//                     </label>
//                   ))}
//                 </div>
//               ) : (
//                 <div style={styles.rateList}>
//                   {shippingRates.map((rate: any) => (
//                     <label key={rate.id} style={{
//                       ...styles.rateItem,
//                       borderColor: selectedRate === rate.id ? "#111" : "#e0e0e0",
//                       background: selectedRate === rate.id ? "#fafafa" : "#fff",
//                     }}>
//                       <input
//                         type="radio"
//                         name="shipping"
//                         value={rate.id}
//                         checked={selectedRate === rate.id}
//                         onChange={() => setSelectedRate(rate.id)}
//                         style={{ display: "none" }}
//                       />
//                       <div style={styles.rateRadio}>
//                         <div style={{
//                           ...styles.rateRadioInner,
//                           background: selectedRate === rate.id ? "#111" : "transparent",
//                         }} />
//                       </div>
//                       <div style={styles.rateInfo}>
//                         <p style={styles.rateLabel}>
//                           {rate.courierName} — {rate.serviceName}
//                         </p>
//                         {(rate.duration || rate.description) && (
//                           <p style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
//                             {rate.duration ? `Estimasi ${rate.duration}` : rate.description}
//                           </p>
//                         )}
//                       </div>
//                       <p style={styles.rateCost}>
//                         {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(rate.price || 0)}
//                       </p>
//                     </label>
//                   ))}
//                 </div>
//               )}

//               <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
//                 <button style={styles.backBtn} onClick={() => setStep(0)}>← Kembali</button>
//                 <button style={styles.nextBtn} onClick={handleNextStep} disabled={!selectedRate}>
//                   Lanjut ke Pembayaran →
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Step 2 — Pembayaran */}
//           {step === 2 && (
//             <div>
//               <p style={styles.sectionTitle}>Konfirmasi & Bayar</p>

//               {/* Summary */}
//               <div style={styles.confirmSummary}>
//                 <div style={styles.confirmRow}>
//                   <span style={styles.confirmLabel}>Alamat</span>
//                   <span style={styles.confirmValue}>{address1}, {city}, {postcode}</span>
//                 </div>
//                 <div style={styles.confirmRow}>
//                   <span style={styles.confirmLabel}>Pengiriman</span>
//                   <span style={styles.confirmValue}>
//                     {(() => {
//                       const rate = shippingRates.find((r: any) => r.id === selectedRate);
//                       if (!rate) return "Pengiriman Reguler";
//                       return `${rate.courierName} — ${rate.serviceName}`;
//                     })()}
//                   </span>
//                 </div>
//                 <div style={styles.confirmRow}>
//                   <span style={styles.confirmLabel}>Pembayaran</span>
//                   <span style={styles.confirmValue}>Midtrans (Transfer, QRIS, Kartu)</span>
//                 </div>
//               </div>

//               <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
//                 <button style={styles.backBtn} onClick={() => setStep(1)}>← Kembali</button>
//                 <button
//                   style={{ ...styles.payBtn, opacity: processing ? 0.6 : 1, cursor: processing ? "not-allowed" : "pointer" }}
//                   onClick={handlePay}
//                   disabled={processing}
//                 >
//                   {processing ? "Memproses..." : `Bayar ${cart?.total || ""}`}
//                 </button>
//               </div>

//               <p style={styles.secureNote}>
//                 🔒 Pembayaran aman diproses oleh Midtrans
//               </p>
//             </div>
//           )}
//         </div>

//         {/* ── Right: Order summary ── */}
//         <div style={styles.summaryCol}>
//           <p style={styles.summaryTitle}>Ringkasan Pesanan</p>

//           {cartLoading ? (
//             <div style={styles.skeletonItem} />
//           ) : (
//             <>
//               <div style={styles.summaryItems}>
//                 {items.map((item) => (
//                   <div key={item.key} style={styles.summaryItem}>
//                     <div style={styles.summaryItemImg}>
//                       {item.product.node.image?.sourceUrl && (
//                         <img src={item.product.node.image.sourceUrl} alt={item.product.node.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                       )}
//                       <span style={styles.summaryItemQty}>{item.quantity}</span>
//                     </div>
//                     <p style={styles.summaryItemName}>{item.product.node.name}</p>
//                     <p style={styles.summaryItemPrice}>{fmt(item.product.node.price)}</p>
//                   </div>
//                 ))}
//               </div>

//               <div style={styles.summaryDivider} />
//               <div style={styles.summaryRow}>
//                 <span style={styles.summaryLabel}>Subtotal</span>
//                 <span style={styles.summaryValue}>{cart?.subtotal}</span>
//               </div>
//               {cart?.shippingTotal && cart.shippingTotal !== "Rp0" && (
//                 <div style={styles.summaryRow}>
//                   <span style={styles.summaryLabel}>Ongkir</span>
//                   <span style={styles.summaryValue}>{cart.shippingTotal}</span>
//                 </div>
//               )}
//               <div style={styles.summaryDivider} />
//               <div style={styles.summaryRow}>
//                 <span style={{ ...styles.summaryLabel, fontWeight: 600, color: "#111" }}>Total</span>
//                 <span style={{ ...styles.summaryValue, fontSize: 16, fontWeight: 600, color: "#111" }}>{cart?.total}</span>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Styles ───────────────────────────────────────────────────────────────────
// const styles: { [key: string]: React.CSSProperties } = {
//   page: { maxWidth: "1100px", margin: "0 auto", padding: "100px 32px 80px", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
//   pageTitle: { fontSize: "40px", fontWeight: 400, color: "#111", margin: "0 0 32px", lineHeight: 1 },
//   layout: { display: "grid", gridTemplateColumns: "1fr 340px", gap: "56px", alignItems: "flex-start" },
//   formCol: { minWidth: 0 },
//   sectionTitle: { fontSize: "10px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#aaa", marginBottom: 20 },
//   formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: 24 },
//   label: { fontSize: "9px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#aaa" },
//   input: { width: "100%", padding: "11px 14px", fontSize: "13px", color: "#111", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", background: "#fff", borderWidth: "0.5px", borderStyle: "solid", borderColor: "#e0e0e0", borderRadius: "4px", outline: "none", transition: "border-color 0.15s ease", boxSizing: "border-box" as const },
//   nextBtn: { height: 48, padding: "0 32px", background: "#111", color: "#fff", border: "none", borderRadius: "4px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, cursor: "pointer", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
//   backBtn: { height: 48, padding: "0 24px", background: "transparent", color: "#555", border: "0.5px solid #e0e0e0", borderRadius: "4px", fontSize: "11px", fontWeight: 500, cursor: "pointer", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
//   payBtn: { flex: 1, height: 48, background: "#111", color: "#fff", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 600, letterSpacing: "0.06em", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
//   errorBox: { background: "#fff5f5", border: "0.5px solid #fca5a5", borderRadius: "4px", padding: "10px 14px", marginBottom: 20 },
//   errorText: { fontSize: "12px", color: "#dc2626" },
//   addressSummary: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "#fafafa", borderRadius: "4px", border: "0.5px solid #ebebeb", marginBottom: 20 },
//   addressSummaryText: { fontSize: "12px", color: "#555" },
//   editLink: { fontSize: "11px", color: "#6bc1c6", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
//   shippingLoading: { fontSize: "13px", color: "#aaa", padding: "20px 0" },
//   shippingEmpty: { padding: "20px 0", display: "flex", flexDirection: "column", gap: 8 },
//   rateList: { display: "flex", flexDirection: "column", gap: 10 },
//   rateItem: { display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderWidth: "0.5px", borderStyle: "solid", borderRadius: "6px", cursor: "pointer", transition: "border-color 0.15s ease" },
//   rateRadio: { width: 18, height: 18, borderRadius: "50%", borderWidth: "1.5px", borderStyle: "solid", borderColor: "#111", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
//   rateRadioInner: { width: 10, height: 10, borderRadius: "50%", transition: "background 0.15s ease" },
//   rateInfo: { flex: 1 },
//   rateLabel: { fontSize: "13px", fontWeight: 500, color: "#111" },
//   rateCost: { fontSize: "13px", fontWeight: 500, color: "#111" },
//   confirmSummary: { display: "flex", flexDirection: "column", gap: 0, border: "0.5px solid #ebebeb", borderRadius: "6px", overflow: "hidden" },
//   confirmRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: "0.5px solid #f0f0f0" },
//   confirmLabel: { fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#aaa" },
//   confirmValue: { fontSize: "13px", color: "#111", maxWidth: "60%", textAlign: "right" as const },
//   secureNote: { fontSize: "11px", color: "#aaa", marginTop: 16, textAlign: "center" as const },

//   // Summary col
//   summaryCol: { background: "#fafafa", border: "0.5px solid #ebebeb", borderRadius: "8px", padding: "24px", position: "sticky", top: "120px" },
//   summaryTitle: { fontSize: "10px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#aaa", marginBottom: 20 },
//   summaryItems: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 },
//   summaryItem: { display: "flex", alignItems: "center", gap: 12 },
//   summaryItemImg: { position: "relative", width: 48, height: 48, borderRadius: "6px", overflow: "hidden", background: "#f5f3ef", flexShrink: 0 },
//   summaryItemQty: { position: "absolute", top: -6, right: -6, background: "#555", color: "#fff", fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
//   summaryItemName: { flex: 1, fontSize: 12, color: "#111", fontWeight: 500, lineHeight: 1.4 },
//   summaryItemPrice: { fontSize: 12, color: "#888", flexShrink: 0 },
//   summaryDivider: { borderTop: "0.5px solid #ebebeb", margin: "12px 0" },
//   summaryRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
//   summaryLabel: { fontSize: 12, color: "#888" },
//   summaryValue: { fontSize: 13, color: "#555" },
//   skeletonItem: { height: 60, background: "#f0f0f0", borderRadius: 6 },
// };

// ke-3
// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { Cormorant_Garamond } from "next/font/google";
// import { getCart } from "@/app/api/graphql/Transaction";
// import { getShippingMethods, updateShippingMethod, checkout, updateOrderPayment } from "@/app/api/graphql/Checkout";

// const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500"] });

// // ─── Types ────────────────────────────────────────────────────────────────────
// type ShippingRate = {
//   id: string;
//   courierCode: string;
//   courierName: string;
//   serviceCode: string;
//   serviceName: string;
//   description?: string;
//   duration?: string;
//   price: number;
//   type?: string;
// };
// type CartItem = {
//   key: string; quantity: number;
//   product: { node: { name: string; price?: string; image?: { sourceUrl: string } } };
// };
// type Cart = { contents: { nodes: CartItem[] }; subtotal: string; total: string; shippingTotal?: string };

// const fmt = (val?: string) => {
//   if (!val) return "Rp 0";
//   const num = parseFloat(val.replace(/[^0-9.]/g, ""));
//   if (isNaN(num)) return val;
//   return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
// };

// // ─── Step indicator ───────────────────────────────────────────────────────────
// function Steps({ current }: { current: number }) {
//   const steps = ["Alamat", "Pengiriman", "Pembayaran"];
//   return (
//     <div style={stepStyles.wrap}>
//       {steps.map((label, i) => (
//         <div key={label} style={stepStyles.item}>
//           <div style={{
//             ...stepStyles.circle,
//             background: i < current ? "#111" : i === current ? "#111" : "transparent",
//             borderColor: i <= current ? "#111" : "#e0e0e0",
//             color: i < current ? "#fff" : i === current ? "#fff" : "#bbb",
//           }}>
//             {i < current ? (
//               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
//                 <polyline points="20 6 9 17 4 12" />
//               </svg>
//             ) : i + 1}
//           </div>
//           <span style={{ ...stepStyles.label, color: i <= current ? "#111" : "#bbb" }}>{label}</span>
//           {i < steps.length - 1 && <div style={{ ...stepStyles.line, background: i < current ? "#111" : "#e0e0e0" }} />}
//         </div>
//       ))}
//     </div>
//   );
// }

// const stepStyles: { [k: string]: React.CSSProperties } = {
//   wrap: { display: "flex", alignItems: "center", marginBottom: 40 },
//   item: { display: "flex", alignItems: "center", gap: 8 },
//   circle: {
//     width: 28, height: 28, borderRadius: "50%",
//     borderWidth: "1.5px", borderStyle: "solid",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     fontSize: 11, fontWeight: 600,
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//     flexShrink: 0,
//   },
//   label: { fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", marginRight: 8 },
//   line: { width: 40, height: 1, marginRight: 8 },
// };

// // ─── Input ────────────────────────────────────────────────────────────────────
// function Field({ label, value, onChange, type = "text", placeholder = "", half = false }: {
//   label: string; value: string; onChange: (v: string) => void;
//   type?: string; placeholder?: string; half?: boolean;
// }) {
//   return (
//     <div style={{ gridColumn: half ? "span 1" : "span 2", display: "flex", flexDirection: "column", gap: 6 }}>
//       <label style={styles.label}>{label}</label>
//       <input
//         type={type} value={value} placeholder={placeholder}
//         onChange={(e) => onChange(e.target.value)}
//         style={styles.input}
//         onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; }}
//         onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; }}
//       />
//     </div>
//   );
// }

// // ─── Main ─────────────────────────────────────────────────────────────────────
// export default function CheckoutPage() {
//   const { data: session } = useSession();
//   const router = useRouter();

//   const [step, setStep] = useState(0);
//   const [cart, setCart] = useState<Cart | null>(null);
//   const [cartLoading, setCartLoading] = useState(true);
//   const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
//   const [shippingLoading, setShippingLoading] = useState(false);
//   const [selectedRate, setSelectedRate] = useState("");
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState("");

//   // Computed: harga ongkir yang dipilih
//   const selectedShipping = shippingRates.find(r => r.id === selectedRate);
//   const shippingCost = selectedShipping?.price || 0;
//   // Parse Rupiah string dengan benar: "Rp20.000" → 20000
//   const parseRupiah = (val?: string) => {
//     if (!val) return 0;
//     // Hapus semua non-digit kecuali koma (desimal IDR pakai koma)
//     const cleaned = val.replace(/[^0-9,]/g, "").replace(",", ".");
//     return parseFloat(cleaned) || 0;
//   };
//   const subtotalRaw = parseRupiah(cart?.subtotal);
//   const grandTotal = subtotalRaw + shippingCost;
//   const fmtIDR = (num: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

//   // Form state
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState(session?.user?.email || "");
//   const [phone, setPhone] = useState("");
//   const [address1, setAddress1] = useState("");
//   const [address2, setAddress2] = useState("");
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");
//   const [postcode, setPostcode] = useState("");

//   // Prefill email from session
//   useEffect(() => {
//     if (session?.user?.email) setEmail(session.user.email);
//     if (session?.user?.name) {
//       const parts = session.user.name.split(" ");
//       setFirstName(parts[0] || "");
//       setLastName(parts.slice(1).join(" ") || "");
//     }
//   }, [session]);

//   // Fetch cart
//   useEffect(() => {
//     getCart()
//       .then(setCart)
//       .catch(console.error)
//       .finally(() => setCartLoading(false));
//   }, []);

//   // Fetch shipping rates dari Biteship
//   const fetchShipping = useCallback(async () => {
//     if (!postcode) return;
//     setShippingLoading(true);
//     try {
//       const cartItems = cart?.contents?.nodes || [];
//       const items = cartItems.map((item) => ({
//         name: item.product.node.name,
//         value: parseFloat((item.product.node.price || "0").replace(/[^0-9.]/g, "")),
//         weight: 1000, // default 1kg — TODO: ambil dari product weight jika ada
//         quantity: item.quantity,
//       }));

//       if (items.length === 0) {
//         items.push({ name: "Produk", value: 0, weight: 1000, quantity: 1 });
//       }

//       const rates = await getShippingMethods({
//         destinationPostalCode: postcode,
//         items,
//       });

//       setShippingRates(rates);
//       if (rates.length > 0) setSelectedRate(rates[0].id);
//     } catch (e) {
//       console.error("Biteship error:", e);
//     }
//     setShippingLoading(false);
//   }, [postcode, cart]);

//   const handleNextStep = async () => {
//     setError("");
//     if (step === 0) {
//       if (!firstName || !lastName || !email || !phone || !address1 || !city || !postcode) {
//         setError("Harap lengkapi semua field yang wajib diisi.");
//         return;
//       }
//       await fetchShipping();
//       setStep(1);
//     } else if (step === 1) {
//       if (!selectedRate) {
//         setError("Pilih metode pengiriman terlebih dahulu.");
//         return;
//       }
//       // Update shipping method in WooCommerce cart
//       setShippingLoading(true);
//       try {
//         await updateShippingMethod(selectedRate);
//         const updated = await getCart();
//         setCart(updated);
//       } catch (e) { console.error(e); }
//       setShippingLoading(false);
//       setStep(2);
//     }
//   };

//   const handlePay = async () => {
//     setProcessing(true);
//     setError("");

//     try {
//       // 1. Create order via WooCommerce dengan midtrans
//       const result = await checkout({
//         billing: { firstName, lastName, email, phone, address1, address2, city, state, postcode, country: "ID" },
//         paymentMethod: "midtrans",
//         shippingMethod: selectedRate ? [selectedRate] : undefined,
//       });

//       if (!result?.order?.databaseId) {
//         setError("Gagal membuat pesanan. Silakan coba lagi.");
//         setProcessing(false);
//         return;
//       }

//       const orderId = result.order.databaseId;

//       // 2. Ambil grand total (subtotal + ongkir Biteship)
//       const grossAmount = grandTotal > 0 ? grandTotal
//         : parseFloat(String(result.order.total || "0").replace(/[^0-9.]/g, ""));
//       // WooCommerce Midtrans plugin taruh token di: /checkout/order-pay/ID/?key=xxx&snap_token=xxx
//       let snapToken: string | null = null;

//       if (result.redirect) {
//         try {
//           const redirectUrl = new URL(result.redirect);
//           snapToken = redirectUrl.searchParams.get("snap_token");
//         } catch (e) {
//           console.error("Failed to parse redirect URL:", e);
//         }
//       }

//       // 3. Kalau tidak dapat dari redirect, generate sendiri via API
//       if (!snapToken) {
//         const tokenRes = await fetch("/api/midtrans-token", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ orderId, grossAmount, firstName, lastName, email, phone }),
//         });
//         const tokenData = await tokenRes.json();
//         snapToken = tokenData.snap_token || null;
//       }

//       if (!snapToken) {
//         setError("Gagal memuat pembayaran. Silakan coba lagi.");
//         setProcessing(false);
//         return;
//       }

//       // 4. Open Midtrans Snap popup — jangan redirect ke WordPress
//       const snap = (window as any).snap;
//       if (!snap) {
//         setError("Midtrans Snap belum dimuat. Refresh dan coba lagi.");
//         setProcessing(false);
//         return;
//       }

//       snap.pay(snapToken, {
//         onSuccess: async (result: any) => {
//           // Update order di WooCommerce: set status processing + transaction ID
//           try {
//             await updateOrderPayment(orderId, result.transaction_id || "");
//           } catch (e) {
//             console.error("Failed to update order:", e);
//           }
//           router.push(`/order-confirmation?order=${orderId}`);
//         },
//         onPending: () => {
//           router.push(`/order-confirmation?order=${orderId}&status=pending`);
//         },
//         onError: () => {
//           setError("Pembayaran gagal. Silakan coba lagi.");
//           setProcessing(false);
//         },
//         onClose: () => {
//           setProcessing(false);
//         },
//       });

//     } catch (e: any) {
//       setError(e.message || "Terjadi kesalahan. Silakan coba lagi.");
//       setProcessing(false);
//     }
//   };

//   const items = cart?.contents?.nodes || [];

//   return (
//     <div style={styles.page}>
//       <h1 className={cormorant.className} style={styles.pageTitle}>Checkout</h1>
//       <Steps current={step} />

//       <div style={styles.layout}>
//         {/* ── Left: Form ── */}
//         <div style={styles.formCol}>

//           {error && <div style={styles.errorBox}><p style={styles.errorText}>{error}</p></div>}

//           {/* Step 0 — Alamat */}
//           {step === 0 && (
//             <div>
//               <p style={styles.sectionTitle}>Alamat Pengiriman</p>
//               <div style={styles.formGrid}>
//                 <Field label="Nama Depan *" value={firstName} onChange={setFirstName} half placeholder="John" />
//                 <Field label="Nama Belakang *" value={lastName} onChange={setLastName} half placeholder="Doe" />
//                 <Field label="Email *" value={email} onChange={setEmail} type="email" placeholder="email@contoh.com" />
//                 <Field label="Nomor Telepon *" value={phone} onChange={setPhone} type="tel" placeholder="08xx-xxxx-xxxx" />
//                 <Field label="Alamat *" value={address1} onChange={setAddress1} placeholder="Jl. Nama Jalan No. X" />
//                 <Field label="Alamat 2 (opsional)" value={address2} onChange={setAddress2} placeholder="Apartemen, unit, dll" />
//                 <Field label="Kota *" value={city} onChange={setCity} half placeholder="Jakarta" />
//                 <Field label="Kode Pos *" value={postcode} onChange={setPostcode} half placeholder="12345" />
//                 <Field label="Provinsi" value={state} onChange={setState} placeholder="DKI Jakarta" />
//               </div>
//               <button style={styles.nextBtn} onClick={handleNextStep}>
//                 Lanjut ke Pengiriman →
//               </button>
//             </div>
//           )}

//           {/* Step 1 — Pengiriman */}
//           {step === 1 && (
//             <div>
//               <p style={styles.sectionTitle}>Metode Pengiriman</p>

//               {/* Address summary */}
//               <div style={styles.addressSummary}>
//                 <p style={styles.addressSummaryText}>
//                   {address1}, {city}, {postcode}
//                 </p>
//                 <button style={styles.editLink} onClick={() => setStep(0)}>Ubah</button>
//               </div>

//               {shippingLoading ? (
//                 <div style={styles.shippingLoading}>Memuat opsi pengiriman...</div>
//               ) : shippingRates.length === 0 ? (
//                 // Fallback: flat rate sementara KiriminAja belum terhubung
//                 <div style={styles.rateList}>
//                   {[
//                     { id: "flat_rate:1", label: "Pengiriman Reguler (2–5 hari kerja)", cost: "0" },
//                   ].map((rate) => (
//                     <label key={rate.id} style={{
//                       ...styles.rateItem,
//                       borderColor: selectedRate === rate.id ? "#111" : "#e0e0e0",
//                       background: selectedRate === rate.id ? "#fafafa" : "#fff",
//                     }}
//                       onClick={() => setSelectedRate(rate.id)}
//                     >
//                       <div style={styles.rateRadio}>
//                         <div style={{ ...styles.rateRadioInner, background: selectedRate === rate.id ? "#111" : "transparent" }} />
//                       </div>
//                       <div style={styles.rateInfo}>
//                         <p style={styles.rateLabel}>{rate.label}</p>
//                         <p style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>Biaya pengiriman dihitung saat konfirmasi order</p>
//                       </div>
//                       <p style={styles.rateCost}>Gratis</p>
//                     </label>
//                   ))}
//                 </div>
//               ) : (
//                 <div style={styles.rateList}>
//                   {shippingRates.map((rate: any) => (
//                     <label key={rate.id} style={{
//                       ...styles.rateItem,
//                       borderColor: selectedRate === rate.id ? "#111" : "#e0e0e0",
//                       background: selectedRate === rate.id ? "#fafafa" : "#fff",
//                     }}>
//                       <input
//                         type="radio"
//                         name="shipping"
//                         value={rate.id}
//                         checked={selectedRate === rate.id}
//                         onChange={() => setSelectedRate(rate.id)}
//                         style={{ display: "none" }}
//                       />
//                       <div style={styles.rateRadio}>
//                         <div style={{
//                           ...styles.rateRadioInner,
//                           background: selectedRate === rate.id ? "#111" : "transparent",
//                         }} />
//                       </div>
//                       <div style={styles.rateInfo}>
//                         <p style={styles.rateLabel}>
//                           {rate.courierName} — {rate.serviceName}
//                         </p>
//                         {(rate.duration || rate.description) && (
//                           <p style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
//                             {rate.duration ? `Estimasi ${rate.duration}` : rate.description}
//                           </p>
//                         )}
//                       </div>
//                       <p style={styles.rateCost}>
//                         {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(rate.price || 0)}
//                       </p>
//                     </label>
//                   ))}
//                 </div>
//               )}

//               <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
//                 <button style={styles.backBtn} onClick={() => setStep(0)}>← Kembali</button>
//                 <button style={styles.nextBtn} onClick={handleNextStep} disabled={!selectedRate}>
//                   Lanjut ke Pembayaran →
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Step 2 — Pembayaran */}
//           {step === 2 && (
//             <div>
//               <p style={styles.sectionTitle}>Konfirmasi & Bayar</p>

//               {/* Summary */}
//               <div style={styles.confirmSummary}>
//                 <div style={styles.confirmRow}>
//                   <span style={styles.confirmLabel}>Alamat</span>
//                   <span style={styles.confirmValue}>{address1}, {city}, {postcode}</span>
//                 </div>
//                 <div style={styles.confirmRow}>
//                   <span style={styles.confirmLabel}>Pengiriman</span>
//                   <span style={styles.confirmValue}>
//                     {(() => {
//                       const rate = shippingRates.find((r: any) => r.id === selectedRate);
//                       if (!rate) return "Pengiriman Reguler";
//                       return `${rate.courierName} — ${rate.serviceName}`;
//                     })()}
//                   </span>
//                 </div>
//                 <div style={styles.confirmRow}>
//                   <span style={styles.confirmLabel}>Pembayaran</span>
//                   <span style={styles.confirmValue}>Midtrans (Transfer, QRIS, Kartu)</span>
//                 </div>
//               </div>

//               <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
//                 <button style={styles.backBtn} onClick={() => setStep(1)}>← Kembali</button>
//                 <button
//                   style={{ ...styles.payBtn, opacity: processing ? 0.6 : 1, cursor: processing ? "not-allowed" : "pointer" }}
//                   onClick={handlePay}
//                   disabled={processing}
//                 >
//                   {processing ? "Memproses..." : `Bayar ${fmtIDR(grandTotal)}`}
//                 </button>
//               </div>

//               <p style={styles.secureNote}>
//                 🔒 Pembayaran aman diproses oleh Midtrans
//               </p>
//             </div>
//           )}
//         </div>

//         {/* ── Right: Order summary ── */}
//         <div style={styles.summaryCol}>
//           <p style={styles.summaryTitle}>Ringkasan Pesanan</p>

//           {cartLoading ? (
//             <div style={styles.skeletonItem} />
//           ) : (
//             <>
//               <div style={styles.summaryItems}>
//                 {items.map((item) => (
//                   <div key={item.key} style={styles.summaryItem}>
//                     <div style={styles.summaryItemImg}>
//                       {item.product.node.image?.sourceUrl && (
//                         <img src={item.product.node.image.sourceUrl} alt={item.product.node.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                       )}
//                       <span style={styles.summaryItemQty}>{item.quantity}</span>
//                     </div>
//                     <p style={styles.summaryItemName}>{item.product.node.name}</p>
//                     <p style={styles.summaryItemPrice}>{fmt(item.product.node.price)}</p>
//                   </div>
//                 ))}
//               </div>

//               <div style={styles.summaryDivider} />
//               <div style={styles.summaryRow}>
//                 <span style={styles.summaryLabel}>Subtotal</span>
//                 <span style={styles.summaryValue}>{fmtIDR(subtotalRaw)}</span>
//               </div>
//               <div style={styles.summaryRow}>
//                 <span style={styles.summaryLabel}>Ongkir</span>
//                 <span style={styles.summaryValue}>
//                   {shippingCost > 0 ? fmtIDR(shippingCost) : selectedRate ? "Gratis" : "—"}
//                 </span>
//               </div>
//               <div style={styles.summaryDivider} />
//               <div style={styles.summaryRow}>
//                 <span style={{ ...styles.summaryLabel, fontWeight: 600, color: "#111" }}>Total</span>
//                 <span style={{ ...styles.summaryValue, fontSize: 16, fontWeight: 600, color: "#111" }}>
//                   {selectedRate ? fmtIDR(grandTotal) : fmtIDR(subtotalRaw)}
//                 </span>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Styles ───────────────────────────────────────────────────────────────────
// const styles: { [key: string]: React.CSSProperties } = {
//   page: { maxWidth: "1100px", margin: "0 auto", padding: "100px 32px 80px", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
//   pageTitle: { fontSize: "40px", fontWeight: 400, color: "#111", margin: "0 0 32px", lineHeight: 1 },
//   layout: { display: "grid", gridTemplateColumns: "1fr 340px", gap: "56px", alignItems: "flex-start" },
//   formCol: { minWidth: 0 },
//   sectionTitle: { fontSize: "10px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#aaa", marginBottom: 20 },
//   formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: 24 },
//   label: { fontSize: "9px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#aaa" },
//   input: { width: "100%", padding: "11px 14px", fontSize: "13px", color: "#111", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", background: "#fff", borderWidth: "0.5px", borderStyle: "solid", borderColor: "#e0e0e0", borderRadius: "4px", outline: "none", transition: "border-color 0.15s ease", boxSizing: "border-box" as const },
//   nextBtn: { height: 48, padding: "0 32px", background: "#111", color: "#fff", border: "none", borderRadius: "4px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, cursor: "pointer", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
//   backBtn: { height: 48, padding: "0 24px", background: "transparent", color: "#555", border: "0.5px solid #e0e0e0", borderRadius: "4px", fontSize: "11px", fontWeight: 500, cursor: "pointer", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
//   payBtn: { flex: 1, height: 48, background: "#111", color: "#fff", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 600, letterSpacing: "0.06em", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
//   errorBox: { background: "#fff5f5", border: "0.5px solid #fca5a5", borderRadius: "4px", padding: "10px 14px", marginBottom: 20 },
//   errorText: { fontSize: "12px", color: "#dc2626" },
//   addressSummary: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "#fafafa", borderRadius: "4px", border: "0.5px solid #ebebeb", marginBottom: 20 },
//   addressSummaryText: { fontSize: "12px", color: "#555" },
//   editLink: { fontSize: "11px", color: "#6bc1c6", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
//   shippingLoading: { fontSize: "13px", color: "#aaa", padding: "20px 0" },
//   shippingEmpty: { padding: "20px 0", display: "flex", flexDirection: "column", gap: 8 },
//   rateList: { display: "flex", flexDirection: "column", gap: 10 },
//   rateItem: { display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderWidth: "0.5px", borderStyle: "solid", borderRadius: "6px", cursor: "pointer", transition: "border-color 0.15s ease" },
//   rateRadio: { width: 18, height: 18, borderRadius: "50%", borderWidth: "1.5px", borderStyle: "solid", borderColor: "#111", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
//   rateRadioInner: { width: 10, height: 10, borderRadius: "50%", transition: "background 0.15s ease" },
//   rateInfo: { flex: 1 },
//   rateLabel: { fontSize: "13px", fontWeight: 500, color: "#111" },
//   rateCost: { fontSize: "13px", fontWeight: 500, color: "#111" },
//   confirmSummary: { display: "flex", flexDirection: "column", gap: 0, border: "0.5px solid #ebebeb", borderRadius: "6px", overflow: "hidden" },
//   confirmRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: "0.5px solid #f0f0f0" },
//   confirmLabel: { fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#aaa" },
//   confirmValue: { fontSize: "13px", color: "#111", maxWidth: "60%", textAlign: "right" as const },
//   secureNote: { fontSize: "11px", color: "#aaa", marginTop: 16, textAlign: "center" as const },

//   // Summary col
//   summaryCol: { background: "#fafafa", border: "0.5px solid #ebebeb", borderRadius: "8px", padding: "24px", position: "sticky", top: "120px" },
//   summaryTitle: { fontSize: "10px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#aaa", marginBottom: 20 },
//   summaryItems: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 },
//   summaryItem: { display: "flex", alignItems: "center", gap: 12 },
//   summaryItemImg: { position: "relative", width: 48, height: 48, borderRadius: "6px", overflow: "hidden", background: "#f5f3ef", flexShrink: 0 },
//   summaryItemQty: { position: "absolute", top: -6, right: -6, background: "#555", color: "#fff", fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
//   summaryItemName: { flex: 1, fontSize: 12, color: "#111", fontWeight: 500, lineHeight: 1.4 },
//   summaryItemPrice: { fontSize: 12, color: "#888", flexShrink: 0 },
//   summaryDivider: { borderTop: "0.5px solid #ebebeb", margin: "12px 0" },
//   summaryRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
//   summaryLabel: { fontSize: 12, color: "#888" },
//   summaryValue: { fontSize: 13, color: "#555" },
//   skeletonItem: { height: 60, background: "#f0f0f0", borderRadius: 6 },
// };

"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Cormorant_Garamond } from "next/font/google";
import { getCart } from "@/app/api/graphql/Transaction";
import { getShippingMethods, updateShippingMethod, checkout, updateOrderPayment } from "@/app/api/graphql/Checkout";
import CitySearch from "@/components/CitySearch";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500"] });

// ─── Types ────────────────────────────────────────────────────────────────────
type ShippingRate = {
  id: string;
  courierCode: string;
  courierName: string;
  serviceCode: string;
  serviceName: string;
  description?: string;
  duration?: string;
  price: number;
  type?: string;
};
type CartItem = {
  key: string; quantity: number;
  product: { node: { name: string; price?: string; image?: { sourceUrl: string } } };
};
type Cart = { contents: { nodes: CartItem[] }; subtotal: string; total: string; shippingTotal?: string };

const fmt = (val?: string) => {
  if (!val) return "Rp 0";
  const num = parseFloat(val.replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return val;
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
};

// ─── Step indicator ───────────────────────────────────────────────────────────
function Steps({ current }: { current: number }) {
  const steps = ["Alamat", "Pengiriman", "Pembayaran"];
  return (
    <div style={stepStyles.wrap}>
      {steps.map((label, i) => (
        <div key={label} style={stepStyles.item}>
          <div style={{
            ...stepStyles.circle,
            background: i < current ? "#111" : i === current ? "#111" : "transparent",
            borderColor: i <= current ? "#111" : "#e0e0e0",
            color: i < current ? "#fff" : i === current ? "#fff" : "#bbb",
          }}>
            {i < current ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : i + 1}
          </div>
          <span style={{ ...stepStyles.label, color: i <= current ? "#111" : "#bbb" }}>{label}</span>
          {i < steps.length - 1 && <div style={{ ...stepStyles.line, background: i < current ? "#111" : "#e0e0e0" }} />}
        </div>
      ))}
    </div>
  );
}

const stepStyles: { [k: string]: React.CSSProperties } = {
  wrap: { display: "flex", alignItems: "center", marginBottom: 40 },
  item: { display: "flex", alignItems: "center", gap: 8 },
  circle: {
    width: 28, height: 28, borderRadius: "50%",
    borderWidth: "1.5px", borderStyle: "solid",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11, fontWeight: 600,
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    flexShrink: 0,
  },
  label: { fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", marginRight: 8 },
  line: { width: 40, height: 1, marginRight: 8 },
};

// ─── Input ────────────────────────────────────────────────────────────────────
function Field({ label, value, onChange, type = "text", placeholder = "", half = false }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; half?: boolean;
}) {
  return (
    <div style={{ gridColumn: half ? "span 1" : "span 2", display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={styles.label}>{label}</label>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={styles.input}
        onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; }}
      />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartLoading, setCartLoading] = useState(true);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [selectedRate, setSelectedRate] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  // Computed: harga ongkir yang dipilih
  const selectedShipping = shippingRates.find(r => r.id === selectedRate);
  const shippingCost = selectedShipping?.price || 0;
  // Parse Rupiah string dengan benar: "Rp20.000" → 20000
  const parseRupiah = (val?: string) => {
    if (!val) return 0;
    // Hapus semua non-digit kecuali koma (desimal IDR pakai koma)
    const cleaned = val.replace(/[^0-9,]/g, "").replace(",", ".");
    return parseFloat(cleaned) || 0;
  };
  const subtotalRaw = parseRupiah(cart?.subtotal);
  const grandTotal = subtotalRaw + shippingCost;
  const fmtIDR = (num: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postcode, setPostcode] = useState("");
  const [cityLabel, setCityLabel] = useState(""); // label untuk CitySearch display

  // Handler saat user pilih area dari CitySearch
  const handleAreaSelect = (area: { city: string; province: string; postalCode: string; label: string; district: string }) => {
    setCity(area.city);
    setState(area.province);
    setPostcode(area.postalCode);
    setCityLabel(area.label);
  };

  // Prefill email from session
  useEffect(() => {
    if (session?.user?.email) setEmail(session.user.email);
    if (session?.user?.name) {
      const parts = session.user.name.split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
    }
  }, [session]);

  // Fetch cart
  useEffect(() => {
    getCart()
      .then(setCart)
      .catch(console.error)
      .finally(() => setCartLoading(false));
  }, []);

  // Fetch shipping rates dari Biteship
  const fetchShipping = useCallback(async () => {
    if (!postcode) return;
    setShippingLoading(true);
    try {
      const cartItems = cart?.contents?.nodes || [];
      const items = cartItems.map((item) => ({
        name: item.product.node.name,
        value: parseFloat((item.product.node.price || "0").replace(/[^0-9.]/g, "")),
        weight: 1000, // default 1kg — TODO: ambil dari product weight jika ada
        quantity: item.quantity,
      }));

      if (items.length === 0) {
        items.push({ name: "Produk", value: 0, weight: 1000, quantity: 1 });
      }

      const rates = await getShippingMethods({
        destinationPostalCode: postcode,
        items,
      });

      setShippingRates(rates);
      if (rates.length > 0) setSelectedRate(rates[0].id);
    } catch (e) {
      console.error("Biteship error:", e);
    }
    setShippingLoading(false);
  }, [postcode, cart]);

  const handleNextStep = async () => {
    setError("");
    if (step === 0) {
      if (!firstName || !lastName || !email || !phone || !address1 || !city || !postcode) {
        setError("Harap lengkapi semua field wajib, termasuk memilih kota dari dropdown.");
        return;
      }
      await fetchShipping();
      setStep(1);
    } else if (step === 1) {
      if (!selectedRate) {
        setError("Pilih metode pengiriman terlebih dahulu.");
        return;
      }
      // Update shipping method in WooCommerce cart
      setShippingLoading(true);
      try {
        await updateShippingMethod(selectedRate);
        const updated = await getCart();
        setCart(updated);
      } catch (e) { console.error(e); }
      setShippingLoading(false);
      setStep(2);
    }
  };

  const handlePay = async () => {
    setProcessing(true);
    setError("");

    try {
      // 1. Create order via WooCommerce dengan midtrans
      const result = await checkout({
        billing: { firstName, lastName, email, phone, address1, address2, city, state, postcode, country: "ID" },
        paymentMethod: "midtrans",
        shippingMethod: selectedRate ? [selectedRate] : undefined,
      });

      if (!result?.order?.databaseId) {
        setError("Gagal membuat pesanan. Silakan coba lagi.");
        setProcessing(false);
        return;
      }

      const orderId = result.order.databaseId;

      // 2. Ambil grand total (subtotal + ongkir Biteship)
      const grossAmount = grandTotal > 0 ? grandTotal
        : parseFloat(String(result.order.total || "0").replace(/[^0-9.]/g, ""));
      // WooCommerce Midtrans plugin taruh token di: /checkout/order-pay/ID/?key=xxx&snap_token=xxx
      let snapToken: string | null = null;

      if (result.redirect) {
        try {
          const redirectUrl = new URL(result.redirect);
          snapToken = redirectUrl.searchParams.get("snap_token");
        } catch (e) {
          console.error("Failed to parse redirect URL:", e);
        }
      }

      // 3. Kalau tidak dapat dari redirect, generate sendiri via API
      if (!snapToken) {
        const tokenRes = await fetch("/api/midtrans-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, grossAmount, firstName, lastName, email, phone }),
        });
        const tokenData = await tokenRes.json();
        snapToken = tokenData.snap_token || null;
      }

      if (!snapToken) {
        setError("Gagal memuat pembayaran. Silakan coba lagi.");
        setProcessing(false);
        return;
      }

      // 4. Open Midtrans Snap popup — jangan redirect ke WordPress
      const snap = (window as any).snap;
      if (!snap) {
        setError("Midtrans Snap belum dimuat. Refresh dan coba lagi.");
        setProcessing(false);
        return;
      }

      snap.pay(snapToken, {
        onSuccess: async (result: any) => {
          // Update order di WooCommerce: set status processing + transaction ID
          try {
            await updateOrderPayment(orderId, result.transaction_id || "");
          } catch (e) {
            console.error("Failed to update order:", e);
          }
          router.push(`/order-confirmation?order=${orderId}`);
        },
        onPending: () => {
          router.push(`/order-confirmation?order=${orderId}&status=pending`);
        },
        onError: () => {
          setError("Pembayaran gagal. Silakan coba lagi.");
          setProcessing(false);
        },
        onClose: () => {
          setProcessing(false);
        },
      });

    } catch (e: any) {
      setError(e.message || "Terjadi kesalahan. Silakan coba lagi.");
      setProcessing(false);
    }
  };

  const items = cart?.contents?.nodes || [];

  return (
    <div style={styles.page}>
      <h1 className={cormorant.className} style={styles.pageTitle}>Checkout</h1>
      <Steps current={step} />

      <div style={styles.layout}>
        {/* ── Left: Form ── */}
        <div style={styles.formCol}>

          {error && <div style={styles.errorBox}><p style={styles.errorText}>{error}</p></div>}

          {/* Step 0 — Alamat */}
          {step === 0 && (
            <div>
              <p style={styles.sectionTitle}>Alamat Pengiriman</p>
              <div style={styles.formGrid}>
                <Field label="Nama Depan *" value={firstName} onChange={setFirstName} half placeholder="John" />
                <Field label="Nama Belakang *" value={lastName} onChange={setLastName} half placeholder="Doe" />
                <Field label="Email *" value={email} onChange={setEmail} type="email" placeholder="email@contoh.com" />
                <Field label="Nomor Telepon *" value={phone} onChange={setPhone} type="tel" placeholder="08xx-xxxx-xxxx" />
                <Field label="Alamat *" value={address1} onChange={setAddress1} placeholder="Jl. Nama Jalan No. X, RT/RW" />
                <Field label="Alamat 2 (opsional)" value={address2} onChange={setAddress2} placeholder="Apartemen, unit, lantai, dll" />
                <CitySearch
                  value={cityLabel}
                  onSelect={handleAreaSelect}
                />
                {/* Readonly fields — terisi otomatis dari CitySearch */}
                {city && (
                  <>
                    <div style={{ gridColumn: "span 1", display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={styles.label}>Kota / Kabupaten</label>
                      <input value={city} disabled style={{ ...styles.input, background: "#fafafa", color: "#888" }} />
                    </div>
                    <div style={{ gridColumn: "span 1", display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={styles.label}>Kode Pos</label>
                      <input value={postcode} disabled style={{ ...styles.input, background: "#fafafa", color: "#888" }} />
                    </div>
                    <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={styles.label}>Provinsi</label>
                      <input value={state} disabled style={{ ...styles.input, background: "#fafafa", color: "#888" }} />
                    </div>
                  </>
                )}
              </div>
              <button style={styles.nextBtn} onClick={handleNextStep}>
                Lanjut ke Pengiriman →
              </button>
            </div>
          )}

          {/* Step 1 — Pengiriman */}
          {step === 1 && (
            <div>
              <p style={styles.sectionTitle}>Metode Pengiriman</p>

              {/* Address summary */}
              <div style={styles.addressSummary}>
                <p style={styles.addressSummaryText}>
                  {address1}, {city}, {postcode}
                </p>
                <button style={styles.editLink} onClick={() => setStep(0)}>Ubah</button>
              </div>

              {shippingLoading ? (
                <div style={styles.shippingLoading}>Memuat opsi pengiriman...</div>
              ) : shippingRates.length === 0 ? (
                // Fallback: flat rate sementara KiriminAja belum terhubung
                <div style={styles.rateList}>
                  {[
                    { id: "flat_rate:1", label: "Pengiriman Reguler (2–5 hari kerja)", cost: "0" },
                  ].map((rate) => (
                    <label key={rate.id} style={{
                      ...styles.rateItem,
                      borderColor: selectedRate === rate.id ? "#111" : "#e0e0e0",
                      background: selectedRate === rate.id ? "#fafafa" : "#fff",
                    }}
                      onClick={() => setSelectedRate(rate.id)}
                    >
                      <div style={styles.rateRadio}>
                        <div style={{ ...styles.rateRadioInner, background: selectedRate === rate.id ? "#111" : "transparent" }} />
                      </div>
                      <div style={styles.rateInfo}>
                        <p style={styles.rateLabel}>{rate.label}</p>
                        <p style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>Biaya pengiriman dihitung saat konfirmasi order</p>
                      </div>
                      <p style={styles.rateCost}>Gratis</p>
                    </label>
                  ))}
                </div>
              ) : (
                <div style={styles.rateList}>
                  {shippingRates.map((rate: any) => (
                    <label key={rate.id} style={{
                      ...styles.rateItem,
                      borderColor: selectedRate === rate.id ? "#111" : "#e0e0e0",
                      background: selectedRate === rate.id ? "#fafafa" : "#fff",
                    }}>
                      <input
                        type="radio"
                        name="shipping"
                        value={rate.id}
                        checked={selectedRate === rate.id}
                        onChange={() => setSelectedRate(rate.id)}
                        style={{ display: "none" }}
                      />
                      <div style={styles.rateRadio}>
                        <div style={{
                          ...styles.rateRadioInner,
                          background: selectedRate === rate.id ? "#111" : "transparent",
                        }} />
                      </div>
                      <div style={styles.rateInfo}>
                        <p style={styles.rateLabel}>
                          {rate.courierName} — {rate.serviceName}
                        </p>
                        {(rate.duration || rate.description) && (
                          <p style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
                            {rate.duration ? `Estimasi ${rate.duration}` : rate.description}
                          </p>
                        )}
                      </div>
                      <p style={styles.rateCost}>
                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(rate.price || 0)}
                      </p>
                    </label>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button style={styles.backBtn} onClick={() => setStep(0)}>← Kembali</button>
                <button style={styles.nextBtn} onClick={handleNextStep} disabled={!selectedRate}>
                  Lanjut ke Pembayaran →
                </button>
              </div>
            </div>
          )}

          {/* Step 2 — Pembayaran */}
          {step === 2 && (
            <div>
              <p style={styles.sectionTitle}>Konfirmasi & Bayar</p>

              {/* Summary */}
              <div style={styles.confirmSummary}>
                <div style={styles.confirmRow}>
                  <span style={styles.confirmLabel}>Alamat</span>
                  <span style={styles.confirmValue}>{address1}, {city}, {postcode}</span>
                </div>
                <div style={styles.confirmRow}>
                  <span style={styles.confirmLabel}>Pengiriman</span>
                  <span style={styles.confirmValue}>
                    {(() => {
                      const rate = shippingRates.find((r: any) => r.id === selectedRate);
                      if (!rate) return "Pengiriman Reguler";
                      return `${rate.courierName} — ${rate.serviceName}`;
                    })()}
                  </span>
                </div>
                <div style={styles.confirmRow}>
                  <span style={styles.confirmLabel}>Pembayaran</span>
                  <span style={styles.confirmValue}>Midtrans (Transfer, QRIS, Kartu)</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button style={styles.backBtn} onClick={() => setStep(1)}>← Kembali</button>
                <button
                  style={{ ...styles.payBtn, opacity: processing ? 0.6 : 1, cursor: processing ? "not-allowed" : "pointer" }}
                  onClick={handlePay}
                  disabled={processing}
                >
                  {processing ? "Memproses..." : `Bayar ${fmtIDR(grandTotal)}`}
                </button>
              </div>

              <p style={styles.secureNote}>
                🔒 Pembayaran aman diproses oleh Midtrans
              </p>
            </div>
          )}
        </div>

        {/* ── Right: Order summary ── */}
        <div style={styles.summaryCol}>
          <p style={styles.summaryTitle}>Ringkasan Pesanan</p>

          {cartLoading ? (
            <div style={styles.skeletonItem} />
          ) : (
            <>
              <div style={styles.summaryItems}>
                {items.map((item) => (
                  <div key={item.key} style={styles.summaryItem}>
                    <div style={styles.summaryItemImg}>
                      {item.product.node.image?.sourceUrl && (
                        <img src={item.product.node.image.sourceUrl} alt={item.product.node.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      )}
                      <span style={styles.summaryItemQty}>{item.quantity}</span>
                    </div>
                    <p style={styles.summaryItemName}>{item.product.node.name}</p>
                    <p style={styles.summaryItemPrice}>{fmt(item.product.node.price)}</p>
                  </div>
                ))}
              </div>

              <div style={styles.summaryDivider} />
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Subtotal</span>
                <span style={styles.summaryValue}>{fmtIDR(subtotalRaw)}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Ongkir</span>
                <span style={styles.summaryValue}>
                  {shippingCost > 0 ? fmtIDR(shippingCost) : selectedRate ? "Gratis" : "—"}
                </span>
              </div>
              <div style={styles.summaryDivider} />
              <div style={styles.summaryRow}>
                <span style={{ ...styles.summaryLabel, fontWeight: 600, color: "#111" }}>Total</span>
                <span style={{ ...styles.summaryValue, fontSize: 16, fontWeight: 600, color: "#111" }}>
                  {selectedRate ? fmtIDR(grandTotal) : fmtIDR(subtotalRaw)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles: { [key: string]: React.CSSProperties } = {
  page: { maxWidth: "1100px", margin: "0 auto", padding: "100px 32px 80px", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  pageTitle: { fontSize: "40px", fontWeight: 400, color: "#111", margin: "0 0 32px", lineHeight: 1 },
  layout: { display: "grid", gridTemplateColumns: "1fr 340px", gap: "56px", alignItems: "flex-start" },
  formCol: { minWidth: 0 },
  sectionTitle: { fontSize: "10px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#aaa", marginBottom: 20 },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: 24 },
  label: { fontSize: "9px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#aaa" },
  input: { width: "100%", padding: "11px 14px", fontSize: "13px", color: "#111", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", background: "#fff", borderWidth: "0.5px", borderStyle: "solid", borderColor: "#e0e0e0", borderRadius: "4px", outline: "none", transition: "border-color 0.15s ease", boxSizing: "border-box" as const },
  nextBtn: { height: 48, padding: "0 32px", background: "#111", color: "#fff", border: "none", borderRadius: "4px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, cursor: "pointer", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  backBtn: { height: 48, padding: "0 24px", background: "transparent", color: "#555", border: "0.5px solid #e0e0e0", borderRadius: "4px", fontSize: "11px", fontWeight: 500, cursor: "pointer", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  payBtn: { flex: 1, height: 48, background: "#111", color: "#fff", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 600, letterSpacing: "0.06em", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  errorBox: { background: "#fff5f5", border: "0.5px solid #fca5a5", borderRadius: "4px", padding: "10px 14px", marginBottom: 20 },
  errorText: { fontSize: "12px", color: "#dc2626" },
  addressSummary: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "#fafafa", borderRadius: "4px", border: "0.5px solid #ebebeb", marginBottom: 20 },
  addressSummaryText: { fontSize: "12px", color: "#555" },
  editLink: { fontSize: "11px", color: "#6bc1c6", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  shippingLoading: { fontSize: "13px", color: "#aaa", padding: "20px 0" },
  shippingEmpty: { padding: "20px 0", display: "flex", flexDirection: "column", gap: 8 },
  rateList: { display: "flex", flexDirection: "column", gap: 10 },
  rateItem: { display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderWidth: "0.5px", borderStyle: "solid", borderRadius: "6px", cursor: "pointer", transition: "border-color 0.15s ease" },
  rateRadio: { width: 18, height: 18, borderRadius: "50%", borderWidth: "1.5px", borderStyle: "solid", borderColor: "#111", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  rateRadioInner: { width: 10, height: 10, borderRadius: "50%", transition: "background 0.15s ease" },
  rateInfo: { flex: 1 },
  rateLabel: { fontSize: "13px", fontWeight: 500, color: "#111" },
  rateCost: { fontSize: "13px", fontWeight: 500, color: "#111" },
  confirmSummary: { display: "flex", flexDirection: "column", gap: 0, border: "0.5px solid #ebebeb", borderRadius: "6px", overflow: "hidden" },
  confirmRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: "0.5px solid #f0f0f0" },
  confirmLabel: { fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#aaa" },
  confirmValue: { fontSize: "13px", color: "#111", maxWidth: "60%", textAlign: "right" as const },
  secureNote: { fontSize: "11px", color: "#aaa", marginTop: 16, textAlign: "center" as const },

  // Summary col
  summaryCol: { background: "#fafafa", border: "0.5px solid #ebebeb", borderRadius: "8px", padding: "24px", position: "sticky", top: "120px" },
  summaryTitle: { fontSize: "10px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#aaa", marginBottom: 20 },
  summaryItems: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 },
  summaryItem: { display: "flex", alignItems: "center", gap: 12 },
  summaryItemImg: { position: "relative", width: 48, height: 48, borderRadius: "6px", overflow: "hidden", background: "#f5f3ef", flexShrink: 0 },
  summaryItemQty: { position: "absolute", top: -6, right: -6, background: "#555", color: "#fff", fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
  summaryItemName: { flex: 1, fontSize: 12, color: "#111", fontWeight: 500, lineHeight: 1.4 },
  summaryItemPrice: { fontSize: 12, color: "#888", flexShrink: 0 },
  summaryDivider: { borderTop: "0.5px solid #ebebeb", margin: "12px 0" },
  summaryRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  summaryLabel: { fontSize: 12, color: "#888" },
  summaryValue: { fontSize: 13, color: "#555" },
  skeletonItem: { height: 60, background: "#f0f0f0", borderRadius: 6 },
};