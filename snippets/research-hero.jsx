export const ResearchHero = ({ eyebrow, title, description }) => (
  <div className="research-hero">
    {eyebrow ? <span className="research-hero-eyebrow">{eyebrow}</span> : null}
    <h1 className="research-hero-title">{title}</h1>
    {description ? <p className="research-hero-description">{description}</p> : null}
  </div>
);

export const ResearchStat = ({ value, label }) => (
  <div className="research-stat">
    <div className="research-stat-value">{value}</div>
    <div className="research-stat-label">{label}</div>
  </div>
);

export const ResearchStatGrid = ({ children }) => (
  <div className="research-stat-grid">{children}</div>
);
