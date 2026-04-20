import { Handle, Position, type NodeProps } from 'reactflow'
import type { WorkflowNodeData, WorkflowNodeType } from '../types/workflow'
import type { WorkflowValidationIssue } from '../utils/workflowValidation'

type WorkflowNodeRenderData = WorkflowNodeData & {
  validationIssues?: WorkflowValidationIssue[]
}

function getNodeTypeLabel(type: WorkflowNodeType) {
  return type === 'automated' ? 'automated step' : type
}

function getNodeSummary(type: WorkflowNodeType, data: WorkflowNodeData) {
  if (type === 'task' && 'description' in data) {
    return data.description || 'No task description yet'
  }

  if (type === 'automated' && 'actionLabel' in data) {
    if (!data.actionLabel) {
      return 'No action selected'
    }

    const configuredParams = Object.values(data.parameters).filter(
      (value) => value.trim().length > 0,
    ).length
    const totalParams = Object.keys(data.parameters).length

    return totalParams
      ? `${data.actionLabel}: ${configuredParams}/${totalParams} params set`
      : data.actionLabel
  }

  if (type === 'approval' && 'approverRole' in data) {
    return data.approverRole
      ? `Approver: ${data.approverRole}`
      : 'Approver role not set'
  }

  if (type === 'end' && 'endMessage' in data) {
    return data.includeSummary ? `${data.endMessage} + summary` : data.endMessage
  }

  if (type === 'start' && 'metadata' in data) {
    return data.metadata.length
      ? `${data.metadata.length} metadata fields`
      : 'Workflow entry point'
  }

  return ''
}

function getNodeTitle(type: WorkflowNodeType, data: WorkflowNodeData) {
  if (type === 'task' && 'title' in data) {
    return data.title.trim() || 'Untitled task'
  }

  if (type === 'approval' && 'title' in data) {
    return data.title.trim() || 'Untitled approval'
  }

  if (type === 'automated' && 'title' in data) {
    return data.title.trim() || 'Untitled automated step'
  }

  if (type === 'end' && 'endMessage' in data) {
    return data.endMessage || data.title
  }

  return data.title
}

function getValidationSeverity(issues: WorkflowValidationIssue[]) {
  if (issues.some((issue) => issue.severity === 'error')) {
    return 'error'
  }

  if (issues.some((issue) => issue.severity === 'warning')) {
    return 'warning'
  }

  return null
}

export function WorkflowNode({
  data,
  selected,
  type,
}: NodeProps<WorkflowNodeRenderData>) {
  const nodeType = (type ?? 'task') as WorkflowNodeType
  const isInvalidTask =
    nodeType === 'task' && 'title' in data && data.title.trim().length === 0
  const validationIssues = data.validationIssues ?? []
  const validationSeverity = getValidationSeverity(validationIssues)
  const firstIssue = validationIssues[0]

  return (
    <div
      className={`workflow-node workflow-node--${nodeType}${
        selected ? ' is-selected' : ''
      }${isInvalidTask ? ' is-invalid' : ''}${
        validationSeverity ? ` has-${validationSeverity}` : ''
      }`}
    >
      {nodeType !== 'start' && <Handle position={Position.Left} type="target" />}

      <span className="workflow-node__type">{getNodeTypeLabel(nodeType)}</span>
      {firstIssue && (
        <span
          className={`workflow-node__badge workflow-node__badge--${firstIssue.severity}`}
        >
          !
        </span>
      )}
      <strong>{getNodeTitle(nodeType, data)}</strong>
      <p>{getNodeSummary(nodeType, data)}</p>
      {firstIssue && (
        <p className="workflow-node__validation">{firstIssue.message}</p>
      )}

      {nodeType !== 'end' && <Handle position={Position.Right} type="source" />}
    </div>
  )
}
