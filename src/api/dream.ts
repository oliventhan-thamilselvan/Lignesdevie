// src/api/dream.ts - Client-side API caller
export async function getAIDreamResponse(dream: string): Promise<string> {
  try {
    const response = await fetch('/api/dream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dream }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error calling AI API:', error);
    // Retournez une réponse par défaut
    const fallbackResponses = [
      "Ton rêve est une graine. Arrose-le chaque jour.",
      "Les étoiles ne brillent que dans l'obscurité. Ton rêve aussi.",
      "Chaque grand voyage commence par un simple pas.",
      "Crois en toi comme tu crois en ton rêve.",
    ];
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
}