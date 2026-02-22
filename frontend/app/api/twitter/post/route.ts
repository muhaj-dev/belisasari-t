import { NextRequest, NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

export const dynamic = "force-dynamic";

function getTwitterClient(): TwitterApi | null {
  const appKey =
    process.env.TWITTER_API_KEY ||
    process.env.TWITTER_CONSUMER_KEY ||
    process.env.NEXT_PUBLIC_TWITTER_CONSUMER_KEY;
  const appSecret =
    process.env.TWITTER_API_SECRET ||
    process.env.TWITTER_CONSUMER_SECRET ||
    process.env.NEXT_PUBLIC_TWITTER_CONSUMER_SECRET;
  const accessToken =
    process.env.TWITTER_ACCESS_TOKEN ||
    process.env.ZORO_ACCESS_TOKEN ||
    process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN;
  const accessSecret =
    process.env.TWITTER_ACCESS_TOKEN_SECRET ||
    process.env.ZORO_ACCESS_TOKEN_SECRET ||
    process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN_SECRET;
  if (!appKey || !appSecret || !accessToken || !accessSecret) return null;
  return new TwitterApi({
    appKey,
    appSecret,
    accessToken,
    accessSecret,
  });
}

/** POST /api/twitter/post - Post a tweet (body: { text: string } or { message: string }). */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const text =
      typeof body.text === "string"
        ? body.text
        : typeof body.message === "string"
          ? body.message
          : null;
    if (!text || text.length > 280) {
      return NextResponse.json(
        { error: "Body must include 'text' or 'message' (max 280 chars)" },
        { status: 400 }
      );
    }

    const client = getTwitterClient();
    if (!client) {
      return NextResponse.json(
        {
          error:
            "Twitter not configured. Set TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET (or NEXT_PUBLIC_* / ZORO_* / CONSUMER_*).",
        },
        { status: 503 }
      );
    }

    const tweet = await client.v2.tweet(text.slice(0, 280));
    return NextResponse.json({
      success: true,
      id: tweet.data?.id,
      text: text.slice(0, 280),
    });
  } catch (e: unknown) {
    console.error("Twitter post error:", e);
    const err = e as { code?: number; rateLimit?: { reset?: number }; message?: string };
    const status = err.code === 429 ? 429 : 500;
    return NextResponse.json(
      {
        error: err.message || "Failed to post tweet",
        rateLimitReset: err.rateLimit?.reset,
      },
      { status }
    );
  }
}
