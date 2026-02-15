import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API Key is missing. Please set it in .env' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    }, { apiVersion: 'v1' });

    const { topic, platform, tone, contentType, slideCount, duration } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    let specificContext = '';
    if (platform === 'instagram') {
      if (contentType === 'carousel') {
        specificContext = `This is a CAROUSEL content with exactly ${slideCount} slides. Provide a script/content for EACH slide clearly in point-form.`;
      } else {
        specificContext = `This is a REELS content with a duration of approx ${duration} seconds. Focus on fast-paced, high-engagement hooks and script.`;
      }
    }

    const prompt = `
      You are an expert marketing content creator for social media.
      Create high-converting content for ${platform} about "${topic}" using the AIDA formula.
      The tone should be ${tone}.
      ${specificContext}

      Respond ONLY with a valid JSON in the following format:
      {
        "title_suggestions": ["3 catchy titles"],
        "aida_script": {
          "attention": ["3 scroll-stopping hooks"],
          "interest": "Building empathy/interest points.",
          "desire": ["Key solution points"],
          "action": "Clear CTA"
        },
        "content_plan": [
           "Point-by-point content for the video or slides",
           "Next point..."
        ],
        "metadata": {
          "caption": "Compelling caption",
          "hashtags": ["#tag1", "#tag2"]
        }
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log('AI Response:', text);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;

    return NextResponse.json(JSON.parse(jsonStr));
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    // Extra clarity for the user
    const errorMsg = error.message || 'Failed to generate content';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

