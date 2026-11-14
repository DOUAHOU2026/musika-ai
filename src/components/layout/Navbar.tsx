'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/context';
import {
  Music,
  Sliders,
  Library,
  LayoutDashboard,
  CreditCard,
  User,
  Sparkles,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/studio', label: t.nav.studio, icon: Sliders },
    { href: '/library', label: t.nav.library, icon: Library },
    { href: '/dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { href: '/pricing', label: t.nav.pricing, icon: CreditCard },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0a0c12]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-violet-600 shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all duration-300">
            <Music className="h-5 w-5 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-200 to-white">
              MUSIKA <span className="text-amber-500">AI</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">
              Studio Afro & World
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/60 p-1 rounded-xl border border-white/5">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-amber-400' : 'text-zinc-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Lang switch, Studio CTA & Auth */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-zinc-900 border border-white/10 rounded-lg p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLocale('fr')}
              className={`px-2.5 py-1 rounded transition-all ${
                locale === 'fr'
                  ? 'bg-amber-500 text-black shadow font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLocale('en')}
              className={`px-2.5 py-1 rounded transition-all ${
                locale === 'en'
                  ? 'bg-amber-500 text-black shadow font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* Credits indicator badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs text-amber-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>5 {t.nav.credits}</span>
          </div>

          {/* Auth links */}
          <Link
            href="/auth/login"
            className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-1.5 transition-colors"
          >
            {t.nav.login}
          </Link>

          <Link
            href="/studio"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-600 text-black hover:from-amber-400 hover:to-orange-500 shadow-md shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <Sliders className="h-4 w-4" />
            <span>{t.nav.studio}</span>
          </Link>

          <Link
            href="/profile"
            className="p-2 text-zinc-400 hover:text-white bg-zinc-900 border border-white/10 rounded-lg transition-colors"
            title={t.nav.profile}
          >
            <User className="h-4 w-4" />
          </Link>

          <Link
            href="/admin"
            className="p-2 text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg transition-colors"
            title="Console Administration"
          >
            <ShieldAlert className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center gap-2">
          <div className="flex items-center bg-zinc-900 border border-white/10 rounded-lg p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLocale('fr')}
              className={`px-2 py-1 rounded ${locale === 'fr' ? 'bg-amber-500 text-black' : 'text-zinc-400'}`}
            >
              FR
            </button>
            <button
              onClick={() => setLocale('en')}
              className={`px-2 py-1 rounded ${locale === 'en' ? 'bg-amber-500 text-black' : 'text-zinc-400'}`}
            >
              EN
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#0c0e17] px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-900/80 border border-white/5 text-sm text-zinc-300"
                >
                  <Icon className="h-4 w-4 text-amber-400" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/studio"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl font-semibold bg-gradient-to-r from-amber-500 to-orange-600 text-black text-sm"
            >
              {t.nav.studio}
            </Link>
            <div className="flex justify-between items-center pt-2 text-sm text-zinc-400">
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                {t.nav.login}
              </Link>
              <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)} className="text-amber-400">
                {t.nav.register}
              </Link>
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                {t.nav.profile}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

