export default function EmptyState({ message = 'No hay datos disponibles.' }) {
  return <div className="empty-state">{message}</div>
}
