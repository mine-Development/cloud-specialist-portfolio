interface SectionProps {
  id?: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}

const Section = ({ id, eyebrow, title, children }: SectionProps) => (
  <section id={id} className="container-classical py-14 md:py-20">
    <div className="section-rule">
      <p className="text-[11px] uppercase tracking-[0.3em] text-accent mb-2">{eyebrow}</p>
      <h2 className="font-serif text-3xl md:text-4xl font-bold">{title}</h2>
    </div>
    {children}
  </section>
);

export default Section;
