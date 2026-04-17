import { ExternalLink, Github } from "lucide-react";

interface Project {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  tech_stack: string | null;
  live_url: string | null;
  github_url: string | null;
}

const ProjectCard = ({ p }: { p: Project }) => (
  <article className="border border-border bg-card p-6 md:p-8 shadow-classical hover:shadow-md transition-shadow">
    {p.category && (
      <p className="text-[11px] uppercase tracking-[0.25em] text-accent mb-2">{p.category}</p>
    )}
    <h3 className="font-serif text-2xl font-bold mb-3">{p.title}</h3>
    {p.description && (
      <p className="text-muted-foreground leading-relaxed mb-4">{p.description}</p>
    )}
    {p.tech_stack && (
      <p className="text-xs text-secondary font-medium mb-5 uppercase tracking-wider">{p.tech_stack}</p>
    )}
    <div className="flex flex-wrap gap-3">
      {p.live_url && (
        <a
          href={p.live_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary border-b border-primary/40 hover:border-primary pb-0.5 transition-colors"
        >
          <ExternalLink className="w-4 h-4" /> Live Demo
        </a>
      )}
      {p.github_url && (
        <a
          href={p.github_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-secondary border-b border-secondary/40 hover:border-secondary pb-0.5 transition-colors"
        >
          <Github className="w-4 h-4" /> Repository
        </a>
      )}
    </div>
  </article>
);

export default ProjectCard;
