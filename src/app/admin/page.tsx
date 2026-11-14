'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DEMO_TRACKS } from '@/lib/demo-tracks';
import {
  ShieldAlert,
  Users,
  Music,
  CreditCard,
  Cpu,
  Trash2,
  CheckCircle2,
  Search,
  Filter,
  Plus,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface MockUser {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'creator' | 'studio-pro';
  credits: number;
  joinedAt: string;
  role: 'admin' | 'user';
}

const INITIAL_USERS: MockUser[] = [
  {
    id: 'usr-1',
    name: 'Admin Principal',
    email: 'admin@musika-ai.com',
    plan: 'studio-pro',
    credits: 9999,
    joinedAt: '2026-11-01',
    role: 'admin',
  },
  {
    id: 'usr-2',
    name: 'Kofi Sound',
    email: 'kofi@afrobeat.io',
    plan: 'creator',
    credits: 84,
    joinedAt: '2026-11-03',
    role: 'user',
  },
  {
    id: 'usr-3',
    name: 'DJ Stéphane 225',
    email: 'steph@abidjan-sound.ci',
    plan: 'free',
    credits: 5,
    joinedAt: '2026-11-05',
    role: 'user',
  },
  {
    id: 'usr-4',
    name: 'Thando Pretoria',
    email: 'thando@amapiano.za',
    plan: 'free',
    credits: 3,
    joinedAt: '2026-11-06',
    role: 'user',
  },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'tracks' | 'system'>('overview');
  const [users, setUsers] = useState<MockUser[]>(INITIAL_USERS);
  const [tracks, setTracks] = useState(DEMO_TRACKS);
  const [userSearch, setUserSearch] = useState('');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState('all');
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const handleAddCredits = (userId: string, amount: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, credits: u.credits + amount } : u))
    );
    showNotice(`+${amount} crédits ajoutés avec succès !`);
  };

  const handleDeleteTrack = (trackId: string) => {
    if (confirm('Êtes-vous sûr de vouloir modérer/supprimer ce morceau ?')) {
      setTracks((prev) => prev.filter((t) => t.id !== trackId));
      showNotice('Morceau supprimé du catalogue.');
    }
  };

  const showNotice = (msg: string) => {
    setNoticeMessage(msg);
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  const filteredUsers = users.filter((u) => {
    const matchesQuery =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesPlan = selectedPlanFilter === 'all' || u.plan === selectedPlanFilter;
    return matchesQuery && matchesPlan;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Admin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="h-4 w-4" />
            <span>Console Administrative (Back-Office)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Administration MUSIKA AI
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Gestion globale des utilisateurs, modération des créations et contrôle des coûts (Budget 0 €).
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 bg-zinc-900 border border-white/10 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'overview' ? 'bg-amber-500 text-black shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Vue d’ensemble
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'users' ? 'bg-amber-500 text-black shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Utilisateurs ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('tracks')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'tracks' ? 'bg-amber-500 text-black shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Pistes ({tracks.length})
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'system' ? 'bg-amber-500 text-black shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Système & IA
          </button>
        </div>
      </div>

      {/* Global Toast Notice */}
      {noticeMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{noticeMessage}</span>
        </div>
      )}

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="rounded-2xl bg-zinc-900/50 border border-white/10 p-5">
              <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                <span>Comptes Enregistrés</span>
                <Users className="h-4 w-4 text-amber-400" />
              </div>
              <p className="text-3xl font-black text-white">{users.length}</p>
              <p className="text-[11px] text-zinc-500 mt-1">100% sur Supabase Auth</p>
            </div>

            <div className="rounded-2xl bg-zinc-900/50 border border-white/10 p-5">
              <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                <span>Pistes Générées</span>
                <Music className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-black text-white">{tracks.length}</p>
              <p className="text-[11px] text-zinc-500 mt-1">Tous genres confondus</p>
            </div>

            <div className="rounded-2xl bg-zinc-900/50 border border-white/10 p-5">
              <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                <span>Dépenses Réseau (Budget)</span>
                <CreditCard className="h-4 w-4 text-blue-400" />
              </div>
              <p className="text-3xl font-black text-emerald-400">0,00 €</p>
              <p className="text-[11px] text-zinc-500 mt-1">Aucune facture en cours</p>
            </div>

            <div className="rounded-2xl bg-zinc-900/50 border border-white/10 p-5">
              <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                <span>Statut Connecteurs IA</span>
                <Cpu className="h-4 w-4 text-violet-400" />
              </div>
              <p className="text-xl font-bold text-amber-400 mt-1">Prêt / En attente</p>
              <p className="text-[11px] text-zinc-500 mt-1">Google Lyria & HuggingFace</p>
            </div>
          </div>

          {/* Quick Admin Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-zinc-900/50 border border-white/10 p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-400" />
                <span>Derniers Utilisateurs Inscrits</span>
              </h3>
              <div className="space-y-2">
                {users.slice(0, 3).map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5 text-xs">
                    <div>
                      <span className="font-bold text-white">{u.name}</span>
                      <p className="text-[11px] text-zinc-400">{u.email}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-500/10 text-amber-300">
                      {u.plan}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-zinc-900/50 border border-white/10 p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="h-4 w-4 text-amber-400" />
                <span>Documents Administratifs & Légaux</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Les conditions d’utilisation, la propriété intellectuelle des créations musicales par IA et la politique de protection des données sont disponibles en ligne :
              </p>
              <div className="flex flex-col gap-2 pt-1 text-xs">
                <Link href="/terms" className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5 hover:border-amber-500/30 text-zinc-300 hover:text-white transition-colors">
                  <span>Conditions Générales d’Utilisation (CGU & Propriété Musicale IA)</span>
                  <ArrowRight className="h-3.5 w-3.5 text-amber-400" />
                </Link>
                <Link href="/privacy" className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5 hover:border-amber-500/30 text-zinc-300 hover:text-white transition-colors">
                  <span>Politique de Confidentialité (RGPD & Supabase)</span>
                  <ArrowRight className="h-3.5 w-3.5 text-amber-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. USERS TAB */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900/60 border border-white/10 p-4 rounded-2xl">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Rechercher par nom ou email..."
                className="w-full rounded-xl bg-black/40 border border-white/10 pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-zinc-400 shrink-0" />
              <select
                value={selectedPlanFilter}
                onChange={(e) => setSelectedPlanFilter(e.target.value)}
                className="rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
              >
                <option value="all">Tous les forfaits</option>
                <option value="free">Découverte (0 €)</option>
                <option value="creator">Créateur Pro</option>
                <option value="studio-pro">Studio Pro</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-zinc-900/50 border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/40 text-zinc-400 uppercase font-semibold border-b border-white/10 text-[10px]">
                <tr>
                  <th className="p-4">Utilisateur</th>
                  <th className="p-4">Rôle</th>
                  <th className="p-4">Forfait</th>
                  <th className="p-4">Crédits</th>
                  <th className="p-4">Inscription</th>
                  <th className="p-4 text-right">Actions rapides</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white">{u.name}</div>
                      <div className="text-[11px] text-zinc-400">{u.email}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.role === 'admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-zinc-800 text-zinc-300'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="capitalize text-zinc-300">{u.plan}</span>
                    </td>
                    <td className="p-4 font-mono font-bold text-amber-400">
                      {u.credits}
                    </td>
                    <td className="p-4 text-zinc-400">{u.joinedAt}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleAddCredits(u.id, 10)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500 hover:text-black text-amber-300 text-[11px] font-medium transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                        <span>+10 Crédits</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. TRACKS MODERATION TAB */}
      {activeTab === 'tracks' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl bg-zinc-900/50 border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/40 text-zinc-400 uppercase font-semibold border-b border-white/10 text-[10px]">
                <tr>
                  <th className="p-4">Morceau</th>
                  <th className="p-4">Genre</th>
                  <th className="p-4">Créateur</th>
                  <th className="p-4">BPM</th>
                  <th className="p-4">Durée</th>
                  <th className="p-4 text-right">Modération</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tracks.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white max-w-xs truncate">
                      {t.title}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-bold uppercase">
                        {t.genre}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-300">{t.creatorName}</td>
                    <td className="p-4 font-mono text-zinc-400">{t.bpm}</td>
                    <td className="p-4 font-mono text-zinc-400">{t.durationSeconds}s</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteTrack(t.id)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Supprimer ce morceau"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. SYSTEM & AI CONFIG TAB */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-zinc-900/50 border border-white/10 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <Cpu className="h-4 w-4 text-amber-400" />
              <span>Connecteurs d’Intelligence Artificielle</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Google Lyria (DeepMind)</p>
                  <p className="text-[11px] text-zinc-400">Génération audio haute résolution</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Prêt pour clé officielle
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">MusicGen Open (AudioCraft)</p>
                  <p className="text-[11px] text-zinc-400">Inférence Hugging Face gratuite</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  Optionnel
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-900/50 border border-white/10 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <CreditCard className="h-4 w-4 text-emerald-400" />
              <span>Garantie Budgétaire SaaS (0 €)</span>
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Le système est configuré pour n’engager aucune dépense automatique :
            </p>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Supabase : Free Tier actif sans moyen de paiement</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Aucune clé payante tierce n’est débitée</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Plafond de 5 crédits par nouvel utilisateur pour contrôler la charge</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
