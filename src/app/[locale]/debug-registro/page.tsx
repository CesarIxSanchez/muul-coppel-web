"use client";

import { useEffect, useState } from "react";

interface PerfilData {
  id: string;
  tipo_cuenta: string;
  nombre: string;
  apellido: string;
  correo: string;
  username: string;
  telefono: string;
  idioma: string;
  created_at: string;
}

export default function DebugRegistro() {
  const [perfiles, setPerfiles] = useState<PerfilData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
          setError("Faltan credenciales de Supabase");
          return;
        }

        // Usar función RPC directamente
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/obtener_ultimos_perfiles`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({ limite: 10 }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Error RPC:", data);
          setError(`Error: ${data.message || data.error}`);
          return;
        }

        setPerfiles(data || []);
        console.log("Perfiles obtenidos:", data);
      } catch (err) {
        console.error("Error en debug:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // Refresh cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">🔍 Debug Registro</h1>

        {loading && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            ⏳ Cargando datos...
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            ❌ {error}
          </div>
        )}

        {/* Tabla de Perfiles */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            📋 Últimos 5 Perfiles Registrados
          </h2>

          {perfiles.length === 0 ? (
            <p className="text-gray-500">No hay perfiles registrados aún</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Nombre</th>
                    <th className="px-4 py-2 text-left">Apellido</th>
                    <th className="px-4 py-2 text-left">Usuario</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Teléfono</th>
                    <th className="px-4 py-2 text-left">Idioma</th>
                    <th className="px-4 py-2 text-left">Creado</th>
                  </tr>
                </thead>
                <tbody>
                  {perfiles.map((perfil, idx) => (
                    <tr
                      key={perfil.id}
                      className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-4 py-2 font-mono text-xs text-gray-600">
                        {perfil.id.substring(0, 8)}...
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={
                            perfil.nombre
                              ? "text-green-700 font-bold"
                              : "text-red-700"
                          }
                        >
                          {perfil.nombre || "❌ VACÍO"}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={
                            perfil.apellido
                              ? "text-green-700 font-bold"
                              : "text-red-700"
                          }
                        >
                          {perfil.apellido || "❌ VACÍO"}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={
                            perfil.username
                              ? "text-green-700 font-bold"
                              : "text-red-700"
                          }
                        >
                          {perfil.username || "❌ VACÍO"}
                        </span>
                      </td>
                      <td className="px-4 py-2 font-mono text-xs">
                        {perfil.correo}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={
                            perfil.telefono
                              ? "text-green-700 font-bold"
                              : "text-red-700"
                          }
                        >
                          {perfil.telefono || "❌ NULL"}
                        </span>
                      </td>
                      <td className="px-4 py-2">{perfil.idioma}</td>
                      <td className="px-4 py-2 text-xs text-gray-500">
                        {new Date(perfil.created_at).toLocaleString("es-MX")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Instrucciones */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 text-yellow-800">
            📝 ¿Cómo usar este debug?
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-yellow-900">
            <li>Abre otra pestaña y ve a <code className="bg-yellow-100 px-2 py-1 rounded">http://localhost:3000/es/auth</code></li>
            <li>Registra un nuevo turista con datos completos</li>
            <li>Vuelve a esta página - se actualiza automáticamente cada 3 segundos</li>
            <li>
              <strong>✅ CORRECTO:</strong> Si ves el nombre, apellido y teléfono en
              VERDE
            </li>
            <li>
              <strong>❌ ERROR:</strong> Si ves vacíos o NULL en ROJO, hay un
              problema
            </li>
          </ol>
        </div>

        {/* JSON Raw */}
        <div className="bg-gray-800 text-green-400 rounded-lg p-6 font-mono text-xs overflow-auto max-h-96">
          <h3 className="text-green-400 font-bold mb-4">🔧 Raw JSON Data</h3>
          <pre>
            {JSON.stringify(
              {
                total: perfiles.length,
                perfiles: perfiles.map((p) => ({
                  id: p.id,
                  nombre: p.nombre || null,
                  apellido: p.apellido || null,
                  usuario: p.username || null,
                  email: p.correo,
                  telefono: p.telefono || null,
                  idioma: p.idioma,
                  created_at: p.created_at,
                })),
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
