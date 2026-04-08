"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function AuthPage() {
  const router = useRouter();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    username: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre.trim()) {
      setError("El nombre es requerido");
      return;
    }
    if (!formData.apellido.trim()) {
      setError("El apellido es requerido");
      return;
    }
    if (!formData.username.trim()) {
      setError("El nombre de usuario es requerido");
      return;
    }
    if (!formData.email.trim()) {
      setError("El correo es requerido");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("El correo no es válido");
      return;
    }
    if (!formData.telefono.trim()) {
      setError("El teléfono es requerido");
      return;
    }
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!formData.terms) {
      setError("Debes aceptar los términos y condiciones");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/signup-turista", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          username: formData.username,
          email: formData.email,
          telefono: formData.telefono,
          password: formData.password,
          locale: locale === "es" ? "es-MX" : locale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al registrar");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/perfil"), 2000);
    } catch (err) {
      setError("Error al registrar la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Ambient Decoration */}
      <div className="fixed bottom-[-10rem] right-[-10rem] w-80 h-80 bg-secondary-container/20 blur-[100px] rounded-full -z-10"></div>
      <div className="fixed top-[-5rem] left-[-5rem] w-64 h-64 bg-primary/10 blur-[80px] rounded-full -z-10"></div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl h-20 flex items-center px-8 md:px-16">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-black tracking-tight text-primary font-headline italic brand-clearspace">
            MUUL
          </span>
          <div className="h-4 w-[1px] bg-outline-variant/30 mx-4"></div>
          <span className="font-label text-xs tracking-widest text-primary uppercase">
            Registro Turista
          </span>
        </div>
      </header>

      <main className="min-h-screen flex items-center justify-center pt-20 px-6">
        {/* Asymmetric Layout Container */}
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side: Editorial Content */}
          <div className="hidden lg:flex lg:col-span-6 flex-col space-y-8 pr-12">
            <div className="space-y-4">
              <span className="font-label text-primary text-sm font-bold tracking-tighter uppercase">
                Inteligencia en Movimiento
              </span>
              <h1 className="text-6xl font-headline italic text-primary leading-tight">
                Únete a MUUL
              </h1>
              <p className="text-on-surface-variant text-lg max-w-md leading-relaxed">
                Crea tu cuenta y comienza a explorar las mejores rutas. Descubre experiencias curadas por inteligencia artificial.
              </p>
            </div>

            {/* Bento-style Small Highlights */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-low p-6 rounded-xl space-y-2 border border-outline-variant/10">
                <span className="material-symbols-outlined text-primary text-3xl">map</span>
                <h3 className="font-headline italic text-xl text-primary">Explora Rutas</h3>
                <p className="text-sm text-on-surface-variant">Descubre nuevos lugares inteligentemente.</p>
              </div>
              <div className="bg-primary text-white p-6 rounded-xl space-y-2">
                <span className="material-symbols-outlined text-3xl">community</span>
                <h3 className="font-headline italic text-xl">Comunidad</h3>
                <p className="text-sm opacity-80">Conecta con otros viajeros como tú.</p>
              </div>
            </div>
          </div>

          {/* Right Side: Registration Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-surface-container-lowest p-10 rounded-[2rem] shadow-sm shadow-on-surface/5 relative overflow-hidden">
              <div className="absolute inset-0 paper-texture pointer-events-none"></div>

              <div className="relative z-10">
                {/* Mobile Branding */}
                <div className="lg:hidden mb-8 flex justify-center">
                  <span className="text-3xl font-black tracking-tight text-primary font-headline italic">
                    MUUL
                  </span>
                </div>

                {/* Title */}
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-headline italic text-primary mb-2">
                    Crear Cuenta
                  </h2>
                  <p className="font-label text-xs text-on-surface-variant uppercase tracking-widest">
                    Registra tu cuenta de turista
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-error/10 border border-error rounded-xl">
                    <p className="text-error text-sm font-medium">❌ {error}</p>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="mb-6 p-4 bg-tertiary/10 border border-tertiary rounded-xl">
                    <p className="text-tertiary text-sm font-medium">
                      ✅ ¡Cuenta creada! Redirigiendo...
                    </p>
                  </div>
                )}

                {/* Registration Form */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {/* Nombre */}
                  <div className="space-y-1.5">
                    <label className="font-label text-xs font-bold text-primary px-1" htmlFor="nombre">
                      NOMBRE
                    </label>
                    <input
                      className="w-full h-12 px-4 bg-surface-container-low border-0 rounded-xl focus:ring-2 focus:ring-secondary-container transition-all text-on-surface placeholder:text-outline-variant"
                      id="nombre"
                      name="nombre"
                      placeholder="Juan"
                      type="text"
                      value={formData.nombre}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>

                  {/* Apellido */}
                  <div className="space-y-1.5">
                    <label className="font-label text-xs font-bold text-primary px-1" htmlFor="apellido">
                      APELLIDO
                    </label>
                    <input
                      className="w-full h-12 px-4 bg-surface-container-low border-0 rounded-xl focus:ring-2 focus:ring-secondary-container transition-all text-on-surface placeholder:text-outline-variant"
                      id="apellido"
                      name="apellido"
                      placeholder="García"
                      type="text"
                      value={formData.apellido}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>

                  {/* Username */}
                  <div className="space-y-1.5">
                    <label className="font-label text-xs font-bold text-primary px-1" htmlFor="username">
                      NOMBRE DE USUARIO
                    </label>
                    <div className="flex items-center h-12 px-4 bg-surface-container-low rounded-xl border border-transparent focus-within:ring-2 focus-within:ring-secondary-container transition-all">
                      <span className="text-outline-variant font-label text-sm">@</span>
                      <input
                        className="flex-1 h-full bg-transparent border-0 focus:outline-none focus:ring-0 pl-2 text-on-surface placeholder:text-outline-variant"
                        id="username"
                        name="username"
                        placeholder="tuusuario"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="font-label text-xs font-bold text-primary px-1" htmlFor="email">
                      CORREO ELECTRÓNICO
                    </label>
                    <input
                      className="w-full h-12 px-4 bg-surface-container-low border-0 rounded-xl focus:ring-2 focus:ring-secondary-container transition-all text-on-surface placeholder:text-outline-variant"
                      id="email"
                      name="email"
                      placeholder="correo@ejemplo.com"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>

                  {/* Telefono */}
                  <div className="space-y-1.5">
                    <label className="font-label text-xs font-bold text-primary px-1" htmlFor="telefono">
                      TELÉFONO
                    </label>
                    <input
                      className="w-full h-12 px-4 bg-surface-container-low border-0 rounded-xl focus:ring-2 focus:ring-secondary-container transition-all text-on-surface placeholder:text-outline-variant"
                      id="telefono"
                      name="telefono"
                      placeholder="+1 (555) 000-0000"
                      type="tel"
                      value={formData.telefono}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="font-label text-xs font-bold text-primary px-1" htmlFor="password">
                      CONTRASEÑA
                    </label>
                    <input
                      className="w-full h-12 px-4 bg-surface-container-low border-0 rounded-xl focus:ring-2 focus:ring-secondary-container transition-all text-on-surface"
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="font-label text-xs font-bold text-primary px-1" htmlFor="confirmPassword">
                      CONFIRMAR CONTRASEÑA
                    </label>
                    <input
                      className="w-full h-12 px-4 bg-surface-container-low border-0 rounded-xl focus:ring-2 focus:ring-secondary-container transition-all text-on-surface"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="••••••••"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>

                  {/* Terms */}
                  <div className="flex items-start space-x-3 pt-2">
                    <input
                      className="w-5 h-5 mt-0.5 accent-primary rounded"
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={formData.terms}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <label className="font-body text-xs text-on-surface-variant leading-relaxed" htmlFor="terms">
                      Acepto los{" "}
                      <a className="text-primary font-bold hover:underline" href="#">
                        términos y condiciones
                      </a>{" "}
                      y la{" "}
                      <a className="text-primary font-bold hover:underline" href="#">
                        política de privacidad
                      </a>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    className="w-full h-12 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-full shadow-lg shadow-primary/10 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center space-x-2 mt-2 disabled:opacity-50"
                    type="submit"
                    disabled={loading}
                  >
                    <span className="font-body">{loading ? "Registrando..." : "Registrarse"}</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-outline-variant/20"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-surface-container-lowest px-4 text-outline-variant font-label">
                      O regístrate con
                    </span>
                  </div>
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    className="flex items-center justify-center space-x-3 h-14 bg-surface-container-low rounded-full border border-outline-variant/10 hover:bg-surface-container-high transition-colors active:scale-95"
                    type="button"
                    disabled={loading}
                  >
                    <img
                      alt="Google"
                      className="w-5 h-5"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnQR8mFjs3poEa1YLSA32bkwizQNWrIXeRDq329ftSailTU5hK6HSGsFTczG6vH26g703bwz98AN1aLhV1ZwB0hYW1ZwKRZLO9o1Pas_25_GSOdf8g7FIdf6igCwO49AE2Ap-jqY7felnLk6lorbEQICTaCrwGxO8gt2v7p69ZcAbw_dheRqhk9qU7ZvGf4onWvVu-3o5Ri5NDPGRCBmq9yvN1vElBo3Ch9HI3kMg-3dc79qdbvxrKTysVzeYjAe9qDEiEFrhvkSI"
                    />
                    <span className="font-body font-bold text-sm text-on-surface">Google</span>
                  </button>
                  <button
                    className="flex items-center justify-center space-x-3 h-14 bg-surface-container-low rounded-full border border-outline-variant/10 hover:bg-surface-container-high transition-colors active:scale-95"
                    type="button"
                    disabled={loading}
                  >
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      ios
                    </span>
                    <span className="font-body font-bold text-sm text-on-surface">Apple</span>
                  </button>
                </div>

                {/* Link to Login */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-on-surface-variant">
                    ¿Ya tienes cuenta?{" "}
                    <a
                      className="text-primary font-bold hover:text-secondary transition-colors underline decoration-secondary-container decoration-2 underline-offset-4"
                      href="#"
                    >
                      Inicia sesión
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-12 px-8 bg-surface-container-low">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex items-center space-x-6">
            <span className="text-xl font-black text-primary font-headline italic">MUUL</span>
            <span className="text-xs text-on-surface-variant font-label">
              © 2024 MUUL by Coppel. Todos los derechos reservados.
            </span>
          </div>
          <nav className="flex space-x-8">
            <a className="text-xs font-label text-on-surface-variant hover:text-primary transition-colors" href="#">
              Privacidad
            </a>
            <a className="text-xs font-label text-on-surface-variant hover:text-primary transition-colors" href="#">
              Términos
            </a>
            <a className="text-xs font-label text-on-surface-variant hover:text-primary transition-colors" href="#">
              Ayuda
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
