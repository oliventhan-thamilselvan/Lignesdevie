import type { Context, Config } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.json();
    const { dream } = body;

    // Validation
    if (!dream || typeof dream !== 'string') {
      return new Response(JSON.stringify({
        response: "Veuillez écrire votre rêve.",
        error: "Dream text missing"
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const trimmedDream = dream.trim();
    if (trimmedDream.length < 2) {
      return new Response(JSON.stringify({
        response: "Écrivez un rêve un peu plus long.",
        error: "Dream too short"
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get OpenAI API Key from environment
    const OPENAI_API_KEY = Netlify.env.get('OPENAI_API_KEY');

    // Fallback responses if no API key
    if (!OPENAI_API_KEY) {
      const fallbackResponses = [
        `"${trimmedDream}" est un beau rêve. Chaque jour qui passe le rapproche un peu plus de toi.`,
        `Je ressens beaucoup d'authenticité dans ton rêve de "${trimmedDream}". C'est prometteur.`,
        `"${trimmedDream}" n'est pas qu'une idée, c'est une direction que ton âme a choisie.`,
        `Ton ambition pour "${trimmedDream}" est comme une graine. Arrose-la avec patience et foi.`,
        `"${trimmedDream}" résonne avec force. C'est le signe d'un chemin qui veut être parcouru.`,
      ];

      const response = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

      return new Response(JSON.stringify({
        response: response,
        source: 'fallback-no-api-key',
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Tu es un coach de vie poétique et inspirant français.
            Réponds AU MAXIMUM 2 phrases.
            Sois encourageant, profond et personnalisé.
            Fais référence au rêve mentionné.
            Ton style: poétique mais accessible, philosophique mais pratique.
            Réponds exclusivement en français.`
          },
          {
            role: 'user',
            content: `Voici mon rêve ou mon ambition : "${trimmedDream}"
            Peux-tu me donner une réponse courte et inspirante ?`
          }
        ],
        max_tokens: 120,
        temperature: 0.8,
        presence_penalty: 0.3,
        frequency_penalty: 0.3
      })
    });

    const data = await openaiResponse.json();

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${data.error?.message || openaiResponse.status}`);
    }

    const aiResponse = data.choices[0]?.message?.content?.trim();

    if (!aiResponse) {
      throw new Error('OpenAI returned empty response');
    }

    return new Response(JSON.stringify({
      response: aiResponse,
      source: 'openai-gpt-3.5-turbo',
      timestamp: new Date().toISOString(),
      tokens: data.usage?.total_tokens
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    // Elegant error response
    const errorResponses = [
      `Ton rêve est valide même quand les étoiles clignotent. Continue d'y croire.`,
      `Parfois, le silence des machines laisse plus de place à la voix du cœur. Ton rêve est entendu.`,
      `Même sans réponse magique, ton aspiration reste réelle et précieuse.`,
    ];

    const selectedResponse = errorResponses[Math.floor(Math.random() * errorResponses.length)];

    return new Response(JSON.stringify({
      response: selectedResponse,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'error-fallback',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config: Config = {
  path: "/api/dream"
};
