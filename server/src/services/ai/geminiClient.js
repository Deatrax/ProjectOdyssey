const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

async function callGemini({ system, user}) {
  if (!GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY in .env");

  const prompt = `
SYSTEM:
${system}

USER:
${typeof user === "string" ? user : JSON.stringify(user)}
`.trim();

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!resp.ok) throw new Error(`Gemini error ${resp.status}: ${await resp.text()}`);

  const data = await resp.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Gemini did not return valid JSON. Raw:\n" + text);
  }
}

module.exports = { callGemini };
