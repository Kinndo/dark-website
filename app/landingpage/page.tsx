"use client";
import { useState, useEffect, useRef } from "react";

export default function HomePage() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [isSubscription, setIsSubscription] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});

  // Intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addToCart = (name, price) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.name === name);
      if (existing) return prev.map((item) => (item.name === name ? { ...item, qty: item.qty + 1 } : item));
      return [...prev, { name, price, qty: 1 }];
    });
    setCartOpen(true);
  };
  const removeFromCart = (name) => setCart((prev) => prev.filter((item) => item.name !== name));
  const updateQty = (name, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.name !== name) return item;
          const newQty = item.qty + delta;
          return newQty <= 0 ? item : { ...item, qty: newQty };
        })
        .filter((item) => item.qty > 0)
    );
  };
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const isVis = (id) => visibleSections[id];

  return (
    <main style={{ overflowX: "hidden" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,700&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
        rel="stylesheet"
      />
      <style>{`
        :root {
          --dark: #0A0A0A;
          --dark-surface: #141414;
          --light: #FAFAF7;
          --cream: #F5F0EB;
          --accent: #CAFF4B;
          --accent-hover: #b8ed3a;
          --text-primary: #111;
          --text-muted: #888;
          --text-light: #ccc;
          --serif: 'Playfair Display', Georgia, serif;
          --sans: 'DM Sans', -apple-system, sans-serif;
        }
        html, body { overflow-x: hidden; margin: 0; padding: 0; }
        * { box-sizing: border-box; }

        @keyframes scrollTrust {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          30% { transform: translate(3%, -15%); }
          50% { transform: translate(-15%, 5%); }
          70% { transform: translate(8%, 10%); }
          90% { transform: translate(-10%, 1%); }
        }

        .reveal { opacity: 0; transform: translateY(28px); transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .reveal-d1 { transition-delay: 0.1s; }
        .reveal-d2 { transition-delay: 0.2s; }
        .reveal-d3 { transition-delay: 0.3s; }
        .reveal-d4 { transition-delay: 0.4s; }
        .reveal-d5 { transition-delay: 0.5s; }

        .hero-fade { animation: fadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
        .hero-d1 { animation-delay: 0.15s; }
        .hero-d2 { animation-delay: 0.3s; }
        .hero-d3 { animation-delay: 0.5s; }
        .hero-d4 { animation-delay: 0.7s; }
        .hero-d5 { animation-delay: 0.85s; }
        .hero-img { animation: slideLeft 1s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards; opacity: 0; }

        .accent-btn {
          background: var(--accent);
          color: var(--dark);
          border: none;
          padding: 20px 44px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 800;
          font-family: var(--sans);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }
        .accent-btn:hover { background: var(--accent-hover); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(202,255,75,0.25); }

        .ghost-btn {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.3);
          padding: 18px 36px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 600;
          font-family: var(--sans);
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.25s ease;
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }
        .ghost-btn:hover { border-color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.05); }

        .dark-btn {
          background: var(--dark);
          color: #fff;
          border: none;
          padding: 20px 44px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 800;
          font-family: var(--sans);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s ease;
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }
        .dark-btn:hover { background: #222; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }

        .section-container { max-width: 1200px; margin: 0 auto; padding: 0 32px; }

        /* Grain overlay for dark sections */
        .grain-overlay::after {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
        }

        .desktop-hide { display: none !important; }

        @media (max-width: 900px) {
          .mobile-hide { display: none !important; }
          .desktop-hide { display: block !important; }
          .hero-grid { flex-direction: column !important; }
          .hero-text { width: 100% !important; padding: 140px 24px 80px !important; text-align: center !important; align-items: center !important; }
          .hero-text .cta-row { justify-content: center !important; flex-direction: column !important; align-items: center !important; }
          .hero-h1 { font-size: 44px !important; }
          .hero-sub { font-size: 16px !important; }
          .section-container { padding: 0 20px !important; }
          .products-grid { grid-template-columns: 1fr !important; }
          .ingredients-grid { grid-template-columns: 1fr !important; }
          .ba-grid { grid-template-columns: 1fr !important; }
          .reviews-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .quiz-grid { flex-direction: column !important; text-align: center !important; }
          .quiz-grid .quiz-text { align-items: center !important; }
          .pain-row { flex-direction: column !important; gap: 16px !important; }
          .pain-row .pain-divider { display: none !important; }
          .section-title { font-size: 34px !important; }
          .stat-title { font-size: 48px !important; }
          .trust-icons { flex-wrap: wrap !important; justify-content: center !important; gap: 24px 32px !important; }
        }
      `}</style>

      {/* ═══════════════════════════════════════ */}
      {/* MOBILE MENU */}
      {/* ═══════════════════════════════════════ */}
      {mobileMenuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "#0A0A0A", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: "0.15em", fontFamily: "var(--sans)" }}>DARK</span>
            <button onClick={() => setMobileMenuOpen(false)} style={{ background: "none", border: "none", fontSize: 28, cursor: "pointer", color: "#666", padding: 4, lineHeight: 1 }}>✕</button>
          </div>
          <div style={{ padding: "48px 24px", display: "flex", flexDirection: "column", gap: 32 }}>
            {[
              { label: "Skin Quiz", href: "/quiz" },
              { label: "Shop", href: "#pricing" },
              { label: "Results", href: "#results" },
              { label: "FAQ", href: "#faq" },
            ].map((item) => (
              <a key={item.label} href={item.href} onClick={() => setMobileMenuOpen(false)} style={{ color: "#fff", fontSize: 22, fontWeight: 700, textDecoration: "none", fontFamily: "var(--sans)" }}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════ */}
      {/* CART SIDEBAR */}
      {/* ═══════════════════════════════════════ */}
      {cartOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
          <div onClick={() => setCartOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 420, maxWidth: "92vw", background: "#fff", boxShadow: "-8px 0 40px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", fontFamily: "var(--sans)" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111", margin: 0 }}>Your Cart ({cartCount})</h3>
              <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#999", padding: 4 }}>✕</button>
            </div>
            <div style={{ flex: 1, overflow: "auto", padding: "16px 24px" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", paddingTop: 60 }}>
                  <p style={{ fontSize: 16, color: "#999", marginBottom: 20 }}>Your cart is empty</p>
                  <button onClick={() => setCartOpen(false)} className="dark-btn" style={{ padding: "14px 32px" }}>Continue Shopping</button>
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
                <button className="dark-btn" style={{ width: "100%", padding: "16px" }}>Checkout</button>
                <p style={{ fontSize: 12, color: "#999", textAlign: "center", marginTop: 10, marginBottom: 0 }}>Free shipping · 60-day guarantee</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════ */}
      {/* NAVBAR — Fixed, transparent over dark hero */}
      {/* ═══════════════════════════════════════ */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 101 }}>
        <nav style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "16px 0" }}>
          <div className="section-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <a href="/" style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "0.15em", textDecoration: "none", fontFamily: "var(--sans)" }}>DARK</a>
            <div className="mobile-hide" style={{ display: "flex", gap: 32, alignItems: "center" }}>
              {[
                { label: "Skin Quiz", href: "/quiz" },
                { label: "Shop", href: "#pricing" },
                { label: "Results", href: "#results" },
                { label: "FAQ", href: "#faq" },
              ].map((item) => (
                <a key={item.label} href={item.href} style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 500, textDecoration: "none", fontFamily: "var(--sans)", transition: "color 0.2s ease", letterSpacing: "0.02em" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <a href="#" onClick={(e) => { e.preventDefault(); setCartOpen(true); }} style={{ color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none", fontFamily: "var(--sans)", position: "relative" }}>
                Cart
                {cartCount > 0 && (
                  <span style={{ position: "absolute", top: -8, right: -16, background: "var(--accent)", color: "var(--dark)", width: 18, height: 18, borderRadius: "50%", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
                )}
              </a>
              <button className="desktop-hide" onClick={() => setMobileMenuOpen(true)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 22, color: "#fff", display: "flex", alignItems: "center" }}>☰</button>
            </div>
          </div>
        </nav>
      </header>

      {/* ═══════════════════════════════════════ */}
      {/* 01 · HERO — FULL BLEED IMAGE */}
      {/* ═══════════════════════════════════════ */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        {/* Full-bleed background image */}
        <img
          src="/Hero_picture.png"
          alt="DARK Skincare — Model with glowing melanin-rich skin and 3-serum system"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            zIndex: 0,
          }}
        />
        {/* Dark gradient overlay — heavier on left for text legibility */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0.05) 100%)",
          zIndex: 1,
        }} />
        {/* Bottom fade to blend into next section */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: "linear-gradient(to top, var(--dark-surface) 0%, transparent 100%)",
          zIndex: 1,
        }} />

        {/* Text content */}
        <div className="section-container" style={{ position: "relative", zIndex: 2, width: "100%" }}>
          <div className="hero-text" style={{ maxWidth: 560, padding: "160px 0 100px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <p className="hero-fade hero-d1" style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 24 }}>
              Personalized 3-Step Dark Spot System
            </p>
            <h1 className="hero-fade hero-d2 hero-h1" style={{ fontFamily: "var(--serif)", fontSize: 68, fontWeight: 800, color: "#fff", margin: "0 0 20px", lineHeight: 1.05, letterSpacing: "-0.01em", textShadow: "0 2px 40px rgba(0,0,0,0.3)" }}>
              Fade the Dark.
              <br />
              <span style={{ fontStyle: "italic", fontWeight: 400, color: "rgba(255,255,255,0.55)" }}>Own the Glow.</span>
            </h1>
            <p className="hero-fade hero-d3 hero-sub" style={{ fontFamily: "var(--sans)", fontSize: 18, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 440, marginBottom: 40 }}>
              Your skin quiz matches you to the exact combination of Vitamin C, Retinol & Peptide, and Dark Spot Serum your skin actually needs.
            </p>
            <div className="hero-fade hero-d4 cta-row" style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
              <a href="/quiz" className="accent-btn" style={{ padding: "20px 48px", fontSize: 15 }}>
                Take the Skin Quiz →
              </a>
              <a href="#pricing" className="ghost-btn">
                Shop the Full System — $99
              </a>
            </div>
            {/* Micro-trust */}
            <div className="hero-fade hero-d5" style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", color: "#FFB800", fontSize: 14, gap: 2 }}>★★★★★</div>
              <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
                4.8 · 3,200+ Reviews · Free Shipping
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* 02 · PROBLEM STRIP — DARK */}
      {/* ═══════════════════════════════════════ */}
      <section style={{ background: "var(--dark-surface)", padding: "48px 0", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div id="problems" data-animate className="section-container">
          <div className="pain-row" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 28 }}>
            {[
              "Dark spots that won't budge",
              "Dull, uneven tone",
              "Post-breakout marks",
              "Skin that looks tired",
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <span className={`reveal ${isVis("problems") ? "visible" : ""} reveal-d${i + 1}`} style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.35)", letterSpacing: "0.02em", padding: "0 28px", textAlign: "center" }}>
                  {text}
                </span>
                {i < 3 && <span className="pain-divider" style={{ color: "rgba(255,255,255,0.12)", fontSize: 20 }}>|</span>}
              </div>
            ))}
          </div>
          <p className={`reveal ${isVis("problems") ? "visible" : ""} reveal-d5`} style={{ fontFamily: "var(--sans)", fontSize: 16, fontWeight: 700, color: "var(--accent)", textAlign: "center", margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            DARK was engineered for exactly this.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* 09 · PRICING — WHITE (PROVEN-style PDP) */}
      {/* ═══════════════════════════════════════ */}
      <section id="pricing" style={{ background: "#fff", padding: "80px 0 100px" }}>
        <div id="pricing-section" data-animate className="section-container">
          <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>

            {/* LEFT — Product Image */}
            <div className={`reveal ${isVis("pricing-section") ? "visible" : ""}`}>
              <div style={{ borderRadius: 20, overflow: "hidden", background: "#f4f2ef", position: "relative" }}>
                <img
                  src="/Bundle 1.png"
                  alt="DARK 3-Serum System Bundle"
                  style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
                />
              </div>
              {/* Thumbnail strip */}
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                {["/Vitamin C.png", "/Dark Spots.png", "/Retional.png", "/Hero_picture.png"].map((img, i) => (
                  <div key={i} style={{
                    width: 72, height: 72, borderRadius: 10, overflow: "hidden",
                    border: i === 0 ? "2px solid var(--dark)" : "2px solid #eee",
                    cursor: "pointer", background: "#f4f2ef", flexShrink: 0,
                  }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Purchase Details */}
            <div className={`reveal ${isVis("pricing-section") ? "visible" : ""} reveal-d2`}>
              <p style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 8, filter: "brightness(0.65)" }}>
                Your Personalized System
              </p>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 40, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 12px", lineHeight: 1.1 }}>
                The 3-Serum System
              </h2>

              {/* Stars + reviews */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ display: "flex", color: "#FFB800", fontSize: 14, gap: 1 }}>★★★★★</div>
                <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>3,200+ Reviews</span>
              </div>

              <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: "#666", lineHeight: 1.7, margin: "0 0 8px" }}>
                Everything your skin needs to fade dark spots in 3 targeted steps. Vitamin C Serum, Dark Spot Serum, and Retinol & Peptide — formulated specifically for melanin-rich skin.
              </p>
              <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--text-muted)", margin: "0 0 24px" }}>
                Size: Vitamin C — 30ml · Dark Spot Serum — 30ml · Retinol & Peptide — 30ml
              </p>

              {/* Personalized Tags (like PROVEN) */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                {[
                  "Hyperpigmentation",
                  "Post-Acne Marks",
                  "Melanin-Rich Skin",
                  "Tyrosinase Inhibition",
                  "Barrier Protection",
                  "Cell Turnover",
                  "UV Defense",
                  "Anti-Inflammatory",
                  "Fitzpatrick IV–VI",
                ].map((tag) => (
                  <span key={tag} style={{
                    fontFamily: "var(--sans)",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#555",
                    padding: "6px 14px",
                    borderRadius: 100,
                    border: "1px solid #ddd",
                    background: "#fafafa",
                    whiteSpace: "nowrap",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Full Ingredients toggle */}
              <details style={{ marginBottom: 28 }}>
                <summary style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3, listStyle: "none" }}>
                  Full Ingredients List +
                </summary>
                <div style={{ marginTop: 12, padding: "16px", background: "#fafafa", borderRadius: 12, border: "1px solid #eee" }}>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 6px" }}>Vitamin C Serum</p>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 11, color: "#888", lineHeight: 1.6, margin: "0 0 12px" }}>Water, Propanediol, L-Ascorbic Acid, Glycerin, Oryza Sativa Extract, Calendula Officinalis Flower Extract, Chamomilla Recutita Flower Extract, 3-Glyceryl Ascorbate, Magnesium Ascorbyl Phosphate, Ferulic Acid, Xanthan Gum</p>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 6px" }}>Dark Spot Serum</p>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 11, color: "#888", lineHeight: 1.6, margin: "0 0 12px" }}>Water, Propanediol, Glycerin, Hexylresorcinol, Niacinamide, Kojic Acid, Azelaic Acid, Gluconolactone, Lentinus Edodes Extract, Trametes Versicolor Extract, Camellia Sinensis Leaf Extract, Resveratrol, Atelocollagen</p>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 6px" }}>Retinol & Peptide Serum</p>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 11, color: "#888", lineHeight: 1.6, margin: 0 }}>Water, Caprylic/Capric Triglyceride, Phospholipids, Retinol, Hexapeptide-11, Bisabolol, Butylene Glycol, Propanediol</p>
                </div>
              </details>

              {/* Subscribe / One-Time Toggle */}
              <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 24, border: "1px solid #e0e0e0", borderRadius: 14, overflow: "hidden" }}>
                {/* Subscribe option */}
                <div
                  onClick={() => setIsSubscription(true)}
                  style={{
                    padding: "18px 20px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    background: isSubscription ? "#fafafa" : "#fff",
                    borderBottom: "1px solid #e0e0e0",
                    transition: "background 0.2s ease",
                    position: "relative",
                  }}
                >
                  {/* Most Popular badge */}
                  {isSubscription && (
                    <span style={{
                      position: "absolute", top: -1, right: 16,
                      background: "var(--accent)", color: "var(--dark)",
                      padding: "4px 12px", borderRadius: "0 0 8px 8px",
                      fontSize: 10, fontWeight: 800, letterSpacing: "0.06em",
                      fontFamily: "var(--sans)",
                    }}>MOST POPULAR</span>
                  )}
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    {/* Radio */}
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%", marginTop: 2,
                      border: isSubscription ? "6px solid var(--dark)" : "2px solid #ccc",
                      background: "#fff", flexShrink: 0,
                      transition: "all 0.2s ease",
                    }} />
                    <div>
                      <p style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 4px" }}>
                        Subscribe & Save 20%
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span style={{ fontFamily: "var(--sans)", fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 11 }}>◎</span> Auto-Refill Every 2 Months
                        </span>
                        <span style={{ fontFamily: "var(--sans)", fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 11 }}>◎</span> Cancel or pause anytime
                        </span>
                        <span style={{ fontFamily: "var(--sans)", fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 11 }}>◎</span> Free reformulation as your skin changes
                        </span>
                      </div>
                    </div>
                  </div>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 18, fontWeight: 800, color: "var(--text-primary)", margin: 0, whiteSpace: "nowrap" }}>
                    $79
                  </p>
                </div>

                {/* One-Time option */}
                <div
                  onClick={() => setIsSubscription(false)}
                  style={{
                    padding: "18px 20px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: !isSubscription ? "#fafafa" : "#fff",
                    transition: "background 0.2s ease",
                  }}
                >
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%",
                      border: !isSubscription ? "6px solid var(--dark)" : "2px solid #ccc",
                      background: "#fff", flexShrink: 0,
                      transition: "all 0.2s ease",
                    }} />
                    <p style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 600, color: !isSubscription ? "var(--text-primary)" : "#999", margin: 0 }}>
                      One-Time Purchase
                    </p>
                  </div>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 18, fontWeight: !isSubscription ? 800 : 500, color: !isSubscription ? "var(--text-primary)" : "#999", margin: 0 }}>
                    $99
                  </p>
                </div>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={() => addToCart(isSubscription ? "3-Serum System (Subscription)" : "3-Serum System (One-Time)", isSubscription ? 79 : 99)}
                className="accent-btn"
                style={{ width: "100%", padding: "20px", fontSize: 15, marginBottom: 16, textAlign: "center" }}
              >
                Add to Cart — ${isSubscription ? 79 : 99}
              </button>

              {/* Trust micro-copy */}
              <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
                {[
                  { icon: "🚚", label: "Free shipping" },
                  { icon: "🔄", label: "Free reformulation" },
                  { icon: "✕", label: "Cancel anytime" },
                ].map((item) => (
                  <span key={item.label} style={{ fontFamily: "var(--sans)", fontSize: 12, color: "var(--text-muted)", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13 }}>{item.icon}</span> {item.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* 03 · PRODUCT BREAKDOWN — LIGHT */}
      {/* ═══════════════════════════════════════ */}
      <section style={{ background: "var(--light)", padding: "100px 0" }}>
        <div id="products" data-animate className="section-container">
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p className={`reveal ${isVis("products") ? "visible" : ""}`} style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12 }}>The System</p>
            <h2 className={`reveal ${isVis("products") ? "visible" : ""} reveal-d1 section-title`} style={{ fontFamily: "var(--serif)", fontSize: 44, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 12px", lineHeight: 1.1 }}>
              Three Products. One System.
              <br />
              <span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--text-muted)" }}>Every Step Has a Job.</span>
            </h2>
            <p className={`reveal ${isVis("products") ? "visible" : ""} reveal-d2`} style={{ fontFamily: "var(--sans)", fontSize: 16, color: "var(--text-muted)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
              Nothing is random. Every formula targets a specific layer of dark spot formation.
            </p>
          </div>

          <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, position: "relative" }}>
            {[
              {
                step: "01",
                name: "Vitamin C Serum",
                role: "Prevent",
                time: "Morning",
                timeIcon: "☀️",
                desc: "Neutralizes free radicals and UV damage that trigger dark spot production before it starts.",
                key: "Triple-form Vitamin C + Ferulic Acid",
                img: "/Vitamin C.png",
              },
              {
                step: "02",
                name: "Dark Spot Serum",
                role: "Treat",
                time: "AM + PM",
                timeIcon: "◐",
                desc: "Directly targets melanin overproduction — the root cause of stubborn dark spots — through 5 separate pathways.",
                key: "Hexylresorcinol · Kojic Acid · Niacinamide · Azelaic Acid",
                img: "/Dark Spots.png",
              },
              {
                step: "03",
                name: "Retinol & Peptide",
                role: "Accelerate",
                time: "Evening",
                timeIcon: "🌙",
                desc: "Speeds up cell turnover to resurface discoloration from within while you sleep. Peptides rebuild structure.",
                key: "Retinol · Hexapeptide-11 · Bisabolol",
                img: "/Retional.png",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`reveal ${isVis("products") ? "visible" : ""} reveal-d${i + 2}`}
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.06)",
                  transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.06)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ background: "#f2f2f0", height: 280, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 8 }}>
                    <span style={{ background: "var(--dark)", color: "#fff", padding: "6px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", fontFamily: "var(--sans)" }}>Step {item.step}</span>
                    <span style={{ background: "#fff", color: "var(--text-primary)", padding: "6px 12px", borderRadius: 100, fontSize: 11, fontWeight: 600, fontFamily: "var(--sans)" }}>{item.timeIcon} {item.time}</span>
                  </div>
                </div>
                <div style={{ padding: "28px 24px 32px" }}>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>{item.role}</p>
                  <h3 style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 12px" }}>{item.name}</h3>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "#666", lineHeight: 1.65, margin: "0 0 16px" }}>{item.desc}</p>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", margin: 0, borderTop: "1px solid #f0f0f0", paddingTop: 12 }}>
                    <span style={{ color: "var(--accent)", marginRight: 6, filter: "brightness(0.6)" }}>●</span> {item.key}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* System connector line */}
          <div className="mobile-hide" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 0 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>Prevent</span>
              <div style={{ width: 48, height: 1, background: "#ddd" }} />
              <span style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>Treat</span>
              <div style={{ width: 48, height: 1, background: "#ddd" }} />
              <span style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>Accelerate</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* 04 · QUIZ INTEGRATION — DARK */}
      {/* ═══════════════════════════════════════ */}
      <section className="grain-overlay" style={{ background: "var(--dark)", padding: "100px 0", position: "relative" }}>
        <div id="quiz-section" data-animate className="section-container">
          <div className="quiz-grid" style={{ display: "flex", alignItems: "center", gap: 80 }}>
            {/* Text */}
            <div className="quiz-text" style={{ flex: "1 1 50%", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <p className={`reveal ${isVis("quiz-section") ? "visible" : ""}`} style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, position: "relative", zIndex: 2 }}>
                Personalized For You
              </p>
              <h2 className={`reveal ${isVis("quiz-section") ? "visible" : ""} reveal-d1 section-title`} style={{ fontFamily: "var(--serif)", fontSize: 42, fontWeight: 800, color: "#fff", margin: "0 0 20px", lineHeight: 1.1, position: "relative", zIndex: 2 }}>
                Not Every Dark Spot Comes From the Same Place.
              </h2>
              <p className={`reveal ${isVis("quiz-section") ? "visible" : ""} reveal-d2`} style={{ fontFamily: "var(--sans)", fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.75, marginBottom: 32, maxWidth: 480, position: "relative", zIndex: 2 }}>
                Sun damage, hormonal shifts, post-acne marks, aging — they all look similar but respond to completely different treatments. Our 2-minute Skin Quiz analyzes your skin history to build the exact DARK system your skin needs.
              </p>

              <div className={`reveal ${isVis("quiz-section") ? "visible" : ""} reveal-d3`} style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 40, position: "relative", zIndex: 2 }}>
                {[
                  "Analyzes 5 clinical dimensions",
                  "Maps your pigment depth & triggers",
                  "Builds a personalized product protocol",
                ].map((text, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ color: "var(--accent)", fontSize: 14, fontWeight: 800 }}>✓</span>
                    <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{text}</span>
                  </div>
                ))}
              </div>

              <a href="/quiz" className={`reveal ${isVis("quiz-section") ? "visible" : ""} reveal-d4 accent-btn`} style={{ padding: "24px 56px", fontSize: 16, position: "relative", zIndex: 2 }}>
                Build My DARK Routine →
              </a>
              <p className={`reveal ${isVis("quiz-section") ? "visible" : ""} reveal-d5`} style={{ fontFamily: "var(--sans)", fontSize: 13, color: "rgba(255,255,255,0.25)", marginTop: 14, position: "relative", zIndex: 2 }}>
                2 minutes · No account required · Free
              </p>
            </div>

            {/* Visual — quiz preview card */}
            <div className={`reveal ${isVis("quiz-section") ? "visible" : ""} reveal-d3`} style={{ flex: "1 1 45%", position: "relative", zIndex: 2 }}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "40px 32px", backdropFilter: "blur(8px)" }}>
                <p style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 20 }}>Sample Question</p>
                <p style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 24, lineHeight: 1.3 }}>What color are your dark spots?</p>
                {[
                  { label: "Light tan / golden", color: "#C8A882" },
                  { label: "Medium–dark brown", color: "#8B6914" },
                  { label: "Very dark / near-black", color: "#3D2B1F" },
                  { label: "Grayish or blue-toned", color: "#6B7B8D" },
                ].map((opt, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12,
                    border: i === 1 ? "1px solid var(--accent)" : "1px solid rgba(255,255,255,0.08)",
                    background: i === 1 ? "rgba(202,255,75,0.04)" : "transparent",
                    marginBottom: 8,
                  }}>
                    <div style={{ width: 20, height: 20, borderRadius: 6, background: opt.color, flexShrink: 0, border: "1px solid rgba(255,255,255,0.1)" }} />
                    <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: i === 1 ? "#fff" : "rgba(255,255,255,0.4)", fontWeight: i === 1 ? 600 : 400 }}>{opt.label}</span>
                    {i === 1 && <span style={{ marginLeft: "auto", color: "var(--accent)", fontSize: 14 }}>✓</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* 05 · INGREDIENTS — LIGHT */}
      {/* ═══════════════════════════════════════ */}
      <section style={{ background: "var(--light)", padding: "100px 0" }}>
        <div id="ingredients" data-animate className="section-container">
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p className={`reveal ${isVis("ingredients") ? "visible" : ""}`} style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12 }}>The Science</p>
            <h2 className={`reveal ${isVis("ingredients") ? "visible" : ""} reveal-d1 section-title`} style={{ fontFamily: "var(--serif)", fontSize: 44, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 12px" }}>
              Every Ingredient Has a Reason.
            </h2>
            <p className={`reveal ${isVis("ingredients") ? "visible" : ""} reveal-d2`} style={{ fontFamily: "var(--sans)", fontSize: 16, color: "var(--text-muted)", maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>
              Only compounds with clinical evidence make it into DARK. Here are the four powerhouses driving your results.
            </p>
          </div>

          <div className="ingredients-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {[
              {
                name: "Vitamin C (Triple-Form)",
                desc: "L-Ascorbic Acid, MAP, and 3-Glyceryl Ascorbate work together to block melanin formation and fight oxidative damage at three different speeds.",
                tags: ["Dark Spots", "Dullness", "UV Damage"],
                accent: "#F5A623",
              },
              {
                name: "Retinol",
                desc: "Accelerates skin cell renewal to push discoloration out from deep within the dermis. Encapsulated delivery minimizes irritation.",
                tags: ["Post-Acne Marks", "Fine Lines", "Texture"],
                accent: "#9B59B6",
              },
              {
                name: "Hexylresorcinol + Kojic Acid",
                desc: "Dual tyrosinase inhibitors that interrupt the signal causing excess melanin production — without the side effects of hydroquinone.",
                tags: ["Stubborn Spots", "Hormonal Pigmentation"],
                accent: "#27AE60",
              },
              {
                name: "Niacinamide + Azelaic Acid",
                desc: "Calms inflammation, blocks pigment transfer between cells, and evens skin tone across both epidermal and dermal layers.",
                tags: ["Redness", "Sensitivity", "Uneven Tone"],
                accent: "#3498DB",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`reveal ${isVis("ingredients") ? "visible" : ""} reveal-d${i + 1}`}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: "32px 28px",
                  border: "1px solid rgba(0,0,0,0.05)",
                  transition: "box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.06)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.accent, marginBottom: 16 }} />
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 10px" }}>{item.name}</h3>
                <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "#666", lineHeight: 1.7, margin: "0 0 16px" }}>{item.desc}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {item.tags.map((tag) => (
                    <span key={tag} style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", background: "#f4f4f2", padding: "4px 10px", borderRadius: 100 }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* 06 · BEFORE & AFTER — DARK */}
      {/* ═══════════════════════════════════════ */}
      <section id="results" className="grain-overlay" style={{ background: "var(--dark)", padding: "100px 0", position: "relative" }}>
        <div id="ba-section" data-animate className="section-container" style={{ position: "relative", zIndex: 2 }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 className={`reveal ${isVis("ba-section") ? "visible" : ""} stat-title`} style={{ fontFamily: "var(--serif)", fontSize: 64, fontWeight: 800, color: "#fff", margin: "0 0 12px", lineHeight: 1 }}>
              87% saw visible fading
              <br />
              <span style={{ color: "var(--accent)" }}>in 6 weeks.</span>
            </h2>
            <p className={`reveal ${isVis("ba-section") ? "visible" : ""} reveal-d1`} style={{ fontFamily: "var(--sans)", fontSize: 14, color: "rgba(255,255,255,0.35)", margin: 0 }}>
              Independent clinical study · 28-day trial · 33 participants
            </p>
          </div>

          <div className="ba-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {[
              { img: "/ba-1.png", name: "Aisha, 22", concern: "Acne PIH", weeks: "12 weeks", quote: "I took the skin quiz thinking nothing would be different. 12 weeks later my dark spots are almost gone." },
              { img: "/ba-2.png", name: "Marcus, 24", concern: "Acne PIH", weeks: "10 weeks", quote: "The quiz told me exactly what I needed and the routine was easy to stick with." },
              { img: "/ba-3.png", name: "Priya, 25", concern: "Sun damage", weeks: "12 weeks", quote: "DARK is the first brand that actually felt made for me." },
              { img: "/ba-4.png", name: "Daniel, 23", concern: "Ingrown hair PIH", weeks: "12 weeks", quote: "The dark marks from shaving had been there for years. After 12 weeks they've faded more than I thought possible." },
            ].map((item, i) => (
              <div key={i} className={`reveal ${isVis("ba-section") ? "visible" : ""} reveal-d${i + 1}`} style={{ borderRadius: 16, overflow: "hidden", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <img src={item.img} alt={`${item.name} results`} style={{ width: "100%", height: "auto", display: "block" }} />
                <div style={{ padding: "16px 20px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div>
                      <p style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 2px" }}>{item.name}</p>
                      <p style={{ fontFamily: "var(--sans)", fontSize: 12, color: "rgba(255,255,255,0.35)", margin: 0 }}>{item.concern}</p>
                    </div>
                    <span style={{ background: "var(--accent)", color: "var(--dark)", padding: "5px 12px", borderRadius: 100, fontSize: 11, fontWeight: 800, fontFamily: "var(--sans)" }}>{item.weeks}</span>
                  </div>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>"{item.quote}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* 07 · REVIEWS — LIGHT */}
      {/* ═══════════════════════════════════════ */}
      <section style={{ background: "var(--cream)", padding: "80px 0" }}>
        <div id="reviews" data-animate className="section-container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 className={`reveal ${isVis("reviews") ? "visible" : ""} section-title`} style={{ fontFamily: "var(--serif)", fontSize: 44, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 8px" }}>
              8,000+ People Already Know.
            </h2>
            <p className={`reveal ${isVis("reviews") ? "visible" : ""} reveal-d1`} style={{ fontFamily: "var(--sans)", fontSize: 15, color: "var(--text-muted)", margin: 0 }}>Real skin. Real results. No filters.</p>
          </div>

          <div className="reviews-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { stars: 5, title: "Finally something that works on my hormonal melasma", body: "I've tried everything. The skin quiz identified my pigment as mixed-depth and the 3-product system started fading my spots within 6 weeks.", name: "Keisha M.", tag: "Verified Buyer" },
              { stars: 5, title: "My acne marks are almost invisible now", body: "The dark spot serum is insane. I've never had a product that actually faded my PIH this fast. The quiz told me to use all three and I'm so glad I listened.", name: "Jaylen T.", tag: "Verified Buyer" },
              { stars: 5, title: "Built for skin like mine", body: "Every other brand says 'for all skin types' but DARK is the first one that actually understands melanin-rich skin. The retinol doesn't irritate and the vitamin C is smooth.", name: "Amara K.", tag: "Verified Buyer" },
              { stars: 5, title: "Took the quiz on a whim — now I'm subscribed", body: "The quiz results were so detailed I felt like I'd been to a derm. Ordered the system and my skin has never been more even.", name: "Marcus R.", tag: "Verified Buyer" },
              { stars: 4, title: "Slow start but the results are real", body: "Didn't see much the first month, but weeks 5–8 everything started fading fast. Patience is key. The routine is simple — 3 products, that's it.", name: "Priya S.", tag: "Verified Buyer" },
              { stars: 5, title: "Gifted this to my mom — she's obsessed", body: "She had sun spots from years of no SPF. After 10 weeks on the full system her tone is so much more even. She calls it her 'miracle kit'.", name: "Daniel O.", tag: "Verified Buyer" },
            ].map((review, i) => (
              <div key={i} className={`reveal ${isVis("reviews") ? "visible" : ""} reveal-d${Math.min(i + 1, 5)}`} style={{ background: "#fff", borderRadius: 16, padding: "24px", border: "1px solid rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", color: "#FFB800", fontSize: 13, gap: 2, marginBottom: 12 }}>
                  {"★".repeat(review.stars)}{"☆".repeat(5 - review.stars)}
                </div>
                <h4 style={{ fontFamily: "var(--serif)", fontSize: 16, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px", lineHeight: 1.3 }}>{review.title}</h4>
                <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "#666", lineHeight: 1.65, margin: "0 0 14px" }}>{review.body}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{review.name}</span>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 11, color: "var(--text-muted)", background: "#f4f4f2", padding: "2px 8px", borderRadius: 100 }}>{review.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* 08 · TRUST BAR — DARK */}
      {/* ═══════════════════════════════════════ */}
      <section style={{ background: "var(--dark)", padding: "44px 0", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="section-container">
          <div className="trust-icons" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {[
              { icon: "🇺🇸", label: "Made in USA" },
              { icon: "🐇", label: "Cruelty Free" },
              { icon: "🌿", label: "Clean Ingredients" },
              { icon: "🩺", label: "Dermatologist Tested" },
              { icon: "◎", label: "Dye-Free" },
              { icon: "📊", label: "Evidence-Based" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em", textTransform: "uppercase", textAlign: "center" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* 10 · FAQ — CREAM */}
      {/* ═══════════════════════════════════════ */}
      <section id="faq" style={{ background: "var(--cream)", padding: "80px 0" }}>
        <div id="faq-section" data-animate className="section-container" style={{ maxWidth: 720 }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 className={`reveal ${isVis("faq-section") ? "visible" : ""} section-title`} style={{ fontFamily: "var(--serif)", fontSize: 44, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              Questions? Answered.
            </h2>
          </div>
          {[
            { q: "How does the skin quiz personalize my system?", a: "The quiz scores 5 clinical dimensions — spot color, coverage, trigger type, duration, and treatment history — to calculate your pigment depth and severity. Based on your total score, it recommends either 2 or 3 DARK products with specific usage instructions tailored to your profile." },
            { q: "Can I use DARK if I have sensitive skin?", a: "Yes. Every DARK product includes anti-inflammatory actives like Bisabolol, Chamomile, and Calendula specifically to prevent irritation. We recommend starting with 2–3 nights per week for the Retinol & Peptide serum and building up as your skin adjusts." },
            { q: "When will I start seeing results?", a: "Most customers notice visible fading between 4–8 weeks. Your skin renews every 28 days — you need multiple renewal cycles for pigmented cells to be replaced. Mild cases see results faster; deeper pigmentation takes 3–5 months for meaningful change." },
            { q: "What if my skin changes over time?", a: "Subscribers get free reformulation. As your skin improves or your needs change, retake the quiz and we'll adjust your system — no extra charge. Your routine should evolve with your skin." },
            { q: "Can I use other skincare products alongside DARK?", a: "Absolutely. DARK replaces only your treatment serums. Continue using your cleanser, moisturizer, and SPF as usual. The only products to avoid layering directly with Retinol are other exfoliating acids on the same night." },
            { q: "How long will my products last?", a: "Each product is designed to last approximately 60 days with daily use — which is why the subscription refills every 2 months. One-time purchase customers can reorder whenever they need a refill." },
          ].map((item, i) => (
            <details
              key={i}
              className={`reveal ${isVis("faq-section") ? "visible" : ""} reveal-d${Math.min(i + 1, 5)}`}
              style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", padding: "20px 0" }}
            >
              <summary style={{ fontFamily: "var(--sans)", fontSize: 17, fontWeight: 700, color: "var(--text-primary)", cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {item.q}
                <span style={{ fontSize: 20, fontWeight: 300, color: "#bbb", marginLeft: 16, flexShrink: 0 }}>+</span>
              </summary>
              <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: "#666", lineHeight: 1.7, marginTop: 12, marginBottom: 0, paddingRight: 32 }}>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* FOOTER — DARK */}
      {/* ═══════════════════════════════════════ */}
      <footer style={{ background: "var(--dark)", padding: "64px 0 32px" }}>
        <div className="section-container">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div>
              <p style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "0.15em", marginBottom: 16, fontFamily: "var(--sans)" }}>DARK</p>
              <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "rgba(255,255,255,0.3)", lineHeight: 1.7, maxWidth: 280 }}>Skincare formulated specifically for melanin-rich skin. Real results, honest timelines.</p>
            </div>
            <div>
              <p style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>Shop</p>
              {["The Bundle", "Vitamin C Serum", "Dark Spot Serum", "Retinol & Peptide"].map((item) => (
                <a key={item} href="#pricing" style={{ display: "block", fontFamily: "var(--sans)", color: "rgba(255,255,255,0.4)", fontSize: 14, textDecoration: "none", marginBottom: 10, transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                >{item}</a>
              ))}
            </div>
            <div>
              <p style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>Learn</p>
              {[
                { label: "How It Works", href: "#products" },
                { label: "The Science", href: "#ingredients" },
                { label: "Skin Quiz", href: "/quiz" },
                { label: "FAQ", href: "#faq" },
              ].map((item) => (
                <a key={item.label} href={item.href} style={{ display: "block", fontFamily: "var(--sans)", color: "rgba(255,255,255,0.4)", fontSize: 14, textDecoration: "none", marginBottom: 10, transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                >{item.label}</a>
              ))}
            </div>
            <div>
              <p style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>Company</p>
              {["About Us", "Contact", "Shipping & Returns", "Privacy Policy"].map((item) => (
                <a key={item} href="#" style={{ display: "block", fontFamily: "var(--sans)", color: "rgba(255,255,255,0.4)", fontSize: 14, textDecoration: "none", marginBottom: 10, transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                >{item}</a>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontFamily: "var(--sans)", color: "rgba(255,255,255,0.2)", fontSize: 12 }}>© 2026 DARK Skincare. All rights reserved.</span>
            <div style={{ display: "flex", gap: 20 }}>
              {["Instagram", "TikTok", "Twitter"].map((item) => (
                <a key={item} href="#" style={{ fontFamily: "var(--sans)", color: "rgba(255,255,255,0.3)", fontSize: 12, textDecoration: "none" }}>{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}