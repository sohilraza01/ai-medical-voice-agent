import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { agentPrompt, messages } = await req.json();

    const conversationText = messages
      ?.map((m: { role: string; text: string }) => `${m.role}: ${m.text}`)
      .join("\n") || "";

    const prompt = `${agentPrompt}

Conversation so far:
${conversationText}

Respond as the doctor AI in 1-2 short, natural sentences. Do not repeat the role labels.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini error:", errText);
      return NextResponse.json({ error: "AI response failed" }, { status: 500 });
    }

    const data = await response.json();
    const aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't respond right now.";

    return NextResponse.json({ response: aiText });
  } catch (error) {
    console.error("medical-agent API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}