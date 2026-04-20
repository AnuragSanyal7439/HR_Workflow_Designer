import { ConfigPanel } from './ConfigPanel'
import { NodePalette } from './NodePalette'
import { WorkflowCanvas } from './WorkflowCanvas'

export function AppLayout() {
  return (
    <main className="designer-shell" aria-label="HR workflow designer">
      <NodePalette />
      <WorkflowCanvas />
      <ConfigPanel />
    </main>
  )
}
