"use client";
import { useState, useEffect, useRef } from "react";
import { VARIANTS, SELLING_PLANS, createCart } from "@/lib/shopify";
import { trackAddToCart, trackInitiateCheckout, trackEmailSignup, trackQuizStart, trackQuizComplete, trackQuizAnswer, trackViewContent } from "@/lib/meta-pixel";

// ─── Data ───
const questions = [
  {
    id: "color",
    question: "What color are your dark spots?",
    subtitle: "Look at your spots in natural daylight for the most accurate read.",
    why: "Color reveals depth.",
    education: "Brown tones mean pigment sits near the surface (epidermal layer) — these respond fastest to topicals. Grayish or blue undertones signal deeper dermal pigmentation, which requires a different strategy entirely. This single observation changes your entire treatment path.",
    options: [
      { label: "Light tan / golden", subtext: "Close to my natural tone", value: "light", score: 1, swatch: "#C8A882" },
      { label: "Medium–dark brown", subtext: "Clearly visible contrast", value: "medium", score: 2, swatch: "#8B6914" },
      { label: "Very dark / near-black", subtext: "Strong contrast", value: "dark", score: 3, swatch: "#3D2B1F" },
      { label: "Grayish or blue-toned", subtext: "Ashy, almost bruise-like", value: "gray", score: 4, swatch: "#6B7B8D" },
    ],
  },
  {
    id: "coverage",
    question: "How much of your face is affected?",
    subtitle: "Think about all areas — cheeks, forehead, upper lip, jawline.",
    why: "Coverage drives clinical severity.",
    education: "Dermatologists use the mMASI scale to score hyperpigmentation severity. Coverage area is weighted heavily — scattered spots across 30% of the face can score higher than a single dark patch. This determines whether you need spot treatment or a full-face protocol.",
    options: [
      { label: "A few spots", subtext: "Under 10% of my face", value: "few", score: 1, pct: "< 10%" },
      { label: "Scattered patches", subtext: "Across 1–2 zones", value: "scattered", score: 2, pct: "10–30%" },
      { label: "Large zones", subtext: "Cheeks + forehead or chin", value: "zones", score: 3, pct: "30–60%" },
      { label: "Nearly everywhere", subtext: "Widespread discoloration", value: "widespread", score: 4, pct: "60%+" },
    ],
  },
  {
    id: "trigger",
    question: "What started your hyperpigmentation?",
    subtitle: "If you're unsure, pick the closest match.",
    why: "Your trigger shapes your treatment.",
    education: "Sun-induced spots involve localized melanin overproduction — relatively straightforward. Post-acne marks (PIH) stem from inflammation that kicked melanocytes into overdrive. Hormonal melasma is the most complex: it involves estrogen receptors in skin cells and often requires systemic management alongside topicals.",
    options: [
      { label: "Sun exposure", subtext: "Sun spots, seasonal darkening", value: "sun", score: 1, icon: "☀" },
      { label: "Post-acne marks", subtext: "Dark spots after breakouts", value: "acne", score: 2, icon: "●" },
      { label: "Not sure", subtext: "Appeared gradually over time", value: "unknown", score: 2, icon: "?" },
      { label: "Hormonal changes", subtext: "Pregnancy, BC, menopause", value: "hormonal", score: 3, icon: "⬡" },
    ],
  },
  {
    id: "duration",
    question: "How long have you had this?",
    subtitle: "Think about when you first noticed the discoloration.",
    why: "Time reveals treatment difficulty.",
    education: "Pigment migrates deeper into the dermis over time. A spot that's been present for 6 months is structurally different from one that's 3+ years old — even if they look similar on the surface. Longer-standing pigmentation typically requires more aggressive actives and realistic timelines measured in months, not weeks.",
    options: [
      { label: "Under 3 months", subtext: "Fairly recent", value: "recent", score: 1 },
      { label: "3–12 months", subtext: "Developing for a while", value: "year", score: 2 },
      { label: "1–3 years", subtext: "Persistent problem", value: "persistent", score: 3 },
      { label: "3+ years", subtext: "Long-standing, treatment-resistant", value: "chronic", score: 4 },
    ],
  },
  {
    id: "history",
    question: "Have brightening products worked for you before?",
    subtitle: "Think about vitamin C serums, dark spot correctors, exfoliants — anything marketed for hyperpigmentation.",
    why: "Past failures are diagnostic.",
    education: "This is the question dermatologists care about most. If over-the-counter brightening products haven't moved the needle, it almost always means your pigment sits deeper than topical actives can easily reach. That's not a failure on your part — it's information that completely changes the recommended approach.",
    options: [
      { label: "Haven't tried any", subtext: "Starting fresh", value: "no", score: 0 },
      { label: "Yes — saw some fading", subtext: "Partial improvement", value: "some", score: 1 },
      { label: "Yes — barely any change", subtext: "Results faded quickly", value: "minimal", score: 3 },
      { label: "Yes — nothing worked", subtext: "Zero visible improvement", value: "nothing", score: 4 },
    ],
  },
];

