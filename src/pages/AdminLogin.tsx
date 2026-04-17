import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import SiteHeader from "@/components/SiteHeader";

const ADMIN_EMAIL = "nz.portfolio@admin.local";

const AdminLogin = () => {
  const nav = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [username, setUsername] = useState("nz.portfolio");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bootstrapped, setBootstrapped] = useState(false);

  // Bootstrap admin user once
  useEffect(() => {
    if (bootstrapped) return;
    supabase.functions.invoke("bootstrap-admin").finally(() => setBootstrapped(true));
  }, [bootstrapped]);

  useEffect(() => {
    document.title = "Admin Login — Portfolio";
    if (!loading && user && isAdmin) nav("/admin/dashboard", { replace: true });
  }, [user, isAdmin, loading, nav]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Map username to internal email
    const email = username.includes("@") ? username : ADMIN_EMAIL;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) toast.error(error.message);
    else toast.success("Welcome back");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-2">Restricted Area</p>
            <h1 className="font-serif text-3xl font-bold">Admin Sign In</h1>
            <div className="ornament mt-4"><span className="text-gold">❦</span></div>
          </div>
          <form onSubmit={onSubmit} className="space-y-5 bg-card border border-border p-8 shadow-classical">
            <div className="space-y-2">
              <Label htmlFor="u">Username</Label>
              <Input id="u" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p">Password</Label>
              <Input id="p" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
