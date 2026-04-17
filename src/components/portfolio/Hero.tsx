import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";
import profileImg from "@/assets/profile.jpg";

interface HeroProps {
  profile: {
    full_name: string;
    title: string;
    tagline: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
    linkedin: string | null;
    github: string | null;
    avatar_url: string | null;
  };
}

const Hero = ({ profile }: HeroProps) => {
  const avatar = profile.avatar_url || profileImg;
  return (
    <section className="container-classical pt-16 pb-12 md:pt-24 md:pb-16 animate-fade-up">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-6">Portfolio · Anno {new Date().getFullYear()}</p>
        <div className="ornament">
          <span className="font-serif italic text-sm">M · A</span>
        </div>
        <h1 className="font-serif text-5xl md:text-7xl font-bold leading-[1.05] mb-4">
          {profile.full_name}
        </h1>
        <p className="font-serif italic text-xl md:text-2xl text-secondary mb-6">
          {profile.title}
        </p>
        {profile.tagline && (
          <p className="max-w-2xl mx-auto text-muted-foreground text-base md:text-lg leading-relaxed">
            {profile.tagline}
          </p>
        )}

        <div className="ornament mt-10">
          <span className="text-gold text-lg">❦</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
          {profile.location && (
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {profile.location}</span>
          )}
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-foreground">
              <Mail className="w-4 h-4" /> {profile.email}
            </a>
          )}
          {profile.phone && (
            <a href={`tel:${profile.phone}`} className="flex items-center gap-2 hover:text-foreground">
              <Phone className="w-4 h-4" /> {profile.phone}
            </a>
          )}
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-foreground">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          )}
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-foreground">
              <Github className="w-4 h-4" /> GitHub
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
