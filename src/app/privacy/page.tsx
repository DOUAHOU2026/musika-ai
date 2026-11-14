import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour à l’accueil</span>
        </Link>
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Lock className="h-4 w-4" />
          <span>Protection des Données & Conformité RGPD</span>
        </div>
        <h1 className="text-3xl font-black text-white">Politique de Confidentialité</h1>
        <p className="text-xs text-zinc-400 mt-1">Dernière mise à jour : Novembre 2026</p>
      </div>

      <div className="space-y-6 text-xs text-zinc-300 leading-relaxed bg-zinc-900/50 border border-white/10 p-6 sm:p-8 rounded-3xl">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white">1. Données Collectées</h2>
          <p>
            Dans le cadre de l’utilisation de MUSIKA AI, nous collectons exclusivement les données strictement nécessaires au fonctionnement du studio :
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li>Adresse email et nom d’artiste lors de la création de compte.</li>
            <li>Prompts musicaux, paroles soumises et préférences de genres (Afrobeat, Coupé-décalé, etc.).</li>
            <li>Métadonnées techniques nécessaires à la sécurité de l’authentification via Supabase Auth.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white">2. Sécurité & Infrastructure Supabase</h2>
          <p>
            Les données utilisateurs sont hébergées sur l’infrastructure de <strong>Supabase (PostgreSQL)</strong> avec l’activation systématique de la sécurité au niveau des lignes (<em>Row Level Security - RLS</em>). Seul l’utilisateur propriétaire a accès en écriture et en modification à son profil personnel et à ses pistes privées.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white">3. Non-vente des Données Personnelles</h2>
          <p>
            MUSIKA AI ne commercialise, ne loue et ne cède aucune donnée personnelle ou création musicale à des tiers à des fins publicitaires.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white">4. Vos Droits (Accès, Rectification, Suppression)</h2>
          <p>
            Conformément au RGPD et aux réglementations applicables, vous disposez d’un droit d’accès, de modification et de suppression définitive de votre compte et de l’ensemble de vos créations associées directement depuis votre profil utilisateur.
          </p>
        </section>
      </div>
    </div>
  );
}
