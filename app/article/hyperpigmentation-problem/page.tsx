"use client";

export default function HyperpigmentationArticlePage() {
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
          .photo-placeholder { height: 300px !important; }
          .hero-photo { height: 380px !important; }
          .byline-row { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .share-row { margin-top: 4px !important; }
          .newsletter-box { padding: 32px 20px !important; margin: 0 -20px 48px !important; }
          .related-grid { grid-template-columns: 1fr !important; }
          .related-section { padding: 48px 20px !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
          .footer-inner { padding: 48px 20px 24px !important; }
          .pull-quote-text { font-size: 19px !important; }
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

        {/* Hero Image */}
        <div className="hero-photo" style={{ height: 520, margin: "20px 32px 0", background: "linear-gradient(135deg, #2c1e1a 0%, #3d2b24 40%, #4a3530 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", borderRadius: 4 }}>
          <div style={{ textAlign: "center", padding: 32 }}>
            <p style={{ fontSize: 13, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", margin: "0 0 8px" }}>Hero Image</p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.25)", maxWidth: 400, margin: "0 auto", lineHeight: 1.5 }}>Portrait of a Black woman in her late twenties, contemplative expression, natural morning light</p>
          </div>
        </div>

        <div className="article-inner" style={{ padding: "36px 32px 60px" }}>

          {/* Headline */}
          <h1 className="article-h1" style={{ fontSize: 38, fontWeight: 400, lineHeight: 1.2, color: "#111", fontFamily: "'DM Serif Display', serif", margin: "0 0 24px" }}>
            Black Women Don't Get the Right Respect When It Comes to Our Skin
          </h1>

          {/* Byline Row */}
          <div className="byline-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Author avatar */}
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#3d2b24", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#d4b896", fontSize: 14, fontWeight: 700 }}>AM</span>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#222", margin: 0 }}>Aaliyah Monroe</p>
                <p style={{ fontSize: 12, color: "#999", margin: "2px 0 0" }}>March 12, 2026 &middot; 8 min read</p>
              </div>
            </div>
            {/* Share buttons */}
            <div className="share-row" style={{ display: "flex", gap: 4 }}>
              {[
                { label: "Facebook", icon: "f" },
                { label: "X", icon: "𝕏" },
                { label: "Pinterest", icon: "P" },
                { label: "Link", icon: "🔗" },
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
              That's the difference nobody talks about. When you grow up Black in America, your skin doesn't just live on your body — it becomes a conversation. A comparison. A problem to be solved by people who never looked like you to begin with.
            </p>

            <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "0 0 48px" }} />

            {/* ── We Were Never the Target ── */}
            <h2 className="article-h2" style={{ fontSize: 26, fontWeight: 400, color: "#111", fontFamily: "'DM Serif Display', serif", margin: "0 0 28px" }}>
              We Were Never the Target. We Were the Target Market.
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              Here's what I was taught, without anyone ever having to say it out loud: clear skin looked like my white classmates' skin. That was the benchmark. That was the goal. The girls in the commercials, the before-and-afters on the product boxes, the faces on the magazine stands at the checkout line — they all told the same story. And that story didn't have me in it.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              So I did what any teenage girl trying to belong would do. I copied. I bought what they bought. I followed the routines I saw online, the ones with the satisfying before-and-afters and the glowing testimonials. I spent money I didn't have on products that weren't made for me, following advice that was never written with my skin in mind.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>And it didn't work.</p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>Not really. Not the way it worked for them.</p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              What I had — what so many Black women have — is hyperpigmentation. Post-inflammatory hyperpigmentation, to be specific. Dark spots left behind by acne, irritation, or sometimes just the simple act of existing in skin that produces more melanin than the industry knows what to do with. It's not a flaw. It's biology. Melanin-rich skin responds to inflammation differently. It heals differently. It needs differently.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 48 }}>
              But nobody told me that. Instead, I just kept wondering why <em>her</em> skin was clear and mine wasn't. Why products that promised results delivered them to everyone but me. Why I kept spending and trying and failing, in a cycle that felt personal even when it wasn't.
            </p>

            {/* PHOTO 2 */}
            <div className="photo-placeholder" style={{ height: 420, background: "linear-gradient(135deg, #e8e2dc 0%, #d5cec6 100%)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 48 }}>
              <div style={{ textAlign: "center", padding: 32 }}>
                <p style={{ fontSize: 13, letterSpacing: 3, textTransform: "uppercase", color: "rgba(0,0,0,0.25)", margin: "0 0 8px" }}>Photo</p>
                <p style={{ fontSize: 14, color: "rgba(0,0,0,0.18)", maxWidth: 360, margin: "0 auto", lineHeight: 1.5 }}>Black woman standing in a drugstore skincare aisle, looking at products with a skeptical expression</p>
              </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "0 0 48px" }} />

            {/* ── The Industry Isn't Broken ── */}
            <h2 className="article-h2" style={{ fontSize: 26, fontWeight: 400, color: "#111", fontFamily: "'DM Serif Display', serif", margin: "0 0 28px" }}>
              The Industry Isn't Broken. It Was Built This Way.
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              As I got older, I stopped blaming myself and started paying attention to the system.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              The skincare industry in America is a multi-billion dollar machine. And Black women are some of its most loyal, highest-spending consumers. Studies consistently show that Black women over-index on beauty spending compared to other demographic groups. We show up. We invest. We believe.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>And what does the industry give us in return?</p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              Products formulated for lighter skin tones that leave us with chemical burns. SPF recommendations that come wrapped in the myth that Black skin doesn't need sun protection. Marketing campaigns that bolt on a darker shade model at the last minute and call it inclusion. "Brightening" serums that, when you actually read the label, were designed with a completely different skin profile in mind.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              It is not representation. It is not care. It is a business decision — and a cynical one. Because they know we'll buy. They've seen the data. So they slap stock photography of a brown-skinned woman on the packaging, charge a premium, and move on.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", fontWeight: 600, marginBottom: 48 }}>
              False hope is a product too. And it has been selling extremely well.
            </p>

            {/* PHOTO 3 */}
            <div className="photo-placeholder" style={{ height: 380, background: "linear-gradient(135deg, #f2eeea 0%, #e6e0d8 100%)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 48 }}>
              <div style={{ textAlign: "center", padding: 32 }}>
                <p style={{ fontSize: 13, letterSpacing: 3, textTransform: "uppercase", color: "rgba(0,0,0,0.25)", margin: "0 0 8px" }}>Photo</p>
                <p style={{ fontSize: 14, color: "rgba(0,0,0,0.18)", maxWidth: 360, margin: "0 auto", lineHeight: 1.5 }}>Overhead flatlay of various skincare products on a white surface — slightly chaotic arrangement</p>
              </div>
            </div>

            {/* ══════════════════════════════════════════
                NEWSLETTER SIGNUP (mid-article)
            ══════════════════════════════════════════ */}
            <div className="newsletter-box" style={{ background: "#f9f6f2", padding: "40px 36px", margin: "0 -32px 48px", textAlign: "center" }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#b8a08a", margin: "0 0 8px" }}>Newsletter</p>
              <p style={{ fontSize: 22, fontWeight: 400, color: "#111", fontFamily: "'DM Serif Display', serif", margin: "0 0 8px" }}>Get HerTone in your inbox</p>
              <p style={{ fontSize: 14, color: "#888", margin: "0 0 20px", lineHeight: 1.5 }}>Skincare advice, product reviews, and essays — written for us, by us.</p>
              <div style={{ display: "flex", maxWidth: 420, margin: "0 auto", gap: 0 }}>
                <input type="email" placeholder="Enter your email" readOnly style={{ flex: 1, padding: "12px 16px", border: "1px solid #ddd", borderRight: "none", borderRadius: "4px 0 0 4px", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", background: "#fff" }} />
                <button style={{ padding: "12px 24px", background: "#111", color: "#fff", border: "none", borderRadius: "0 4px 4px 0", fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Subscribe</button>
              </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "0 0 48px" }} />

            {/* ── Then I Became a Mother ── */}
            <h2 className="article-h2" style={{ fontSize: 26, fontWeight: 400, color: "#111", fontFamily: "'DM Serif Display', serif", margin: "0 0 28px" }}>
              Then I Became a Mother.
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              My daughter is seven years old. She has her father's nose and my complexion, and she is the most beautiful thing I have ever seen in my life.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              She doesn't know what hyperpigmentation is yet. She doesn't know that someday her skin might do what mine did — hold onto every scar, every blemish, every moment of inflammation like a memory it refuses to let go of. She doesn't know that the world has spent decades building an industry that will look at her skin and see a sales opportunity before it sees a person.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>I know. And knowing changes everything.</p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              I refuse to let her grow up the way I did. Measuring herself against a standard that was never designed to include her. Pouring money into products built for someone else. Carrying shame about something that was never shameful to begin with.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 48 }}>That refusal is what led me to DARK.</p>

            {/* PHOTO 4 */}
            <div className="photo-placeholder" style={{ height: 460, background: "linear-gradient(135deg, #3d2e28 0%, #5a4138 100%)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 48 }}>
              <div style={{ textAlign: "center", padding: 32 }}>
                <p style={{ fontSize: 13, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", margin: "0 0 8px" }}>Photo</p>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.22)", maxWidth: 360, margin: "0 auto", lineHeight: 1.5 }}>Black woman gently touching the face of a young Black girl, both smiling softly, natural window light</p>
              </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "0 0 48px" }} />

            {/* ── What It Looks Like When a Brand Actually Sees You ── */}
            <h2 className="article-h2" style={{ fontSize: 26, fontWeight: 400, color: "#111", fontFamily: "'DM Serif Display', serif", margin: "0 0 28px" }}>
              What It Looks Like When a Brand Actually Sees You
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              I came across DARK the way most things find you when you've stopped looking — by accident, and then all at once.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              What stopped me wasn't the packaging or the marketing. It was the positioning. DARK is a brand built specifically for melanin-rich skin, centered on treating hyperpigmentation — not as a cosmetic flaw to mask, but as a biological reality to address with real, targeted science.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              Their system is built around three serums working in sequence: a Vitamin C Serum that protects and brightens, a Dark Spot Serum that gets to work directly on hyperpigmentation, and a Retinol & Peptide Serum that supports skin renewal over time. Not a one-size-fits-all solution repackaged and re-targeted. An actual system, designed from the ground up for skin like mine.
            </p>

            {/* Pull Quote */}
            <div style={{ borderTop: "2px solid #111", borderBottom: "2px solid #111", padding: "28px 0", margin: "40px 0", textAlign: "center" }}>
              <p className="pull-quote-text" style={{ fontSize: 22, lineHeight: 1.5, color: "#222", fontFamily: "'DM Serif Display', serif", fontStyle: "italic", margin: 0 }}>
                You didn't choose this. But you get to decide what you do with it.
              </p>
            </div>

            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 48 }}>
              That distinction — between agency and erasure — meant more to me than I expected. I started using the system. I paid attention. And for the first time in a long time, I felt like I was working <em>with</em> my skin instead of against it.
            </p>

            {/* PHOTO 5 */}
            <div className="photo-placeholder" style={{ height: 400, background: "linear-gradient(135deg, #1a1614 0%, #2a2320 100%)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 48 }}>
              <div style={{ textAlign: "center", padding: 32 }}>
                <p style={{ fontSize: 13, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", margin: "0 0 8px" }}>Photo</p>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.22)", maxWidth: 360, margin: "0 auto", lineHeight: 1.5 }}>Three dark glass serum bottles on a matte black surface, soft side lighting, premium feel</p>
              </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "0 0 48px" }} />

            {/* ── This Isn't Just About Me ── */}
            <h2 className="article-h2" style={{ fontSize: 26, fontWeight: 400, color: "#111", fontFamily: "'DM Serif Display', serif", margin: "0 0 28px" }}>
              This Isn't Just About Me
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              Black women are not the only ones the industry has left behind. Latinas. South Asian women. Women of every background whose skin carries more melanin, who have been handed products and promises calibrated for someone else's biology. Hyperpigmentation doesn't discriminate within communities of color — and neither does the frustration of reaching for solutions that consistently fall short.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 48 }}>
              DARK was built with all of that in mind. And I think it matters that a brand like this exists — not as a niche, not as a subcategory tucked in the back of a shelf, but as a full, unapologetic answer to a need that has been underfunded and underseen for far too long.
            </p>

            <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "0 0 48px" }} />

            {/* ── To Every Woman Reading This ── */}
            <h2 className="article-h2" style={{ fontSize: 26, fontWeight: 400, color: "#111", fontFamily: "'DM Serif Display', serif", margin: "0 0 28px" }}>
              To Every Woman Reading This
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              If you have spent years wondering what is wrong with you — stop. Nothing is wrong with you. Your skin is not a problem. Your melanin is not a deficiency. The products that didn't work weren't evidence of your failure; they were evidence of an industry's.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              You deserve skincare that was built for you. Not adapted for you, not begrudgingly expanded to include you — <em>built</em> for you.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 24 }}>
              And your daughters deserve to grow up in a world where that is simply assumed.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 48 }}>
              That world doesn't exist yet. But brands like DARK are how we start building it.
            </p>

            {/* PHOTO 6 */}
            <div className="photo-placeholder" style={{ height: 460, background: "linear-gradient(135deg, #3a2d27 0%, #52403a 100%)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 48 }}>
              <div style={{ textAlign: "center", padding: 32 }}>
                <p style={{ fontSize: 13, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", margin: "0 0 8px" }}>Photo</p>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.22)", maxWidth: 360, margin: "0 auto", lineHeight: 1.5 }}>Black woman looking directly into the camera with calm confidence, natural light, no makeup</p>
              </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "0 0 48px" }} />

            {/* CTA */}
            <div style={{ textAlign: "center", padding: "24px 0 40px" }}>
              <a href="/quiz" style={{ display: "inline-block", background: "#111", color: "#fff", padding: "18px 48px", borderRadius: 100, fontSize: 14, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>
                Shop the DARK System →
              </a>
              <p style={{ fontSize: 14, color: "#888", marginTop: 16, marginBottom: 0 }}>Built for melanin-rich skin. Built for you.</p>
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
          MORE FROM HERTONE
      ══════════════════════════════════════════ */}
      <section className="related-section" style={{ background: "#f9f9f9", padding: "64px 32px", marginTop: 48 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#aaa", margin: "0 0 8px", textAlign: "center" }}>Keep Reading</p>
          <h3 style={{ fontSize: 28, fontWeight: 400, color: "#111", fontFamily: "'DM Serif Display', serif", margin: "0 0 40px", textAlign: "center" }}>More From HerTone</h3>
          <div className="related-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 28 }}>
            {[
              { cat: "Skincare", title: "The SPF Myth That's Costing Black Women Their Skin", author: "Jasmine Cole", color: "#d5cec6" },
              { cat: "Reviews", title: "Why Your Retinol Isn't Working (And What Derms Want You to Try Instead)", author: "Priya Sharma", color: "#c7b8a9" },
              { cat: "Wellness", title: "The Ingredient List Red Flags Every WOC Should Know", author: "Marisol Reyes", color: "#b8a899" },
            ].map((item) => (
              <a key={item.title} href="#" style={{ display: "block", background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div style={{ height: 180, background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <p style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "rgba(0,0,0,0.2)", margin: 0 }}>Photo</p>
                </div>
                <div style={{ padding: "16px 20px 20px" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#b8a08a" }}>{item.cat}</span>
                  <p style={{ fontSize: 16, fontWeight: 600, color: "#111", lineHeight: 1.4, margin: "6px 0 12px", fontFamily: "'DM Serif Display', serif" }}>{item.title}</p>
                  <p style={{ fontSize: 12, color: "#999", margin: 0 }}>By {item.author}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer style={{ background: "#1a1a1a" }}>
        <div className="footer-inner" style={{ maxWidth: 1000, margin: "0 auto", padding: "64px 32px 32px" }}>
          <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div>
              <p style={{ fontSize: 24, fontWeight: 700, color: "#fff", fontFamily: "'DM Serif Display', serif", letterSpacing: 2, marginBottom: 12 }}>HerTone</p>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7, maxWidth: 260 }}>Beauty, wellness, and culture — written for women of color, by women of color.</p>
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
