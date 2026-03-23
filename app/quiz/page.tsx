"use client";
import { useState, useEffect } from "react";
import { VARIANTS, SELLING_PLANS, createCart } from "@/lib/shopify";
import {
  trackAddToCart,
  trackInitiateCheckout,
  trackCustom,
  trackLead,
  trackViewContent,
} from "@/lib/meta-pixel";

// ─── Path A — Risk Assessment Questions ───
const pathAQuestions = [
  {
    id: "skin_tone",
    question: "How would you describe your natural skin tone?",
    subtitle: "Think about your undertone in natural light.",
    why: "Skin tone affects baseline risk.",
    education:
      "Deeper skin tones have more reactive melanocytes — higher baseline risk for PIH when triggered.",
    options: [
      { label: "Light brown / caramel", value: "light", score: 1 },
      { label: "Medium brown", value: "medium", score: 2 },
      { label: "Deep brown", value: "deep", score: 3 },
      { label: "Very deep / ebony", value: "ebony", score: 4 },
    ],
  },
  {
    id: "acne_history",
    question: "How often do you experience breakouts?",
    subtitle: "Consider your skin over the past year.",
    why: "Acne is a leading PIH trigger.",
    education:
      "Acne is the leading trigger of PIH in darker skin. Frequency directly correlates with risk level.",
    options: [
      { label: "Rarely or never", value: "rarely", score: 0 },
      { label: "Occasionally — a few times a year", value: "occasionally", score: 1 },
      { label: "Regularly — monthly or more", value: "regularly", score: 2 },
      { label: "Frequently — almost always have active breakouts", value: "frequently", score: 4 },
    ],
  },
  {
    id: "product_reactions",
    question: "Have skincare products ever irritated or inflamed your skin?",
    subtitle: "Think about redness, burning, or peeling from products.",
    why: "Inflammation triggers melanin.",
    education:
      "Inflammation from product irritation triggers melanin production — a primary pathway to PIH.",
    options: [
      { label: "Never", value: "never", score: 0 },
      { label: "Once or twice", value: "once", score: 1 },
      { label: "A few times", value: "few", score: 2 },
      { label: "Frequently — my skin reacts easily", value: "frequently", score: 4 },
    ],
  },
  {
    id: "sun_protection",
    question: "How consistently do you wear SPF on your face?",
    subtitle: "Be honest — this one matters more than you think.",
    why: "UV accelerates melanin production.",
    education:
      "UV exposure accelerates melanin production and worsens existing and emerging hyperpigmentation.",
    options: [
      { label: "Daily, without fail", value: "daily", score: 0 },
      { label: "Most days", value: "most", score: 1 },
      { label: "Sometimes", value: "sometimes", score: 2 },
      { label: "Rarely or never", value: "rarely", score: 4 },
    ],
  },
];

// ─── Path B — Severity Assessment Questions ───
const pathBQuestions = [
  {
    id: "color",
    question: "What color are your dark spots?",
    subtitle: "Look at your spots in natural daylight for the most accurate read.",
    why: "Color reveals depth.",
    education:
      "Color reveals pigment depth — brown means epidermal, grey or blue means dermal. Dermal pigment requires a stronger, longer protocol.",
    options: [
      { label: "Light tan / golden", value: "light", score: 1 },
      { label: "Medium–dark brown", value: "medium", score: 2 },
      { label: "Very dark / near-black", value: "dark", score: 3 },
      { label: "Grayish or blue-toned", value: "gray", score: 4 },
    ],
  },
  {
    id: "coverage",
    question: "How much of your face is affected?",
    subtitle: "Think about all areas — cheeks, forehead, upper lip, jawline.",
    why: "Coverage drives clinical severity.",
    education:
      "Based on the mMASI dermatological scale used by dermatologists to assess hyperpigmentation severity.",
    options: [
      { label: "A few spots — less than 10%", value: "few", score: 1 },
      { label: "Scattered patches — 10 to 30%", value: "scattered", score: 2 },
      { label: "Large zones — 30 to 60%", value: "zones", score: 3 },
      { label: "Nearly everywhere — 60% or more", value: "widespread", score: 4 },
    ],
  },
  {
    id: "trigger",
    question: "What started your hyperpigmentation?",
    subtitle: "If you\’re unsure, pick the closest match.",
    why: "Your trigger shapes your treatment.",
    education:
      "Different triggers require different treatment strategies. Hormonal PIH is the most persistent and requires the full three-step system.",
    options: [
      { label: "Sun exposure", value: "sun", score: 1 },
      { label: "Post-acne marks", value: "acne", score: 2 },
      { label: "Not sure", value: "unknown", score: 2 },
      { label: "Hormonal changes", value: "hormonal", score: 3 },
    ],
  },
  {
    id: "duration",
    question: "How long have you had these dark spots?",
    subtitle: "Think about when you first noticed the discoloration.",
    why: "Time reveals treatment difficulty.",
    education:
      "Pigment migrates deeper over time. Spots present for more than a year are typically dermal and need the full system to treat effectively.",
    options: [
      { label: "Under 3 months", value: "recent", score: 1 },
      { label: "3 to 12 months", value: "year", score: 2 },
      { label: "1 to 3 years", value: "persistent", score: 3 },
      { label: "3 or more years", value: "chronic", score: 4 },
    ],
  },
  {
    id: "history",
    question: "Have brightening products worked for you before?",
    subtitle:
      "Think about vitamin C serums, dark spot correctors, exfoliants — anything marketed for hyperpigmentation.",
    why: "Past failures are diagnostic.",
    education:
      "Past treatment failure is the strongest indicator of dermal pigmentation. Products that failed were likely not formulated to reach the right depth.",
    options: [
      { label: "Haven\’t tried any", value: "no", score: 0 },
      { label: "Yes — saw some fading", value: "some", score: 1 },
      { label: "Yes — barely any change", value: "minimal", score: 3 },
      { label: "Yes — nothing worked", value: "nothing", score: 4 },
    ],
  },
];

