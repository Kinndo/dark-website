"use client";
import { useState } from "react";
import { trackAddToCart, trackInitiateCheckout, trackViewContent, trackCTAClick } from "@/lib/meta-pixel";

export default function HomePage() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [isSubscription, setIsSubscription] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const addToCart = (name, price) => {
    trackAddToCart(name, price);
    setCart(prev => {
      const existing = prev.find(item => item.name === name);
      if (existing) {
        return prev.map(item => item.name === name ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { name, price, qty: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (name) => {
    setCart(prev => prev.filter(item => item.name !== name));
  };

  const updateQty = (name, delta) => {
    setCart(prev => prev.map(item => {
      if (item.name !== name) return item;
      const newQty = item.qty + delta;
      return newQty <= 0 ? item : { ...item, qty: newQty };
    }).filter(item => item.qty > 0));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <main> 
      <style>{`
        html, body { overflow-x: hidden; }
        @keyframes scrollTrust {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .desktop-hide { display: none !important; }
        @media (max-width: 768px) {
          .mobile-hide { display: none !important; }
          .desktop-hide { display: block !important; }
          .section-pad { padding: 60px 24px !important; }
          .nav-pad { padding: 0 20px !important; }
          .logo-text { font-size: 26px !important; }
          .hero-section { flex-direction: column !important; padding-top: 140px !important; }
          .hero-text-box { width: 100% !important; padding: 0 24px 60px !important; align-items: center !important; text-align: center !important; }
          .hero-text-box div { justify-content: center !important; }
          .hero-text-box p { text-align: center !important; margin-left: auto !important; margin-right: auto !important; }
          .hero-image-box { width: 100% !important; height: 60vh !important; }
          .hero-h1 { font-size: 48px !important; line-height: 1.1 !important; letter-spacing: -1px !important; }
          .hero-h2 { font-size: 40px !important; }
          .title-text { font-size: 34px !important; line-height: 1.2 !important; }
          .grid-2 { grid-template-columns: 1fr !important; gap: 48px !important; }
          .grid-4 { grid-template-columns: 1fr !important; gap: 40px !important; text-align: center !important; }
          .science-badge { right: auto !important; left: 50% !important; transform: translateX(-50%) !important; bottom: -30px !important; width: 90% !important; max-width: none !important; padding: 20px !important; }
          .bundle-card { padding: 32px 24px !important; text-align: center !important; }
          .bundle-col-header { text-align: center !important; }
          .bundle-col { flex: none !important; width: 100% !important; max-width: 100% !important; align-items: stretch !important; text-align: left !important; }
          .footer-bottom { flex-direction: column !important; text-align: center !important; gap: 24px !important; }
          .footer-bottom div { justify-content: center !important; }
        }
      `}</style>

      {/* ── Mobile Navigation Menu ── */}
      {mobileMenuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "#fff", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee" }}>
            <span style={{ fontSize: 26, fontWeight: 900, color: "#000", fontFamily: "Impact, sans-serif", transform: "scaleY(1.2)", display: "inline-block" }}>DARK</span>
            <button onClick={() => setMobileMenuOpen(false)} style={{ background: "none", border: "none", fontSize: 28, cursor: "pointer", color: "#999", padding: 4, lineHeight: 1 }}>✕</button>
          </div>
          <div style={{ padding: "40px 24px", display: "flex", flexDirection: "column", gap: 32 }}>
            {["Skin Quiz", "Shop", "Learn", "Results"].map((item) => (
              <a key={item} href={item === "Skin Quiz" ? "/quiz" : "#"} onClick={() => setMobileMenuOpen(false)} style={{ color: "#111", fontSize: 22, fontWeight: 700, textDecoration: "none", letterSpacing: 0.5 }}>
                {item}
              </a>
            ))}
            <div style={{ height: 1, background: "#eee", margin: "8px 0" }} />
            <a href="#" onClick={() => setMobileMenuOpen(false)} style={{ color: "#666", fontSize: 18, fontWeight: 500, textDecoration: "none" }}>Account</a>
          </div>
        </div>
      )}

      {/* ── Cart Sidebar ── */}
      {cartOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
          <div onClick={() => setCartOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 400, maxWidth: "90vw", background: "#fff", boxShadow: "-4px 0 20px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111", margin: 0 }}>Your Cart ({cartCount})</h3>
              <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#999", padding: 4 }}>✕</button>
            </div>
            <div style={{ flex: 1, overflow: "auto", padding: "16px 24px" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", paddingTop: 60 }}>
                  <p style={{ fontSize: 16, color: "#999", marginBottom: 20 }}>Your cart is empty</p>
                  <button onClick={() => setCartOpen(false)} style={{ background: "#111", color: "#fff", border: "none", padding: "12px 28px", borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Continue Shopping</button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid #f0f0f0" }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#111", margin: "0 0 4px" }}>{item.name}</p>
                      <p style={{ fontSize: 14, color: "#888", margin: 0 }}>${item.price}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <button onClick={() => updateQty(item.name, -1)} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                      <span style={{ fontSize: 14, fontWeight: 600, minWidth: 16, textAlign: "center" }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.name, 1)} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                      <button onClick={() => removeFromCart(item.name)} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 16, marginLeft: 4 }}>✕</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div style={{ padding: "20px 24px", borderTop: "1px solid #eee" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>Total</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>${cartTotal}</span>
                </div>
                <button onClick={() => trackInitiateCheckout(cartTotal, cartCount)} style={{ width: "100%", background: "#111", color: "#fff", border: "none", padding: "16px 0", borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: 1.5, textTransform: "uppercase" }}>Checkout</button>
                <p style={{ fontSize: 12, color: "#999", textAlign: "center", marginTop: 10, marginBottom: 0 }}>Free shipping · 30-day guarantee</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Fixed Header ── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 101, display: "flex", flexDirection: "column" }}>
        <div style={{ background: "#111", padding: "12px 20px", textAlign: "center" }}>
          <p style={{ color: "#fff", fontSize: 13, fontWeight: 500, margin: 0, letterSpacing: 1.5, lineHeight: 1.4 }}>
            NEW CUSTOMERS: <span style={{ fontWeight: 700, textDecoration: "underline" }}>SAVE $20</span> ON YOUR SUBSCRIPTION
          </p>
        </div>
        <nav style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid #eee", padding: "14px 0" }}>
          <div className="nav-pad" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <a href="/" className="logo-text" style={{ fontSize: 34, fontWeight: 900, color: "#000", letterSpacing: 0, textDecoration: "none", fontFamily: "Impact, sans-serif", transform: "scaleY(1.2)", display: "inline-block" }}>DARK</a>
            <div className="mobile-hide" style={{ display: "flex", gap: 32, alignItems: "center" }}>
              {["Skin Quiz", "Shop", "Learn", "Results"].map((item) => (
                <a key={item} href={item === "Skin Quiz" ? "/quiz" : "#"} style={{ color: "#333", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{item}</a>
              ))}
            </div>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <a href="#" className="mobile-hide" style={{ color: "#333", fontSize: 14, textDecoration: "none" }}>Account</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setCartOpen(true); }} style={{ color: "#111", fontSize: 14, fontWeight: 600, textDecoration: "none", position: "relative" }}>
                Cart
                <span style={{ position: "absolute", top: -8, right: -14, background: "#111", color: "#fff", width: 18, height: 18, borderRadius: "50%", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
              </a>
              <button className="desktop-hide" onClick={() => setMobileMenuOpen(true)} style={{ background: "none", border: "none", padding: "0 0 0 8px", cursor: "pointer", fontSize: 24, lineHeight: 1, color: "#111", display: "flex", alignItems: "center" }}>☰</button>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Hero Section ── */}
      <section className="hero-section" style={{ display: "flex", minHeight: "100vh", background: "#fff", paddingTop: 120 }}>
        <div className="hero-text-box" style={{ width: "50%", display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: "max(32px, calc(50vw - 600px))", paddingRight: "5%", paddingBottom: "80px", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 480 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <div style={{ display: "flex", color: "#FFB800", fontSize: 15 }}>★★★★★</div>
              <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.5, color: "#111", textTransform: "uppercase" }}>2,500+ 5-Star Reviews</span>
            </div>
            <h1 style={{ margin: "0 0 24px 0", lineHeight: 1.05 }}>
              <span className="hero-h1" style={{ display: "block", fontSize: 72, fontWeight: 800, color: "#111", letterSpacing: "-1.5px" }}>Fade dark spots.</span>
              <span className="hero-h2" style={{ display: "block", fontSize: 64, fontWeight: 400, fontStyle: "italic", color: "#999", fontFamily: "Georgia, 'Times New Roman', serif", marginTop: 4 }}>Without the bleach.</span>
            </h1>
            <p style={{ fontSize: 17, color: "#555", lineHeight: 1.7, marginBottom: 44 }}>
              The first 3-serum system clinically engineered to treat hyperpigmentation in melanin-rich skin. Safe, effective, and barrier-focused.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
              <button onClick={() => { trackCTAClick("Shop the System", "home"); addToCart("3-Serum System Bundle (Subscription)", 79); }} style={{ background: "#111", color: "#fff", border: "none", padding: "18px 44px", borderRadius: 100, fontSize: 13, fontWeight: 800, cursor: "pointer", letterSpacing: 1.5, textTransform: "uppercase", transition: "background 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.background = "#333"} onMouseLeave={(e) => e.currentTarget.style.background = "#111"}>Shop the System</button>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#111" }}>Subscribe & Save $20</span>
                <span style={{ fontSize: 13, color: "#888", fontWeight: 500 }}>90-Day Money Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-image-box" style={{ width: "50%", position: "relative", zIndex: 0 }}>
          <img src="/Adobe Express - file.png" alt="DARK 3-Serum System" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        </div>
      </section>

      {/* ── Scrolling Trust Bar ── */}
      <div style={{ background: "#111", overflow: "hidden", padding: "14px 0", position: "relative" }}>
        <div style={{ display: "flex", whiteSpace: "nowrap", animation: "scrollTrust 25s linear infinite", width: "fit-content" }}>
          {[...Array(2)].map((_, repeat) => (
            <div key={repeat} style={{ display: "flex" }}>
              {["Formulated for Fitzpatrick IV–VI", "✦", "No Bleaching Agents", "✦", "Tested on Melanin-Rich Skin", "✦", "Results in 8–12 Weeks", "✦", "Dermatologist Informed", "✦", "No Harsh Chemicals", "✦"].map((text, i) => (
                <span key={i} style={{ color: "#fff", fontSize: 12, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", marginRight: 32 }}>{text}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── The Clinical Approach ── */}
      <section className="section-pad" style={{ background: "#fff", padding: "100px 32px", borderBottom: "1px solid #eee" }}>
        <div className="grid-2" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <div style={{ aspectRatio: "4/5", borderRadius: 24, overflow: "hidden", background: "#f4f4f4" }}>
              <img src="/girl.png" alt="Melanin-rich skin close-up" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div className="science-badge" style={{ position: "absolute", bottom: -24, right: -24, background: "#111", color: "#fff", padding: "28px", borderRadius: 16, maxWidth: 260, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#aaa", margin: "0 0 12px" }}>Clinical Fact</p>
              <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0, color: "#eaeaea" }}>Melanocytes in Fitzpatrick IV–VI skin are larger and more reactive. Aggressive acids cause micro-tears that trigger <em>more</em> hyperpigmentation.</p>
            </div>
          </div>
          <div>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#888" }}>The Approach</span>
            <h2 className="title-text" style={{ fontSize: 42, fontWeight: 800, color: "#111", margin: "16px 0 24px", fontFamily: "Georgia, 'Times New Roman', serif", lineHeight: 1.1 }}>Standard skincare fails melanin-rich skin.</h2>
            <p style={{ fontSize: 16, color: "#666", lineHeight: 1.7, marginBottom: 48 }}>Most dark spot treatments are tested entirely on lighter skin types. They rely on aggressive bleaching agents and harsh exfoliants that strip the skin barrier—leading to rebound pigmentation. We engineered a better way.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {[
                { num: "01", title: "Root-Cause Prevention", desc: "We use gentle Tyrosinase Inhibitors to regulate your melanocytes at the source, stopping excess pigment production before it reaches the surface." },
                { num: "02", title: "Cellular Acceleration", desc: "In darker skin, trapped pigment can linger for 6–12 months. Our encapsulated retinol speeds up your skin's natural renewal cycle without the irritating side effects." },
                { num: "03", title: "Barrier First", desc: "A compromised barrier produces melanin as a defense mechanism. Every serum we make includes ceramides to fortify your skin while treating it." },
              ].map((point) => (
                <div key={point.num} style={{ display: "flex", gap: 20 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "#ccc", fontFamily: "Georgia, serif", fontStyle: "italic" }}>{point.num}</span>
                  <div>
                    <h4 style={{ fontSize: 17, fontWeight: 800, color: "#111", margin: "0 0 8px" }}>{point.title}</h4>
                    <p style={{ fontSize: 15, color: "#666", lineHeight: 1.6, margin: 0 }}>{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Quiz CTA Banner ── */}
      <section className="section-pad" style={{ background: "#f9f9f9", padding: "72px 32px", borderBottom: "1px solid #eee" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h3 className="title-text" style={{ fontSize: 32, fontWeight: 800, color: "#111", marginBottom: 16, fontFamily: "Georgia, 'Times New Roman', serif" }}>Not sure where to start?</h3>
          <p style={{ fontSize: 16, color: "#666", maxWidth: 500, margin: "0 auto 32px", lineHeight: 1.7 }}>Take our 2-minute clinical assessment to get a personalized regimen based on your specific hyperpigmentation triggers.</p>
          <a href="/quiz" onClick={() => trackCTAClick("Start Assessment", "home")} style={{ display: "inline-block", background: "#111", color: "#fff", border: "none", padding: "16px 44px", borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: 1.5, textTransform: "uppercase", boxShadow: "0 8px 16px rgba(0,0,0,0.1)", textDecoration: "none" }}>Start Assessment</a>
        </div>
      </section>

      {/* ── Before & After Section ── */}
      <section className="section-pad" style={{ background: "#fff", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#aaa" }}>Real Results</span>
            <h2 className="title-text" style={{ fontSize: 44, fontWeight: 800, color: "#111", margin: "12px 0 12px", fontFamily: "Georgia, 'Times New Roman', serif" }}>Real People. Real Progress.</h2>
            <p style={{ fontSize: 16, color: "#888", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>Results after 8–12 weeks of consistent use. No filters. No retouching.</p>
          </div>
          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {[
              { img: "/ba-1.png", name: "Aisha, 22", concern: "Acne PIH", weeks: "12 weeks", quote: "I took the skin quiz thinking nothing would be different. 12 weeks later my dark spots are almost gone. I wish I found this sooner." },
              { img: "/ba-2.png", name: "Marcus, 24", concern: "Acne PIH", weeks: "10 weeks", quote: "I never used skincare before. The quiz told me exactly what I needed and the routine was easy to stick with." },
              { img: "/ba-3.png", name: "Priya, 25", concern: "Sun damage", weeks: "12 weeks", quote: "Every product I tried before said 'for all skin types.' DARK is the first brand that actually felt made for me." },
              { img: "/ba-4.png", name: "Daniel, 23", concern: "Ingrown hair PIH", weeks: "12 weeks", quote: "The dark marks on my jawline from shaving had been there for years. After 12 weeks they've faded more than I thought possible." },
            ].map((item, i) => (
              <div key={i} style={{ borderRadius: 14, overflow: "hidden", background: "#f7f7f7" }}>
                <img src={item.img} alt={`${item.name} before and after using DARK`} style={{ width: "100%", height: "auto", display: "block" }} />
                <div style={{ padding: "16px 20px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div>
                      <p style={{ fontSize: 16, fontWeight: 700, color: "#111", margin: "0 0 2px" }}>{item.name}</p>
                      <p style={{ fontSize: 13, color: "#888", margin: 0 }}>{item.concern}</p>
                    </div>
                    <span style={{ background: "#111", color: "#fff", padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600 }}>{item.weeks}</span>
                  </div>
                  <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>&ldquo;{item.quote}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <button onClick={() => { trackCTAClick("Start Your Transformation", "home"); addToCart("3-Serum System Bundle (Subscription)", 79); }} style={{ background: "#111", color: "#fff", border: "none", padding: "16px 40px", borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: 1.5, textTransform: "uppercase" }}>Start Your Transformation</button>
          </div>
        </div>
      </section>

      {/* ── 3 Serums Section ── */}
      <section className="section-pad" style={{ background: "#f9f9f9", padding: "80px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#aaa" }}>The Regimen</span>
            <h2 className="title-text" style={{ fontSize: 44, fontWeight: 800, color: "#111", margin: "12px 0 16px", fontFamily: "Georgia, 'Times New Roman', serif" }}>Here is Your New Routine</h2>
            <p style={{ fontSize: 16, color: "#666", maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>Three targeted steps engineered to work together. Discover how each formula targets hyperpigmentation, then secure your complete system.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32, marginBottom: 64 }}>
            {[
              { step: "01", role: "Prevent", name: "Vitamin C Serum", time: "☀️ Morning", desc: "Blocks excess melanin production before new dark spots can form. Antioxidant-rich formula protects against environmental stressors.", img: "/Vitamin C.png" },
              { step: "02", role: "Treat", name: "Dark Spot Corrector", time: "🌙 Evening", desc: "Targets existing spots directly, fading them from the inside out using clinically proven tyrosinase inhibitors.", img: "/Dark Spots.png" },
              { step: "03", role: "Accelerate", name: "Retinol & Peptide", time: "🌙 Evening", desc: "Speeds up cell turnover to bring fresh, even skin to the surface faster. Plumps fine lines and smooths texture.", img: "/Retional.png" },
            ].map((item, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #eee", transition: "transform 0.2s ease, box-shadow 0.2s ease", display: "flex", flexDirection: "column" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.06)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ background: "#f0f0f0", height: 300, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", top: 16, left: 16, background: "#fff", padding: "6px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#111", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>Step {item.step}</div>
                </div>
                <div style={{ padding: "28px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: "#111", margin: "0 0 8px" }}>{item.name}</h3>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#888", margin: "0 0 16px" }}>{item.role} · {item.time}</p>
                  <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, margin: 0, flex: 1 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bundle CTA */}
          <div className="bundle-card" style={{ background: "#111", borderRadius: 20, padding: "56px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 32, backgroundImage: "linear-gradient(135deg, #111 0%, #222 100%)", boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}>
            <div className="bundle-col-header" style={{ flex: "1 1 400px" }}>
              <span style={{ display: "inline-block", background: "rgba(255,255,255,0.1)", color: "#fff", padding: "6px 12px", borderRadius: 100, fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Best Value</span>
              <h3 style={{ fontSize: 32, fontWeight: 800, color: "#fff", margin: "0 0 12px", fontFamily: "Georgia, 'Times New Roman', serif" }}>The 3-Serum System</h3>
              <p style={{ fontSize: 16, color: "#aaa", margin: 0, lineHeight: 1.6 }}>Get all three clinically-formulated serums working together. Prevent new spots, treat existing ones, and accelerate your skin's renewal cycle.</p>
            </div>
            <div className="bundle-col" style={{ display: "flex", flexDirection: "column", gap: 12, flex: "1 1 350px", maxWidth: 450 }}>
              <div onClick={() => setIsSubscription(true)} style={{ background: isSubscription ? "rgba(255,255,255,0.1)" : "transparent", border: isSubscription ? "2px solid #fff" : "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "16px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s ease" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{isSubscription && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fff" }} />}</div>
                    <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Subscribe & Save</span>
                    <span className="mobile-hide" style={{ background: "#fff", color: "#111", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 100 }}>SAVE $20</span>
                  </div>
                  <p style={{ color: "#aaa", fontSize: 13, margin: "6px 0 0 30px" }}>Delivered every 60 days. Cancel anytime.</p>
                </div>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>$79</span>
              </div>
              <div onClick={() => setIsSubscription(false)} style={{ background: !isSubscription ? "rgba(255,255,255,0.1)" : "transparent", border: !isSubscription ? "2px solid #fff" : "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "16px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s ease" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid " + (!isSubscription ? "#fff" : "#666"), display: "flex", alignItems: "center", justifyContent: "center" }}>{!isSubscription && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fff" }} />}</div>
                  <span style={{ color: isSubscription ? "#aaa" : "#fff", fontWeight: 600, fontSize: 16 }}>One-Time Purchase</span>
                </div>
                <span style={{ color: isSubscription ? "#aaa" : "#fff", fontWeight: 600, fontSize: 16 }}>$99</span>
              </div>
              <button onClick={() => addToCart(isSubscription ? "3-Serum System Bundle (Subscription)" : "3-Serum System Bundle", isSubscription ? 79 : 99)} style={{ background: "#fff", color: "#111", border: "none", padding: "18px 40px", borderRadius: 100, fontSize: 15, fontWeight: 800, cursor: "pointer", letterSpacing: 1, textTransform: "uppercase", boxShadow: "0 4px 12px rgba(255,255,255,0.2)", marginTop: 8, width: "100%" }}>Add to Cart — ${isSubscription ? 79 : 99}</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="section-pad" style={{ background: "#fff", padding: "72px 32px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#aaa" }}>FAQ</span>
            <h2 className="title-text" style={{ fontSize: 44, fontWeight: 800, color: "#111", margin: "12px 0 0", fontFamily: "Georgia, 'Times New Roman', serif" }}>Questions? We got you.</h2>
          </div>
          {[
            { q: "How long until I see results?", a: "Most people start seeing visible fading at 4–8 weeks, with significant results by 10–12 weeks. Your skin renews every 28 days — you need multiple cycles for the pigmented cells to be replaced with fresh ones." },
            { q: "Will this bleach or lighten my natural skin tone?", a: "No. DARK targets excess melanin in dark spots only — never your natural skin tone. We use zero bleaching agents. Your melanin is beautiful. We're only fading the spots." },
            { q: "Do I really need all 3 serums?", a: "Yes — each one plays a different role. Vitamin C prevents new spots, the Corrector fades existing ones, and Retinol speeds up cell turnover. Using just one won't give you the full results." },
            { q: "Is this safe for sensitive skin?", a: "We offer a sensitive skin version of the Dark Spot Corrector ($28). The full system is formulated to be effective without irritation, but we always recommend starting slow — alternate nights for the first 2 weeks." },
            { q: "What skin types is DARK made for?", a: "DARK is specifically formulated and tested for Fitzpatrick IV–VI skin — that includes most Black, Latino/a, and South Asian skin tones. If your skin produces a lot of melanin, this system was built for you." },
            { q: "Do I need to wear SPF too?", a: "Yes — SPF is non-negotiable when treating dark spots. Sun exposure triggers more melanin production and can darken existing spots. We don't sell SPF yet, but any broad-spectrum SPF 30+ will work." },
          ].map((item, i) => (
            <details key={i} style={{ borderBottom: "1px solid #eee", padding: "20px 0" }}>
              <summary style={{ fontSize: 17, fontWeight: 700, color: "#111", cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {item.q}
                <span style={{ fontSize: 22, fontWeight: 300, color: "#999", marginLeft: 16, flexShrink: 0 }}>+</span>
              </summary>
              <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, marginTop: 12, marginBottom: 0, paddingRight: 32 }}>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="section-pad" style={{ background: "#111", padding: "64px 32px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div>
              <p style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: 5, marginBottom: 16 }}>DARK</p>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, maxWidth: 280, margin: "0 auto" }}>Skincare formulated specifically for melanin-rich skin. Real results, honest timelines.</p>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: "#888", marginBottom: 16 }}>Shop</p>
              {["The Bundle", "Vitamin C Serum", "Dark Spot Corrector", "Retinol & Peptide"].map((item) => (
                <a key={item} href="#" style={{ display: "block", color: "#666", fontSize: 14, textDecoration: "none", marginBottom: 10 }}>{item}</a>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: "#888", marginBottom: 16 }}>Learn</p>
              {["How It Works", "The Science", "Skin Quiz", "FAQ"].map((item) => (
                <a key={item} href={item === "Skin Quiz" ? "/quiz" : "#"} style={{ display: "block", color: "#666", fontSize: 14, textDecoration: "none", marginBottom: 10 }}>{item}</a>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: "#888", marginBottom: 16 }}>Company</p>
              {["About Us", "Contact", "Shipping & Returns", "Privacy Policy"].map((item) => (
                <a key={item} href="#" style={{ display: "block", color: "#666", fontSize: 14, textDecoration: "none", marginBottom: 10 }}>{item}</a>
              ))}
            </div>
          </div>
          <div className="footer-bottom" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ color: "#555", fontSize: 12 }}>&copy; 2026 DARK Skincare. All rights reserved.</span>
            <div style={{ display: "flex", gap: 20 }}>
              {["Instagram", "TikTok", "Twitter"].map((item) => (
                <a key={item} href="#" style={{ color: "#555", fontSize: 12, textDecoration: "none" }}>{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}