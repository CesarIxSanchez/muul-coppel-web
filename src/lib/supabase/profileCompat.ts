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
  // Legacy schema: perfiles(nombre_completo, tipo_cuenta, idioma...)
  const oldRes = await supabase
    .from("perfiles")
    .select("id,nombre_completo,tipo_cuenta,idioma,avatar_url,ciudad,created_at")
    .eq("id", userId)
    .maybeSingle();

  if (!oldRes.error && oldRes.data) {
    return normalizePerfil(oldRes.data, "perfiles_old", userId);
  }

  // New schema variant: perfiles(nombre, tipo, foto_url, idioma...)
  const newRes = await supabase
    .from("perfiles")
    .select("id,nombre,tipo,idioma,foto_url,created_at")
    .eq("id", userId)
    .maybeSingle();

  if (!newRes.error && newRes.data) {
    return normalizePerfil(newRes.data, "perfiles_new", userId);
  }

  // Fallback schema: users(username, language...)
  const userRes = await supabase
    .from("users")
    .select("id,username,language,created_at")
    .eq("id", userId)
    .maybeSingle();

  if (!userRes.error && userRes.data) {
    return normalizePerfil(userRes.data, "users", userId);
  }

  return null;
}

export async function updateIdiomaCompat(
  supabase: AnySupabase,
  userId: string,
  idioma: string
): Promise<boolean> {
  // Try common schema first
  const perfilUpdate = await supabase.from("perfiles").update({ idioma }).eq("id", userId);
  if (!perfilUpdate.error) return true;

  // Fallback schema
  const userUpdate = await supabase.from("users").update({ language: idioma }).eq("id", userId);
  if (!userUpdate.error) return true;

  return false;
}
