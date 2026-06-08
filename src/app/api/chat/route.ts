import { NextRequest } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;

const SYSTEM_PROMPT = `You are an intelligent AI assistant embedded in a SaaS analytics dashboard called "Nexus Analytics".
You have deep knowledge of SaaS metrics, growth strategies, and data analysis.

Current dashboard context:
- MRR: $98,400 (↑7.2% vs last month)
- ARR: $1,180,800
- Active Users: 3,280 (↑11.1%)
- New Signups this month: 340
- Churn Rate: 3.7% (↓0.4% improvement)
- Conversion Rate: 4.2%
- Revenue grew from $42K in January to $98.4K in December
- Plan distribution: Starter 38%, Pro 31%, Business 21%, Enterprise 10%
- Top traffic source: Organic Search (12,840 visitors, 3.2% conversion)
- Most growing feature: AI Assistant (43% usage, +34% trend)

CRITICAL LANGUAGE RULE:
- Detect the language of the user's message
- If the user writes in Persian (Farsi), you MUST respond ONLY in Persian (Farsi) — never in Arabic
- If the user writes in English, respond in English
- If the user writes in any other language, respond in that language
- Persian and Arabic are different languages — always use Persian script and vocabulary when responding in Persian

Be concise, data-driven, and actionable. Provide specific insights based on the metrics above.
When relevant, suggest specific actions the user can take to improve their SaaS metrics.
Keep responses focused and under 200 words unless asked for detailed analysis.`;

type MessageRole = "user" | "assistant";

interface ChatMessage {
  role: MessageRole;
  content: string;
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function validateMessages(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages)) throw new ValidationError("messages must be an array");
  if (messages.length === 0) throw new ValidationError("messages array cannot be empty");
  if (messages.length > MAX_MESSAGES)
    throw new ValidationError(`messages array cannot exceed ${MAX_MESSAGES} items`);

  return messages.map((m, i) => {
    if (typeof m !== "object" || m === null)
      throw new ValidationError(`message at index ${i} must be an object`);

    const { role, content } = m as Record<string, unknown>;

    if (role !== "user" && role !== "assistant")
      throw new ValidationError(`message at index ${i} has invalid role`);

    if (typeof content !== "string" || content.trim().length === 0)
      throw new ValidationError(`message at index ${i} has invalid or empty content`);

    if (content.length > MAX_MESSAGE_LENGTH)
      throw new ValidationError(
        `message at index ${i} exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`
      );

    return { role, content: content.trim() };
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let messages: ChatMessage[];
    try {
      messages = validateMessages(body.messages);
    } catch (err) {
      if (err instanceof ValidationError) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      throw err;
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error("[chat/route] GROQ_API_KEY is not configured");
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const groqResponse = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 500,
        temperature: 0.7,
        stream: true,
      }),
    });

    if (!groqResponse.ok || !groqResponse.body) {
      const errorData = await groqResponse.json().catch(() => ({}));
      console.error("[chat/route] Groq API error:", {
        status: groqResponse.status,
        error: errorData,
      });
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    // Pipe Groq SSE → plain text stream to client
    const stream = new ReadableStream({
      async start(controller) {
        const reader = groqResponse.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const jsonStr = line.slice(6).trim();
              if (!jsonStr || jsonStr === "[DONE]") continue;

              try {
                const parsed = JSON.parse(jsonStr);
                const delta = parsed?.choices?.[0]?.delta?.content;
                if (delta) {
                  controller.enqueue(new TextEncoder().encode(delta));
                }
              } catch {
                // skip malformed chunks
              }
            }
          }
        } catch (err) {
          console.error("[chat/route] Stream read error:", err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[chat/route] Unhandled error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}