// ─── Products ───
const products = {
  vitC: { name: "DARK Vitamin C Serum", tag: "VITAMIN C SERUM" },
  darkSpot: { name: "DARK Dark Spot Serum", tag: "DARK SPOT SERUM" },
  retinol: { name: "DARK Retinol & Peptide Serum", tag: "RETINOL & PEPTIDE" },
};

// ─── Path A Results ───
function getPathAResults(answers: Record<string, string>) {
  let totalScore = 0;
  for (const [qId, val] of Object.entries(answers)) {
    const q = pathAQuestions.find((q) => q.id === qId);
    const opt = q?.options.find((o) => o.value === val);
    if (opt) totalScore += opt.score;
  }

  if (totalScore <= 5) {
    return {
      segment: "Low Risk",
      badge: "CAUTION",
      headline: "Your skin profile suggests a lower risk of developing hyperpigmentation right now.",
      detail:
        "That doesn\’t mean you\’re immune — it means you have a window. The right prevention routine now is significantly easier than treating it later.",
      products: [products.vitC],
      routineRationale:
        "Interrupt melanin production before inflammation can trigger it. One step, used daily, is enough at this stage.",
      timeline: "6 weeks",
      priceOneTime: 29,
      priceSub: 25,
      scoreRange: "0–5",
      score: totalScore,
      maxScore: 16,
    };
  } else if (totalScore <= 10) {
    return {
      segment: "Moderate Risk",
      badge: "ATTENTION",
      headline: "Your skin has several risk factors that put you in the moderate risk category.",
      detail:
        "This means hyperpigmentation hasn\’t fully developed yet — but the conditions for it are present. Starting a two-step protocol now significantly reduces the likelihood of it progressing.",
      products: [products.vitC, products.darkSpot],
      routineRationale:
        "Two steps work together — one prevents new melanin formation, one targets any early spots before they deepen.",
      timeline: "8–10 weeks",
      priceOneTime: 50,
      priceSub: 40,
      scoreRange: "6–10",
      score: totalScore,
      maxScore: 16,
    };
  } else {
    return {
      segment: "High Risk",
      badge: "ACT NOW",
      headline: "Your skin profile indicates a high risk of developing significant hyperpigmentation.",
      detail:
        "Based on your skin tone, acne history, and reaction patterns — your melanocytes are highly reactive. The full three-step system is the right move before this becomes harder to treat.",
      products: [products.vitC, products.darkSpot, products.retinol],
      routineRationale:
        "All three steps are needed — prevention, targeted treatment, and cell renewal support. Starting now gives you the best chance of staying ahead of it.",
      timeline: "3–4 months",
      priceOneTime: 79,
      priceSub: 69,
      scoreRange: "11–16",
      score: totalScore,
      maxScore: 16,
    };
  }
}

