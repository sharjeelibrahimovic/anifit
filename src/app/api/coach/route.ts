import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-5.6-luna",
      messages: [
        {
          role: "system",
          content:
            "You are an energetic anime-style fitness coach. Keep responses short, motivating, and practical. Use light anime/shonen-style hype language occasionally, but stay genuinely helpful about fitness and nutrition.",
        },
        ...messages,
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json({ error: data }, { status: 500 });
  }

  const reply = data.choices[0].message.content;
  return NextResponse.json({ reply });
}