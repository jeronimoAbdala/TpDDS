export default function ResumenCard({
  title,
  value,
  description,
  icon,
  variant = 'neutral',
}) {
  return (
    <div className={`resumen-card resumen-card-${variant}`}>
      {icon && (
        <div className="resumen-card-icon">
          {icon}
        </div>
      )}

      <div className="resumen-card-content">
        <h3>{title}</h3>

        <p className="resumen-value">
          {value}
        </p>

        {description && (
          <p className="resumen-desc">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
