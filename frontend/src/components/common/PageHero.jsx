export default function PageHero({ eyebrow, title, description, icon, action }) {
  return (
    <section className="page-hero">
      <div>
        {eyebrow && (
          <p className="page-hero-eyebrow">
            {eyebrow}
          </p>
        )}

        <h1>{title}</h1>

        {description && (
          <p className="page-hero-subtitle">
            {description}
          </p>
        )}
      </div>

      <div className="page-hero-side">
        {action && (
          <div className="page-hero-action">
            {action}
          </div>
        )}

        {icon && (
          <div className="page-hero-icon">
            {icon}
          </div>
        )}
      </div>
    </section>
  )
}