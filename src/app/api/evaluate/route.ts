import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const EVALUATION_PROMPT = `Tu es un formateur expert en vente de services de conciergerie locative au Maroc.

On te donne la transcription d'un appel de prospection roleplay entre un commercial (USER) et un propriétaire (ASSISTANT).

Tu dois évaluer le commercial sur 7 critères. Sois juste mais bienveillant — même un court appel mérite une évaluation honnête basée sur ce qui a été dit.

CRITÈRES ET BARÈMES:
1. SCORE DÉCOUVERTE & ÉCOUTE: /15 — A-t-il posé des questions? Écouté les réponses?
2. SCORE GESTION DES OBJECTIONS: /15 — A-t-il traité les résistances du propriétaire?
3. SCORE CONNAISSANCE PRODUIT: /15 — A-t-il démontré une expertise sur la conciergerie/Airbnb/location?
4. SCORE PROPOSITION DE VALEUR: /15 — A-t-il présenté une offre claire et attractive?
5. SCORE CRÉATION DE CONFIANCE: /15 — A-t-il créé du rapport, mis en confiance?
6. SCORE GESTION DU RYTHME: /10 — Le rythme était-il bon? Pas trop rapide ni trop lent?
7. SCORE CLOSING & RÉSILIENCE: /15 — A-t-il tenté de conclure ou proposé un prochain pas?

RÈGLES D'ÉVALUATION:
- Si l'appel est court (< 5 échanges), note proportionnellement à ce qui a été fait
- Un appel court mais avec un bon début = au moins 3-5/15 sur les critères abordés
- Ne mets 0 que si le critère n'a VRAIMENT pas été abordé du tout
- Un simple "bonjour, je vous appelle de ConciergElite" = au moins 2 en confiance et 2 en produit

RÉPONDS EXACTEMENT DANS CE FORMAT (sans markdown, juste le texte brut):

SCORE DÉCOUVERTE & ÉCOUTE: [X]
SCORE GESTION DES OBJECTIONS: [X]
SCORE CONNAISSANCE PRODUIT: [X]
SCORE PROPOSITION DE VALEUR: [X]
SCORE CRÉATION DE CONFIANCE: [X]
SCORE GESTION DU RYTHME: [X]
SCORE CLOSING & RÉSILIENCE: [X]
SCORE TOTAL: [X]

POINTS FORTS:
[2-3 points forts observés dans l'appel]

AXES D'AMÉLIORATION:
[2-3 axes concrets d'amélioration]

CONSEIL PRINCIPAL:
[Un conseil actionnable pour le prochain appel]`;

export async function POST(request: Request) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { transcript, profileName } = body;

    if (!transcript || typeof transcript !== 'string' || transcript.trim().length < 20) {
      return NextResponse.json(
        { error: 'Transcript too short to evaluate' },
        { status: 400 }
      );
    }

    const userPrompt = `Voici la transcription de l'appel avec le propriétaire "${profileName || 'inconnu'}":\n\n${transcript}\n\nÉvalue ce commercial maintenant.`;

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${EVALUATION_PROMPT}\n\n${userPrompt}` }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[Evaluate] Gemini API error:', response.status, errText);
      return NextResponse.json(
        { error: `Gemini API error: ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const evaluationText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!evaluationText) {
      return NextResponse.json(
        { error: 'Empty response from Gemini' },
        { status: 502 }
      );
    }

    return NextResponse.json({ evaluation: evaluationText });
  } catch (err: any) {
    console.error('[Evaluate] Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal error' },
      { status: 500 }
    );
  }
}
