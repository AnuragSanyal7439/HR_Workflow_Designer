import type { Edge, Node } from 'reactflow'

export const WORKFLOW_NODE_DRAG_TYPE = 'application/hr-workflow-node'

export const workflowNodeTypeValues = [
  'start',
  'task',
  'approval',
  'automated',
  'end',
] as const

export type WorkflowNodeType = (typeof workflowNodeTypeValues)[number]

export type WorkflowKeyValuePair = {
  id: string
  key: string
  value: string
}

export type StartNodeData = {
  title: string
  metadata: WorkflowKeyValuePair[]
}

export type TaskNodeData = {
  title: string
  description: string
  assignee: string
  dueDate: string
  customFields: WorkflowKeyValuePair[]
}

export type ApprovalNodeData = {
  title: string
  approverRole: string
  autoApproveThreshold: number
}

export type AutomatedNodeData = {
  title: string
  actionId: string
  actionLabel: string
  parameters: Record<string, string>
}

export type EndNodeData = {
  title: string
  endMessage: string
  includeSummary: boolean
}

export type WorkflowNodeDataByType = {
  start: StartNodeData
  task: TaskNodeData
  approval: ApprovalNodeData
  automated: AutomatedNodeData
  end: EndNodeData
}

export type WorkflowNodeData = WorkflowNodeDataByType[WorkflowNodeType]

export type WorkflowNodeByType = {
  [Type in WorkflowNodeType]: Node<WorkflowNodeDataByType[Type], Type>
}

export type WorkflowNode = WorkflowNodeByType[WorkflowNodeType]

export type WorkflowEdge = Edge

export type PaletteNode = {
  type: WorkflowNodeType
  label: string
  description: string
}

export type WorkflowSummary = {
  id: string
  name: string
  updatedAt: string
}

export type NodeVersionHistoryEntry = {
  fieldName: string
  previousValue: unknown
  newValue: unknown
  sequence: number
}

export function isWorkflowNodeType(value: string): value is WorkflowNodeType {
  return workflowNodeTypeValues.includes(value as WorkflowNodeType)
}
