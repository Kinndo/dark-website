"use client";
import { useState, useEffect } from "react";
import { VARIANTS, SELLING_PLANS, createCart } from "@/lib/shopify";
import { trackAddToCart, trackInitiateCheckout, trackEmailSignup, trackViewContent, trackCTAClick } from "@/lib/meta-pixel";

export default function BrandPage() {
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});
  const [purchaseType, setPurchaseType] = useState<"one-time" | "subscribe">("subscribe");
  const [activeImg, setActiveImg] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [emailValue, setEmailValue] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const galleryImages = [
    { src: "/a.png", alt: "DARK 3-Serum System — all three bottles" },
    { src: "/Vitamin C.png", alt: "DARK Vitamin C Serum — amber bottle" },
    { src: "/Dark Spots.png", alt: "DARK Dark Spot Serum — clear bottle" },
    { src: "/Retional.png", alt: "DARK Retinol & Peptide Face Serum — white bottle" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isVis = (id: string) => visibleSections[id];

  return (
    <main style={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,700&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
        rel="stylesheet"
      />
      <style>{`
        :root {
          --page-base: #FAF7F2;
          --section-bg: #F2EBE0;
          --card-bg: #E8DDD0;
          --body-text: #1A1410;
          --muted-text: #6B5B4E;
          --cta-lime: #CAFF4B;
          --serif: 'Playfair Display', Georgia, serif;
          --sans: 'DM Sans', -apple-system, sans-serif;
        }
        html, body { overflow-x: hidden; margin: 0; padding: 0; }
        * { box-sizing: border-box; }
        a { text-decoration: none; }

        .reveal { opacity: 0; transform: translateY(28px); transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .reveal-d1 { transition-delay: 0.1s; }
        .reveal-d2 { transition-delay: 0.2s; }
        .reveal-d3 { transition-delay: 0.3s; }

        .brand-container { max-width: 720px; margin: 0 auto; padding: 0 28px; }

        .editorial-body p {
          font-size: 17px;
          line-height: 1.8;
          color: var(--body-text);
          margin: 0 0 24px;
          font-family: var(--sans);
        }
        .editorial-body p em { font-style: italic; }

        .editorial-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--muted-text);
          margin: 0 0 16px;
          font-family: var(--sans);
        }

        .editorial-heading {
          font-size: 36px;
          font-weight: 400;
          color: var(--body-text);
          font-family: var(--serif);
          line-height: 1.25;
          margin: 0 0 36px;
        }

        .editorial-divider {
          border: none;
          border-top: 1px solid rgba(26,20,16,0.08);
          margin: 0;
        }

        /* Serum cards — warm */
        .serum-card-warm {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 40px 28px;
          transition: all 0.3s ease;
        }
        .serum-card-warm:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(26,20,16,0.08); }

        .serum-number-warm {
          font-size: 52px;
          font-weight: 400;
          color: rgba(26,20,16,0.1);
          font-family: var(--serif);
          line-height: 1;
          margin: 0 0 16px;
        }

        .serum-name-warm {
          font-size: 22px;
          font-weight: 400;
          color: var(--body-text);
          font-family: var(--serif);
          margin: 0 0 16px;
        }

        .serum-desc-warm {
          font-size: 15px;
          line-height: 1.75;
          color: var(--muted-text);
          margin: 0;
          font-family: var(--sans);
        }

        /* Proof cards */
        .proof-card-warm {
          background: var(--card-bg);
          border-radius: 16px;
          overflow: hidden;
        }

        .proof-body-warm { padding: 24px 28px 28px; }
        .proof-stars-warm { color: var(--body-text); font-size: 13px; letter-spacing: 2px; margin: 0 0 10px; }
        .proof-text-warm {
          font-size: 15px;
          line-height: 1.7;
          color: var(--muted-text);
          margin: 0 0 14px;
          font-style: italic;
          font-family: var(--sans);
        }
        .proof-name-warm {
          font-size: 13px;
          font-weight: 600;
          color: rgba(26,20,16,0.45);
          margin: 0;
          font-family: var(--sans);
        }

        /* BA tape label aesthetic */
        .ba-frame {
          position: relative;
          background: #fff;
          padding: 6px;
          box-shadow: 0 2px 12px rgba(26,20,16,0.06);
          transform: rotate(-0.5deg);
        }
        .ba-frame:nth-child(even) { transform: rotate(0.7deg); }
        .ba-tape {
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255,245,220,0.85);
          color: rgba(26,20,16,0.4);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 4px 16px;
          font-family: var(--sans);
        }

        /* Pricing */
        .pricing-card-warm {
          background: var(--card-bg);
          border: 2px solid transparent;
          border-radius: 20px;
          padding: 40px 32px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }
        .pricing-card-warm.active {
          border-color: var(--body-text);
          box-shadow: 0 8px 40px rgba(26,20,16,0.1);
        }

        /* CTA — only place lime appears */
        .cta-lime {
          background: var(--cta-lime);
          color: var(--body-text);
          border: none;
          padding: 20px 48px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 800;
          font-family: var(--sans);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          display: inline-block;
          text-align: center;
        }
        .cta-lime:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(202,255,75,0.35); }

        @media (max-width: 768px) {
          .brand-container { padding: 0 20px; }
          .editorial-body p { font-size: 16px; }
          .editorial-heading { font-size: 28px; }
          .serums-grid { grid-template-columns: 1fr !important; }
          .proof-grid { grid-template-columns: 1fr !important; }
          .pricing-row { flex-direction: column !important; }
          .pricing-card-warm { width: 100% !important; }
          .email-row { flex-direction: column !important; }
          .email-row input, .email-row button { width: 100% !important; border-radius: 8px !important; }
          .ba-collage { grid-template-columns: 1fr 1fr !important; }
          .product-layout { grid-template-columns: 1fr !important; }
          .purchase-cards { grid-template-columns: 1fr !important; }
        }
      `}</style>


      {/* ══════════════════════════════════════════════════════════
          STORY ZONE — Sections 01–03
          Warmest, most editorial. #FAF7F2. Breathing room.
      ══════════════════════════════════════════════════════════ */}
      <div style={{ background: "var(--page-base)" }}>

        {/* ── SECTION 01 — TRANSITION HOOK ── */}
        <section style={{ paddingTop: 120, paddingBottom: 56 }}>
          <div className="brand-container">
            <div
              id="s1"
              data-animate
              className={`reveal ${isVis("s1") ? "visible" : ""}`}
            >
              <p style={{ fontSize: 28, lineHeight: 1.6, color: "var(--body-text)", fontStyle: "italic", fontFamily: "var(--serif)", margin: "0 0 28px" }}>
                I didn&rsquo;t set out to build a brand.
              </p>
              <p style={{ fontSize: 28, lineHeight: 1.6, color: "var(--body-text)", fontStyle: "italic", fontFamily: "var(--serif)", margin: "0 0 28px" }}>
                I set out to fix my own skin &mdash; so my daughter wouldn&rsquo;t have to grow up feeling the same way I did.
              </p>
              <p style={{ fontSize: 28, lineHeight: 1.6, color: "var(--body-text)", fontStyle: "italic", fontFamily: "var(--serif)", margin: 0 }}>
                What I found along the way took two years, a lot of wasted money, and more than a few products that made things worse before they got better.
              </p>
            </div>
          </div>
        </section>

        <div className="brand-container"><hr className="editorial-divider" /></div>

        {/* ── SECTION 02 — THE STRUGGLE ── */}
        <section style={{ padding: "72px 0" }}>
          <div className="brand-container editorial-body">
            <div
              id="s2"
              data-animate
              className={`reveal ${isVis("s2") ? "visible" : ""}`}
            >
              <p className="editorial-label">The Struggle</p>
              <h2 className="editorial-heading">Everything I tried that didn&rsquo;t work</h2>

              <p>
                I started where most people start. The products with the biggest promises and the prettiest packaging. Brightening serums. Dark spot correctors. Vitamin C everything.
              </p>
              <p>
                Some of them burned. Some of them did nothing. One left my skin looking grey in natural light &mdash; a shade I&rsquo;d never had before I started &ldquo;treating&rdquo; it.
              </p>
              <p>
                I noticed something after a while. The before and afters on every product I tried showed the same thing: lighter skin. The research behind most of them was built around lighter skin. The &ldquo;universal&rdquo; solutions were universal for everyone except me.
              </p>
              <p>
                Every time I had a reaction &mdash; redness, irritation, a new breakout &mdash; my spots got darker. I didn&rsquo;t know it then, but that&rsquo;s how melanin-rich skin works. Inflammation triggers more melanin production. The wrong product doesn&rsquo;t just fail to help. It actively makes things worse.
              </p>
              <p style={{ marginBottom: 0 }}>
                I spent two years and more money than I want to admit figuring that out.
              </p>
            </div>

            {/* Image 1 — End of struggle, honest mirror portrait */}
            <div
              id="s2-img"
              data-animate
              className={`reveal reveal-d2 ${isVis("s2-img") ? "visible" : ""}`}
              style={{ marginTop: 56 }}
            >
              <div style={{ borderRadius: 12, overflow: "hidden" }}>
                <img
                  src="/story-portrait.png"
                  alt="A woman examining her skin in the bathroom mirror, searching for answers"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="brand-container"><hr className="editorial-divider" /></div>

        {/* ── SECTION 03 — THE DISCOVERY ── */}
        <section style={{ padding: "72px 0" }}>
          <div className="brand-container editorial-body">
            <div
              id="s3"
              data-animate
              className={`reveal ${isVis("s3") ? "visible" : ""}`}
            >
              <p className="editorial-label">The Discovery</p>
              <h2 className="editorial-heading">What I learned about my skin</h2>

              <p>
                Once I understood why things were failing, everything looked different.
              </p>
              <p>
                Melanin-rich skin isn&rsquo;t difficult. It isn&rsquo;t stubborn. It just operates by a different set of rules &mdash; rules that the majority of the skincare industry has never bothered to learn.
              </p>
              <p>
                When skin like mine experiences inflammation &mdash; from a breakout, from irritation, from a harsh chemical it wasn&rsquo;t built to handle &mdash; it responds by producing more melanin. That&rsquo;s where the dark spots come from. Not from the original blemish. From the skin&rsquo;s own defense response, triggered over and over again by the wrong products.
              </p>
              <p>
                I also learned that treating hyperpigmentation on deeper skin tones isn&rsquo;t a one-step process. You have to interrupt melanin production at the source. You have to target existing spots directly. And you have to support the skin&rsquo;s ability to resurface and renew &mdash; because without that third step, the first two don&rsquo;t hold.
              </p>
              <p>
                Three steps. In the right order. With the right concentrations for skin that actually produces melanin.
              </p>
              <p style={{ marginBottom: 0 }}>
                That&rsquo;s what nobody had ever put together before. Not for me. Not for women like me.
              </p>
            </div>
          </div>
        </section>

        {/* ── EMAIL CAPTURE ── */}
        <section style={{ padding: "0 0 72px" }}>
          <div className="brand-container">
            <div
              id="email"
              data-animate
              className={`reveal ${isVis("email") ? "visible" : ""}`}
              style={{ background: "var(--section-bg)", borderRadius: 16, padding: "48px 36px", textAlign: "center" }}
            >
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "var(--muted-text)", margin: "0 0 10px", fontFamily: "var(--sans)" }}>
                Get the routine
              </p>
              <p style={{ fontSize: 24, fontWeight: 400, color: "var(--body-text)", fontFamily: "var(--serif)", margin: "0 0 8px" }}>
                Get the routine I use
              </p>
              <p style={{ fontSize: 14, color: "var(--muted-text)", margin: "0 0 24px", lineHeight: 1.6 }}>
                Join the waitlist for skincare advice built for melanin-rich skin.
              </p>
              {emailStatus === "success" ? (
                <p style={{ fontSize: 16, color: "var(--body-text)", fontFamily: "var(--sans)", fontWeight: 600, margin: 0 }}>
                  ✓ You&rsquo;re in. Check your inbox.
                </p>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!emailValue || !emailValue.includes("@")) return;
                    setEmailStatus("loading");
                    try {
                      const res = await fetch("/api/subscribe", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: emailValue }),
                      });
                      if (res.ok) {
                        setEmailStatus("success");
                        trackEmailSignup("brand-page");
                      } else {
                        setEmailStatus("error");
                      }
                    } catch {
                      setEmailStatus("error");
                    }
                  }}
                >
                  <div className="email-row" style={{ display: "flex", maxWidth: 440, margin: "0 auto", gap: 0 }}>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={emailValue}
                      onChange={(e) => { setEmailValue(e.target.value); if (emailStatus === "error") setEmailStatus("idle"); }}
                      required
                      style={{
                        flex: 1,
                        padding: "14px 18px",
                        border: emailStatus === "error" ? "1px solid #c44" : "1px solid rgba(26,20,16,0.12)",
                        borderRight: "none",
                        borderRadius: "8px 0 0 8px",
                        fontSize: 14,
                        fontFamily: "var(--sans)",
                        outline: "none",
                        background: "#fff",
                        color: "var(--body-text)",
                      }}
                    />
                    <button
                      type="submit"
                      disabled={emailStatus === "loading"}
                      style={{
                        padding: "14px 28px",
                        background: "var(--body-text)",
                        color: "var(--page-base)",
                        border: "none",
                        borderRadius: "0 8px 8px 0",
                        fontSize: 13,
                        fontWeight: 800,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        cursor: emailStatus === "loading" ? "not-allowed" : "pointer",
                        fontFamily: "var(--sans)",
                        opacity: emailStatus === "loading" ? 0.6 : 1,
                      }}
                    >
                      {emailStatus === "loading" ? "..." : "Join"}
                    </button>
                  </div>
                  {emailStatus === "error" && (
                    <p style={{ fontSize: 13, color: "#c44", marginTop: 12, marginBottom: 0, fontFamily: "var(--sans)" }}>
                      Something went wrong. Please try again.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </section>
      </div>


      {/* ══════════════════════════════════════════════════════════
          TRANSITION — Section 04 — The Reveal
          Subtle shift to #F2EBE0. DARK name appears.
      ══════════════════════════════════════════════════════════ */}
      <div style={{ background: "var(--section-bg)" }}>
        <section style={{ padding: "80px 0" }}>
          <div className="brand-container editorial-body">
            <div
              id="s4"
              data-animate
              className={`reveal ${isVis("s4") ? "visible" : ""}`}
            >
              <p className="editorial-label">The Reveal</p>
              <h2 className="editorial-heading">The system I built</h2>

              <p>So I built it myself.</p>
              <p>
                Not in a lab coat. Not with a team of investors behind me. Starting with obsessive research, a long list of failed products, and a very clear understanding of what my skin actually needed &mdash; because I&rsquo;d spent two years learning it the hard way.
              </p>
              <p>
                The result is <span style={{ fontWeight: 600 }}>DARK</span>. A three-serum system built specifically for melanin-rich skin, designed to treat hyperpigmentation the way my skin actually works &mdash; not the way the industry assumed it did.
              </p>
              <p style={{ marginBottom: 48 }}>
                This isn&rsquo;t a general skincare line with a diverse marketing campaign. It&rsquo;s a protocol. Built from the ground up for one purpose: to work for skin like yours.
              </p>

              {/* Image 2 — Mother & daughter, quiet confidence */}
              <div style={{ borderRadius: 12, overflow: "hidden", maxWidth: 520, margin: "0 auto" }}>
                <img
                  src="/story-reveal.png"
                  alt="Mother holding her daughter with quiet confidence"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>


      {/* ══════════════════════════════════════════════════════════
          PRODUCT ZONE — Sections 05–07
          Warm cards on #E8DDD0. Lime green CTAs only in 07.
      ══════════════════════════════════════════════════════════ */}
      <div style={{ background: "var(--section-bg)" }}>

        {/* ── SECTION 05 — THE THREE SERUMS ── */}
        <section style={{ padding: "40px 0 80px" }}>
          <div className="brand-container">
            <div className="brand-container" style={{ padding: 0 }}><hr className="editorial-divider" style={{ marginBottom: 80 }} /></div>
            <div
              id="s5"
              data-animate
              className={`reveal ${isVis("s5") ? "visible" : ""}`}
            >
              <p className="editorial-label" style={{ textAlign: "center" }}>The System</p>
              <h2 className="editorial-heading" style={{ textAlign: "center", marginBottom: 56 }}>
                What each serum does and why
              </h2>

              <div className="serums-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                <div className="serum-card-warm" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                  <div style={{ width: "100%", maxWidth: 160, margin: "0 auto 20px", borderRadius: 12, overflow: "hidden", padding: 12 }}>
                    <img src="/Vitamin C.png" alt="DARK Vitamin C Serum" style={{ width: "100%", height: "auto", display: "block" }} />
                  </div>
                  <p className="serum-number-warm">01</p>
                  <h3 className="serum-name-warm">Vitamin C Serum</h3>
                  <p className="serum-desc-warm">
                    Interrupts melanin production before new spots can form. Protects against the environmental triggers that make hyperpigmentation worse over time.
                  </p>
                </div>

                <div className="serum-card-warm" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                  <div style={{ width: "100%", maxWidth: 160, margin: "0 auto 20px", borderRadius: 12, overflow: "hidden", padding: 12 }}>
                    <img src="/Dark Spots.png" alt="DARK Dark Spot Serum" style={{ width: "100%", height: "auto", display: "block" }} />
                  </div>
                  <p className="serum-number-warm">02</p>
                  <h3 className="serum-name-warm">Dark Spot Serum</h3>
                  <p className="serum-desc-warm">
                    Works directly on existing hyperpigmentation. Formulated at concentrations that penetrate where PIH actually lives in melanin-rich skin.
                  </p>
                </div>

                <div className="serum-card-warm" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                  <div style={{ width: "100%", maxWidth: 160, margin: "0 auto 20px", borderRadius: 12, overflow: "hidden", padding: 12 }}>
                    <img src="/Retional.png" alt="DARK Retinol & Peptide Serum" style={{ width: "100%", height: "auto", display: "block" }} />
                  </div>
                  <p className="serum-number-warm">03</p>
                  <h3 className="serum-name-warm">Retinol &amp; Peptide Serum</h3>
                  <p className="serum-desc-warm">
                    Supports skin renewal and cell turnover so results actually last. Without this, spots fade and return. With it, the skin builds a new baseline.
                  </p>
                </div>
              </div>

              <p style={{ fontSize: 17, lineHeight: 1.8, color: "var(--muted-text)", textAlign: "center", marginTop: 48, fontFamily: "var(--sans)", fontStyle: "italic" }}>
                Used together, in order, they work the way your skin works. Not against it.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 06 — SOCIAL PROOF / BEFORE & AFTERS ── */}
        <section style={{ padding: "0 0 80px" }}>
          <div className="brand-container">
            <hr className="editorial-divider" style={{ marginBottom: 80 }} />
            <div
              id="s6"
              data-animate
              className={`reveal ${isVis("s6") ? "visible" : ""}`}
            >
              <p className="editorial-label" style={{ textAlign: "center" }}>Results</p>
              <h2 className="editorial-heading" style={{ textAlign: "center", marginBottom: 12 }}>
                Women who look like me, with results
              </h2>
              <p style={{ fontSize: 17, lineHeight: 1.8, color: "var(--muted-text)", textAlign: "center", marginBottom: 56, fontFamily: "var(--sans)", fontStyle: "italic" }}>
                I&rsquo;m not the only one who found it.
              </p>

              {/* Before & After collage — tape label aesthetic */}
              <div className="ba-collage" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 56 }}>
                {[
                  { img: "/ba-new-1.png", label: "1 month" },
                  { img: "/ba-new-2.png", label: "8 weeks" },
                  { img: "/ba-new-3.png", label: "6 weeks" },
                ].map((item, i) => (
                  <div key={i} className="ba-frame" style={{ transform: i % 2 === 0 ? "rotate(-0.8deg)" : "rotate(0.6deg)", gridColumn: i === 2 ? "1 / -1" : "auto" }}>
                    <div className="ba-tape">{item.label}</div>
                    <img
                      src={item.img}
                      alt={`Before and after results — ${item.label}`}
                      style={{ width: "100%", height: "auto", display: "block", borderRadius: 2, maxHeight: i === 2 ? 420 : "none", objectFit: i === 2 ? "cover" : "initial" }}
                    />
                  </div>
                ))}
              </div>

              {/* Review cards */}
              <div className="proof-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {[
                  { name: "Jasmine T., Atlanta", text: "I spent years thinking my dark spots were permanent. After 8 weeks with the system, I finally see my real skin again." },
                  { name: "Nia R., Houston", text: "Every product I tried before was made for someone else. This is the first time something actually worked for my skin tone." },
                  { name: "Keisha M., Brooklyn", text: "My daughter asked me why my face looked so smooth. That\u2019s when I knew it was working." },
                ].map((review, i) => (
                  <div key={i} className="proof-card-warm" style={{ padding: 0 }}>
                    <div className="proof-body-warm">
                      <p className="proof-stars-warm">{"\u2605".repeat(5)}</p>
                      <p className="proof-text-warm">&ldquo;{review.text}&rdquo;</p>
                      <p className="proof-name-warm">{review.name}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: 16, color: "var(--muted-text)", textAlign: "center", marginTop: 48, fontFamily: "var(--sans)" }}>
                Real women. Real skin. Real results &mdash; from a system that was actually built for them.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 07 — STORY-DRIVEN CTA ── */}
        <section style={{ padding: "0 0 100px" }}>
          <div className="brand-container">
            <hr className="editorial-divider" style={{ marginBottom: 80 }} />
            <div
              id="s7"
              data-animate
              className={`reveal ${isVis("s7") ? "visible" : ""}`}
            >
              <p className="editorial-label" style={{ textAlign: "center" }}>Get Started</p>
              <h2 className="editorial-heading" style={{ textAlign: "center", marginBottom: 48 }}>
                Get the system I built
              </h2>

              {/* Story intro */}
              <div style={{ maxWidth: 640, margin: "0 auto 56px" }}>
                <p style={{ fontSize: 17, lineHeight: 1.85, color: "var(--muted-text)", marginBottom: 24, fontFamily: "var(--sans)" }}>
                  You&rsquo;ve been here before.
                </p>
                <p style={{ fontSize: 17, lineHeight: 1.85, color: "var(--muted-text)", marginBottom: 24, fontFamily: "var(--sans)" }}>
                  You&rsquo;ve stood in a pharmacy aisle reading the back of something that promised results. You&rsquo;ve spent money you didn&rsquo;t want to spend on something that didn&rsquo;t do what it said. You&rsquo;ve blamed yourself when it didn&rsquo;t work.
                </p>
                <p style={{ fontSize: 17, lineHeight: 1.85, color: "var(--muted-text)", marginBottom: 24, fontFamily: "var(--sans)" }}>
                  I&rsquo;ve been there too. Every single step of it.
                </p>
                <p style={{ fontSize: 17, lineHeight: 1.85, color: "var(--muted-text)", marginBottom: 0, fontFamily: "var(--sans)" }}>
                  Which is why DARK doesn&rsquo;t ask you to just trust it. It gives you 60 days to know.
                </p>
              </div>

              {/* 60-Day Guarantee */}
              <div style={{ background: "var(--section-bg)", borderRadius: 16, padding: "48px 40px", maxWidth: 640, margin: "0 auto 56px", textAlign: "center" }}>
                <h3 style={{ fontSize: 28, fontWeight: 400, color: "var(--body-text)", fontFamily: "var(--serif)", margin: "0 0 20px", lineHeight: 1.3 }}>
                  The 60-Day Skin Guarantee
                </h3>
                <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--muted-text)", marginBottom: 20, fontFamily: "var(--sans)" }}>
                  Use all three serums, in order, every day for 60 days. If you don&rsquo;t see a real, visible difference in your hyperpigmentation &mdash; not perfect skin, just real progress &mdash; I&rsquo;ll refund every dollar. No forms. No hoops. No questions.
                </p>
                <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--body-text)", fontFamily: "var(--sans)", fontStyle: "italic", margin: 0 }}>
                  I spent two years wasting money on things that didn&rsquo;t work. I&rsquo;m not going to let you do the same.
                </p>
              </div>

              {/* Founding Offer intro */}
              <div style={{ maxWidth: 640, margin: "0 auto 48px" }}>
                <h3 style={{ fontSize: 26, fontWeight: 400, color: "var(--body-text)", fontFamily: "var(--serif)", margin: "0 0 20px", textAlign: "center", lineHeight: 1.3 }}>
                  The founding offer
                </h3>
                <p style={{ fontSize: 17, lineHeight: 1.85, color: "var(--muted-text)", marginBottom: 24, fontFamily: "var(--sans)", textAlign: "center" }}>
                  DARK is in its first run. The first 500 women who order get it at the founding price &mdash; a rate that will never be available again once this batch is gone.
                </p>
                <p style={{ fontSize: 17, lineHeight: 1.85, color: "var(--muted-text)", marginBottom: 0, fontFamily: "var(--sans)", fontStyle: "italic", textAlign: "center" }}>
                  This isn&rsquo;t a sale. It&rsquo;s an invitation to be part of what I started.
                </p>
              </div>

              {/* ── Two Purchase Cards ── */}
              <div className="purchase-cards" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 800, margin: "0 auto 48px" }}>

                {/* ONE-TIME CARD */}
                <div style={{ background: "var(--card-bg)", borderRadius: 16, padding: "36px 28px", display: "flex", flexDirection: "column" }}>
                  {/* Product image */}
                  <div style={{ marginBottom: 24, display: "flex", justifyContent: "center" }}>
                    <img src="/a.png" alt="DARK 3-Serum System" style={{ height: 160, width: "auto", objectFit: "contain" }} />
                  </div>

                  <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted-text)", margin: "0 0 8px", fontFamily: "var(--sans)" }}>
                    One-Time Bundle
                  </p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 40, fontWeight: 800, color: "var(--body-text)", fontFamily: "var(--sans)" }}>$79</span>
                    <span style={{ fontSize: 18, color: "var(--muted-text)", textDecoration: "line-through" }}>$89</span>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--muted-text)", marginBottom: 24, fontFamily: "var(--sans)", flex: 1 }}>
                    The complete 3-serum system. Yours to keep. 60-day guarantee included.
                  </p>
                  <button
                    onClick={async () => {
                      setPurchaseType("one-time");
                      setCartLoading(true);
                      trackAddToCart("3-Serum System Bundle (One-Time)", 79);
                      trackCTAClick("Get the system — $79", "brand");
                      try {
                        const line = { merchandiseId: VARIANTS.BUNDLE, quantity: 1 };
                        const shopifyCart = await createCart([line]);
                        setCheckoutUrl(shopifyCart.checkoutUrl);
                        setAddedToCart(true);
                      } catch (err) {
                        console.error("addToCart failed:", err);
                      } finally {
                        setCartLoading(false);
                      }
                    }}
                    disabled={cartLoading}
                    className="cta-lime"
                    style={{ width: "100%", padding: "18px", fontSize: 14, cursor: cartLoading ? "not-allowed" : "pointer" }}
                  >
                    Get the system &mdash; $79
                  </button>
                </div>

                {/* SUBSCRIBE CARD */}
                <div style={{ background: "var(--card-bg)", borderRadius: 16, padding: "36px 28px", display: "flex", flexDirection: "column", position: "relative", border: "2px solid var(--body-text)" }}>
                  {/* Recommended badge */}
                  <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "var(--body-text)", color: "var(--page-base)", fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", padding: "6px 18px", borderRadius: 100, fontFamily: "var(--sans)", whiteSpace: "nowrap" }}>
                    My recommendation
                  </div>

                  {/* Product image */}
                  <div style={{ marginBottom: 24, display: "flex", justifyContent: "center" }}>
                    <img src="/a.png" alt="DARK 3-Serum System" style={{ height: 160, width: "auto", objectFit: "contain" }} />
                  </div>

                  <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted-text)", margin: "0 0 8px", fontFamily: "var(--sans)" }}>
                    Subscribe &amp; Never Run Out
                  </p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 40, fontWeight: 800, color: "var(--body-text)", fontFamily: "var(--sans)" }}>$67</span>
                    <span style={{ fontSize: 16, color: "var(--muted-text)", fontFamily: "var(--sans)" }}>/month</span>
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.8, color: "var(--muted-text)", marginBottom: 16, fontFamily: "var(--sans)", flex: 1 }}>
                    <p style={{ margin: "0 0 8px" }}>Everything in the bundle, delivered before you finish. Founding subscribers lock in this price forever &mdash; it never goes up, no matter what.</p>
                    <p style={{ margin: "0 0 8px" }}>Free shipping on every order, always. Cancel any time.</p>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--body-text)", fontFamily: "var(--sans)", fontStyle: "italic", marginBottom: 20 }}>
                    This is the option I&rsquo;d choose. You&rsquo;re building a routine, not making a one-time purchase.
                  </p>
                  <button
                    onClick={async () => {
                      setPurchaseType("subscribe");
                      setCartLoading(true);
                      trackAddToCart("3-Serum System Bundle (Subscription)", 67);
                      trackCTAClick("Subscribe & save — $67/month", "brand");
                      try {
                        const line = { merchandiseId: VARIANTS.BUNDLE, quantity: 1, sellingPlanId: SELLING_PLANS.BUNDLE_MONTHLY };
                        const shopifyCart = await createCart([line]);
                        setCheckoutUrl(shopifyCart.checkoutUrl);
                        setAddedToCart(true);
                      } catch (err) {
                        console.error("addToCart failed:", err);
                      } finally {
                        setCartLoading(false);
                      }
                    }}
                    disabled={cartLoading}
                    className="cta-lime"
                    style={{ width: "100%", padding: "18px", fontSize: 14, cursor: cartLoading ? "not-allowed" : "pointer" }}
                  >
                    Subscribe &amp; save &mdash; $67/month
                  </button>
                </div>
              </div>

              {/* Checkout confirmation overlay */}
              {addedToCart && (
                <div style={{ maxWidth: 480, margin: "0 auto 48px", textAlign: "center" }}>
                  <div style={{ background: "var(--body-text)", color: "var(--page-base)", padding: "20px", borderRadius: 100, fontSize: 15, fontWeight: 800, fontFamily: "var(--sans)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
                    ✓ Added to Cart
                  </div>
                  <button
                    onClick={() => { trackInitiateCheckout(purchaseType === "subscribe" ? 67 : 79); checkoutUrl && window.location.assign(checkoutUrl); }}
                    className="cta-lime"
                    style={{ width: "100%", padding: "18px", fontSize: 14 }}
                  >
                    Continue to Checkout →
                  </button>
                </div>
              )}

              {/* Trust signals */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginBottom: 56, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, color: "var(--muted-text)", fontFamily: "var(--sans)" }}>Free shipping</span>
                <span style={{ fontSize: 13, color: "rgba(26,20,16,0.2)" }}>&middot;</span>
                <span style={{ fontSize: 13, color: "var(--muted-text)", fontFamily: "var(--sans)" }}>60-day money-back guarantee</span>
                <span style={{ fontSize: 13, color: "rgba(26,20,16,0.2)" }}>&middot;</span>
                <span style={{ fontSize: 13, color: "var(--muted-text)", fontFamily: "var(--sans)" }}>Founding price available for the first 500 bundles only</span>
              </div>

              {/* Closing line */}
              <div style={{ borderTop: "1px solid rgba(26,20,16,0.08)", paddingTop: 48, textAlign: "center" }}>
                <p style={{ fontSize: 24, lineHeight: 1.6, color: "var(--body-text)", fontFamily: "var(--serif)", fontStyle: "italic", margin: 0 }}>
                  You didn&rsquo;t choose this. But you get to choose what you do next.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
