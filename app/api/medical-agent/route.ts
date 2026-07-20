import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { agentPrompt, messages } = await req.json();

  const conversationMessages = [
  { role: "system", content: agentPrompt || "You are a helpful medical AI assistant." },
  ...(messages || []).map((m: { role: string; text: string }) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: m.text || "",
  })),
];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: conversationMessages,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq error:", errText);
      return NextResponse.json({ error: "AI response failed" }, { status: 500 });
    }

    const data = await response.json();
    const aiText = data?.choices?.[0]?.message?.content || "Sorry, I couldn't respond right now.";

    return NextResponse.json({ response: aiText });
  } catch (error) {
    console.error("medical-agent API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}