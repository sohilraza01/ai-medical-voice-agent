import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, sessionDetail, sessionId } = await req.json();

    const conversationText = (messages || [])
      .map((m: { role: string; text: string }) => `${m.role}: ${m.text}`)
      .join("\n");

    const reportPrompt = `You are an AI Medical Voice Agent that just finished a voice conversation with a user. Based on the transcript, generate a structured report with the following fields:
1. sessionId: a unique session identifier
2. agent: the medical specialist name (e.g., "General Physician AI")
3. user: name of the patient or "Anonymous" if not provided
4. timestamp: current date and time in ISO format
5. chiefComplaint: one-sentence summary of the main health concern
6. summary: a 2-3 sentence summary of the conversation, symptoms, and recommendations
7. symptoms: list of symptoms mentioned by the user
8. duration: how long the user has experienced the symptoms
9. severity: mild, moderate, or severe
10. medicationsMentioned: list of any medicines mentioned
11. recommendations: list of AI suggestions (e.g., rest, see a doctor)

Return the result in this JSON format:
{
  "sessionId": "string",
  "agent": "string",
  "user": "string",
  "timestamp": "ISO Date string",
  "chiefComplaint": "string",
  "summary": "string",
  "symptoms": ["symptom1", "symptom2"],
  "duration": "string",
  "severity": "string",
  "medicationsMentioned": ["med1", "med2"],
  "recommendations": ["rec1", "rec2"]
}
Only include valid fields. Respond with nothing else.

Specialist: ${sessionDetail?.selectedDoctor?.specialist || "General Physician"}
sessionId: ${sessionId}

Conversation transcript:
${conversationText}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: reportPrompt }],
        response_format: { type: "json_object" },
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq report error:", errText);
      return NextResponse.json({ error: "Report generation failed" }, { status: 500 });
    }

    const data = await response.json();
    const reportText = data?.choices?.[0]?.message?.content || "{}";
    const report = JSON.parse(reportText);

    // TODO: yahan DB mein save karna hai
    const result = await db.update(SessionChatTable).set({
        report:report,
        conversion:messages
    }).where(eq(SessionChatTable.sessionId,sessionId));

    return NextResponse.json(report);
  } catch (error) {
    console.error("medical-report API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}