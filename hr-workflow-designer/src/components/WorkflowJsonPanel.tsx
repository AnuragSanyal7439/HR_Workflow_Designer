type WorkflowJsonPanelMode = 'export' | 'import'

type WorkflowJsonPanelProps = {
  mode: WorkflowJsonPanelMode
  json: string
  error: string | null
  onJsonChange: (json: string) => void
  onImport: () => void
  onClose: () => void
}

export function WorkflowJsonPanel({
  mode,
  json,
  error,
  onJsonChange,
  onImport,
  onClose,
}: WorkflowJsonPanelProps) {
  const isImportMode = mode === 'import'

  return (
    <section className="json-panel" aria-label="Workflow JSON panel">
      <div className="json-panel__header">
        <div>
          <p className="panel-eyebrow">JSON</p>
          <h3>{isImportMode ? 'Import Workflow' : 'Export Workflow'}</h3>
        </div>
        <button className="secondary-button" type="button" onClick={onClose}>
          Close
        </button>
      </div>

      <textarea
        readOnly={!isImportMode}
        rows={12}
        spellCheck={false}
        value={json}
        onChange={(event) => onJsonChange(event.target.value)}
      />

      {error && <p className="json-panel__error">{error}</p>}

      {isImportMode && (
        <button className="run-simulation-button" type="button" onClick={onImport}>
          Apply Import
        </button>
      )}
    </section>
  )
}
