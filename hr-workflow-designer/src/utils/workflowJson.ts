import type { XYPosition } from 'reactflow'
import { createDefaultNodeData } from '../nodes/nodeFactory'
import {
  isWorkflowNodeType,
  type AutomatedNodeData,
  type ApprovalNodeData,
  type EndNodeData,
  type StartNodeData,
  type TaskNodeData,
  type WorkflowEdge,
  type WorkflowKeyValuePair,
  type WorkflowNode,
  type WorkflowNodeData,
  type WorkflowNodeType,
} from '../types/workflow'

type ExportedWorkflowNode = {
  id: string
  type: WorkflowNodeType
  position: XYPosition
  data: WorkflowNodeData
}

export type ExportedWorkflow = {
  nodes: ExportedWorkflowNode[]
  edges: WorkflowEdge[]
}

export type ImportWorkflowResult =
  | {
      success: true
      workflow: {
        nodes: WorkflowNode[]
        edges: WorkflowEdge[]
      }
    }
  | {
      success: false
      error: string
    }

export function serializeWorkflowForExport(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): ExportedWorkflow {
  return {
    nodes: nodes.map((node) => ({
      id: node.id,
      type: node.type as WorkflowNodeType,
      position: {
        x: node.position.x,
        y: node.position.y,
      },
      data: removeRuntimeNodeData(node.data) as unknown as WorkflowNodeData,
    })),
    edges,
  }
}

export function exportWorkflowAsJson(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
) {
  return JSON.stringify(serializeWorkflowForExport(nodes, edges), null, 2)
}

export function importWorkflowFromJson(json: string): ImportWorkflowResult {
  let parsed: unknown

  try {
    parsed = JSON.parse(json)
  } catch {
    return {
      success: false,
      error: 'Invalid JSON. Please check the syntax and try again.',
    }
  }

  return validateImportedWorkflow(parsed)
}

function validateImportedWorkflow(value: unknown): ImportWorkflowResult {
  if (!isRecord(value)) {
    return {
      success: false,
      error: 'Workflow JSON must be an object.',
    }
  }

  if (!Array.isArray(value.nodes) || !Array.isArray(value.edges)) {
    return {
      success: false,
      error: 'Workflow JSON must include nodes and edges arrays.',
    }
  }

  const nodeIds = new Set<string>()
  const nodes: WorkflowNode[] = []

  for (const rawNode of value.nodes) {
    const nodeResult = validateImportedNode(rawNode)

    if (!nodeResult.success) {
      return nodeResult
    }

    if (nodeIds.has(nodeResult.node.id)) {
      return {
        success: false,
        error: `Duplicate node id "${nodeResult.node.id}" found.`,
      }
    }

    nodeIds.add(nodeResult.node.id)
    nodes.push(nodeResult.node)
  }

  const edges: WorkflowEdge[] = []

  for (const rawEdge of value.edges) {
    const edgeResult = validateImportedEdge(rawEdge, nodeIds)

    if (!edgeResult.success) {
      return edgeResult
    }

    edges.push(edgeResult.edge)
  }

  return {
    success: true,
    workflow: {
      nodes,
      edges,
    },
  }
}

function validateImportedNode(
  value: unknown,
):
  | { success: true; node: WorkflowNode }
  | { success: false; error: string } {
  if (!isRecord(value)) {
    return {
      success: false,
      error: 'Each node must be an object.',
    }
  }

  if (!isNonEmptyString(value.id)) {
    return {
      success: false,
      error: 'Each node must include a non-empty string id.',
    }
  }

  if (typeof value.type !== 'string' || !isWorkflowNodeType(value.type)) {
    return {
      success: false,
      error: `Node "${value.id}" has an invalid type.`,
    }
  }

  if (!isPosition(value.position)) {
    return {
      success: false,
      error: `Node "${value.id}" must include a numeric position.`,
    }
  }

  if (!isRecord(value.data)) {
    return {
      success: false,
      error: `Node "${value.id}" must include a data object.`,
    }
  }

  return {
    success: true,
    node: {
      id: value.id,
      type: value.type,
      position: value.position,
      data: hydrateNodeData(value.type, value.data),
    } as WorkflowNode,
  }
}

