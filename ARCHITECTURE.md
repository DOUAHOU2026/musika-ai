# MUSIKA AI - Architecture & Documentation Technique

## 1. Vision & Spécificités
**MUSIKA AI** est une plateforme SaaS de génération et de composition musicale par Intelligence Artificielle, avec une expertise forte sur les **rythmes africains** (Afrobeat, Coupé-décalé, Zouglou, Amapiano, Rap ivoirien, Drill, Gospel, R&B, Reggae, Dancehall, Hip-hop, Musique traditionnelle africaine).

### Politique Économique : 0 € au Démarrage
- **Aucun coût d’infrastructure** : Utilisation exclusive d’outils open-source, de bibliothèques gratuites, et du palier gratuit (Free Tier) de Supabase.
- **Transparence d'ingénierie** : Aucun faux flux audio n'est simulé. Si un moteur d'inférence (ex: Google Lyria) n'a pas de clé d'API configurée, le système affiche expressément le statut d'attente.

---

## 2. Pile Technologique (100% Gratuite)
- **Framework** : Next.js 16 (App Router avec Turbopack & composants serveur/client).
- **Langage** : TypeScript 5 (typage strict).
- **Styles & Design** : Tailwind CSS v4, palette Dark Studio DAW inspirée de Suno AI (#08090E, accents ambre/or #F59E0B et violet studio #8B5CF6).
- **Icônes** : Lucide React.
- **Base de données & Auth** : Supabase (PostgreSQL avec Row Level Security et Supabase Auth gratuit).
- **Audio Engine** : Web Audio API (oscillateurs polyphoniques pour les démos sans hébergement lourd) + HTML5 Audio Player docké.

---

## 3. Architecture Modulaire

```
src/
├── app/                      # Next.js App Router
│   ├── auth/
│   │   ├── login/            # Page de connexion Supabase Auth
│   │   └── register/         # Inscription gratuite (0 €)
│   ├── dashboard/            # Statistiques d'artiste et métriques
│   ├── library/              # Bibliothèque, filtres par genres, recherche
│   ├── pricing/              # Modèle économique (0€ Freemium, Pro, Studio)
│   ├── profile/              # Profil créateur, styles favoris, clés API
│   ├── studio/               # Studio complet (Prompt, Paroles, 12 genres, BPM)
│   ├── globals.css           # Thème sombre studio DAW et animations
│   ├── layout.tsx            # Providers globaux (i18n, AudioPlayer)
│   └── page.tsx              # Landing page commerciale premium
├── components/
│   ├── auth/                 # Composants d'authentification
│   ├── layout/               # Navbar responsive, Footer bilingue
│   ├── library/              # Listes de pistes, viewer de paroles
│   ├── player/               # Lecteur audio global persistant en bas d'écran
│   ├── pricing/              # Grilles comparatives de tarification
│   └── studio/               # Commandes DAW et console de prompt
├── lib/
│   ├── ai/                   # Architecture Provider Pattern
│   │   ├── providers/
│   │   │   ├── lyria.ts      # Connecteur Google Lyria (DeepMind)
│   │   │   └── musicgen.ts   # Connecteur MusicGen (AudioCraft / HuggingFace)
│   │   ├── lyrics-generator.ts # Moteur de paroles thématiques & genres
│   │   ├── types.ts          # Interfaces et contrats du moteur IA
│   │   └── index.ts          # MusicEngineManager
│   ├── i18n/                 # Dictionnaire et context bilingue FR/EN
│   ├── player/               # Contexte audio et synthèse WebAudio
│   ├── supabase/             # Client Supabase sécurisé et schéma SQL
│   ├── demo-tracks.ts        # Pistes audio démo préconfigurées
│   └── genres.ts             # 12 genres africains & globaux avec BPM & instruments
└── types/
    └── index.ts              # Modèles de données stricts
```

---

## 4. Intégration de Google Lyria & Fournisseurs IA
L'architecture repose sur l'interface `MusicEngineProvider` :
```typescript
interface MusicEngineProvider {
  getInfo(): ProviderInfo;
  isAvailable(): boolean;
  generateMusic(request: GenerationRequest): Promise<GenerationResponse>;
}
```
Si l'API officielle de **Google Lyria** devient publiquement accessible, il suffit de configurer la variable `GOOGLE_LYRIA_API_KEY` dans `.env.local` sans avoir à réécrire la logique d'interface ou le frontend.

---

## 5. Déploiement & Configuration Supabase
1. Créez un projet gratuit sur [supabase.com](https://supabase.com).
2. Dans le SQL Editor de Supabase, exécutez le script contenu dans `src/lib/supabase/schema.sql`.
3. Copiez vos identifiants dans `.env.local` :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<votre-projet>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<votre-cle-anonyme>
   ```

