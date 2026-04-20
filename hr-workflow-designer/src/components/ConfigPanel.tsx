import { useWorkflowStore } from '../store/workflowStore'
import type {
  NodeVersionHistoryEntry,
  WorkflowNode,
  WorkflowNodeByType,
} from '../types/workflow'
import { ApprovalNodeForm } from './ApprovalNodeForm'
import { AutomatedNodeForm } from './AutomatedNodeForm'
import { EndNodeForm } from './EndNodeForm'
import { NodeVersionHistory } from './NodeVersionHistory'
import { StartNodeForm } from './StartNodeForm'
import { TaskNodeForm } from './TaskNodeForm'

const EMPTY_NODE_HISTORY: NodeVersionHistoryEntry[] = []

function renderNodeForm(node: WorkflowNode) {
  switch (node.type) {
    case 'start':
      return <StartNodeForm node={node as WorkflowNodeByType['start']} />
    case 'task':
      return <TaskNodeForm node={node as WorkflowNodeByType['task']} />
    case 'approval':
      return <ApprovalNodeForm node={node as WorkflowNodeByType['approval']} />
    case 'automated':
      return <AutomatedNodeForm node={node as WorkflowNodeByType['automated']} />
    case 'end':
      return <EndNodeForm node={node as WorkflowNodeByType['end']} />
    default:
      return null
  }
}

export function ConfigPanel() {
  const selectedNode = useWorkflowStore((state) => state.getSelectedNode())
  const selectedNodeHistory = useWorkflowStore((state) =>
    selectedNode ? state.getNodeVersionHistory(selectedNode.id) : EMPTY_NODE_HISTORY,
  )

  return (
    <aside className="config-panel" aria-label="Configuration panel">
      <div>
        <p className="panel-eyebrow">Config</p>
        <h2>Node Settings</h2>
      </div>

      {selectedNode ? (
        <div className="config-card config-card--form">
          <div className="config-row config-row--header">
            <span>Type</span>
            <strong>{selectedNode.type ?? 'unknown'}</strong>
          </div>

          {renderNodeForm(selectedNode)}
          <NodeVersionHistory entries={selectedNodeHistory} />
        </div>
      ) : (
        <div className="config-empty">
          <h3>No node selected</h3>
          <p>
            Select a node on the canvas to view its basic configuration.
          </p>
        </div>
      )}
    </aside>
  )
}
