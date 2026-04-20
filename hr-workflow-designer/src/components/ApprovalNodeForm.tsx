import { useDraftValue } from '../hooks/useDraftValue'
import { useWorkflowStore } from '../store/workflowStore'
import type { WorkflowNodeByType } from '../types/workflow'

type ApprovalNodeFormProps = {
  node: WorkflowNodeByType['approval']
}

export function ApprovalNodeForm({ node }: ApprovalNodeFormProps) {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData)
  const [title, setTitle] = useDraftValue(node.id, node.data.title)
  const [approverRole, setApproverRole] = useDraftValue(
    node.id,
    node.data.approverRole,
  )
  const [autoApproveThreshold, setAutoApproveThreshold] = useDraftValue(
    node.id,
    String(node.data.autoApproveThreshold),
  )

  function commitTitle() {
    updateNodeData<'approval'>(node.id, { title })
  }

  function commitApproverRole() {
    updateNodeData<'approval'>(node.id, { approverRole })
  }

  function commitAutoApproveThreshold() {
    updateNodeData<'approval'>(node.id, {
      autoApproveThreshold: Number(autoApproveThreshold || 0),
    })
  }

  return (
    <form className="config-form">
      <section className="form-section" aria-label="Approval details">
        <label className="form-field">
          <span>Title</span>
          <input
            value={title}
            onBlur={commitTitle}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Approver role</span>
          <input
            value={approverRole}
            onBlur={commitApproverRole}
            onChange={(event) => setApproverRole(event.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Auto-approve threshold</span>
          <input
            min="0"
            type="number"
            value={autoApproveThreshold}
            onBlur={commitAutoApproveThreshold}
            onChange={(event) => setAutoApproveThreshold(event.target.value)}
          />
        </label>
      </section>
    </form>
  )
}
