"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[750px] w-full overflow-hidden bg-gradient-to-br from-primary via-primary-container to-primary/80">
        <div className="absolute inset-0 opacity-60 bg-gradient-to-t from-black to-transparent"></div>
        <div className="relative z-10 h-full max-w-[1440px] mx-auto px-8 flex flex-col justify-center items-start">
          <span className="font-label !text-white uppercase tracking-[0.3em] text-xs md:text-sm mb-6 inline-flex items-center rounded-full bg-white/15 border border-white/20 px-4 py-2 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
            {t("badge")}
          </span>
          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl text-white max-w-4xl leading-[0.9] mb-8 drop-shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
            {t("titulo")} <br className="hidden md:block" /><span className="italic font-light">{t("tituloDestacado")}</span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-xl mb-12 font-body">
            {t("subtitulo")}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/mapa"
              className="bg-[#003e6f] text-white !text-white px-8 md:px-12 py-4 md:py-5 rounded-full font-headline font-black text-base md:text-lg hover:bg-[#005596] transition-all shadow-2xl shadow-[#003e6f]/20 flex items-center justify-center gap-2 group"
            >
              {t("explorarMapa")} <span aria-hidden="true">→</span>
            </Link>
            <button className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-white/20 transition-all">
              {t("registrarNegocio")}
            </button>
          </div>
        </div>
      </section>

      {/* Category Cards - Explore by Interest */}
      <section className="py-24 md:py-32 bg-white px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <div>
            <span className="font-label text-primary tracking-widest text-xs uppercase mb-2 block">{t("tendenciasTag")}</span>
            <h2 className="font-headline text-4xl md:text-5xl text-on-surface">{t("exploraInteresTitulo")}</h2>
          </div>
          <p className="text-on-surface-variant max-w-xs font-body text-sm">
            {t("exploraInteresDesc")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Green Card */}
          <div className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-tertiary-container cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-tertiary-container/90 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <span className="font-label text-on-tertiary-container text-xs uppercase tracking-widest mb-2 block">{t("tagHogarVerde")}</span>
              <h3 className="font-headline text-3xl text-white">{t("comida")}</h3>
              <div className="h-0.5 w-0 group-hover:w-12 bg-on-tertiary-container transition-all duration-500 mt-4"></div>
            </div>
          </div>
          {/* Blue Card */}
          <div className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-primary-container cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-primary-container/90 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <span className="font-label text-on-primary-container text-xs uppercase tracking-widest mb-2 block">{t("tagCulturaViva")}</span>
              <h3 className="font-headline text-3xl text-white">{t("cultural")}</h3>
              <div className="h-0.5 w-0 group-hover:w-12 bg-on-primary-container transition-all duration-500 mt-4"></div>
            </div>
          </div>
          {/* Red Card - using error color */}
          <div className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-error cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-error/90 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <span className="font-label text-error-container text-xs uppercase tracking-widest mb-2 block">{t("tagGastronomia")}</span>
              <h3 className="font-headline text-3xl text-white">{t("tiendas")}</h3>
              <div className="h-0.5 w-0 group-hover:w-12 bg-error-container transition-all duration-500 mt-4"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Destinations - Bento Layout */}
      <section className="py-20 md:py-32 bg-surface-container-low">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="font-label text-primary tracking-widest text-xs uppercase mb-4">{t("tendenciasTag")}</span>
            <h2 className="font-headline text-5xl md:text-6xl text-on-surface mb-6">{t("destinosTitulo")}</h2>
            <div className="w-20 h-1 bg-secondary-container mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
            {/* Large Card */}
            <div className="md:col-span-2 md:row-span-2 bg-white rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-end group shadow-sm border border-outline-variant/10 h-80 md:h-full">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded text-xs font-label uppercase tracking-widest font-bold">{t("tendencia")} #1</span>
                  <span className="text-white/80 font-label text-xs uppercase tracking-widest">{t("mexicoSur")}</span>
                </div>
                <h3 className="font-headline text-3xl md:text-4xl text-white mb-4">{t("destinoPrincipal")}</h3>
                <div className="flex gap-8">
                  <div>
                      <span className="text-white/50 text-xs uppercase block font-label">{t("subidaDato")}</span>
                    <span className="text-white font-label text-lg">+124%</span>
                  </div>
                  <div>
                    <span className="text-white/50 text-xs uppercase block font-label">Clima</span>
                    <span className="text-white font-label text-lg">24°C</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Side Card 1 */}
            <div className="md:col-span-2 bg-white rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-sm border border-outline-variant/10 h-auto md:h-auto">
              <div className="flex-1">
                <span className="text-primary font-label text-xs uppercase tracking-widest mb-2 block">{t("mexicoSur")}</span>
                <h3 className="font-headline text-2xl md:text-3xl text-on-surface mb-2">{t("destinoSecundario")}</h3>
                <p className="text-on-surface-variant text-sm font-body mb-4">{t("destinoSecundarioDesc")}</p>
                <button className="text-primary font-bold text-sm flex items-center gap-2 group">
                  {t("explorarGuia")} <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
            {/* Stats Small */}
            <div className="bg-primary-container rounded-[2rem] p-6 md:p-8 text-white flex flex-col justify-between shadow-lg h-auto md:h-full">
              <span className="text-3xl md:text-4xl" aria-hidden="true">📈</span>
              <div>
                <span className="font-label text-3xl md:text-4xl font-bold">8.4k</span>
                <p className="font-label text-xs uppercase tracking-tighter opacity-70">{t("recomendacionesDigitales")}</p>
              </div>
            </div>
            {/* Stats Small */}
            <div className="bg-secondary-container rounded-[2rem] p-6 md:p-8 text-on-secondary-container flex flex-col justify-between shadow-lg h-auto md:h-full">
              <span className="text-3xl md:text-4xl" aria-hidden="true">🏨</span>
              <div>
                <span className="font-label text-3xl md:text-4xl font-bold">92%</span>
                <p className="font-label text-xs uppercase tracking-tighter opacity-70">{t("impactoPositivo")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-8 bg-surface-container-high rounded-[3rem] p-12 md:p-16 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="font-headline text-4xl md:text-5xl text-primary mb-6">{t("uneteA")} <span className="italic">{t("inteligenciaEditorial")}</span></h2>
            <p className="text-on-surface-variant text-lg mb-8 font-body">
              {t("newsletterDesc")}
            </p>
            <div className="flex gap-2 p-2 bg-white rounded-full shadow-inner max-w-md">
              <input type="email" placeholder={t("newsletterPlaceholder")} className="flex-1 bg-transparent border-none focus:ring-0 px-4 font-body" />
              <button className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:brightness-110 transition-all">{t("suscribirme")}</button>
            </div>
          </div>
        </div>
      </section>

      <div className="h-24"></div>
    </main>
  );
}