import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Trash2, Plus, Save, LogOut } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

type TableName = "education" | "experience" | "skills" | "projects";

const FIELDS: Record<TableName, { name: string; label: string; textarea?: boolean }[]> = {
  education: [
    { name: "degree", label: "Degree" },
    { name: "institution", label: "Institution" },
    { name: "period", label: "Period" },
    { name: "description", label: "Description", textarea: true },
    { name: "coursework", label: "Coursework", textarea: true },
  ],
  experience: [
    { name: "role", label: "Role" },
    { name: "company", label: "Company" },
    { name: "period", label: "Period" },
    { name: "location", label: "Location" },
    { name: "description", label: "Description", textarea: true },
  ],
  skills: [
    { name: "category", label: "Category" },
    { name: "items", label: "Items", textarea: true },
  ],
  projects: [
    { name: "title", label: "Title" },
    { name: "category", label: "Category" },
    { name: "description", label: "Description", textarea: true },
    { name: "tech_stack", label: "Tech Stack" },
    { name: "live_url", label: "Live Demo URL" },
    { name: "github_url", label: "GitHub URL" },
  ],
};

const PROFILE_FIELDS = [
  { name: "full_name", label: "Full Name" },
  { name: "title", label: "Title" },
  { name: "tagline", label: "Tagline", textarea: true },
  { name: "bio", label: "Bio", textarea: true },
  { name: "email", label: "Email" },
  { name: "phone", label: "Phone" },
  { name: "location", label: "Location" },
  { name: "linkedin", label: "LinkedIn URL" },
  { name: "github", label: "GitHub URL" },
];

const AdminDashboard = () => {
  const nav = useNavigate();
  const { user, isAdmin, loading } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [data, setData] = useState<Record<TableName, any[]>>({ education: [], experience: [], skills: [], projects: [] });

  useEffect(() => {
    document.title = "Dashboard — Admin";
    if (!loading && (!user || !isAdmin)) nav("/admin", { replace: true });
  }, [user, isAdmin, loading, nav]);

  const refreshAll = async () => {
    const [{ data: p }, { data: e }, { data: x }, { data: s }, { data: pr }] = await Promise.all([
      supabase.from("profile").select("*").maybeSingle(),
      supabase.from("education").select("*").order("sort_order"),
      supabase.from("experience").select("*").order("sort_order"),
      supabase.from("skills").select("*").order("sort_order"),
      supabase.from("projects").select("*").order("sort_order"),
    ]);
    setProfile(p);
    setData({ education: e || [], experience: x || [], skills: s || [], projects: pr || [] });
  };

  useEffect(() => {
    if (user && isAdmin) refreshAll();
  }, [user, isAdmin]);

  const saveProfile = async () => {
    const { id, updated_at, ...rest } = profile;
    const { error } = await supabase.from("profile").update(rest).eq("id", id);
    if (error) toast.error(error.message); else toast.success("Profile saved");
  };

  const saveItem = async (table: TableName, item: any) => {
    const { id, created_at, ...rest } = item;
    const { error } = await supabase.from(table).update(rest).eq("id", id);
    if (error) toast.error(error.message); else toast.success("Saved");
    refreshAll();
  };

  const deleteItem = async (table: TableName, id: string) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); refreshAll(); }
  };

  const addItem = async (table: TableName) => {
    const blank: any = { sort_order: (data[table].length + 1) * 10 };
    FIELDS[table].forEach((f) => (blank[f.name] = ""));
    // required NOT NULL fields per table
    const requiredDefaults: Record<TableName, Record<string, string>> = {
      education: { degree: "New Degree", institution: "Institution" },
      experience: { role: "New Role", company: "Company" },
      skills: { category: "New Category", items: "" },
      projects: { title: "New Project" },
    };
    Object.assign(blank, requiredDefaults[table]);
    const { error } = await supabase.from(table).insert(blank);
    if (error) toast.error(error.message); else { toast.success("Added"); refreshAll(); }
  };

  const updateField = (table: TableName, id: string, field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      [table]: prev[table].map((it) => (it.id === id ? { ...it, [field]: value } : it)),
    }));
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    nav("/admin");
  };

  if (loading || !user || !isAdmin) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <SiteHeader />
      <main className="container-classical flex-1 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Admin</p>
            <h1 className="font-serif text-3xl font-bold">Content Dashboard</h1>
          </div>
          <Button variant="outline" onClick={signOut}><LogOut className="w-4 h-4 mr-2" />Sign out</Button>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            {profile && (
              <div className="bg-card border border-border p-6 space-y-4 max-w-3xl">
                {PROFILE_FIELDS.map((f) => (
                  <div key={f.name} className="space-y-2">
                    <Label>{f.label}</Label>
                    {f.textarea ? (
                      <Textarea
                        value={profile[f.name] ?? ""}
                        onChange={(e) => setProfile({ ...profile, [f.name]: e.target.value })}
                        rows={3}
                      />
                    ) : (
                      <Input
                        value={profile[f.name] ?? ""}
                        onChange={(e) => setProfile({ ...profile, [f.name]: e.target.value })}
                      />
                    )}
                  </div>
                ))}
                <Button onClick={saveProfile}><Save className="w-4 h-4 mr-2" />Save Profile</Button>
              </div>
            )}
          </TabsContent>

          {(["education", "experience", "skills", "projects"] as TableName[]).map((table) => (
            <TabsContent key={table} value={table} className="mt-6">
              <Button onClick={() => addItem(table)} className="mb-4"><Plus className="w-4 h-4 mr-2" />Add {table.slice(0, -1)}</Button>
              <div className="space-y-4">
                {data[table].map((item) => (
                  <div key={item.id} className="bg-card border border-border p-5 space-y-3">
                    {FIELDS[table].map((f) => (
                      <div key={f.name} className="space-y-1">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">{f.label}</Label>
                        {f.textarea ? (
                          <Textarea
                            value={item[f.name] ?? ""}
                            onChange={(e) => updateField(table, item.id, f.name, e.target.value)}
                            rows={2}
                          />
                        ) : (
                          <Input
                            value={item[f.name] ?? ""}
                            onChange={(e) => updateField(table, item.id, f.name, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                    <div className="space-y-1">
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground">Sort Order</Label>
                      <Input
                        type="number"
                        value={item.sort_order ?? 0}
                        onChange={(e) => updateField(table, item.id, "sort_order", e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" onClick={() => saveItem(table, item)}><Save className="w-4 h-4 mr-2" />Save</Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteItem(table, item.id)}><Trash2 className="w-4 h-4 mr-2" />Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
