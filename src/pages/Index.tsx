import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/portfolio/Hero";
import Section from "@/components/portfolio/Section";
import ProjectCard from "@/components/portfolio/ProjectCard";

interface Profile {
  full_name: string; title: string; tagline: string | null; bio: string | null;
  email: string | null; phone: string | null; location: string | null;
  linkedin: string | null; github: string | null; avatar_url: string | null;
}

const Index = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [education, setEducation] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    document.title = "Mohamed Arshath — Cloud Specialist Portfolio";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Cloud Specialist portfolio of Mohamed Arshath — cloud computing, cybersecurity, and modern web projects.");

    (async () => {
      const [{ data: p }, { data: e }, { data: x }, { data: s }, { data: pr }] = await Promise.all([
        supabase.from("profile").select("*").maybeSingle(),
        supabase.from("education").select("*").order("sort_order"),
        supabase.from("experience").select("*").order("sort_order"),
        supabase.from("skills").select("*").order("sort_order"),
        supabase.from("projects").select("*").order("sort_order"),
      ]);
      setProfile(p as any);
      setEducation(e || []);
      setExperience(x || []);
      setSkills(s || []);
      setProjects(pr || []);
    })();
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero profile={profile} />

        {profile.bio && (
          <Section id="about" eyebrow="Chapter I" title="About">
            <p className="font-serif text-lg md:text-xl leading-relaxed text-foreground/90 first-letter:font-bold first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:font-serif">
              {profile.bio}
            </p>
          </Section>
        )}

        <Section id="projects" eyebrow="Chapter II" title="Selected Projects">
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((p) => <ProjectCard key={p.id} p={p} />)}
          </div>
        </Section>

        <Section id="education" eyebrow="Chapter III" title="Education">
          <div className="space-y-8">
            {education.map((e) => (
              <div key={e.id} className="grid md:grid-cols-[180px_1fr] gap-4 md:gap-8 pb-8 border-b border-border last:border-0">
                <p className="text-sm uppercase tracking-wider text-accent font-medium">{e.period}</p>
                <div>
                  <h3 className="font-serif text-xl font-bold mb-1">{e.degree}</h3>
                  <p className="text-secondary mb-3 italic">{e.institution}</p>
                  {e.description && <p className="text-muted-foreground leading-relaxed mb-3">{e.description}</p>}
                  {e.coursework && (
                    <p className="text-sm"><span className="font-semibold text-foreground">Coursework: </span><span className="text-muted-foreground">{e.coursework}</span></p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="experience" eyebrow="Chapter IV" title="Experience">
          <div className="space-y-8">
            {experience.map((x) => (
              <div key={x.id} className="grid md:grid-cols-[180px_1fr] gap-4 md:gap-8 pb-8 border-b border-border last:border-0">
                <p className="text-sm uppercase tracking-wider text-accent font-medium">{x.period}</p>
                <div>
                  <h3 className="font-serif text-xl font-bold mb-1">{x.role}</h3>
                  <p className="text-secondary mb-1 italic">{x.company}{x.location ? ` · ${x.location}` : ""}</p>
                  {x.description && <p className="text-muted-foreground leading-relaxed mt-3">{x.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="skills" eyebrow="Chapter V" title="Skills & Expertise">
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
            {skills.map((s) => (
              <div key={s.id} className="flex justify-between items-baseline gap-4 pb-3 border-b border-dashed border-border">
                <span className="font-serif font-bold text-lg">{s.category}</span>
                <span className="text-muted-foreground text-sm text-right">{s.items}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="contact" eyebrow="Epilogue" title="Get in Touch">
          <div className="text-center max-w-xl mx-auto">
            <p className="font-serif italic text-xl text-muted-foreground mb-6">
              "Open to opportunities in cloud infrastructure, cybersecurity, and modern web engineering."
            </p>
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="inline-block bg-primary text-primary-foreground px-8 py-3 font-medium tracking-wider uppercase text-sm hover:bg-secondary transition-colors"
              >
                {profile.email}
              </a>
            )}
            <div className="ornament mt-10"><span className="text-gold">❦</span></div>
          </div>
        </Section>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <div className="container-classical">
          <p className="font-serif italic">© {new Date().getFullYear()} {profile.full_name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
