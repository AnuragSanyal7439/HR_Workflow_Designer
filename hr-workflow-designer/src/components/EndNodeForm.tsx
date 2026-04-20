import { useDraftValue } from '../hooks/useDraftValue'
import { useWorkflowStore } from '../store/workflowStore'
import type { WorkflowNodeByType } from '../types/workflow'

type EndNodeFormProps = {
  node: WorkflowNodeByType['end']
}

export function EndNodeForm({ node }: EndNodeFormProps) {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData)
  const [endMessage, setEndMessage] = useDraftValue(
    node.id,
    node.data.endMessage,
  )
  const [includeSummary, setIncludeSummary] = useDraftValue(
    node.id,
    node.data.includeSummary,
  )

  function commitEndMessage() {
    updateNodeData<'end'>(node.id, { endMessage })
  }

  function commitIncludeSummary() {
    updateNodeData<'end'>(node.id, { includeSummary })
  }

  return (
    <form className="config-form">
      <label className="form-field">
        <span>End message</span>
        <textarea
          rows={3}
          value={endMessage}
          onBlur={commitEndMessage}
          onChange={(event) => setEndMessage(event.target.value)}
        />
      </label>

      <label className="checkbox-field">
        <input
          checked={includeSummary}
          type="checkbox"
          onBlur={commitIncludeSummary}
          onChange={(event) => setIncludeSummary(event.target.checked)}
        />
        <span>Include summary</span>
      </label>
    </form>
  )
}
