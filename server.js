// server.js - Version COMPLÈTE et TESTÉE
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Log de démarrage
console.log('\n' + '='.repeat(50));
console.log('🚀 DÉMARRAGE DU SERVEUR BACKEND');
console.log('='.repeat(50));

// Vérification de la clé OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (OPENAI_API_KEY) {
  console.log('✅ OPENAI_API_KEY: PRÉSENTE');
  console.log('   Début:', OPENAI_API_KEY.substring(0, 15) + '...');
} else {
  console.log('❌ OPENAI_API_KEY: ABSENTE');
  console.log('   Créez un fichier .env avec: OPENAI_API_KEY=votre-clé');
}
console.log('='.repeat(50) + '\n');

// =============== ROUTES ===============

// 1. Route de santé (GET)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Dream AI Backend',
    openai: OPENAI_API_KEY ? 'configurée' : 'non configurée',
    timestamp: new Date().toISOString(),
    endpoints: ['POST /api/dream', 'GET /api/health']
  });
});

// 2. Route principale (POST)
app.post('/api/dream', async (req, res) => {
  console.log('\n📨 NOUVELLE REQUÊTE');
  console.log('   Rêve:', req.body.dream || '(vide)');
  
  try {
    const { dream } = req.body;
    
    // Validation
    if (!dream || typeof dream !== 'string') {
      return res.status(400).json({ 
        response: "Veuillez écrire votre rêve.",
        error: "Dream text missing"
      });
    }
    
    const trimmedDream = dream.trim();
    if (trimmedDream.length < 2) {
      return res.status(400).json({ 
        response: "Écrivez un rêve un peu plus long.",
        error: "Dream too short"
      });
    }
    
    // =========== OPENAI ===========
    if (!OPENAI_API_KEY) {
      console.log('⚠️  Mode fallback (pas de clé OpenAI)');
      
      const fallbackResponses = [
        `"${trimmedDream}" est un beau rêve. Chaque jour qui passe le rapproche un peu plus de toi.`,
        `Je ressens beaucoup d'authenticité dans ton rêve de "${trimmedDream}". C'est prometteur.`,
        `"${trimmedDream}" n'est pas qu'une idée, c'est une direction que ton âme a choisie.`,
        `Ton ambition pour "${trimmedDream}" est comme une graine. Arrose-la avec patience et foi.`,
        `"${trimmedDream}" résonne avec force. C'est le signe d'un chemin qui veut être parcouru.`,
      ];
      
      const response = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      return res.json({ 
        response: response,
        source: 'fallback-no-api-key',
        timestamp: new Date().toISOString()
      });
    }
    
    console.log('🔗 Appel à OpenAI en cours...');
    
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
    
    console.log('📊 OpenAI - Status:', openaiResponse.status);
    
    if (!openaiResponse.ok) {
      console.error('❌ Erreur OpenAI:', data.error || 'Unknown error');
      throw new Error(`OpenAI API error: ${data.error?.message || openaiResponse.status}`);
    }
    
    const aiResponse = data.choices[0]?.message?.content?.trim();
    
    if (!aiResponse) {
      throw new Error('OpenAI returned empty response');
    }
    
    console.log('✅ Réponse générée avec succès!');
    console.log('   ' + aiResponse.substring(0, 80) + '...');
    
    res.json({
      response: aiResponse,
      source: 'openai-gpt-3.5-turbo',
      timestamp: new Date().toISOString(),
      tokens: data.usage?.total_tokens
    });
    
  } catch (error) {
    console.error('💥 ERREUR:', error.message);
    
    // Réponse d'erreur élégante
    const errorResponses = [
      `Ton rêve est valide même quand les étoiles clignotent. Continue d'y croire.`,
      `Parfois, le silence des machines laisse plus de place à la voix du cœur. Ton rêve est entendu.`,
      `Même sans réponse magique, ton aspiration reste réelle et précieuse.`,
    ];
    
    const selectedResponse = errorResponses[Math.floor(Math.random() * errorResponses.length)];
    
    res.status(500).json({
      response: selectedResponse,
      error: error.message,
      source: 'error-fallback',
      timestamp: new Date().toISOString()
    });
  }
});

// 3. Route de test simple
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend fonctionnel!',
    version: '1.0',
    ready: true
  });
});

// =============== DÉMARRAGE ===============
app.listen(PORT, () => {
  console.log('\n' + '✨'.repeat(25));
  console.log(`   SERVEUR PRÊT`);
  console.log(`   Port: ${PORT}`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log('✨'.repeat(25));
  console.log('\n📋 ENDPOINTS DISPONIBLES:');
  console.log(`   • GET  http://localhost:${PORT}/api/health`);
  console.log(`   • GET  http://localhost:${PORT}/api/test`);
  console.log(`   • POST http://localhost:${PORT}/api/dream`);
  console.log('\n🔧 POUR TESTER:');
  console.log(`   curl -X GET http://localhost:${PORT}/api/health`);
  console.log(`   curl -X POST http://localhost:${PORT}/api/dream \\`);
  console.log(`     -H "Content-Type: application/json" \\`);
  console.log(`     -d '{"dream":"devenir astronaute"}'`);
  console.log('\n' + '='.repeat(50));
});