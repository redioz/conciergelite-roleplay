# ConciergÉlite — Simulateur Roleplay Vocal IA

Simulateur d'entraînement vocal pour les équipes commerciales ConciergÉlite. Les élèves s'entraînent à convaincre des propriétaires marocains (joués par une IA vocale) de confier leur logement en gestion courte durée.

## Stack

- **Frontend** : Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Agent vocal** : Vapi.ai (Web SDK)
- **IA** : GPT-4o via Vapi
- **Voix** : ElevenLabs Multilingual v2 via Vapi
- **Transcription** : Deepgram Nova-2 (français) via Vapi

## Prérequis

- Node.js 18+
- Un compte [Vapi.ai](https://vapi.ai) avec une clé publique (`pk_xxx`)
- Vapi nécessite un compte avec des crédits (OpenAI, ElevenLabs, Deepgram sont configurés côté Vapi)

## Installation

```bash
# Cloner le projet
git clone <repo-url>
cd conciergelite-roleplay

# Installer les dépendances
npm install

# Lancer en dev
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Configuration

1. Cliquer sur l'icône ⚙️ en haut à droite
2. Entrer la clé publique Vapi (`pk_xxx...`)
3. Choisir le modèle IA et la durée d'appel
4. Les paramètres sont sauvegardés en localStorage

## Déploiement Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/VOTRE_REPO)

Ou manuellement :

```bash
npm i -g vercel
vercel
```

Pas de variables d'environnement nécessaires — tout est côté client.

## Les 3 profils

| Profil | Personnage | Difficulté |
|--------|-----------|------------|
| 🏠 Le Locatif Long Terme | Hicham, 48 ans, Marrakech | Prudent, aime la stabilité |
| 📊 L'Investisseur ROI | Karim, 35 ans, Entrepreneur | Direct, veut des chiffres |
| ❤️ L'Émotionnel Attaché | Fatima, 55 ans, Tanger | Protectrice, besoin d'empathie |

## Scoring

5 critères notés sur 20 (total /100) :
- Écoute Active
- Gestion des Objections
- Connaissance Produit
- Création de Confiance
- Technique de Closing

## Structure

```
src/
├── app/
│   ├── layout.tsx          # Layout global
│   ├── page.tsx            # Page principale (state management)
│   └── globals.css         # Styles globaux + Tailwind
├── components/
│   ├── WelcomeScreen.tsx   # Écran d'accueil + grille profils
│   ├── ProfileCard.tsx     # Carte profil individuelle
│   ├── BriefingScreen.tsx  # Briefing avant appel
│   ├── CallScreen.tsx      # Écran d'appel (timer, avatar, transcript)
│   ├── ResultsScreen.tsx   # Écran résultats (scores + feedback)
│   └── SettingsModal.tsx   # Modal configuration
├── hooks/
│   └── useVapi.ts          # Hook Vapi (connexion, events, transcript)
├── lib/
│   ├── profiles.ts         # Données des 3 profils + system prompts
│   ├── constants.ts        # Constantes (couleurs, verdicts, options)
│   └── scoring.ts          # Parsing des scores depuis la transcription
└── types/
    └── index.ts            # Types TypeScript
```