function validateImportedEdge(
  value: unknown,
  nodeIds: Set<string>,
):
  | { success: true; edge: WorkflowEdge }
  | { success: false; error: string } {
  if (!isRecord(value)) {
    return {
      success: false,
      error: 'Each edge must be an object.',
    }
  }

  if (!isNonEmptyString(value.id)) {
    return {
      success: false,
      error: 'Each edge must include a non-empty string id.',
    }
  }

  if (!isNonEmptyString(value.source) || !isNonEmptyString(value.target)) {
    return {
      success: false,
      error: `Edge "${value.id}" must include source and target node ids.`,
    }
  }

  if (!nodeIds.has(value.source) || !nodeIds.has(value.target)) {
    return {
      success: false,
      error: `Edge "${value.id}" references a missing node.`,
    }
  }

  return {
    success: true,
    edge: {
      ...value,
      id: value.id,
      source: value.source,
      target: value.target,
    } as WorkflowEdge,
  }
}

function hydrateNodeData(type: WorkflowNodeType, data: Record<string, unknown>) {
  const workflowData = removeRuntimeNodeData(data)

  switch (type) {
    case 'start':
      return hydrateStartNodeData(workflowData)
    case 'task':
      return hydrateTaskNodeData(workflowData)
    case 'approval':
      return hydrateApprovalNodeData(workflowData)
    case 'automated':
      return hydrateAutomatedNodeData(workflowData)
    case 'end':
      return hydrateEndNodeData(workflowData)
    default:
      return createDefaultNodeData(type)
  }
}

function removeRuntimeNodeData(data: unknown) {
  if (!isRecord(data)) {
    return {}
  }

  const workflowData = { ...data }

  delete workflowData.validationIssues

  return workflowData
}

function hydrateStartNodeData(data: Record<string, unknown>): StartNodeData {
  const defaults = createDefaultNodeData('start')

  return {
    title: getString(data.title, defaults.title),
    metadata: getKeyValuePairs(data.metadata),
  }
}

function hydrateTaskNodeData(data: Record<string, unknown>): TaskNodeData {
  const defaults = createDefaultNodeData('task')

  return {
    title: getString(data.title, defaults.title),
    description: getString(data.description, defaults.description),
    assignee: getString(data.assignee, defaults.assignee),
    dueDate: getString(data.dueDate, defaults.dueDate),
    customFields: getKeyValuePairs(data.customFields),
  }
}

function hydrateApprovalNodeData(data: Record<string, unknown>): ApprovalNodeData {
  const defaults = createDefaultNodeData('approval')

  return {
    title: getString(data.title, defaults.title),
    approverRole: getString(data.approverRole, defaults.approverRole),
    autoApproveThreshold: getNumber(
      data.autoApproveThreshold,
      defaults.autoApproveThreshold,
    ),
  }
}

function hydrateAutomatedNodeData(data: Record<string, unknown>): AutomatedNodeData {
  const defaults = createDefaultNodeData('automated')

  return {
    title: getString(data.title, defaults.title),
    actionId: getString(data.actionId, defaults.actionId),
    actionLabel: getString(data.actionLabel, defaults.actionLabel),
    parameters: getStringRecord(data.parameters),
  }
}

function hydrateEndNodeData(data: Record<string, unknown>): EndNodeData {
  const defaults = createDefaultNodeData('end')

  return {
    title: getString(data.title, defaults.title),
    endMessage: getString(data.endMessage, defaults.endMessage),
    includeSummary: getBoolean(data.includeSummary, defaults.includeSummary),
  }
}

function getString(value: unknown, fallback: string) {
  return typeof value === 'string' ? value : fallback
}

function getNumber(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function getBoolean(value: unknown, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback
}

function getKeyValuePairs(value: unknown): WorkflowKeyValuePair[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter(isKeyValuePair)
}

function getStringRecord(value: unknown) {
  if (!isRecord(value)) {
    return {}
  }

  return Object.entries(value).reduce<Record<string, string>>(
    (record, [key, recordValue]) => {
      if (typeof recordValue === 'string') {
        record[key] = recordValue
      }

      return record
    },
    {},
  )
}

function isKeyValuePair(value: unknown): value is WorkflowKeyValuePair {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.key === 'string' &&
    typeof value.value === 'string'
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isPosition(value: unknown): value is XYPosition {
  return (
    isRecord(value) &&
    typeof value.x === 'number' &&
    Number.isFinite(value.x) &&
    typeof value.y === 'number' &&
    Number.isFinite(value.y)
  )
}