function getResults(answers) {
  let totalScore = 0;
  for (const [qId, val] of Object.entries(answers)) {
    const q = questions.find((q) => q.id === qId);
    const opt = q?.options.find((o) => o.value === val);
    if (opt) totalScore += opt.score;
  }

  // Product detail objects for consistent referencing
  const products = {
    vitC: {
      name: "DARK Vitamin C Serum",
      tag: "DARK VITAMIN C",
    },
    darkSpot: {
      name: "DARK Dark Spot Serum",
      tag: "DARK SPOT SERUM",
    },
    retinol: {
      name: "DARK Retinol & Peptide Serum",
      tag: "RETINOL & PEPTIDE",
    },
  };

  if (totalScore <= 6) {
    return {
      segment: "Mild",
      label: "Epidermal",
      headline: "Your pigment is surface-level.",
      subhead: "That's the best possible starting point.",
      detail: "Your clinical profile indicates primarily epidermal hyperpigmentation — melanin sitting in the outermost layers of skin. This type responds exceptionally well to targeted topical actives. With the right combination of melanin-intercepting ingredients and antioxidant defense, you should see measurable fading.",
      timeline: "6–10 weeks",
      timelineNote: "with consistent daily use",
      scoreRange: "0–6",
      score: totalScore,
      products: [products.vitC, products.darkSpot],
      routine: [
        {
          time: "AM",
          step: 1,
          name: products.vitC.name,
          product: true,
          role: "Your serum delivers three forms of Vitamin C — L-Ascorbic Acid for immediate brightening, plus Magnesium Ascorbyl Phosphate and 3-Glyceryl Ascorbate for sustained melanin suppression throughout the day. Ferulic Acid doubles the photoprotective power, while Rice and Calendula extracts calm inflammation that triggers new pigment.",
        },
        {
          time: "AM",
          step: 2,
          name: "SPF 50+ Broad Spectrum",
          product: false,
          role: "Non-negotiable. Even 10 minutes of unprotected UV exposure can undo weeks of brightening progress on melanin-rich skin. Apply generously every morning, reapply every 2 hours outdoors.",
        },
        {
          time: "PM",
          step: 3,
          name: products.darkSpot.name,
          product: true,
          role: "This is where the heavy lifting happens at night. Hexylresorcinol and Kojic Acid shut down tyrosinase — the enzyme that produces melanin. Niacinamide blocks pigment from transferring to surrounding cells. Gluconolactone gently dissolves the surface layer of pigmented skin. Mushroom extracts (Shiitake and Turkey Tail) provide additional brightening through pathways most serums don't even target.",
        },
      ],
      ctaText: "Shop Your 2-Product System",
      ctaPrice: 49,
      ctaOriginal: 65,
    };
  } else if (totalScore <= 12) {
    return {
      segment: "Moderate",
      label: "Mixed-Depth",
      headline: "Your pigment runs deeper than the surface.",
      subhead: "This explains why basic products haven't fully worked.",
      detail: "Your profile indicates mixed epidermal and early dermal pigmentation. Standard brightening serums only address the top layer — they can't reach where some of your melanin lives. You need actives working at multiple depths simultaneously: melanin interception on the surface, inflammatory cycle disruption in the middle layers, and accelerated cellular turnover from below.",
      timeline: "3–5 months",
      timelineNote: "for meaningful, lasting improvement",
      scoreRange: "7–12",
      score: totalScore,
      products: [products.vitC, products.darkSpot, products.retinol],
      routine: [
        {
          time: "AM",
          step: 1,
          name: products.vitC.name,
          product: true,
          role: "Triple-form Vitamin C (L-Ascorbic Acid, MAP, and 3-Glyceryl Ascorbate) intercepts melanin production at the enzymatic level. Ferulic Acid amplifies UV defense — critical because your pigmentation has an inflammatory component that sunlight actively worsens. Chamomile and Calendula prevent the irritation that triggers rebound darkening.",
        },
        {
          time: "AM",
          step: 2,
          name: "SPF 50+ Broad Spectrum",
          product: false,
          role: "At your severity level, unprotected sun exposure doesn't just slow progress — it actively reverses it. Daily SPF is the single most important step. Look for formulas with iron oxides, which block visible light that standard sunscreens miss.",
        },
        {
          time: "PM",
          step: 3,
          name: products.darkSpot.name,
          product: true,
          role: "This serum attacks your pigmentation through five separate pathways. Azelaic Acid and Hexylresorcinol inhibit tyrosinase at the dermal level — where your deeper pigment lives. Kojic Acid and Niacinamide handle the epidermal layer. Gluconolactone accelerates surface cell turnover without the harshness of traditional acids. Resveratrol and Green Tea provide antioxidant reinforcement that prevents new pigment from forming while you treat existing spots.",
        },
        {
          time: "PM",
          step: 4,
          name: products.retinol.name,
          product: true,
          role: "Retinol forces deep cellular renewal — pushing pigmented cells to the surface faster so your other actives can clear them. Hexapeptide-11 supports skin repair and collagen production during this accelerated turnover. Bisabolol keeps inflammation in check so the retinol doesn't trigger the exact hyperpigmentation you're trying to fix. Start 2–3 nights per week and build to nightly as your skin acclimates.",
        },
      ],
      ctaText: "Shop Your 3-Product System",
      ctaPrice: 79,
      ctaOriginal: 99,
    };
  } else {
    return {
      segment: "Severe",
      label: "Dermal",
      headline: "Your pigment sits deep in the dermis.",
      subhead: "This requires a clinical-grade approach.",
      detail: "Your profile indicates deep, treatment-resistant dermal pigmentation — often involving hormonal or systemic triggers. We'll be honest: this level of pigmentation takes real commitment. But our full 3-product protocol is specifically formulated to manage every layer that topicals can reach. With consistent daily use, you'll see meaningful progress — it just takes patience and discipline.",
      timeline: "6–12 months",
      timelineNote: "consistency and patience are non-negotiable",
      scoreRange: "13–20",
      score: totalScore,
      products: [products.vitC, products.darkSpot, products.retinol],
      routine: [
        {
          time: "AM",
          step: 1,
          name: products.vitC.name,
          product: true,
          role: "Your morning defense layer. Triple-form Vitamin C provides continuous antioxidant protection that prevents UV and environmental stress from depositing new melanin while you work on clearing existing pigment. Ferulic Acid is clinically shown to double photoprotection — essential at your severity level where any new pigment production is a setback.",
        },
        {
          time: "AM",
          step: 2,
          name: "SPF 50+ Broad Spectrum",
          product: false,
          role: "Daily. Every day. Rain or shine. Even indoors near windows. At your pigment depth, this is the single most important step in your entire routine. Choose a formula with iron oxides to block visible light — a trigger that standard sunscreens completely miss.",
        },
        {
          time: "PM",
          step: 3,
          name: products.darkSpot.name,
          product: true,
          role: "Your most important treatment product. Azelaic Acid is one of the few ingredients with clinical evidence for reaching dermal pigment — and it's combined here with Hexylresorcinol, which outperforms hydroquinone in studies without the side effects. Kojic Acid and Niacinamide address the epidermal layer simultaneously. The Shiitake and Turkey Tail mushroom extracts provide tyrosinase inhibition through a completely different mechanism than the acids, meaning more pathways blocked. Atelocollagen and Chondroitin Sulfate support dermal repair at the structural level.",
        },
        {
          time: "PM",
          step: 4,
          name: products.retinol.name,
          product: true,
          role: "Retinol drives aggressive cellular turnover — essential for pushing deep pigment toward the surface where your Dark Spot Serum can clear it. Hexapeptide-11 supports the structural repair your skin needs during this accelerated renewal cycle. Bisabolol is critical here: it prevents the inflammatory cascade that retinol can trigger on sensitive or over-pigmented skin. Use 2–3 nights per week, alternating with your Dark Spot Serum on other nights.",
        },
      ],
      ctaText: "Shop Full System",
      ctaPrice: 99,
      ctaOriginal: 129,
    };
  }
}

