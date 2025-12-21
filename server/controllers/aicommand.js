import fetch from "node-fetch";

/**
 * POST /api/ai-recommend
 * Body:
 * {
 *   preferences: { ... },
 *   watchlist: []
 * }
 */
export const aiRecommend = async (req, res) => {
  const { preferences, watchlist } = req.body;

  if (!preferences) {
    return res.status(400).json({ recommendations: [] });
  }

  console.log("[AI] Request received");

  try {
    const aiRecommendations = await askGroq(preferences);

    if (
      Array.isArray(aiRecommendations) &&
      aiRecommendations.length > 0
    ) {
      return res.json({ recommendations: aiRecommendations });
    }

    throw new Error("Groq returned empty result");
  } catch (err) {
    console.error("[AI] Groq failed — fallback engaged");
    console.error(err.message);

    try {
      const fallback = await tmdbFallback(preferences);
      return res.json({ recommendations: fallback });
    } catch (fallbackErr) {
      console.error("[AI] TMDB fallback failed");
      return res.json({ recommendations: [] });
    }
  }
};

/* ---------------- GROQ AI ---------------- */

async function askGroq(preferences) {
  console.log("[AI] Groq request received");

  const prompt = buildPrompt(preferences);

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content:
              "You are a movie recommendation engine. Return ONLY valid JSON in this exact format: { \"recommendations\": [\"Movie Title\", \"Movie Title\"] }",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    }
  );

  const rawText = await response.text();

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    console.error("[Groq RAW RESPONSE]", rawText);
    throw new Error("Groq JSON parse failed");
  }

  const content = parsed?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Groq returned no content");
  }

  let finalJson;
  try {
    finalJson = JSON.parse(content);
  } catch {
    console.error("[Groq CONTENT INVALID JSON]", content);
    throw new Error("Groq content JSON invalid");
  }

  if (!Array.isArray(finalJson.recommendations)) {
    throw new Error("Groq response missing recommendations array");
  }

  return finalJson.recommendations;
}

/* ---------------- TMDB FALLBACK ---------------- */

async function tmdbFallback(preferences) {
  console.log("[AI] Using TMDB fallback");

  const genreMap = {
    "Action / Thriller": 28,
    "Drama / Romance": 18,
    "Sci-Fi / Fantasy": 878,
    Comedy: 35,
  };

  const genreId = genreMap[preferences.genres] || 28;

  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${
    process.env.TMDB_API_KEY
  }&with_genres=${genreId}&sort_by=popularity.desc`;

  const res = await fetch(url);
  const data = await res.json();

  if (!Array.isArray(data.results)) return [];

  return data.results.slice(0, 10);
}

/* ---------------- PROMPT BUILDER ---------------- */

function buildPrompt(prefs) {
  return `
User movie preferences:
- Mood: ${prefs.mood}
- Genres: ${prefs.genres}
- Pace: ${prefs.pace}
- Emotional weight: ${prefs.emotionalWeight}
- Familiarity: ${prefs.familiarity}
- Subtitles OK: ${prefs.subtitles}
- Desired ending feeling: ${prefs.endingFeeling}

Recommend 8–10 movies that best match these preferences.
Return ONLY valid JSON.
`;
}