// ─── Path B Results ───
function getPathBResults(answers: Record<string, string>) {
  let totalScore = 0;
  for (const [qId, val] of Object.entries(answers)) {
    const q = pathBQuestions.find((q) => q.id === qId);
    const opt = q?.options.find((o) => o.value === val);
    if (opt) totalScore += opt.score;
  }

  if (totalScore <= 6) {
    return {
      segment: "Mild",
      badge: "Epidermal",
      headline: "Your hyperpigmentation is in the early stages — primarily in the upper layers of your skin.",
      detail:
        "This is the most treatable stage. The right two-step protocol can produce visible results in 6 to 10 weeks.",
      products: [products.vitC, products.darkSpot],
      routineRationale:
        "Vitamin C intercepts melanin production during the day while Dark Spot Serum targets existing pigment at night. Two steps, working in sync.",
      timeline: "6–10 weeks",
      priceOneTime: 50,
      priceSub: 40,
      scoreRange: "0–6",
      score: totalScore,
      maxScore: 20,
    };
  } else if (totalScore <= 12) {
    return {
      segment: "Moderate",
      badge: "Mixed Depth",
      headline: "Your hyperpigmentation has both epidermal and early dermal involvement.",
      detail:
        "Surface treatments alone won\’t be enough at this stage. The full three-step system addresses pigment at both depths — and supports the skin\’s ability to renew itself so results hold.",
      products: [products.vitC, products.darkSpot, products.retinol],
      routineRationale:
        "Three products target three depths — surface melanin interception, mid-layer pigment disruption, and deep cellular renewal.",
      timeline: "3–5 months",
      priceOneTime: 79,
      priceSub: 69,
      scoreRange: "7–12",
      score: totalScore,
      maxScore: 20,
    };
  } else {
    return {
      segment: "Severe",
      badge: "Dermal",
      headline: "Your hyperpigmentation has migrated into the deeper layers of your skin.",
      detail:
        "This is the most persistent form of PIH and the most commonly undertreated — because most products on the market are formulated to treat surface pigmentation only. The full system was built specifically for this depth.",
      products: [products.vitC, products.darkSpot, products.retinol],
      routineRationale:
        "The full system attacks pigment at every reachable layer — prevention, treatment, and accelerated cell renewal working together daily.",
      timeline: "6–12 months",
      priceOneTime: 79,
      priceSub: 69,
      scoreRange: "13–20",
      score: totalScore,
      maxScore: 20,
    };
  }
}

// ─── Tracking Helpers ───
function fireQuizStart(pathChoice: "A" | "B") {
  trackCustom("QuizStart", { content_name: pathChoice, content_category: `path_${pathChoice.toLowerCase()}` });
}

function fireQuizAnswer(
  path: "A" | "B",
  questionId: string,
  answerValue: string,
  runningScore: number
) {
  trackCustom("QuizAnswer", {
    content_name: questionId,
    content_category: answerValue,
    value: runningScore,
    path: `path_${path.toLowerCase()}`,
  });
}

function fireQuizEmailSubmit(
  path: "A" | "B",
  scoreRange: string,
  resultSegment: string
) {
  trackLead("quiz");
  trackCustom("QuizEmailSubmit", {
    content_name: resultSegment,
    content_category: `path_${path.toLowerCase()}`,
    path: `path_${path.toLowerCase()}`,
    score_range: scoreRange,
    result_segment: resultSegment,
  });
}

function fireQuizEmailSkip(path: "A" | "B", scoreRange: string) {
  trackCustom("QuizEmailSkip", {
    content_category: `path_${path.toLowerCase()}`,
    path: `path_${path.toLowerCase()}`,
    score_range: scoreRange,
  });
}

function fireQuizComplete(
  path: "A" | "B",
  finalScore: number,
  resultSegment: string,
  productRecommended: string
) {
  trackCustom("QuizComplete", {
    content_name: resultSegment,
    content_category: `path_${path.toLowerCase()}`,
    value: finalScore,
    path: `path_${path.toLowerCase()}`,
    result_segment: resultSegment,
    product_recommended: productRecommended,
  });
  trackViewContent("Quiz Results", `path_${path.toLowerCase()}`);
}

// ─── Reusable Components ───