// ─── Reusable Components ───

function EducationDrawer({ why, education, isOpen, onToggle }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <button
        onClick={onToggle}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 0",
          width: "100%",
          textAlign: "left",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: isOpen ? "#1a1a1a" : "rgba(180,160,130,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: isOpen ? "#fff" : "#8a7a66",
              fontWeight: 700,
              transition: "transform 0.3s ease",
              display: "inline-block",
              transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
            }}
          >
            +
          </span>
        </div>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: "#8a7a66",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {why}
          <span style={{ fontWeight: 400, textTransform: "none", marginLeft: 6, color: "#aaa" }}>
            Tap to learn more
          </span>
        </span>
      </button>
      <div
        style={{
          maxHeight: isOpen ? 300 : 0,
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div
          style={{
            padding: "16px 20px 20px 38px",
            background: "rgba(180,160,130,0.06)",
            borderRadius: 12,
            borderLeft: "3px solid rgba(180,160,130,0.3)",
          }}
        >
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: 15,
              lineHeight: 1.75,
              color: "#555",
              margin: 0,
            }}
          >
            {education}
          </p>
        </div>
      </div>
    </div>
  );
}

function ProgressDots({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 32 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 24 : 8,
            height: 8,
            borderRadius: 100,
            background: i < current ? "#1a1a1a" : i === current ? "#1a1a1a" : "#ddd",
            opacity: i < current ? 0.3 : 1,
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      ))}
    </div>
  );
}

