// Bootstraps the single admin account. Idempotent: safe to call repeatedly.
// Public so it can be invoked from the client once. After admin exists, it just no-ops.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "nz.portfolio@admin.local";
const ADMIN_PASSWORD = "admin!view";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Check if any admin already exists
    const { data: existingRoles } = await supabase
      .from("user_roles")
      .select("id")
      .eq("role", "admin")
      .limit(1);

    if (existingRoles && existingRoles.length > 0) {
      return new Response(
        JSON.stringify({ ok: true, message: "Admin already exists" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Create admin user
    const { data: created, error: createErr } = await supabase.auth.admin
      .createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
      });

    let userId = created?.user?.id;

    if (createErr && !userId) {
      // User may already exist — look it up
      const { data: list } = await supabase.auth.admin.listUsers();
      const found = list?.users?.find((u) => u.email === ADMIN_EMAIL);
      userId = found?.id;
      if (!userId) throw createErr;
    }

    // Insert admin role
    const { error: roleErr } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" });

    if (roleErr && !roleErr.message.includes("duplicate")) throw roleErr;

    return new Response(
      JSON.stringify({ ok: true, message: "Admin created" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: String(e) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
