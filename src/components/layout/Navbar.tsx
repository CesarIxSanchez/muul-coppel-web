"use client";

import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getPerfilCompat } from "@/lib/supabase/profileCompat";
import { useTranslations } from "next-intl";

interface UserInfo {
  initials: string;
  nombre: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const t = useTranslations("nav");

  const idiomas = [
    { code: "es" as const, label: "ES", flag: "🇲🇽" },
    { code: "en" as const, label: "EN", flag: "🇺🇸" },
    { code: "zh" as const, label: "中文", flag: "🇨🇳" },
    { code: "pt" as const, label: "PT", flag: "🇧🇷" },
  ];

  const cambiarIdioma = (locale: "es" | "en" | "zh" | "pt") => {
    router.replace(pathname, { locale });
    setLangOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const perfil = await getPerfilCompat(supabase, authUser.id);
        const nombre =
          perfil?.nombre_completo || authUser.user_metadata?.nombre_completo || authUser.email || "Usuario";
        const parts = nombre.split(" ");
        const initials = parts.length >= 2
          ? (parts[0][0] + parts[1][0]).toUpperCase()
          : nombre.substring(0, 2).toUpperCase();
        setUser({ initials, nombre });
      } else {
        setUser(null);
      }
    };
    getUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { getUser(); });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 bg-surface-bright/60 backdrop-blur-md shadow-nav">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-black text-on-surface uppercase font-headline tracking-tight">Muul</Link>
          <div className="hidden md:flex gap-6 items-center">
            <Link href="/" className={`font-headline font-bold tracking-tight transition-colors ${isActive("/") ? "text-on-surface border-b-2 border-tertiary pb-1" : "text-on-surface-variant hover:text-on-surface"}`}>
              {t("explorar")}
            </Link>
            <Link href="/tiendas" className={`font-headline font-bold tracking-tight transition-colors ${isActive("/tiendas") ? "text-on-surface border-b-2 border-tertiary pb-1" : "text-on-surface-variant hover:text-on-surface"}`}>
              {t("tiendas")}
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)} className="text-on-surface hover:bg-white/5 p-2 rounded-full transition-all text-sm font-bold">🌐</button>
            {langOpen && (
              <div className="absolute right-0 top-12 bg-surface-container-low border border-outline-variant/20 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in-up">
                {idiomas.map((lang) => (
                  <button key={lang.code} onClick={() => cambiarIdioma(lang.code)} className="flex items-center gap-3 px-5 py-3 hover:bg-surface-container-highest transition-colors w-full text-left text-sm">
                    <span>{lang.flag}</span>
                    <span className="font-bold text-on-surface">{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden md:block h-6 w-px bg-outline-variant/30 mx-2" />

          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <Link href="/perfil" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm border-2 border-primary/20 group-hover:border-primary/40 transition-all">
                  {user.initials}
                </div>
              </Link>
              <button onClick={handleLogout} className="px-4 py-2 font-headline font-bold text-on-surface-variant hover:text-tertiary transition-colors text-sm">
                {t("salir")}
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="hidden md:block px-4 py-2 font-headline font-bold text-on-surface-variant hover:text-on-surface transition-colors">
                {t("login")}
              </Link>
              <Link href="/perfil" className="hidden md:flex px-6 py-2 rounded-md font-headline font-bold transition-all hover:translate-y-[-1px] active:scale-95 bg-primary-container text-on-primary-container">
                {t("perfil")}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}