function EducationDrawer({
  why,
  education,
  isOpen,
  onToggle,
}: {
  why: string;
  education: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
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
            background: isOpen ? "#1A1410" : "rgba(180,160,130,0.15)",
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
          <span
            style={{
              fontWeight: 400,
              textTransform: "none",
              marginLeft: 6,
              color: "#aaa",
            }}
          >
            Tap to learn more
          </span>
        </span>
      </button>
      <div
        style={{
          maxHeight: isOpen ? 300 : 0,
          overflow: "hidden",
          transition:
            "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
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
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
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

function ProgressDots({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        justifyContent: "center",
        marginBottom: 32,
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 24 : 8,
            height: 8,
            borderRadius: 100,
            background: i <= current ? "#CAFF4B" : "rgba(26,20,16,0.12)",
            opacity: i < current ? 0.5 : 1,
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      ))}
    </div>
  );
}

function ScoreMeter({
  score,
  max,
  label,
}: {
  score: number;
  max: number;
  label: string;
}) {
  const pct = Math.min((score / max) * 100, 100);
  const color =
    pct <= 35 ? "#3B6D11" : pct <= 65 ? "#BA7517" : "#A32D2D";
  return (
    <div style={{ margin: "24px 0 8px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            fontWeight: 600,
            color: "#999",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Your Score
        </span>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: color,
          }}
        >
          {score} / {max} — {label}
        </span>
      </div>
      <div
        style={{
          height: 6,
          background: "rgba(26,20,16,0.08)",
          borderRadius: 100,
          overflow: "hidden",
        }}
      >
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
  // State
  const [path, setPath] = useState<"A" | "B" | null>(null);
  const [step, setStep] = useState(0);
  // step 0 = welcome/landing
  // step 1..N = questions (N depends on path)
  // step N+1 = email gate
  // step N+2 = analyzing
  // step N+3 = results
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [eduOpen, setEduOpen] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [analyzePhase, setAnalyzePhase] = useState(0);
  const [isSubscription, setIsSubscription] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [recapOpen, setRecapOpen] = useState(false);

  const questions = path === "A" ? pathAQuestions : pathBQuestions;
  const totalQuestions = questions.length;
  const isQuestion = step >= 1 && step <= totalQuestions;
  const currentQ = isQuestion ? questions[step - 1] : null;

  // Get result based on path
  const result =
    path === "A" ? getPathAResults(answers) : getPathBResults(answers);

  // Running score
  const runningScore = Object.entries(answers).reduce((sum, [qId, val]) => {
    const q = questions.find((q) => q.id === qId);
    const opt = q?.options.find((o) => o.value === val);
    return sum + (opt?.score || 0);
  }, 0);

  // Animate on step change
  useEffect(() => {
    setAnimKey((k) => k + 1);
    setEduOpen(false);
  }, [step]);

  // Analyzing animation
  useEffect(() => {
    if (step === totalQuestions + 2) {
      setAnalyzePhase(0);
      const t1 = setTimeout(() => setAnalyzePhase(1), 1000);
      const t2 = setTimeout(() => setAnalyzePhase(2), 2200);
      const t3 = setTimeout(() => {
        const productNames = result.products.map((p) => p.tag).join(", ");
        fireQuizComplete(path!, result.score, result.segment, productNames);
        setStep(totalQuestions + 3);
      }, 3200);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [step, totalQuestions]);

  const handlePathSelect = (p: "A" | "B") => {
    setPath(p);
    fireQuizStart(p);
    setStep(1);
  };

  const handleSelect = (value: string) => setSelected(value);

  const handleNext = () => {
    if (isQuestion && selected && currentQ) {
      const newAnswers = { ...answers, [currentQ.id]: selected };
      setAnswers(newAnswers);
      // Calculate running score with new answer
      const newScore = Object.entries(newAnswers).reduce((sum, [qId, val]) => {
        const q = questions.find((q) => q.id === qId);
        const opt = q?.options.find((o) => o.value === val);
        return sum + (opt?.score || 0);
      }, 0);
      fireQuizAnswer(path!, currentQ.id, selected, newScore);
      setSelected(null);
    }
    if (step === totalQuestions + 1) {
      // Email step
      if (email.includes("@")) {
        fireQuizEmailSubmit(path!, result.scoreRange, result.segment);
        // Determine Klaviyo tags
        const tags: string[] = [`path_${path!.toLowerCase()}`];
        if (path === "A") {
          if (result.segment === "Low Risk") tags.push("risk_low");
          else if (result.segment === "Moderate Risk") tags.push("risk_moderate");
          else tags.push("risk_high");
        } else {
          if (result.segment === "Mild") tags.push("severity_mild");
          else if (result.segment === "Moderate") tags.push("severity_moderate");
          else tags.push("severity_severe");
        }
        const productRec = result.products.map((p) => p.tag).join(", ");
        fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            firstName,
            tags,
            properties: {
              quiz_path: path,
              quiz_result: result.segment,
              quiz_score: result.score,
              score_range: result.scoreRange,
              product_recommended: productRec,
              quiz_completed: true,
              quiz_skipped_email: false,
            },
          }),
        }).catch(() => {});
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
    if (step === 1) {
      // Go back to path selection
      setPath(null);
      setAnswers({});
      setSelected(null);
      setStep(0);
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  };

  const handleEmailSkip = () => {
    fireQuizEmailSkip(path!, result.scoreRange);
    // Fire Klaviyo with skip tag
    if (email.includes("@")) {
      fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          properties: {
            quiz_path: path,
            quiz_skipped_email: true,
          },
        }),
      }).catch(() => {});
    }
    setStep(totalQuestions + 2);
  };

  // Cart line builder based on result
  const getCartLines = () => {
    const numProducts = result.products.length;
    if (numProducts === 3) {
      // Use bundle
      return isSubscription
        ? [{ merchandiseId: VARIANTS.BUNDLE, quantity: 1, sellingPlanId: SELLING_PLANS.BUNDLE_MONTHLY }]
        : [{ merchandiseId: VARIANTS.BUNDLE, quantity: 1 }];
    } else if (numProducts === 2) {
      // Vitamin C + Dark Spot Bundle
      return isSubscription
        ? [{ merchandiseId: VARIANTS.BUNDLE_2, quantity: 1, sellingPlanId: SELLING_PLANS.BUNDLE_2_MONTHLY }]
        : [{ merchandiseId: VARIANTS.BUNDLE_2, quantity: 1 }];
    } else {
      // Vitamin C only
      return [{ merchandiseId: VARIANTS.VITAMIN_C, quantity: 1 }];
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAF7F2",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
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
          background: #F2EBE0;
          border: 2px solid transparent;
          border-radius: 14px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          text-align: left;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          position: relative;
          overflow: hidden;
          min-height: 48px;
        }
        .opt-btn:hover {
          background: #E8DDD0;
          transform: translateY(-1px);
        }
        .opt-btn.active {
          border-color: #CAFF4B;
          background: #E8DDD0;
        }

        .radio-outer {
          width: 22px; height: 22px; border-radius: 50%;
          border: 2px solid rgba(26,20,16,0.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: all 0.25s ease;
        }
        .opt-btn.active .radio-outer {
          border-color: #CAFF4B;
          background: #CAFF4B;
        }
        .radio-inner {
          width: 7px; height: 7px; border-radius: 50%;
          background: #1A1410;
          transform: scale(0);
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .opt-btn.active .radio-inner { transform: scale(1); }

        .primary-btn {
          background: #CAFF4B;
          color: #1A1410;
          border: none;
          padding: 18px 48px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(202,255,75,0.3);
        }
        .primary-btn:disabled {
          background: rgba(26,20,16,0.08);
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
          border: 1px solid rgba(26,20,16,0.06);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 12px;
          transition: all 0.2s ease;
        }

        input::placeholder { color: #bbb; }
        input:focus { outline: none; border-color: #CAFF4B !important; }

        .path-btn {
          flex: 1;
          background: #CAFF4B;
          color: #1A1410;
          border: none;
          border-radius: 16px;
          padding: 28px 24px;
          cursor: pointer;
          text-align: left;
          transition: all 0.25s ease;
          min-width: 240px;
        }
        .path-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(202,255,75,0.3);
        }
      `}</style>

      {/* ─── Nav ─── */}
      <nav
        style={{
          padding: "16px 28px",
          background: "rgba(250,247,242,0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(26,20,16,0.05)",
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
              color: "#1A1410",
              letterSpacing: "0.12em",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            DARK
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#8a7a66",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            skin assessment
          </span>
        </div>
        <a
          href="/"
          className="ghost-btn"
          style={{
            fontSize: 12,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
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
        <div
          key={animKey}
          className="fade-up"
          style={{ maxWidth: 600, width: "100%", margin: "0 auto" }}
        >
          {/* ═══ STEP 0 — WELCOME / 75% SCREEN ═══ */}
          {step === 0 && !path && (
            <div style={{ textAlign: "center", padding: "32px 0 20px" }}>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#8a7a66",
                  marginBottom: 24,
                }}
              >
                DARK Skin Assessment
              </p>

              <h1
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 38,
                  fontWeight: 700,
                  color: "#1A1410",
                  margin: "0 0 20px",
                  lineHeight: 1.15,
                  letterSpacing: "-0.01em",
                }}
              >
                Up to 75% of Black women will develop hyperpigmentation in their lifetime.
              </h1>

              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 16,
                  color: "#777",
                  lineHeight: 1.7,
                  maxWidth: 480,
                  margin: "0 auto 40px",
                }}
              >
                Most don&apos;t know they&apos;re already showing early signs. Some don&apos;t know they&apos;re at risk until it&apos;s harder to treat. This assessment was built to tell you exactly where you stand &mdash; in 60 seconds.
              </p>

              {/* Two Path Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  justifyContent: "center",
                  flexWrap: "wrap",
                  marginBottom: 48,
                }}
              >
                <button
                  className="path-btn"
                  onClick={() => handlePathSelect("A")}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: 17,
                      fontWeight: 700,
                      marginBottom: 6,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    I don&apos;t have dark spots yet
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 500,
                      opacity: 0.7,
                    }}
                  >
                    Find out if you&apos;re at risk
                  </span>
                </button>

                <button
                  className="path-btn"
                  onClick={() => handlePathSelect("B")}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: 17,
                      fontWeight: 700,
                      marginBottom: 6,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    I already have dark spots
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 500,
                      opacity: 0.7,
                    }}
                  >
                    Find out how severe it is
                  </span>
                </button>
              </div>

              {/* Trust Badges */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 28,
                  flexWrap: "wrap",
                }}
              >
                {[
                  "Clinically modeled questions",
                  "Built for melanin-rich skin",
                  "Results in 60 seconds",
                  "Used by 500+ women",
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: "#aaa",
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    <span style={{ color: "#8a7a66", fontSize: 10 }}>&#10003;</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ QUESTIONS ═══ */}
          {isQuestion && currentQ && (
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#8a7a66",
                  marginBottom: 10,
                  textAlign: "center",
                }}
              >
                Question {step} of {totalQuestions}
              </p>

              <h2
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#1A1410",
                  margin: "0 0 6px",
                  lineHeight: 1.2,
                  textAlign: "center",
                }}
              >
                {currentQ.question}
              </h2>

              <p
                style={{
                  fontSize: 14,
                  color: "#aaa",
                  textAlign: "center",
                  margin: "0 0 28px",
                  fontWeight: 400,
                }}
              >
                {currentQ.subtitle}
              </p>

              {/* Options */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                {currentQ.options.map((opt, i) => (
                  <button
                    key={opt.value}
                    className={`opt-btn fade-up stagger-${i + 1} ${
                      selected === opt.value ? "active" : ""
                    }`}
                    onClick={() => handleSelect(opt.value)}
                  >
                    <div className="radio-outer">
                      <div className="radio-inner" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: "#1A1410",
                        }}
                      >
                        {opt.label}
                      </div>
                    </div>
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

              {/* Running score */}
              {Object.keys(answers).length > 0 && (
                <div style={{ opacity: 0.5, marginBottom: 24 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#bbb",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      Running score
                    </span>
                    <span
                      style={{ fontSize: 12, fontWeight: 600, color: "#999" }}
                    >
                      {runningScore} so far
                    </span>
                  </div>
                  <div
                    style={{
                      height: 3,
                      background: "rgba(26,20,16,0.06)",
                      borderRadius: 100,
                      marginTop: 6,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${(runningScore / (path === "A" ? 16 : 20)) * 100}%`,
                        height: "100%",
                        background:
                          "linear-gradient(90deg, #b4a082, #8a7a66)",
                        borderRadius: 100,
                        transition:
                          "width 0.8s cubic-bezier(0.22,1,0.36,1)",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Nav buttons */}
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <button className="ghost-btn" onClick={handleBack}>
                  Back
                </button>
                <button
                  className="primary-btn"
                  onClick={handleNext}
                  disabled={!selected}
                >
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
                  background: "rgba(202,255,75,0.2)",
                  margin: "0 auto 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  color: "#3B6D11",
                }}
              >
                ✓
              </div>

              <h2
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 30,
                  fontWeight: 700,
                  color: "#1A1410",
                  margin: "0 0 12px",
                }}
              >
                Your results are ready.
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: "#888",
                  lineHeight: 1.6,
                  maxWidth: 400,
                  margin: "0 auto 32px",
                }}
              >
                Enter your email and we&apos;ll send your personalized skin assessment &mdash; plus the exact routine built for where your skin is right now.
              </p>

              <div style={{ maxWidth: 380, margin: "0 auto" }}>
                <input
                  type="text"
                  placeholder="Your name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "16px 20px",
                    borderRadius: 12,
                    border: "2px solid rgba(26,20,16,0.08)",
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
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "16px 20px",
                    borderRadius: 12,
                    border: "2px solid rgba(26,20,16,0.08)",
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
                  style={{ width: "100%", fontSize: 15 }}
                >
                  See my results →
                </button>
              </div>

              <button
                className="ghost-btn"
                onClick={handleEmailSkip}
                style={{ marginTop: 16, fontSize: 12 }}
              >
                Skip for now
              </button>
            </div>
          )}

          {/* ═══ ANALYZING ═══ */}
          {step === totalQuestions + 2 && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              {/* Warm progress bar */}
              <div
                style={{
                  width: 200,
                  height: 4,
                  background: "rgba(26,20,16,0.08)",
                  borderRadius: 100,
                  margin: "0 auto 40px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg, #CAFF4B, #3B6D11)",
                    borderRadius: 100,
                    animation: "progressFill 3.2s ease-out forwards",
                  }}
                />
              </div>

              {[
                "Mapping your melanin profile...",
                "Cross-referencing with clinical research...",
                "Building your personalized routine...",
              ].map((text, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: 15,
                    color: analyzePhase >= i ? "#555" : "#ddd",
                    transition: "color 0.4s ease",
                    margin: "0 0 14px",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontStyle: "italic",
                  }}
                >
                  {analyzePhase > i
                    ? "✓ "
                    : analyzePhase === i
                    ? "→ "
                    : ""}
                  {text}
                </p>
              ))}
            </div>
          )}

          {/* ═══ RESULTS ═══ */}
          {step === totalQuestions + 3 && (
            <div>
              {/* Score Meter */}
              <ScoreMeter
                score={result.score}
                max={result.maxScore}
                label={result.segment}
              />

              {/* Diagnosis Label */}
              <div style={{ textAlign: "center", margin: "28px 0" }}>
                <span
                  style={{
                    display: "inline-block",
                    background: "#1A1410",
                    color: "#CAFF4B",
                    padding: "6px 16px",
                    borderRadius: 100,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 16,
                  }}
                >
                  {result.badge} · {result.segment}
                </span>

                <h2
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 30,
                    fontWeight: 700,
                    color: "#1A1410",
                    margin: "0 0 12px",
                    lineHeight: 1.2,
                  }}
                >
                  {result.headline}
                </h2>
              </div>

              {/* Diagnosis Explanation */}
              <div
                className="result-card"
                style={{ padding: 28, borderRadius: 20 }}
              >
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15,
                    color: "#555",
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
                    background: "rgba(202,255,75,0.1)",
                    borderRadius: 12,
                    borderLeft: "3px solid #CAFF4B",
                    display: "flex",
                    alignItems: "baseline",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#3B6D11",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Timeline
                  </span>
                  <span style={{ fontSize: 14, color: "#555" }}>
                    <strong>{result.timeline}</strong> with consistent daily use
                  </span>
                </div>
              </div>

              {/* Recommended Routine */}
              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#1A1410",
                  margin: "32px 0 6px",
                }}
              >
                Your recommended routine
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#aaa",
                  margin: "0 0 16px",
                }}
              >
                {result.products.length} product{result.products.length > 1 ? "s" : ""} selected for your {result.segment.toLowerCase()} profile.
              </p>

              {/* Product cards */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                {result.products.map((p, i) => (
                  <div
                    key={i}
                    className={`result-card fade-up stagger-${Math.min(i + 1, 5)}`}
                    style={{
                      padding: "18px 20px",
                      display: "flex",
                      gap: 14,
                      alignItems: "center",
                      borderLeft: "3px solid #CAFF4B",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: i === 0
                          ? "linear-gradient(135deg, #FFF3E0, #FFE0B2)"
                          : i === 1
                          ? "linear-gradient(135deg, #E8EAF6, #C5CAE9)"
                          : "linear-gradient(135deg, #E8F5E9, #C8E6C9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 800,
                        color: i === 0 ? "#E65100" : i === 1 ? "#283593" : "#2E7D32",
                        letterSpacing: "0.06em",
                        flexShrink: 0,
                      }}
                    >
                      {i === 0 ? "AM" : "PM"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#1A1410",
                          margin: 0,
                        }}
                      >
                        {p.name}
                      </p>
                      <span
                        style={{
                          background: "rgba(202,255,75,0.2)",
                          color: "#3B6D11",
                          padding: "2px 8px",
                          borderRadius: 100,
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                        }}
                      >
                        DARK
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Routine rationale */}
              <div
                className="result-card"
                style={{
                  padding: "16px 20px",
                  marginBottom: 24,
                  background: "rgba(250,247,242,0.8)",
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    color: "#777",
                    lineHeight: 1.7,
                    margin: 0,
                    fontStyle: "italic",
                  }}
                >
                  {result.routineRationale}
                </p>
              </div>

              {/* Answer Recap — Accordion */}
              <div style={{ marginBottom: 24 }}>
                <button
                  onClick={() => setRecapOpen(!recapOpen)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom: "1px solid rgba(26,20,16,0.06)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#8a7a66",
                    }}
                  >
                    Your responses
                  </span>
                  <span
                    style={{
                      fontSize: 18,
                      color: "#aaa",
                      transition: "transform 0.3s ease",
                      display: "inline-block",
                      transform: recapOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    ▾
                  </span>
                </button>
                <div
                  style={{
                    maxHeight: recapOpen ? 500 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.4s ease",
                  }}
                >
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
                          borderBottom: "1px solid rgba(26,20,16,0.04)",
                        }}
                      >
                        <span style={{ fontSize: 13, color: "#999" }}>
                          {q.question}
                        </span>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#555",
                            textAlign: "right",
                            flexShrink: 0,
                            marginLeft: 12,
                          }}
                        >
                          {opt.label} (+{opt.score})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 60-Day Guarantee */}
              <div
                style={{
                  background: "rgba(202,255,75,0.08)",
                  border: "1px solid rgba(202,255,75,0.3)",
                  borderRadius: 16,
                  padding: "24px 28px",
                  textAlign: "center",
                  marginBottom: 24,
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#3B6D11",
                    margin: "0 0 8px",
                  }}
                >
                  60-Day Guarantee
                </p>
                <p
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#1A1410",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  Use it for 60 days. See real progress or get every dollar back.
                </p>
              </div>

              {/* ── Purchase Section ── */}
              <div
                style={{
                  background: "#1A1410",
                  borderRadius: 24,
                  padding: "36px 28px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(circle at 20% 50%, rgba(202,255,75,0.06) 0%, transparent 60%)",
                    pointerEvents: "none",
                  }}
                />

                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#CAFF4B",
                    margin: "0 0 12px",
                    position: "relative",
                    textAlign: "center",
                  }}
                >
                  Your system is ready
                </p>

                {/* Products included */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    marginBottom: 24,
                    position: "relative",
                  }}
                >
                  {result.products.map((p, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 14px",
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: 12,
                      }}
                    >
                      <span style={{ color: "#CAFF4B", fontSize: 14 }}>
                        ✓
                      </span>
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 14,
                          color: "rgba(255,255,255,0.7)",
                          fontWeight: 500,
                        }}
                      >
                        {p.name}
                      </span>
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 11,
                          color: "rgba(255,255,255,0.3)",
                          marginLeft: "auto",
                        }}
                      >
                        30ml
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subscribe / One-Time Toggle */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                    marginBottom: 20,
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 14,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {/* Subscribe option */}
                  <div
                    onClick={() => setIsSubscription(true)}
                    style={{
                      padding: "16px 18px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      background: isSubscription
                        ? "rgba(255,255,255,0.06)"
                        : "transparent",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          marginTop: 2,
                          border: isSubscription
                            ? "6px solid #CAFF4B"
                            : "2px solid rgba(255,255,255,0.25)",
                          background: isSubscription
                            ? "#1A1410"
                            : "transparent",
                          flexShrink: 0,
                          transition: "all 0.2s ease",
                        }}
                      />
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 4,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: 15,
                              fontWeight: 700,
                              color: "#fff",
                            }}
                          >
                            Subscribe &amp; Save
                          </span>
                          <span
                            style={{
                              background: "#CAFF4B",
                              color: "#1A1410",
                              padding: "2px 8px",
                              borderRadius: 100,
                              fontSize: 10,
                              fontWeight: 800,
                            }}
                          >
                            BEST VALUE
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: 12,
                              color: "rgba(255,255,255,0.35)",
                            }}
                          >
                            Auto-refill every 60 days
                          </span>
                          <span
                            style={{
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: 12,
                              color: "rgba(255,255,255,0.35)",
                            }}
                          >
                            Cancel or pause anytime
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 20,
                          fontWeight: 800,
                          color: "#fff",
                        }}
                      >
                        ${result.priceSub}
                      </span>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
                        /month
                      </div>
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
                      background: !isSubscription
                        ? "rgba(255,255,255,0.06)"
                        : "transparent",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          border: !isSubscription
                            ? "6px solid #CAFF4B"
                            : "2px solid rgba(255,255,255,0.25)",
                          background: !isSubscription
                            ? "#1A1410"
                            : "transparent",
                          flexShrink: 0,
                          transition: "all 0.2s ease",
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 15,
                          fontWeight: 600,
                          color: !isSubscription
                            ? "#fff"
                            : "rgba(255,255,255,0.4)",
                        }}
                      >
                        One-Time Purchase
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 18,
                        fontWeight: !isSubscription ? 800 : 500,
                        color: !isSubscription
                          ? "#fff"
                          : "rgba(255,255,255,0.4)",
                      }}
                    >
                      ${result.priceOneTime}
                    </span>
                  </div>
                </div>

                {/* Add to Cart / Checkout */}
                {!addedToCart ? (
                  <button
                    onClick={async () => {
                      setCartLoading(true);
                      const price = isSubscription
                        ? result.priceSub
                        : result.priceOneTime;
                      const productName = result.products
                        .map((p) => p.tag)
                        .join(" + ");
                      trackAddToCart(
                        isSubscription
                          ? `${productName} (Subscription)`
                          : productName,
                        price
                      );
                      try {
                        const lines = getCartLines();
                        const shopifyCart = await createCart(lines);
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
                      background: "#CAFF4B",
                      color: "#1A1410",
                      border: "none",
                      padding: "18px",
                      borderRadius: 100,
                      fontSize: 15,
                      fontWeight: 800,
                      fontFamily: "'DM Sans', sans-serif",
                      letterSpacing: "0.04em",
                      cursor: cartLoading ? "not-allowed" : "pointer",
                      position: "relative",
                      transition: "all 0.2s ease",
                      opacity: cartLoading ? 0.7 : 1,
                    }}
                  >
                    {cartLoading
                      ? "Adding…"
                      : isSubscription
                      ? `Subscribe & save — $${result.priceSub}/month`
                      : `Get my routine — $${result.priceOneTime}`}
                  </button>
                ) : (
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        width: "100%",
                        background: "#CAFF4B",
                        color: "#1A1410",
                        padding: "18px",
                        borderRadius: 100,
                        fontSize: 15,
                        fontWeight: 800,
                        fontFamily: "'DM Sans', sans-serif",
                        letterSpacing: "0.04em",
                        textAlign: "center",
                      }}
                    >
                      ✓ Added to Cart
                    </div>
                    <button
                      onClick={() => {
                        trackInitiateCheckout(
                          isSubscription
                            ? result.priceSub
                            : result.priceOneTime
                        );
                        checkoutUrl &&
                          window.location.assign(checkoutUrl);
                      }}
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 20,
                    marginTop: 16,
                    position: "relative",
                    flexWrap: "wrap",
                  }}
                >
                  {["Free shipping", "60-day guarantee", "Cancel anytime"].map(
                    (item) => (
                      <span
                        key={item}
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 11,
                          color: "rgba(255,255,255,0.3)",
                          fontWeight: 500,
                        }}
                      >
                        ✓ {item}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Brand closing line */}
              <p
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 16,
                  fontStyle: "italic",
                  color: "#999",
                  textAlign: "center",
                  marginTop: 36,
                  lineHeight: 1.6,
                }}
              >
                You didn&apos;t choose this. But you get to choose what you do next.
              </p>

              {/* Disclaimer */}
              <p
                style={{
                  fontSize: 11,
                  color: "#ccc",
                  textAlign: "center",
                  marginTop: 16,
                  lineHeight: 1.6,
                }}
              >
                This assessment is for educational purposes and does not replace
                professional medical advice.
                <br />
                Results vary by individual. Consult a dermatologist for persistent
                conditions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
