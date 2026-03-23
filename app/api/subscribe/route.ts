import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, firstName, tags, properties } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const apiKey = process.env.KLAVIYO_API_KEY;
  const listId = process.env.KLAVIYO_LIST_ID;

  console.log("[subscribe] email:", email, "apiKey set:", !!apiKey, "listId set:", !!listId);

  if (!apiKey || !listId) {
    console.error("[subscribe] Missing KLAVIYO_API_KEY or KLAVIYO_LIST_ID env vars");
    return NextResponse.json({ error: "Missing config" }, { status: 500 });
  }

  const headers = {
    Authorization: `Klaviyo-API-Key ${apiKey}`,
    "Content-Type": "application/json",
    revision: "2024-10-15",
  };

  // Step 1: Subscribe profile to the list
  const subscribePayload = {
    data: {
      type: "profile-subscription-bulk-create-job",
      attributes: {
        profiles: {
          data: [
            {
              type: "profile",
              attributes: {
                email,
                subscriptions: {
                  email: {
                    marketing: {
                      consent: "SUBSCRIBED",
                    },
                  },
                },
              },
            },
          ],
        },
      },
      relationships: {
        list: {
          data: {
            type: "list",
            id: listId,
          },
        },
      },
    },
  };

  const subscribeRes = await fetch(
    "https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/",
    {
      method: "POST",
      headers,
      body: JSON.stringify(subscribePayload),
    }
  );

  if (!subscribeRes.ok) {
    const err = await subscribeRes.text();
    console.error("[subscribe] Klaviyo subscribe error:", err);
    return NextResponse.json({ error: "Klaviyo subscribe failed" }, { status: 500 });
  }

  // Step 2: If quiz properties provided, create/update profile with quiz data
  // and fire a "Quiz Completed" event so the Klaviyo flow triggers
  if (properties && !properties.quiz_skipped_email) {
    // Upsert profile with quiz custom properties
    const profilePayload = {
      data: {
        type: "profile",
        attributes: {
          email,
          ...(firstName && { first_name: firstName }),
          properties: {
            quiz_path: properties.quiz_path || "",
            quiz_result: properties.quiz_result || "",
            quiz_score: properties.quiz_score ?? 0,
            product_recommended: properties.product_recommended || "",
            quiz_completed: true,
            quiz_completed_at: new Date().toISOString(),
          },
        },
      },
    };

    const profileRes = await fetch(
      "https://a.klaviyo.com/api/profile-import/",
      {
        method: "POST",
        headers,
        body: JSON.stringify(profilePayload),
      }
    );

    if (!profileRes.ok) {
      const err = await profileRes.text();
      console.error("[subscribe] Klaviyo profile upsert error:", err);
      // Don't fail the whole request — subscription succeeded
    }

    // Step 3: Fire a "Quiz Completed" event to trigger the Klaviyo flow
    const eventPayload = {
      data: {
        type: "event",
        attributes: {
          metric: {
            data: {
              type: "metric",
              attributes: {
                name: "Quiz Completed",
              },
            },
          },
          profile: {
            data: {
              type: "profile",
              attributes: {
                email,
                ...(firstName && { first_name: firstName }),
              },
            },
          },
          properties: {
            quiz_path: properties.quiz_path || "",
            quiz_result: properties.quiz_result || "",
            quiz_score: properties.quiz_score ?? 0,
            product_recommended: properties.product_recommended || "",
            score_range: properties.score_range || "",
            // These help the conditional splits in your flow
            path_a_low_risk: properties.quiz_path === "A" && properties.quiz_result === "Low Risk",
            path_a_moderate_risk: properties.quiz_path === "A" && properties.quiz_result === "Moderate Risk",
            path_a_high_risk: properties.quiz_path === "A" && properties.quiz_result === "High Risk",
            path_b_mild: properties.quiz_path === "B" && properties.quiz_result === "Mild",
            path_b_moderate: properties.quiz_path === "B" && properties.quiz_result === "Moderate",
            path_b_severe: properties.quiz_path === "B" && properties.quiz_result === "Severe",
          },
          time: new Date().toISOString(),
        },
      },
    };

    const eventRes = await fetch(
      "https://a.klaviyo.com/api/events/",
      {
        method: "POST",
        headers,
        body: JSON.stringify(eventPayload),
      }
    );

    if (!eventRes.ok) {
      const err = await eventRes.text();
      console.error("[subscribe] Klaviyo event error:", err);
      // Don't fail — subscription and profile update already succeeded
    } else {
      console.log("[subscribe] Quiz Completed event fired for:", email, "result:", properties.quiz_result);
    }
  }

  return NextResponse.json({ success: true });
}
