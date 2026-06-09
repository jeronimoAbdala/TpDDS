export default function ResumenCard({ title, value, description }) {
  return (
    <div className="resumen-card">
      <h3>{title}</h3>
      <p className="resumen-value">{value}</p>
      {description && <p className="resumen-desc">{description}</p>}
    </div>
  )
}
