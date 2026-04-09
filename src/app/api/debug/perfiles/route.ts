import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log("=== DEBUG API ===");
    console.log("URL:", supabaseUrl);
    console.log("Service Key (primeros 20 chars):", supabaseServiceKey?.substring(0, 20) + "...");
    console.log("Service Key presente:", !!supabaseServiceKey);
    console.log("Service Key length:", supabaseServiceKey?.length);

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("❌ Faltan credenciales");
      return NextResponse.json(
        { error: "Missing Supabase credentials" },
        { status: 500 }
      );
    }

    const supabase = createSupabaseClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    console.log("✅ Cliente Supabase creado");


    console.log("🔄 Intentando SELECT...");
    const { data: perfiles, error: err } = await supabase
      .from("perfiles")
      .select("id,nombre,apellido,correo,username,telefono,idioma,created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    console.log("Response:", { data: perfiles?.length, error: err });

    if (err) {
      console.error("❌ Error SELECT:", err);
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: 400 }
      );
    }

    console.log("✅ SELECT exitoso:", perfiles?.length, "registros");

    return NextResponse.json({
      success: true,
      total: perfiles?.length || 0,
      perfiles: perfiles || [],
    });
  } catch (error) {
    console.error("❌ Error en API:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
