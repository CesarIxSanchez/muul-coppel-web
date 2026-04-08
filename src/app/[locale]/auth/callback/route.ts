import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const validLocales = ["es", "en", "zh", "pt"];

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/perfil";

  // Leer locale desde cookie de next-intl
  const cookieHeader = request.headers.get("cookie") ?? "";
  const localeCookie = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("NEXT_LOCALE="));
  const locale = localeCookie?.split("=")?.[1] ?? "es";
  const safeLocale = validLocales.includes(locale) ? locale : "es";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/${safeLocale}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/${safeLocale}/login`);
}