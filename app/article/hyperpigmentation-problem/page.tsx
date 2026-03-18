"use client";
import { useState } from "react";

export default function HyperpigmentationArticlePage() {
  const [emailValue, setEmailValue] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  return (
    <main style={{ background: "#fff", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        a { text-decoration: none; }
        @media (max-width: 768px) {
          .topbar-socials { display: none !important; }
          .nav-categories { gap: 16px !important; font-size: 11px !important; }
          .article-h1 { font-size: 28px !important; line-height: 1.2 !important; }
          .article-h2 { font-size: 22px !important; }
          .article-container { padding: 0 !important; }
          .article-inner { padding: 40px 20px !important; }
          .article-body p { font-size: 16px !important; }
          .hero-photo { height: 380px !important; }
          .byline-row { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .share-row { margin-top: 4px !important; }
          .newsletter-box { padding: 32px 20px !important; margin: 0 -20px 48px !important; }
          .related-grid { grid-template-columns: 1fr !important; }
          .related-section { padding: 48px 20px !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
          .footer-inner { padding: 48px 20px 24px !important; }
          .article-photo { height: 420px !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════════
          PUBLICATION HEADER
      ══════════════════════════════════════════ */}

      {/* Top Bar */}
      <div style={{ background: "#1a1a1a", padding: "8px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="topbar-socials" style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {["Instagram", "TikTok", "Pinterest"].map((s) => (
            <a key={s} href="#" style={{ color: "#888", fontSize: 11, fontWeight: 500, letterSpacing: 0.5 }}>{s}</a>
          ))}
        </div>
        <a href="#" style={{ color: "#fff", fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>Subscribe</a>
      </div>

      {/* Main Nav */}
      <header style={{ borderBottom: "1px solid #eee", padding: "20px 32px 0", textAlign: "center" }}>
        <a href="#" style={{ fontSize: 36, fontWeight: 700, color: "#111", letterSpacing: 3, fontFamily: "'DM Serif Display', serif", display: "inline-block", marginBottom: 16 }}>
          HerTone
        </a>
        <nav className="nav-categories" style={{ display: "flex", justifyContent: "center", gap: 28, paddingBottom: 16, flexWrap: "wrap" }}>
          {["Skincare", "Haircare", "Wellness", "Reviews", "Culture"].map((cat) => (
            <a key={cat} href="#" style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: cat === "Skincare" ? "#111" : "#888", borderBottom: cat === "Skincare" ? "2px solid #111" : "2px solid transparent", paddingBottom: 14 }}>
              {cat}
            </a>
          ))}
        </nav>
      </header>

      {/* ══════════════════════════════════════════
          ARTICLE
      ══════════════════════════════════════════ */}
      <article className="article-container" style={{ maxWidth: 780, margin: "0 auto" }}>

        {/* Category Tag */}
        <div style={{ padding: "24px 32px 0" }}>
          <span style={{ background: "#111", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", padding: "5px 12px", borderRadius: 2 }}>Skincare</span>
        </div>

        {/* Hero Image — portrait */}
        <div className="hero-photo" style={{ height: 520, margin: "20px 32px 0", borderRadius: 4, overflow: "hidden" }}>
          <img
            src="/girl.png"
            alt="Portrait of Aaliyah Monroe looking directly at the camera with quiet honesty"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>

        <div className="article-inner" style={{ padding: "36px 32px 60px" }}>

          {/* Headline */}
          <h1 className="article-h1" style={{ fontSize: 38, fontWeight: 400, lineHeight: 1.2, color: "#111", fontFamily: "'DM Serif Display', serif", margin: "0 0 24px" }}>
            Black Women Don&rsquo;t Get the Right Respect When It Comes to Our Skin
          </h1>

          {/* Byline Row */}
          <div className="byline-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#3d2b24", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#d4b896", fontSize: 14, fontWeight: 700 }}>AM</span>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#222", margin: 0 }}>Aaliyah Monroe</p>
                <p style={{ fontSize: 12, color: "#999", margin: "2px 0 0" }}>March 12, 2026 &middot; 6 min read</p>
              </div>
            </div>
            <div className="share-row" style={{ display: "flex", gap: 4 }}>
              {[
                { label: "Facebook", icon: "f" },
                { label: "X", icon: "\uD835\uDD4F" },
                { label: "Pinterest", icon: "P" },
                { label: "Link", icon: "\uD83D\uDD17" },
              ].map((s) => (
                <a key={s.label} href="#" title={`Share on ${s.label}`} style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#666", background: "#fff" }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "0 0 32px" }} />

          {/* ══════════════════════════════════════════
              ARTICLE BODY
          ══════════════════════════════════════════ */}
          <div className="article-body">

            {/* Opening */}
            <p style={{ fontSize: 18, lineHeight: 1.85, color: "#333", marginBottom: 24 }}>
              I still remember being fourteen years old, standing in my bathroom under fluorescent light, pressing my fingers against my cheeks and wondering what was wrong with me.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.85, color: "#333", marginBottom: 24 }}>
              Not what was wrong with my skin. What was wrong with <em>me</em>.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 48 }}>
              That&rsquo;s the difference nobody talks about. When you grow up Black in America, your skin doesn&rsquo;t just live on your body &mdash; it becomes a conversation. A comparison. A problem to be solved by people who never looked like you to begin with.
            </p>

            <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "0 0 48px" }} />

            {/* ── We Were Never the Target ── */}
            <h2 className="article-h2" style={{ fontSize: 26, fontWeight: 400, color: "#111", fontFamily: "'DM Serif Display', serif", margin: "0 0 28px" }}>
              We Were Never the Target. We Were the Target Market.
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              Here&rsquo;s what I was taught, without anyone ever having to say it out loud: clear skin looked like my white classmates&rsquo; skin. That was the benchmark. That was the goal. The girls in the commercials, the before-and-afters on the product boxes, the faces on the magazine stands at the checkout line &mdash; they all told the same story. And that story didn&rsquo;t have me in it.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              So I did what any teenage girl trying to belong would do. I copied. I bought what they bought. I followed the routines I saw online, the ones with the satisfying before-and-afters and the glowing testimonials. I spent money I didn&rsquo;t have on products that weren&rsquo;t made for me, following advice that was never written with my skin in mind.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>And it didn&rsquo;t work.</p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>Not really. Not the way it worked for them.</p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              What I had &mdash; what so many Black women have &mdash; is hyperpigmentation. Post-inflammatory hyperpigmentation, to be specific. Dark spots left behind by acne, irritation, or sometimes just the simple act of existing in skin that produces more melanin than the industry knows what to do with. It&rsquo;s not a flaw. It&rsquo;s biology. Melanin-rich skin responds to inflammation differently. It heals differently. It <em>needs</em> differently.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 48 }}>
              But nobody told me that. Instead, I just kept wondering why <em>her</em> skin was clear and mine wasn&rsquo;t. Why products that promised results delivered them to everyone but me. Why I kept spending and trying and failing, in a cycle that felt personal even when it wasn&rsquo;t.
            </p>

            <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "0 0 48px" }} />

            {/* ── The Industry Isn't Broken ── */}
            <h2 className="article-h2" style={{ fontSize: 26, fontWeight: 400, color: "#111", fontFamily: "'DM Serif Display', serif", margin: "0 0 28px" }}>
              The Industry Isn&rsquo;t Broken. It Was Built This Way.
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              As I got older, I stopped blaming myself and started paying attention to the system.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              The skincare industry in America is a multi-billion dollar machine. And Black women are some of its most loyal, highest-spending consumers. Studies consistently show that Black women over-index on beauty spending compared to other demographic groups. We show up. We invest. We believe.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>And what does the industry give us in return?</p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              Products formulated for lighter skin tones that leave us with chemical burns. SPF recommendations that come wrapped in the myth that Black skin doesn&rsquo;t need sun protection. Marketing campaigns that bolt on a darker shade model at the last minute and call it inclusion. &ldquo;Brightening&rdquo; serums that, when you actually read the label, were designed with a completely different skin profile in mind.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              It is not representation. It is not care. It is a business decision &mdash; and a cynical one. Because they know we&rsquo;ll buy. They&rsquo;ve seen the data. So they slap stock photography of a brown-skinned woman on the packaging, charge a premium, and move on.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", fontWeight: 600, marginBottom: 48 }}>
              False hope is a product too. And it has been selling extremely well.
            </p>

            {/* ══════════════════════════════════════════
                NEWSLETTER SIGNUP (mid-article)
            ══════════════════════════════════════════ */}
            <div className="newsletter-box" style={{ background: "#f9f6f2", padding: "40px 36px", margin: "0 -32px 48px", textAlign: "center" }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#b8a08a", margin: "0 0 8px" }}>Newsletter</p>
              <p style={{ fontSize: 22, fontWeight: 400, color: "#111", fontFamily: "'DM Serif Display', serif", margin: "0 0 8px" }}>Get HerTone in your inbox</p>
              <p style={{ fontSize: 14, color: "#888", margin: "0 0 20px", lineHeight: 1.5 }}>Skincare advice, product reviews, and essays &mdash; written for us, by us.</p>
              {emailStatus === "success" ? (
                <p style={{ fontSize: 16, color: "#111", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, margin: 0 }}>
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
                      } else {
                        setEmailStatus("error");
                      }
                    } catch {
                      setEmailStatus("error");
                    }
                  }}
                >
                  <div style={{ display: "flex", maxWidth: 420, margin: "0 auto", gap: 0 }}>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={emailValue}
                      onChange={(e) => { setEmailValue(e.target.value); if (emailStatus === "error") setEmailStatus("idle"); }}
                      required
                      style={{ flex: 1, padding: "12px 16px", border: emailStatus === "error" ? "1px solid #c44" : "1px solid #ddd", borderRight: "none", borderRadius: "4px 0 0 4px", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", background: "#fff" }}
                    />
                    <button
                      type="submit"
                      disabled={emailStatus === "loading"}
                      style={{ padding: "12px 24px", background: "#111", color: "#fff", border: "none", borderRadius: "0 4px 4px 0", fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", cursor: emailStatus === "loading" ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", opacity: emailStatus === "loading" ? 0.6 : 1 }}
                    >
                      {emailStatus === "loading" ? "..." : "Subscribe"}
                    </button>
                  </div>
                  {emailStatus === "error" && (
                    <p style={{ fontSize: 13, color: "#c44", marginTop: 12, marginBottom: 0, fontFamily: "'DM Sans', sans-serif" }}>
                      Something went wrong. Please try again.
                    </p>
                  )}
                </form>
              )}
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "0 0 48px" }} />

            {/* ── Then I Became a Mother ── */}
            <h2 className="article-h2" style={{ fontSize: 26, fontWeight: 400, color: "#111", fontFamily: "'DM Serif Display', serif", margin: "0 0 28px" }}>
              Then I Became a Mother.
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              My daughter is seven years old. She has her father&rsquo;s nose and my complexion, and she is the most beautiful thing I have ever seen in my life.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              She doesn&rsquo;t know what hyperpigmentation is yet. She doesn&rsquo;t know that someday her skin might do what mine did &mdash; hold onto every scar, every blemish, every moment of inflammation like a memory it refuses to let go of. She doesn&rsquo;t know that the world has spent decades building an industry that will look at her skin and see a sales opportunity before it sees a person.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>I know. And knowing changes everything.</p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 48 }}>
              I refuse to let her grow up the way I did. Measuring herself against a standard that was never designed to include her. Pouring money into products built for someone else. Carrying shame about something that was never shameful to begin with.
            </p>

            {/* Mother & daughter photo */}
            <div className="article-photo" style={{ height: 540, borderRadius: 4, overflow: "hidden", marginBottom: 48 }}>
              <img
                src="/story-reveal.png"
                alt="Mother holding her daughter with quiet confidence"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "0 0 48px" }} />

            {/* ── That refusal changed everything ── */}
            <h2 className="article-h2" style={{ fontSize: 26, fontWeight: 400, color: "#111", fontFamily: "'DM Serif Display', serif", margin: "0 0 28px" }}>
              That refusal changed everything.
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              I stopped looking for a product that might work. I started asking a different question entirely &mdash; why wasn&rsquo;t anything working? Not for me, not for the women in the comments of every skincare forum I&rsquo;d spent years reading, not for any of us with skin that produces melanin the way ours does.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              The answer took me two years to find. A lot of money I won&rsquo;t get back. A lot of mornings standing in that same bathroom, older now, still looking for something that finally made sense.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              But I found it. And what I learned about why our skin responds the way it does &mdash; and what it actually needs &mdash; changed the way I understood everything I&rsquo;d been through since I was fourteen years old.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              It wasn&rsquo;t that our skin was difficult.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 48 }}>
              It was that nobody had ever taken the time to understand it.
            </p>

            {/* ── Closing — the bridge to /brand ── */}
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              I&rsquo;m not going to try to explain everything here. But if you&rsquo;ve spent years in the same cycle I was in &mdash; buying, hoping, being disappointed, blaming yourself &mdash; I want to show you what I found.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 48 }}>
              Because you shouldn&rsquo;t have to figure this out alone. And your daughter shouldn&rsquo;t have to start from the beginning the way we did.
            </p>

            {/* CTA — links to brand page */}
            <div style={{ textAlign: "center", padding: "24px 0 40px" }}>
              <a href="/brand" style={{ display: "inline-block", fontSize: 22, fontWeight: 400, color: "#111", fontFamily: "'DM Serif Display', serif", fontStyle: "italic", borderBottom: "1px solid #111", paddingBottom: 4, transition: "opacity 0.2s ease" }}>
                What I found &rarr;
              </a>
            </div>

            {/* Author Bio Box */}
            <div style={{ background: "#f9f9f9", borderRadius: 8, padding: 28, marginTop: 48, display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#3d2b24", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#d4b896", fontSize: 18, fontWeight: 700 }}>AM</span>
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#111", margin: "0 0 4px" }}>Aaliyah Monroe</p>
                <p style={{ fontSize: 13, color: "#888", lineHeight: 1.6, margin: 0 }}>Aaliyah is a writer and mother based in Atlanta covering beauty, identity, and the politics of skincare. Her work has appeared in HerTone, Cocoa Butter, and The Melanin Edit.</p>
              </div>
            </div>

          </div>
        </div>
      </article>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer style={{ background: "#1a1a1a" }}>
        <div className="footer-inner" style={{ maxWidth: 1000, margin: "0 auto", padding: "64px 32px 32px" }}>
          <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div>
              <p style={{ fontSize: 24, fontWeight: 700, color: "#fff", fontFamily: "'DM Serif Display', serif", letterSpacing: 2, marginBottom: 12 }}>HerTone</p>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7, maxWidth: 260 }}>Beauty, wellness, and culture &mdash; written for women of color, by women of color.</p>
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: "#888", marginBottom: 16 }}>Categories</p>
              {["Skincare", "Haircare", "Wellness", "Reviews", "Culture"].map((item) => (
                <a key={item} href="#" style={{ display: "block", color: "#666", fontSize: 13, marginBottom: 10 }}>{item}</a>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: "#888", marginBottom: 16 }}>Company</p>
              {["About Us", "Write For Us", "Advertise", "Contact"].map((item) => (
                <a key={item} href="#" style={{ display: "block", color: "#666", fontSize: 13, marginBottom: 10 }}>{item}</a>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: "#888", marginBottom: 16 }}>Follow Us</p>
              {["Instagram", "TikTok", "Pinterest", "Twitter / X"].map((item) => (
                <a key={item} href="#" style={{ display: "block", color: "#666", fontSize: 13, marginBottom: 10 }}>{item}</a>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ color: "#555", fontSize: 11 }}>&copy; 2026 HerTone Media. All rights reserved.</span>
            <div style={{ display: "flex", gap: 20 }}>
              {["Terms", "Privacy", "Contact"].map((item) => (
                <a key={item} href="#" style={{ color: "#555", fontSize: 11 }}>{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