function ScoreMeter({ score, max = 20, label }) {
  const pct = Math.min((score / max) * 100, 100);
  const color = score <= 6 ? "#5a8a5e" : score <= 12 ? "#b8860b" : "#a04040";
  return (
    <div style={{ margin: "24px 0 8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "#999", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Clinical Score
        </span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: color }}>
          {score} / {max} — {label}
        </span>
      </div>
      <div style={{ height: 6, background: "#eee", borderRadius: 100, overflow: "hidden" }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            borderRadius: 100,
            transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>
    </div>
  );
}

// ─── Main Component ───

export default function DarkQuiz() {
  const [step, setStep] = useState(0);
  // 0=welcome, 1-5=questions, 6=email gate, 7=analyzing, 8=results
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [selected, setSelected] = useState(null);
  const [eduOpen, setEduOpen] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [analyzePhase, setAnalyzePhase] = useState(0);
  const [isSubscription, setIsSubscription] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [cartLoading, setCartLoading] = useState(false);

  const totalQuestions = questions.length;
  const isQuestion = step >= 1 && step <= totalQuestions;
  const currentQ = isQuestion ? questions[step - 1] : null;

  // Animate on step change
  useEffect(() => {
    setAnimKey((k) => k + 1);
    setEduOpen(false);
  }, [step]);

  // Analyzing animation phases
  useEffect(() => {
    if (step === totalQuestions + 2) {
      setAnalyzePhase(0);
      const t1 = setTimeout(() => setAnalyzePhase(1), 800);
      const t2 = setTimeout(() => setAnalyzePhase(2), 1800);
      const t3 = setTimeout(() => {
        trackQuizComplete(result?.segment);
        trackViewContent("Quiz Results", "quiz");
        setStep(totalQuestions + 3);
      }, 3200);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [step, totalQuestions]);

  const handleSelect = (value) => setSelected(value);

  const handleNext = () => {
    if (isQuestion && selected) {
      trackQuizAnswer(currentQ.id, selected);
      setAnswers((prev) => ({ ...prev, [currentQ.id]: selected }));
      setSelected(null);
    }
    if (step === 0) {
      trackQuizStart();
    }
    if (step === totalQuestions + 1) {
      // Email step → fire-and-forget Klaviyo subscribe, then go to analyzing
      if (email.includes("@")) {
        trackEmailSignup("quiz");
        fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, firstName }),
        }).catch(() => {/* silently ignore errors */});
      }
      setStep(totalQuestions + 2);
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 1 && step <= totalQuestions + 1) {
      const prevQ = questions[step - 2];
      if (prevQ) setSelected(answers[prevQ.id] || null);
    }
    setStep((s) => Math.max(0, s - 1));
  };

  const result = getResults(answers);

  const runningScore = Object.entries(answers).reduce((sum, [qId, val]) => {
    const q = questions.find((q) => q.id === qId);
    const opt = q?.options.find((o) => o.value === val);
    return sum + (opt?.score || 0);
  }, 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAF8F5",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Source+Serif+4:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes expandBar {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .fade-up { animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .fade-in { animation: fadeIn 0.5s ease forwards; }
        .stagger-1 { animation-delay: 0.05s; opacity: 0; }
        .stagger-2 { animation-delay: 0.1s; opacity: 0; }
        .stagger-3 { animation-delay: 0.15s; opacity: 0; }
        .stagger-4 { animation-delay: 0.2s; opacity: 0; }
        .stagger-5 { animation-delay: 0.25s; opacity: 0; }

        .opt-btn {
          width: 100%;
          background: #fff;
          border: 2px solid transparent;
          border-radius: 14px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          text-align: left;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          position: relative;
          overflow: hidden;
        }
        .opt-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(180,160,130,0.04), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .opt-btn:hover {
          border-color: rgba(180,160,130,0.3);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        }
        .opt-btn:hover::before { opacity: 1; }
        .opt-btn.active {
          border-color: #1a1a1a;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .opt-btn.active::before { opacity: 1; background: linear-gradient(135deg, rgba(180,160,130,0.06), transparent); }

        .radio-outer {
          width: 22px; height: 22px; border-radius: 50%;
          border: 2px solid #d0ccc6;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: all 0.25s ease;
        }
        .opt-btn.active .radio-outer {
          border-color: #1a1a1a;
          background: #1a1a1a;
        }
        .radio-inner {
          width: 7px; height: 7px; border-radius: 50%;
          background: #fff;
          transform: scale(0);
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .opt-btn.active .radio-inner { transform: scale(1); }

        .primary-btn {
          background: #1a1a1a;
          color: #fff;
          border: none;
          padding: 18px 48px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        }
        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.18);
        }
        .primary-btn:disabled {
          background: #d0ccc6;
          color: #aaa;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        .ghost-btn {
          background: none; border: none;
          color: #aaa; font-size: 13px; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; padding: 12px;
          transition: color 0.2s ease;
          text-decoration: none;
        }
        .ghost-btn:hover { color: #666; }

        .result-card {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 12px;
          transition: all 0.2s ease;
        }
        .result-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.04);
        }

        input::placeholder { color: #bbb; }
        input:focus { outline: none; border-color: #1a1a1a !important; }

        /* Texture overlay */
        .texture-bg::after {
          content: '';
          position: fixed;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.015'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }
      `}</style>

      {/* ─── Nav ─── */}
      <nav
        className="texture-bg"
        style={{
          padding: "16px 28px",
          background: "rgba(250,248,245,0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#1a1a1a",
              letterSpacing: "0.12em",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            DARK
          </span>
          <span style={{ fontSize: 10, fontWeight: 600, color: "#b4a082", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            skin assessment
          </span>
        </div>
        <a href="/" className="ghost-btn" style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Exit
        </a>
      </nav>

      {/* ─── Progress ─── */}
      {isQuestion && (
        <div style={{ padding: "20px 28px 0" }}>
          <ProgressDots current={step - 1} total={totalQuestions} />
        </div>
      )}

      {/* ─── Content ─── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "24px 20px 60px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div key={animKey} className="fade-up" style={{ maxWidth: 560, width: "100%", margin: "0 auto" }}>

          {/* ═══ WELCOME ═══ */}
          {step === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0 20px" }}>
              {/* Decorative element */}
              <div style={{ margin: "0 auto 32px", width: 80, height: 80, position: "relative" }}>
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: "linear-gradient(135deg, #C8A882 0%, #8B6914 50%, #3D2B1F 100%)",
                  opacity: 0.2,
                }} />
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: 32,
                }}>
                  ◐
                </div>
              </div>

              <h1
                style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: 42,
                  fontWeight: 800,
                  color: "#1a1a1a",
                  margin: "0 0 16px",
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                }}
              >
                Your skin has a story.
                <br />
                <span style={{ color: "#b4a082" }}>Let's read it.</span>
              </h1>

              <p
                style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: 17,
                  color: "#888",
                  lineHeight: 1.7,
                  maxWidth: 420,
                  margin: "0 auto 40px",
                }}
              >
                Five clinical questions. Two minutes. We'll map your hyperpigmentation type, depth, and triggers — then build a treatment plan backed by dermatological research.
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 32,
                  marginBottom: 48,
                  flexWrap: "wrap",
                }}
              >
                {[
                  { icon: "◷", text: "2 minutes" },
                  { icon: "⚕", text: "Clinically modeled" },
                  { icon: "◉", text: "Personalized results" },
                ].map((item) => (
                  <div
                    key={item.text}
                    style={{ display: "flex", alignItems: "center", gap: 8, color: "#aaa", fontSize: 13, fontWeight: 500 }}
                  >
                    <span style={{ fontSize: 16, color: "#b4a082" }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>

              <button className="primary-btn" onClick={handleNext} style={{ padding: "20px 56px", fontSize: 15 }}>
                Begin Assessment
              </button>

              <p style={{ fontSize: 12, color: "#ccc", marginTop: 24, lineHeight: 1.5 }}>
                Not a medical diagnosis. For educational purposes.
              </p>
            </div>
          )}

          {/* ═══ QUESTIONS ═══ */}
          {isQuestion && (
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#b4a082",
                  marginBottom: 10,
                  textAlign: "center",
                }}
              >
                Question {step} of {totalQuestions}
              </p>

              <h2
                style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: 30,
                  fontWeight: 700,
                  color: "#1a1a1a",
                  margin: "0 0 6px",
                  lineHeight: 1.2,
                  textAlign: "center",
                }}
              >
                {currentQ.question}
              </h2>

              <p style={{ fontSize: 14, color: "#aaa", textAlign: "center", margin: "0 0 28px", fontWeight: 400 }}>
                {currentQ.subtitle}
              </p>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 }}>
                {currentQ.options.map((opt, i) => (
                  <button
                    key={opt.value}
                    className={`opt-btn fade-up stagger-${i + 1} ${selected === opt.value ? "active" : ""}`}
                    onClick={() => handleSelect(opt.value)}
                  >
                    <div className="radio-outer">
                      <div className="radio-inner" />
                    </div>
                    {opt.swatch && (
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: opt.swatch,
                          flexShrink: 0,
                          border: "1px solid rgba(0,0,0,0.08)",
                        }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", marginBottom: 1 }}>
                        {opt.label}
                      </div>
                      <div style={{ fontSize: 13, color: "#999", fontWeight: 400 }}>{opt.subtext}</div>
                    </div>
                    {opt.pct && (
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#b4a082", flexShrink: 0 }}>
                        {opt.pct}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Education drawer */}
              <EducationDrawer
                why={currentQ.why}
                education={currentQ.education}
                isOpen={eduOpen}
                onToggle={() => setEduOpen(!eduOpen)}
              />

              {/* Running score (after first answer) */}
              {Object.keys(answers).length > 0 && (
                <div style={{ opacity: 0.6, marginBottom: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#bbb", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      Running score
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#999" }}>
                      {runningScore} so far
                    </span>
                  </div>
                  <div style={{ height: 3, background: "#eee", borderRadius: 100, marginTop: 6, overflow: "hidden" }}>
                    <div style={{
                      width: `${(runningScore / 20) * 100}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #b4a082, #8a7a66)",
                      borderRadius: 100,
                      transition: "width 0.8s cubic-bezier(0.22,1,0.36,1)",
                    }} />
                  </div>
                </div>
              )}

              {/* Nav buttons */}
              <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center" }}>
                <button className="ghost-btn" onClick={handleBack}>
                  Back
                </button>
                <button className="primary-btn" onClick={handleNext} disabled={!selected}>
                  {step === totalQuestions ? "See My Results" : "Continue"}
                </button>
              </div>
            </div>
          )}

          {/* ═══ EMAIL GATE ═══ */}
          {step === totalQuestions + 1 && (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(180,160,130,0.15), rgba(180,160,130,0.05))",
                  margin: "0 auto 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                }}
              >
                ✓
              </div>

              <h2
                style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: 30,
                  fontWeight: 700,
                  color: "#1a1a1a",
                  margin: "0 0 12px",
                }}
              >
                Your assessment is ready.
              </h2>
              <p style={{ fontSize: 15, color: "#999", lineHeight: 1.6, maxWidth: 380, margin: "0 auto 12px" }}>
                We've analyzed your responses. Enter your email to unlock:
              </p>

              {/* Value props */}
              <div style={{ textAlign: "left", maxWidth: 340, margin: "0 auto 32px" }}>
                {[
                  "Your clinical severity score & what it means",
                  "Exact ingredients and concentrations for your type",
                  "A realistic timeline based on your pigment depth",
                  "15% off your first order",
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`fade-up stagger-${i + 1}`}
                    style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}
                  >
                    <span style={{ color: "#b4a082", fontSize: 14, marginTop: 1, flexShrink: 0 }}>✦</span>
                    <span style={{ fontSize: 14, color: "#666", lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>

              <div style={{ maxWidth: 380, margin: "0 auto" }}>
                <input
                  type="text"
                  placeholder="First name (optional)"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "16px 20px",
                    borderRadius: 12,
                    border: "2px solid #eee",
                    fontSize: 15,
                    fontFamily: "'DM Sans', sans-serif",
                    marginBottom: 12,
                    background: "#fff",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s ease",
                  }}
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "16px 20px",
                    borderRadius: 12,
                    border: "2px solid #eee",
                    fontSize: 15,
                    fontFamily: "'DM Sans', sans-serif",
                    marginBottom: 20,
                    background: "#fff",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s ease",
                  }}
                />

                <button
                  className="primary-btn"
                  onClick={handleNext}
                  disabled={!email.includes("@")}
                  style={{ width: "100%" }}
                >
                  Unlock My Results
                </button>
              </div>

              <button
                className="ghost-btn"
                onClick={() => {
                  setStep(totalQuestions + 2);
                }}
                style={{ marginTop: 16, fontSize: 12 }}
              >
                Skip — show me the results
              </button>
            </div>
          )}

          {/* ═══ ANALYZING ═══ */}
          {step === totalQuestions + 2 && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              {/* Animated ring */}
              <div style={{ position: "relative", width: 72, height: 72, margin: "0 auto 32px" }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    border: "3px solid #eee",
                    borderTopColor: "#1a1a1a",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              </div>

              {["Scoring 5 clinical dimensions...", "Mapping pigment depth indicators...", "Building your treatment protocol..."].map(
                (text, i) => (
                  <p
                    key={i}
                    style={{
                      fontSize: 15,
                      color: analyzePhase >= i ? "#555" : "#ddd",
                      transition: "color 0.4s ease",
                      margin: "0 0 12px",
                      fontFamily: "'Source Serif 4', Georgia, serif",
                      fontStyle: "italic",
                    }}
                  >
                    {analyzePhase > i ? "✓ " : analyzePhase === i ? "→ " : ""}
                    {text}
                  </p>
                )
              )}
            </div>
          )}

          {/* ═══ RESULTS ═══ */}
          {step === totalQuestions + 3 && (
            <div>
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: 36 }}>
                <span
                  style={{
                    display: "inline-block",
                    background: "#1a1a1a",
                    color: "#fff",
                    padding: "5px 14px",
                    borderRadius: 100,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 16,
                  }}
                >
                  {result.label} · {result.segment}
                </span>

                <h2
                  style={{
                    fontFamily: "'Source Serif 4', Georgia, serif",
                    fontSize: 34,
                    fontWeight: 800,
                    color: "#1a1a1a",
                    margin: "0 0 8px",
                    lineHeight: 1.15,
                  }}
                >
                  {result.headline}
                </h2>
                <p style={{ fontSize: 16, color: "#999", margin: 0 }}>{result.subhead}</p>
              </div>

              {/* Score */}
              <ScoreMeter score={result.score} label={result.segment} />

              {/* Detail card */}
              <div
                className="result-card"
                style={{ marginTop: 24, padding: 28, borderRadius: 20 }}
              >
                <h3
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#b4a082",
                    margin: "0 0 14px",
                  }}
                >
                  What this means
                </h3>
                <p
                  style={{
                    fontFamily: "'Source Serif 4', Georgia, serif",
                    fontSize: 15,
                    color: "#444",
                    lineHeight: 1.8,
                    margin: 0,
                  }}
                >
                  {result.detail}
                </p>

                <div
                  style={{
                    marginTop: 20,
                    padding: "14px 18px",
                    background: "rgba(180,160,130,0.08)",
                    borderRadius: 12,
                    borderLeft: "3px solid #b4a082",
                    display: "flex",
                    alignItems: "baseline",
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#b4a082", whiteSpace: "nowrap" }}>
                    Timeline
                  </span>
                  <span style={{ fontSize: 14, color: "#555" }}>
                    <strong>{result.timeline}</strong> — {result.timelineNote}
                  </span>
                </div>
              </div>

              {/* Your DARK Products */}
              {result.products && (
                <>
                  <h3
                    style={{
                      fontFamily: "'Source Serif 4', Georgia, serif",
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#1a1a1a",
                      margin: "36px 0 6px",
                    }}
                  >
                    Your DARK system
                  </h3>
                  <p style={{ fontSize: 14, color: "#aaa", margin: "0 0 16px" }}>
                    {result.products.length} products selected for your {result.label.toLowerCase()} profile.
                  </p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
                    {result.products.map((p, i) => (
                      <div
                        key={i}
                        style={{
                          background: "#1a1a1a",
                          color: "#fff",
                          padding: "10px 16px",
                          borderRadius: 10,
                          fontSize: 12,
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span style={{ color: "#b4a082" }}>◆</span>
                        {p.tag}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Routine */}
              <h3
                style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#1a1a1a",
                  margin: "0 0 6px",
                }}
              >
                Your prescribed routine
              </h3>
              <p style={{ fontSize: 14, color: "#aaa", margin: "0 0 20px" }}>
                When to use each product and why it works for your specific profile.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {result.routine.map((item, i) => (
                  <div
                    key={i}
                    className={`result-card fade-up stagger-${Math.min(i + 1, 5)}`}
                    style={{
                      padding: "18px 20px",
                      display: "flex",
                      gap: 16,
                      alignItems: "flex-start",
                      borderLeft: item.product ? "3px solid #1a1a1a" : "3px solid transparent",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background:
                          item.time === "AM"
                            ? "linear-gradient(135deg, #FFF3E0, #FFE0B2)"
                            : item.time === "PM"
                            ? "linear-gradient(135deg, #E8EAF6, #C5CAE9)"
                            : "linear-gradient(135deg, #E8F5E9, #C8E6C9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 800,
                        color: item.time === "AM" ? "#E65100" : item.time === "PM" ? "#283593" : "#2E7D32",
                        letterSpacing: "0.06em",
                        flexShrink: 0,
                      }}
                    >
                      {item.time}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        <p
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: "#1a1a1a",
                            margin: 0,
                          }}
                        >
                          {item.name}
                        </p>
                        {item.product && (
                          <span style={{
                            background: "rgba(180,160,130,0.15)",
                            color: "#8a7a66",
                            padding: "2px 8px",
                            borderRadius: 100,
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                          }}>
                            DARK
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          fontFamily: "'Source Serif 4', Georgia, serif",
                          fontSize: 13,
                          color: "#888",
                          margin: 0,
                          lineHeight: 1.7,
                        }}
                      >
                        {item.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Answers recap */}
              <div style={{ marginTop: 36, marginBottom: 36 }}>
                <h3
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#b4a082",
                    margin: "0 0 16px",
                  }}
                >
                  Your responses
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {questions.map((q) => {
                    const ans = answers[q.id];
                    const opt = q.options.find((o) => o.value === ans);
                    if (!opt) return null;
                    return (
                      <div
                        key={q.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 0",
                          borderBottom: "1px solid rgba(0,0,0,0.04)",
                        }}
                      >
                        <span style={{ fontSize: 13, color: "#999" }}>{q.question}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#555", textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                          {opt.label} (+{opt.score})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Purchase Section ── */}
              <div
                style={{
                  background: "#1a1a1a",
                  borderRadius: 24,
                  padding: "36px 28px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Subtle pattern */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(circle at 20% 50%, rgba(180,160,130,0.08) 0%, transparent 60%)",
                    pointerEvents: "none",
                  }}
                />

                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#b4a082",
                    margin: "0 0 12px",
                    position: "relative",
                    textAlign: "center",
                  }}
                >
                  Your system is ready
                </p>

                <h3
                  style={{
                    fontFamily: "'Source Serif 4', Georgia, serif",
                    fontSize: 26,
                    fontWeight: 700,
                    color: "#fff",
                    margin: "0 0 8px",
                    position: "relative",
                    textAlign: "center",
                  }}
                >
                  Start your transformation.
                </h3>
                <p style={{ fontSize: 14, color: "#777", margin: "0 0 28px", position: "relative", lineHeight: 1.5, textAlign: "center" }}>
                  Every product calibrated to your clinical profile.
                </p>

                {/* Products included */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24, position: "relative" }}>
                  {result.products && result.products.map((p, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "rgba(255,255,255,0.05)", borderRadius: 12 }}>
                      <span style={{ color: "#b4a082", fontSize: 14 }}>✓</span>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{p.name}</span>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)", marginLeft: "auto" }}>30ml</span>
                    </div>
                  ))}
                </div>

                {/* Subscribe / One-Time Toggle */}
                <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 20, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, overflow: "hidden", position: "relative" }}>
                  {/* Subscribe option */}
                  <div
                    onClick={() => setIsSubscription(true)}
                    style={{
                      padding: "16px 18px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      background: isSubscription ? "rgba(255,255,255,0.06)" : "transparent",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%", marginTop: 2,
                        border: isSubscription ? "6px solid #b4a082" : "2px solid rgba(255,255,255,0.25)",
                        background: isSubscription ? "#1a1a1a" : "transparent", flexShrink: 0,
                        transition: "all 0.2s ease",
                      }} />
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff" }}>Subscribe & Save</span>
                          <span style={{ background: "#b4a082", color: "#1a1a1a", padding: "2px 8px", borderRadius: 100, fontSize: 10, fontWeight: 800 }}>BEST VALUE</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>◎ Auto-refill every 60 days</span>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>◎ Cancel or pause anytime</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 800, color: "#fff" }}>$79</span>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textDecoration: "line-through" }}>$99</div>
                    </div>
                  </div>

                  {/* One-Time option */}
                  <div
                    onClick={() => setIsSubscription(false)}
                    style={{
                      padding: "16px 18px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: !isSubscription ? "rgba(255,255,255,0.06)" : "transparent",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%",
                        border: !isSubscription ? "6px solid #b4a082" : "2px solid rgba(255,255,255,0.25)",
                        background: !isSubscription ? "#1a1a1a" : "transparent", flexShrink: 0,
                        transition: "all 0.2s ease",
                      }} />
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: !isSubscription ? "#fff" : "rgba(255,255,255,0.4)" }}>One-Time Purchase</span>
                    </div>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: !isSubscription ? 800 : 500, color: !isSubscription ? "#fff" : "rgba(255,255,255,0.4)" }}>$99</span>
                  </div>
                </div>

                {/* Add to Cart / Added confirmation */}
                {!addedToCart ? (
                  <button
                    onClick={async () => {
                      setCartLoading(true);
                      trackAddToCart(
                        isSubscription ? "3-Serum System Bundle (Subscription)" : "3-Serum System Bundle",
                        isSubscription ? 79 : 99
                      );
                      try {
                        const line = isSubscription
                          ? { merchandiseId: VARIANTS.BUNDLE, quantity: 1, sellingPlanId: SELLING_PLANS.BUNDLE_MONTHLY }
                          : { merchandiseId: VARIANTS.BUNDLE, quantity: 1 };
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
                    style={{
                      width: "100%",
                      background: "#fff",
                      color: "#1a1a1a",
                      border: "none",
                      padding: "18px",
                      borderRadius: 100,
                      fontSize: 15,
                      fontWeight: 800,
                      fontFamily: "'DM Sans', sans-serif",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      cursor: cartLoading ? "not-allowed" : "pointer",
                      position: "relative",
                      transition: "all 0.2s ease",
                      boxShadow: "0 4px 16px rgba(255,255,255,0.1)",
                      opacity: cartLoading ? 0.7 : 1,
                    }}
                  >
                    {cartLoading ? "Adding…" : `Add to Cart — $${isSubscription ? 79 : 99}`}
                  </button>
                ) : (
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        width: "100%",
                        background: "#b4a082",
                        color: "#1a1a1a",
                        padding: "18px",
                        borderRadius: 100,
                        fontSize: 15,
                        fontWeight: 800,
                        fontFamily: "'DM Sans', sans-serif",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        textAlign: "center",
                      }}
                    >
                      ✓ Added to Cart
                    </div>
                    <button
                      onClick={() => { trackInitiateCheckout(isSubscription ? 79 : 99); checkoutUrl && window.location.assign(checkoutUrl); }}
                      style={{
                        display: "block",
                        width: "100%",
                        background: "transparent",
                        color: "#fff",
                        border: "1px solid rgba(255,255,255,0.2)",
                        padding: "16px",
                        borderRadius: 100,
                        fontSize: 14,
                        fontWeight: 700,
                        fontFamily: "'DM Sans', sans-serif",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        textAlign: "center",
                        marginTop: 10,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      Continue to Checkout →
                    </button>
                  </div>
                )}

                {/* Trust signals */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginTop: 16, position: "relative", flexWrap: "wrap" }}>
                  {["Free shipping", "60-day guarantee", "Cancel anytime"].map((item) => (
                    <span key={item} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <p style={{ fontSize: 11, color: "#ccc", textAlign: "center", marginTop: 24, lineHeight: 1.6 }}>
                This assessment is for educational purposes and does not replace professional medical advice.
                <br />
                Results vary by individual. Consult a dermatologist for persistent conditions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}