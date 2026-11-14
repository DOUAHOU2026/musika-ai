import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale } from 'lucide-react';

export default function TermsPage() {
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
          <Scale className="h-4 w-4" />
          <span>Cadre Juridique & Propriété Intellectuelle</span>
        </div>
        <h1 className="text-3xl font-black text-white">Conditions Générales d’Utilisation (CGU)</h1>
        <p className="text-xs text-zinc-400 mt-1">Dernière mise à jour : Novembre 2026</p>
      </div>

      <div className="space-y-6 text-xs text-zinc-300 leading-relaxed bg-zinc-900/50 border border-white/10 p-6 sm:p-8 rounded-3xl">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white">1. Objet du Service</h2>
          <p>
            MUSIKA AI est une plateforme logicielle fournissant des outils d’assistance à la composition et à la production musicale basés sur l’intelligence artificielle, avec une orientation particulière pour les musiques africaines et contemporaines.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white">2. Propriété Intellectuelle & Droits sur les Compositions</h2>
          <p>
            - <strong>Morceaux générés par l’utilisateur</strong> : Dans la limite permise par les législations applicables à la propriété intellectuelle des œuvres assistées par IA, l’utilisateur conserve la pleine jouissance des pistes audio qu’il produit via la plateforme.
          </p>
          <p>
            - <strong>Usage Commercial</strong> : Les formules actives autorisent l’exploitation commerciale des morceaux finalisés, sous réserve du respect des droits des tiers et de l’absence d’échantillons protégés non autorisés.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white">3. Règles de Conduite & Engagements de l’Utilisateur</h2>
          <p>Il est strictement interdit d’utiliser MUSIKA AI pour :</p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li>Générer des contenus haineux, diffamatoires, violents ou incitant à la discrimination.</li>
            <li>Usurper l’identité vocale d’un artiste sans autorisation explicite (deepfake vocal illicite).</li>
            <li>Tenter de contourner les quotas de sécurité ou saturer l’infrastructure réseau.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white">4. Politique Tarifaire & Budget 0 €</h2>
          <p>
            La formule de démarrage est garantie à 0 € sans carte bancaire requise. L’utilisateur bénéficie d’un quota de crédits d’exploration gratuit. Aucune facturation inopinée ne peut survenir sans consentement exprès.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white">5. Responsabilité & Moteurs IA Tiers</h2>
          <p>
            MUSIKA AI utilise une architecture modulaire pouvant se connecter à des modèles d’inférence tiers (ex: Google Lyria, Meta AudioCraft). La plateforme applique une transparence stricte et ne feint aucun flux audio réel.
          </p>
        </section>
      </div>
    </div>
  );
}
