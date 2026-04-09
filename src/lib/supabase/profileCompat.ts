import type { Perfil, TipoCuenta } from "@/types/database";

type AnySupabase = any;

function mapTipoCuenta(value?: string | null): TipoCuenta {
  if (!value) return "turista";
  if (value === "negocio" || value === "empresa") return "negocio";
  return "turista";
}

function normalizePerfil(row: any, source: "perfiles_old" | "perfiles_new" | "users", userId: string): Perfil {
  const nombreCompleto =
    row?.nombre_completo || row?.nombre || row?.username || "Usuario";

  const idioma = row?.idioma || row?.language || "es-MX";
  const tipo = mapTipoCuenta(row?.tipo_cuenta || row?.tipo);
  const avatar = row?.avatar_url || row?.foto_url || null;

  return {
    id: row?.id || userId,
    nombre_completo: nombreCompleto,
    tipo_cuenta: tipo,
    idioma,
    avatar_url: avatar,
    ciudad: row?.ciudad || null,
    created_at: row?.created_at || new Date().toISOString(),
  };
}

export async function getPerfilCompat(supabase: AnySupabase, userId: string): Promise<Perfil | null> {

  const res = await supabase
    .from("perfiles")
    .select("id,nombre,apellido,nombre_completo,tipo_cuenta,idioma,foto_url,ciudad,created_at")
    .eq("id", userId)
    .maybeSingle();

  if (!res.error && res.data) {
    return normalizePerfil(res.data, "perfiles_new", userId);
  }

  return null;
}

export async function updateIdiomaCompat(
  supabase: AnySupabase,
  userId: string,
  idioma: string
): Promise<boolean> {

  const result = await supabase
    .from("perfiles")
    .update({ idioma })
    .eq("id", userId);

  return !result.error;
}
