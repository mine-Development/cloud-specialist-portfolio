import { Link, useLocation } from "react-router-dom";

const SiteHeader = () => {
  const { pathname } = useLocation();
  const onAdmin = pathname.startsWith("/admin");

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-40">
      <div className="container-classical flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="font-serif text-xl font-bold tracking-tight">M·A</span>
          <span className="hidden sm:inline text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Cloud Specialist
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {!onAdmin && (
            <>
              <a href="#about" className="hover:text-accent transition-colors">About</a>
              <a href="#projects" className="hover:text-accent transition-colors">Projects</a>
              <a href="#experience" className="hover:text-accent transition-colors hidden sm:inline">Experience</a>
              <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
            </>
          )}
          {onAdmin && (
            <Link to="/" className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground">
              View Site
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
