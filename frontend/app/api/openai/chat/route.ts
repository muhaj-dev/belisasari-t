import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

const systemPrompt = `You are Belisasari, a helpful AI assistant for memecoin trading on Solana. You help users discover trending tokens, understand portfolio and NFT data, and get market insights. Be concise, friendly, and use the context provided when relevant. Keep responses under 300 words unless the user asks for detail.`;

/** POST /api/openai/chat - Chat completion with optional context (for AI agent, portfolio insight, etc.). */
export async function POST(req: NextRequest) {
  const key = process.env.OPENAI_API_KEY;
  if (!key?.trim()) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> =
      Array.isArray(body.messages) ? body.messages : [];
    const context: string =
      typeof body.context === "string" ? body.context : "";
    const userMessage: string =
      typeof body.prompt === "string" ? body.prompt : (messages.find((m) => m.role === "user")?.content ?? "");

    const openai = new OpenAI({ apiKey: key.trim() });

    const buildMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
    ];
    if (context) {
      buildMessages.push({
        role: "user",
        content: `Context (use this to inform your answer):\n${context.slice(0, 4000)}`,
      });
      buildMessages.push({
        role: "assistant",
        content: "I have the context.",
      });
    }
    if (messages.length > 0) {
      messages.forEach((m) => {
        if (m.role && m.content) buildMessages.push({ role: m.role, content: m.content });
      });
    } else if (userMessage) {
      buildMessages.push({ role: "user", content: userMessage });
    } else {
      return NextResponse.json(
        { error: "Provide messages or prompt" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: body.model || "gpt-4o-mini",
      messages: buildMessages,
      max_tokens: 600,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content?.trim() ?? "";
    return NextResponse.json({ content, usage: completion.usage });
  } catch (e: unknown) {
    console.error("OpenAI chat error:", e);
    const err = e as { status?: number; message?: string };
    return NextResponse.json(
      { error: err.message || "OpenAI request failed" },
      { status: err.status === 429 ? 429 : 500 }
    );
  }
}
