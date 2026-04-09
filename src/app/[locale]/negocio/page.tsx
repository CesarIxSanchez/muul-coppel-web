"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import type { Negocio } from "@/types/database";

const categoryEmojis: Record<string, string> = {
  comida: "🌮",
  tienda: "🛍️",
  servicios: "🏨",
  cultural: "🏛️",
  deportes: "⚽",
};

export default function NegocioDashboardPage() {
  const supabase = createClient();
  const t = useTranslations("negocio");
  const tNav = useTranslations("nav");
  const tc = useTranslations("common");
  const [loading, setLoading] = useState(true);
  const [negocio, setNegocio] = useState<Negocio | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [fotoPerfil, setFotoPerfil] = useState("");
  const [banner, setBanner] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [caracteristicas, setCaracteristicas] = useState({
    pago_tarjeta: false,
    transferencias: false,
    pet_friendly: false,
    vegana: false,
    accesibilidad: false,
  });

  useEffect(() => {
    const loadBusiness = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      setAuthenticated(true);
      const { data } = await supabase
        .from("negocios")
        .select("*")
        .eq("propietario_id", user.id)
        .eq("activo", true)
        .limit(1);

      if (data && data.length > 0) {
        const neg = data[0] as Negocio;
        setNegocio(neg);
        setFotoPerfil(neg.foto_url || "");
        setBanner(neg.banner_url || "");
        setInstagram(neg.instagram || "");
        setFacebook(neg.facebook || "");
        setCaracteristicas({
          pago_tarjeta: neg.caracteristicas?.pago_tarjeta ?? false,
          transferencias: neg.caracteristicas?.transferencias ?? false,
          pet_friendly: neg.caracteristicas?.pet_friendly ?? false,
          vegana: neg.caracteristicas?.vegana ?? false,
          accesibilidad: neg.caracteristicas?.accesibilidad ?? false,
        });
      }
      setLoading(false);
    };

    loadBusiness();
  }, [supabase]);

  const handleGuardar = async () => {
    if (!negocio) return;

    const { error } = await supabase
      .from("negocios")
      .update({
        foto_url: fotoPerfil,
        banner_url: banner,
        instagram,
        facebook,
        caracteristicas,
      })
      .eq("id", negocio.id);

    if (!error) {
      setIsEditing(false);
      setSaveMessage(`✓ ${t("dashboardSaved")}`);
      setNegocio({
        ...negocio,
        foto_url: fotoPerfil,
        banner_url: banner,
        instagram,
        facebook,
        caracteristicas,
      });
      setTimeout(() => setSaveMessage(""), 3000);
    } else {
      setSaveMessage(`✗ ${t("dashboardSaveError")}`);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto min-h-screen px-6 py-24 flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-2xl">
          <div className="h-64 bg-surface-container-high rounded-3xl" />
          <div className="h-12 bg-surface-container-high rounded w-1/2" />
          <div className="h-6 bg-surface-container-high rounded w-3/4" />
        </div>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="max-w-4xl mx-auto min-h-screen px-6 py-24 flex flex-col items-center justify-center text-center gap-6">
        <span className="text-6xl">🔐</span>
        <h1 className="text-4xl font-bold">{t("dashboardAccessTitle")}</h1>
        <p className="text-on-surface-variant max-w-xl">{t("dashboardAccessDesc")}</p>
        <Link href="/login" className="px-8 py-4 bg-secondary text-on-secondary rounded-full font-bold">
          {tNav("login")}
        </Link>
      </main>
    );
  }

  if (!negocio) {
    return (
      <main className="max-w-4xl mx-auto min-h-screen px-6 py-24 flex flex-col items-center justify-center text-center gap-6">
        <span className="text-6xl">🏪</span>
        <h1 className="text-4xl font-bold">{t("dashboardEmptyTitle")}</h1>
        <p className="text-on-surface-variant max-w-xl">{t("dashboardEmptyDesc")}</p>
        <Link href="/tiendas" className="px-8 py-4 bg-primary text-white rounded-full font-bold">
          {t("dashboardRegister")}
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-20 pb-12">
      {/* BANNER */}
      <div className="relative h-64 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
        {banner && <img src={banner} alt="banner" className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Avatar */}
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl -mt-32 shrink-0 bg-surface-container-low flex items-center justify-center text-6xl">
            {fotoPerfil ? (
              <img src={fotoPerfil} alt={negocio.nombre} className="w-full h-full object-cover" />
            ) : (
              categoryEmojis[negocio.categoria] || "🏪"
            )}
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-center gap-4">
            <h1 className="text-5xl font-bold">{negocio.nombre}</h1>
            <p className="text-on-surface-variant text-lg">{negocio.descripcion}</p>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="px-3 py-1 bg-primary-container text-primary-fixed rounded-full text-sm font-bold">
                {tc(negocio.categoria)}
              </span>
              {negocio.verificado && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                  ✓ {t("verificado")}
                </span>
              )}
              <span className="text-gray-600">👥 {negocio.seguidores || 0} {t("dashboardFollowers")}</span>
            </div>

            <div className="flex gap-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleGuardar}
                    className="px-6 py-3 bg-green-600 text-white rounded-full font-bold hover:bg-green-700"
                  >
                    {t("guardar")}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border border-gray-300 rounded-full font-bold hover:bg-gray-100"
                  >
                    {t("cancelar")}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-primary text-white rounded-full font-bold hover:brightness-110"
                  >
                    {t("editarPerfil")}
                  </button>
                  <Link href={`/negocio/${negocio.id}`} className="px-6 py-3 border border-primary text-primary rounded-full font-bold hover:bg-primary/10">
                    {t("dashboardPublicPage")}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Características */}
        <section className="bg-surface-container-low rounded-3xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">{t("dashboardFeatures")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { key: "pago_tarjeta", label: t("featureCard"), emoji: "💳" },
              { key: "transferencias", label: t("featureTransfer"), emoji: "🏦" },
              { key: "pet_friendly", label: t("featurePetFriendly"), emoji: "🐶" },
              { key: "vegana", label: t("featureVegan"), emoji: "🥗" },
              { key: "accesibilidad", label: t("featureAccessible"), emoji: "♿" },
            ].map(({ key, label, emoji }) => (
              <button
                key={key}
                onClick={() =>
                  isEditing &&
                  setCaracteristicas({
                    ...caracteristicas,
                    [key]: !caracteristicas[key as keyof typeof caracteristicas],
                  })
                }
                disabled={!isEditing}
                className={`p-4 rounded-2xl text-center transition-all ${
                  caracteristicas[key as keyof typeof caracteristicas]
                    ? "bg-secondary text-white shadow-lg"
                    : "bg-surface-container-high text-gray-600"
                }`}
              >
                <div className="text-3xl mb-2">{emoji}</div>
                <div className="text-xs font-bold">{label}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Redes Sociales */}
        <section className="bg-surface-container-low rounded-3xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">{t("dashboardSocial")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-bold mb-2 block">{t("dashboardInstagram")}</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                disabled={!isEditing}
                placeholder="@usuario"
                className="w-full px-4 py-3 rounded-lg border border-outline-variant/20 bg-white disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="text-sm font-bold mb-2 block">{t("dashboardFacebook")}</label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                disabled={!isEditing}
                placeholder="facebook.com/usuario"
                className="w-full px-4 py-3 rounded-lg border border-outline-variant/20 bg-white disabled:bg-gray-100"
              />
            </div>
          </div>
        </section>

        {/* Estadísticas */}
        <section className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-primary/10 rounded-3xl p-6 text-center">
            <div className="text-3xl font-bold text-primary">245</div>
            <div className="text-sm text-gray-600">{t("dashboardVisits")}</div>
          </div>
          <div className="bg-secondary/10 rounded-3xl p-6 text-center">
            <div className="text-3xl font-bold text-secondary">18</div>
            <div className="text-sm text-gray-600">{t("dashboardProducts")}</div>
          </div>
          <div className="bg-tertiary/10 rounded-3xl p-6 text-center">
            <div className="text-3xl font-bold text-tertiary">4.8</div>
            <div className="text-sm text-gray-600">{t("dashboardRating")}</div>
          </div>
        </section>

        {/* URLs de edición */}
        {isEditing && (
          <section className="bg-yellow-50 rounded-3xl p-8 border border-yellow-200">
            <h3 className="font-bold mb-4">{t("dashboardUrls")}</h3>
            <div>
              <label className="text-sm font-bold mb-2 block">{t("dashboardProfileImageUrl")}</label>
              <input
                type="text"
                value={fotoPerfil}
                onChange={(e) => setFotoPerfil(e.target.value)}
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
