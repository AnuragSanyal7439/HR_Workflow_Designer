import type { WorkflowSimulationResult } from '../utils/workflowSimulation'

type SimulationPanelProps = {
  result: WorkflowSimulationResult
}

export function SimulationPanel({ result }: SimulationPanelProps) {
  return (
    <section className="simulation-panel" aria-label="Workflow simulation result">
      <div className="simulation-panel__header">
        <div>
          <p className="panel-eyebrow">Sandbox</p>
          <h3>Simulation Output</h3>
        </div>
        <span className={result.success ? 'simulation-badge' : 'simulation-badge simulation-badge--error'}>
          {result.success ? 'Ready' : 'Invalid'}
        </span>
      </div>

      {result.success ? (
        <ol className="simulation-log">
          {result.log.map((entry) => (
            <li key={entry}>{entry}</li>
          ))}
        </ol>
      ) : (
        <p className="simulation-error">{result.error}</p>
      )}
    </section>
  )
}
