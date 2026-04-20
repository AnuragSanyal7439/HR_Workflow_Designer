import type { NodeVersionHistoryEntry } from '../types/workflow'

type NodeVersionHistoryProps = {
  entries: NodeVersionHistoryEntry[]
}

export function NodeVersionHistory({ entries }: NodeVersionHistoryProps) {
  return (
    <section className="node-history" aria-label="Node version history">
      <div>
        <p className="panel-eyebrow">History</p>
        <h3>Recent Changes</h3>
      </div>

      {entries.length > 0 ? (
        <ul>
          {[...entries].reverse().map((entry) => (
            <li key={`${entry.sequence}-${entry.fieldName}`}>
              {formatFieldName(entry.fieldName)} changed from{' '}
              <strong>{formatValue(entry.previousValue)}</strong> to{' '}
              <strong>{formatValue(entry.newValue)}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <p className="node-history__empty">No config changes yet.</p>
      )}
    </section>
  )
}

function formatFieldName(fieldName: string) {
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (character) => character.toUpperCase())
}

function formatValue(value: unknown) {
  if (value === undefined || value === null || value === '') {
    return 'empty'
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return `"${String(value)}"`
}
