"use client";

import { useState } from "react";
import { useLocale } from "next-intl";

export default function DebugSignupNegocioPage() {
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleDebugSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup-negocio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombrePropietario: "Carlos",
          apellidoPropietario: "Martínez",
          cp: "28001",
          telefonoPropietario: "+34912345678",
          correoPropietario: "carlos@example.com",
          nombreNegocio: "La Tienda de Carlos",
          categoriaNegocio: "comercio_tiendas",
          latitud: 19.4326,
          longitud: -99.1677,
          direccion: "Avenida Paseo 100",
          email: `negocio-${Date.now()}@example.com`,
          password: "password123",
          caracteristicas: ["pago_tarjeta", "pet_friendly"],
          locale: locale === "es" ? "es-MX" : locale,
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003e6f] to-[#0d5fa0] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">🧪 Debug: Signup Negocio</h1>

        <div className="grid grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Test Form</h2>
            <form onSubmit={handleDebugSubmit} className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#003e6f] text-white font-bold py-3 rounded-lg hover:bg-[#002e52] disabled:opacity-50"
              >
                {loading ? "Registrando..." : "Registrar Negocio de Prueba"}
              </button>
            </form>
          </div>

          {/* Response */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Response</h2>
            {response ? (
              <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto max-h-96 text-xs">
                {JSON.stringify(response, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-500">Click the button to test...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
