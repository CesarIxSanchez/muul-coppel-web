"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import { getPerfilCompat } from "@/lib/supabase/profileCompat";
import type { Negocio } from "@/types/database";


const categoryEmojis: Record<string, string> = {
  comida: "🌮",
  tienda: "🛍️",
  servicios: "🏨",
  cultural: "🏛️",
  deportes: "⚽",
};

interface BusinessMetrics {
  visitantes: number;
  contactos: number;
  alcance: number;
  rating: number;
  reviews: number;
}

interface DashboardState {
  business: Negocio | null;
  metrics: BusinessMetrics;
  loading: boolean;
  authenticated: boolean;
}

export default function NegocioDashboardPage() {
  const supabase = createClient();
  const router = useRouter();
  const t = useTranslations("negocio-dashboard");
  const tNav = useTranslations("nav");
  const tc = useTranslations("common");

  const [state, setState] = useState<DashboardState>({
    business: null,
    metrics: { visitantes: 0, contactos: 0, alcance: 0, rating: 0, reviews: 0 },
    loading: true,
    authenticated: false,
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          setState((prev) => ({ ...prev, loading: false }));
          return;
        }

        setState((prev) => ({ ...prev, authenticated: true }));

        // Get business data
        const { data: negocioData, error } = await supabase.rpc("get_negocio_usuario_actual");

        if (error || !negocioData || negocioData.length === 0) {
          console.error("Error fetching business:", error);
          setState((prev) => ({ ...prev, loading: false }));
          return;
        }

        const business = negocioData[0] as Negocio;
        
        // Simulate metrics (replace with real data from your DB)
        const mockMetrics: BusinessMetrics = {
          visitantes: Math.floor(Math.random() * 500) + 100,
          contactos: Math.floor(Math.random() * 50) + 5,
          alcance: Math.floor(Math.random() * 5000) + 1000,
          rating: 4.5 + Math.random() * 0.5,
          reviews: Math.floor(Math.random() * 50) + 10,
        };

        setState((prev) => ({
          ...prev,
          business,
          metrics: mockMetrics,
          loading: false,
        }));
      } catch (error) {
        console.error("Error loading dashboard:", error);
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    loadDashboard();
  }, [supabase]);

  if (state.loading) {
    return (
      <main className="pt-20 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#003e6f] border-t-[#fed000] mx-auto mb-4"></div>
          <p className="text-[#003e6f] font-headline font-bold">{t("cargando", "Cargando...")}</p>
        </div>
      </main>
    );
  }

  if (!state.authenticated) {
    return (
      <main className="pt-20 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">🔐</span>
          <h1 className="text-4xl font-headline font-bold text-[#003e6f] mb-4">{t("acceso_denegado", "Acceso Denegado")}</h1>
          <p className="text-gray-600 max-w-xl mb-8">{t("inicia_sesion_continuar", "Inicia sesión para continuar.")}</p>
          <Link href="/login" className="inline-block px-8 py-4 bg-[#003e6f] text-white font-headline font-bold rounded-lg hover:opacity-90 transition-all">
            {tNav("login", "Iniciar Sesión")}
          </Link>
        </div>
      </main>
    );
  }

  if (!state.business) {
    return (
      <main className="pt-20 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">🏬</span>
          <h1 className="text-4xl font-headline font-bold text-[#003e6f] mb-4">{t("crear_negocio", "Crea tu Negocio")}</h1>
          <p className="text-gray-600 max-w-xl mb-8">
            {t("crear_negocio_desc", "Únete a la red MUUL para que miles de viajeros descubran tu local de forma instantánea.")}
          </p>
          <Link href="/signup-negocio" className="inline-block px-8 py-4 bg-[#fed000] text-[#003e6f] font-headline font-bold rounded-lg hover:opacity-90 transition-all">
            {t("registrar_ahora", "Registra tu Negocio")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 min-h-screen bg-white pb-12">
      <div className="px-6 md:px-12 py-10 max-w-7xl mx-auto space-y-12">
        {/* 1. HEADER SECTION */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-5xl md:text-6xl font-black text-[#003e6f] font-headline tracking-tight mb-4">
              {t("bienvenida", "Bienvenido")}, {state.business.nombre}
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold">
                {t("estado", "Estado")}: {t("verificado", "Verificado")}
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-600">
                  {t("perfil_completitud", "Perfil")} 85% {t("completado", "completado")}
                </span>
                <div className="w-32 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#003e6f] rounded-full transition-all w-[85%]"></div>
                </div>
              </div>
            </div>
          </div>
          <Link
            href={`/negocio/${state.business.id}?tab=perfil`}
            className="bg-gray-100 text-[#003e6f] px-8 py-3 rounded-lg font-headline font-bold hover:bg-gray-200 transition-all active:scale-95 whitespace-nowrap"
          >
            {t("editar_perfil", "Editar Perfil")}
          </Link>
        </section>

        {/* 2. METRICS OVERVIEW */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-[0_20px_40px_rgba(0,62,111,0.06)] hover:shadow-[0_30px_60px_rgba(0,62,111,0.12)] transform hover:-translate-y-1 transition-all group border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <span className="material-symbols-outlined text-[#003e6f] text-4xl group-hover:scale-110 transition-transform">
                visibility
              </span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t("visitantes", "Visitantes Este Mes")}</span>
            </div>
            <p className="text-5xl font-black text-[#003e6f] font-headline">{state.metrics.visitantes}</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-[0_20px_40px_rgba(0,62,111,0.06)] hover:shadow-[0_30px_60px_rgba(0,62,111,0.12)] transform hover:-translate-y-1 transition-all group border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <span className="material-symbols-outlined text-[#fed000] text-4xl group-hover:scale-110 transition-transform">
                mail
              </span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t("contactos", "Contactos Recibidos")}</span>
            </div>
            <p className="text-5xl font-black text-[#003e6f] font-headline">{state.metrics.contactos}</p>
          </div>

          <div className="bg-[#003e6f] text-white p-8 rounded-2xl shadow-[0_20px_40px_rgba(0,62,111,0.15)] hover:shadow-[0_30px_60px_rgba(0,62,111,0.25)] transform hover:-translate-y-1 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <span className="material-symbols-outlined text-[#fed000] text-4xl group-hover:scale-110 transition-transform">
                public
              </span>
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">{t("alcance", "Mi Alcance")}</span>
            </div>
            <p className="text-5xl font-black font-headline">{(state.metrics.alcance / 1000).toFixed(1)}k</p>
          </div>

          <div className="bg-[#f3f6ff] p-8 rounded-2xl shadow-[0_20px_40px_rgba(0,62,111,0.06)] hover:shadow-[0_30px_60px_rgba(0,62,111,0.12)] transform hover:-translate-y-1 transition-all group border border-[#fed000]/20">
            <div className="flex justify-between items-start mb-6">
              <span className="material-symbols-outlined text-[#005596] text-4xl group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t("rating", "Rating")}</span>
            </div>
            <p className="text-5xl font-black text-[#003e6f] font-headline">
              {state.metrics.rating.toFixed(1)}
              <span className="text-lg text-gray-500 font-medium">/5</span>
            </p>
            <p className="text-xs font-semibold text-gray-500 mt-2">{state.metrics.reviews} reviews</p>
          </div>
        </section>

        {/* 3 & 4. PROFILE STATUS + QUICK ACTIONS */}
        <section className="grid lg:grid-cols-3 gap-8">
          {/* Profile Status Card */}
          <div className="lg:col-span-1 bg-[#f3f6ff] border-2 border-[#fed000]/30 p-8 rounded-2xl flex flex-col">
            <h3 className="text-2xl font-black font-headline mb-6 text-[#003e6f]">{t("completar_perfil", "Completá tu Perfil")}</h3>

            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-[#003e6f]">{t("progreso", "Progreso General")}</span>
                <span className="text-sm font-bold text-[#003e6f]">85%</span>
              </div>
              <div className="w-full h-3 bg-white rounded-full p-0.5">
                <div className="h-full bg-[#fed000] rounded-full transition-all w-[85%]"></div>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm font-semibold text-[#003e6f]/80">
                <span className="material-symbols-outlined text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                {t("info_basica", "Info básica")}
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-[#003e6f]/80">
                <span className="material-symbols-outlined text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                {t("fotos", "Fotos")}
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-[#003e6f]/80">
                <span className="material-symbols-outlined text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                {t("horarios", "Horarios")}
              </li>
              <li className="flex items-center justify-between gap-3 text-sm font-semibold text-[#003e6f]">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gray-400">radio_button_unchecked</span>
                  {t("metodos_pago", "Métodos de pago")}
                </div>
                <button className="text-xs bg-white px-3 py-1.5 rounded-full font-bold hover:shadow-sm transition-all">
                  {t("completar", "Completar")}
                </button>
              </li>
              <li className="flex items-center justify-between gap-3 text-sm font-semibold text-[#003e6f]">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gray-400">radio_button_unchecked</span>
                  {t("verificacion", "Verificación")}
                </div>
                <button className="text-xs bg-white px-3 py-1.5 rounded-full font-bold hover:shadow-sm transition-all">
                  {t("verificar", "Verificar")}
                </button>
              </li>
            </ul>

            <button className="mt-auto w-full bg-[#fed000] text-[#003e6f] py-4 rounded-lg font-headline font-black text-lg hover:bg-[#fed000]/90 active:scale-95 transition-all">
              {t("continuar", "Continuar")}
            </button>
          </div>

          {/* Quick Actions Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link
              href={`/negocio/${state.business.id}?tab=promociones`}
              className="bg-white p-8 rounded-2xl shadow-[0_20px_40px_rgba(0,62,111,0.06)] hover:shadow-[0_30px_60px_rgba(0,62,111,0.12)] transition-all cursor-pointer flex flex-col justify-center items-center text-center group border border-gray-100"
            >
              <div className="h-16 w-16 bg-[#a1c9ff] rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform group-hover:scale-110">
                <span className="material-symbols-outlined text-[#003e6f] text-3xl">campaign</span>
              </div>
              <h4 className="text-lg font-bold font-headline text-[#003e6f]">{t("publicar_promo", "Publicar Promoción")}</h4>
            </Link>

            <Link
              href={`/negocio/${state.business.id}?tab=fotos`}
              className="bg-white p-8 rounded-2xl shadow-[0_20px_40px_rgba(0,62,111,0.06)] hover:shadow-[0_30px_60px_rgba(0,62,111,0.12)] transition-all cursor-pointer flex flex-col justify-center items-center text-center group border border-gray-100"
            >
              <div className="h-16 w-16 bg-[#a1c9ff] rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform group-hover:scale-110">
                <span className="material-symbols-outlined text-[#003e6f] text-3xl">photo_library</span>
              </div>
              <h4 className="text-lg font-bold font-headline text-[#003e6f]">{t("ver_fotos", "Ver Mis Fotos")}</h4>
            </Link>

            <Link
              href={`/negocio/${state.business.id}?tab=reservas`}
              className="bg-white p-8 rounded-2xl shadow-[0_20px_40px_rgba(0,62,111,0.06)] hover:shadow-[0_30px_60px_rgba(0,62,111,0.12)] transition-all cursor-pointer flex flex-col justify-center items-center text-center group border border-gray-100"
            >
              <div className="h-16 w-16 bg-[#a1c9ff] rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform group-hover:scale-110">
                <span className="material-symbols-outlined text-[#003e6f] text-3xl">event_available</span>
              </div>
              <h4 className="text-lg font-bold font-headline text-[#003e6f]">{t("gestionar_reservas", "Gestionar Reservas")}</h4>
            </Link>

            <Link
              href={`/negocio/${state.business.id}?tab=horarios`}
              className="bg-white p-8 rounded-2xl shadow-[0_20px_40px_rgba(0,62,111,0.06)] hover:shadow-[0_30px_60px_rgba(0,62,111,0.12)] transition-all cursor-pointer flex flex-col justify-center items-center text-center group border border-gray-100"
            >
              <div className="h-16 w-16 bg-[#a1c9ff] rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform group-hover:scale-110">
                <span className="material-symbols-outlined text-[#003e6f] text-3xl">schedule</span>
              </div>
              <h4 className="text-lg font-bold font-headline text-[#003e6f]">{t("config_horarios", "Configurar Horarios")}</h4>
            </Link>
          </div>
        </section>

        {/* 5. LAST ACTIVITIES */}
        <section className="bg-[#f3f6ff] p-10 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-black font-headline text-[#003e6f]">{t("ultimas_actividades", "Últimas Actividades")}</h3>
            <span className="inline-flex items-center justify-center h-8 w-8 bg-red-500 text-white text-xs font-bold rounded-full">3</span>
          </div>
          <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#003e6f]/10">
            <div className="flex items-start gap-6 relative group">
              <div className="h-10 w-10 bg-white rounded-full border-4 border-[#f3f6ff] flex items-center justify-center z-10 shadow-sm group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[#003e6f] text-lg">person_pin</span>
              </div>
              <div className="pt-2">
                <p className="font-bold text-[#003e6f]">{t("juan_contacto", "Juan contactó tu negocio")}</p>
                <p className="text-xs font-medium text-gray-500">{t("hace_15min", "Hace 15 min")}</p>
              </div>
            </div>
            <div className="flex items-start gap-6 relative group">
              <div className="h-10 w-10 bg-white rounded-full border-4 border-[#f3f6ff] flex items-center justify-center z-10 shadow-sm group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[#003e6f] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  favorite
                </span>
              </div>
              <div className="pt-2">
                <p className="font-bold text-[#003e6f]">{t("publicacion_likes", "Tu publicación recibió 12 me gusta")}</p>
                <p className="text-xs font-medium text-gray-500">{t("hace_2horas", "Hace 2 horas")}</p>
              </div>
            </div>
            <div className="flex items-start gap-6 relative group">
              <div className="h-10 w-10 bg-white rounded-full border-4 border-[#f3f6ff] flex items-center justify-center z-10 shadow-sm group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[#003e6f] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
              <div className="pt-2">
                <p className="font-bold text-[#003e6f]">{t("reserva_completada", "Se completó una reserva")}</p>
                <p className="text-xs font-medium text-gray-500">{t("ayer_1830", "Ayer, 18:30")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. RECOMMENDATIONS */}
        <section className="space-y-6">
          <h3 className="text-3xl font-black font-headline text-[#003e6f]">{t("recomendaciones", "Recomendaciones para vos")}</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#003e6f] to-[#005596] p-8 rounded-2xl text-white shadow-xl flex flex-col h-full relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                <span className="material-symbols-outlined text-[120px]">lightbulb</span>
              </div>
              <div className="mb-6 h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[#fed000]">lightbulb</span>
              </div>
              <h4 className="text-xl font-bold font-headline mb-2">{t("mas_fotos", "Añade más fotos")}</h4>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">
                {t("mas_fotos_desc", "Los negocios con más de 10 fotos reciben un 40% más de interacciones.")}
              </p>
              <button className="mt-auto self-start text-white font-bold border-b-2 border-white/40 pb-0.5 hover:border-white transition-all text-sm">
                {t("gestionar_fotos", "Gestionar fotos")}
              </button>
            </div>

            <div className="bg-gradient-to-br from-[#005596] to-[#003e6f] p-8 rounded-2xl text-white shadow-xl flex flex-col h-full relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                <span className="material-symbols-outlined text-[120px]">campaign</span>
              </div>
              <div className="mb-6 h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[#fed000]">campaign</span>
              </div>
              <h4 className="text-xl font-bold font-headline mb-2">{t("crear_promo", "Crea una promoción")}</h4>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">
                {t("crear_promo_desc", "Atrae nuevos clientes ofreciendo un descuento especial para la comunidad MUUL.")}
              </p>
              <button className="mt-auto self-start text-white font-bold border-b-2 border-white/40 pb-0.5 hover:border-white transition-all text-sm">
                {t("empezar_campana", "Empezar campaña")}
              </button>
            </div>

            <div className="bg-gradient-to-br from-[#003e6f] to-[#001c39] p-8 rounded-2xl text-white shadow-xl flex flex-col h-full relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                <span className="material-symbols-outlined text-[120px]">group_add</span>
              </div>
              <div className="mb-6 h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[#fed000]">group_add</span>
              </div>
              <h4 className="text-xl font-bold font-headline mb-2">{t("invita_amigos", "Invita a amigos")}</h4>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">
                {t("invita_amigos_desc", "Comparte tu perfil y ayuda a otros negocios a crecer en nuestra plataforma.")}
              </p>
              <button className="mt-auto self-start text-white font-bold border-b-2 border-white/40 pb-0.5 hover:border-white transition-all text-sm">
                {t("compartir_enlace", "Compartir enlace")}
              </button>
            </div>
          </div>
        </section>

        {/* 7. QUICK RESOURCES */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/recursos"
            className="bg-white p-6 rounded-lg text-center hover:bg-[#f3f6ff] transition-all border border-transparent hover:border-gray-300 group"
          >
            <span className="material-symbols-outlined text-[#005596] mb-3 block text-3xl">help_center</span>
            <span className="text-sm font-bold text-[#003e6f] block">{t("help_center", "Help Center")}</span>
          </Link>
          <Link
            href="/recursos"
            className="bg-white p-6 rounded-lg text-center hover:bg-[#f3f6ff] transition-all border border-transparent hover:border-gray-300"
          >
            <span className="material-symbols-outlined text-[#005596] mb-3 block text-3xl">auto_stories</span>
            <span className="text-sm font-bold text-[#003e6f] block">{t("success_guide", "Success Guide")}</span>
          </Link>
          <Link
            href="/comunidad"
            className="bg-white p-6 rounded-lg text-center hover:bg-[#f3f6ff] transition-all border border-transparent hover:border-gray-300"
          >
            <span className="material-symbols-outlined text-[#005596] mb-3 block text-3xl">forum</span>
            <span className="text-sm font-bold text-[#003e6f] block">{t("community", "Community")}</span>
          </Link>
          <a
            href="mailto:support@muul.com"
            className="bg-white p-6 rounded-lg text-center hover:bg-[#f3f6ff] transition-all border border-transparent hover:border-gray-300"
          >
            <span className="material-symbols-outlined text-[#005596] mb-3 block text-3xl">support_agent</span>
            <span className="text-sm font-bold text-[#003e6f] block">{t("support", "Support")}</span>
          </a>
        </section>

        {/* 8. FOOTER */}
        <footer className="pt-16 border-t border-gray-200 text-center space-y-8">
          <div className="space-y-2">
            <p className="text-2xl font-black font-headline text-[#003e6f]">{t("necesitas_ayuda", "¿Necesitas ayuda?")}</p>
            <p className="text-gray-600 font-medium">{t("soporte_24_7", "Nuestro equipo está disponible 24/7 para asistirte.")}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="flex items-center gap-3 bg-[#003e6f] text-white px-10 py-4 rounded-lg font-headline font-bold hover:opacity-90 transition-all active:scale-95">
              <span className="material-symbols-outlined">chat</span>
              {t("chat", "Chat")}
            </button>
            <button className="flex items-center gap-3 bg-gray-100 text-[#003e6f] px-10 py-4 rounded-lg font-headline font-bold hover:bg-gray-200 transition-all active:scale-95">
              <span className="material-symbols-outlined">mail</span>
              {t("email", "Email")}
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}
      </div>
    </main>
  );
}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-3 rounded-lg border border-yellow-300"
              />
            </div>
            <div className="mt-4">
              <label className="text-sm font-bold mb-2 block">{t("dashboardBannerUrl")}</label>
              <input
                type="text"
                value={banner}
                onChange={(e) => setBanner(e.target.value)}
                placeholder="https://example.com/banner.jpg"
                className="w-full px-4 py-3 rounded-lg border border-yellow-300"
              />
            </div>
          </section>
        )}

        {/* Save Message */}
        {saveMessage && (
          <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 rounded-full font-bold text-white shadow-lg animate-fade-in-up ${saveMessage.startsWith("✓") ? "bg-green-600" : "bg-error"}`}>
            {saveMessage}
          </div>
        )}
      </div>
    </main>
  );
}
