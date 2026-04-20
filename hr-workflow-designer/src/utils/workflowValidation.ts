import type { WorkflowEdge, WorkflowNode } from '../types/workflow'

export type WorkflowValidationSeverity = 'error' | 'warning'

export type WorkflowValidationCode =
  | 'START_NODE_COUNT'
  | 'END_NODE_MISSING'
  | 'DISCONNECTED_NODE'
  | 'REQUIRED_FIELD_MISSING'

export type WorkflowValidationIssue = {
  nodeId: string | null
  code: WorkflowValidationCode
  message: string
  severity: WorkflowValidationSeverity
}

export type WorkflowValidationResult = {
  issues: WorkflowValidationIssue[]
  hasErrors: boolean
}

type SerializedWorkflow = {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

export function validateWorkflowGraph(
  workflow: SerializedWorkflow,
): WorkflowValidationResult {
  const issues = [
    ...validateStructure(workflow),
    ...validateConnectivity(workflow),
    ...validateRequiredFields(workflow.nodes),
  ]

  return {
    issues,
    hasErrors: issues.some((issue) => issue.severity === 'error'),
  }
}

export function groupValidationIssuesByNode(
  issues: WorkflowValidationIssue[],
) {
  return issues.reduce<Map<string, WorkflowValidationIssue[]>>((groups, issue) => {
    if (!issue.nodeId) {
      return groups
    }

    const nodeIssues = groups.get(issue.nodeId) ?? []

    nodeIssues.push(issue)
    groups.set(issue.nodeId, nodeIssues)

    return groups
  }, new Map())
}

function validateStructure(workflow: SerializedWorkflow) {
  const issues: WorkflowValidationIssue[] = []
  const startNodes = workflow.nodes.filter((node) => node.type === 'start')
  const endNodes = workflow.nodes.filter((node) => node.type === 'end')

  if (startNodes.length === 0) {
    issues.push({
      nodeId: null,
      code: 'START_NODE_COUNT',
      message: 'Workflow must have exactly 1 Start node.',
      severity: 'error',
    })
  }

  if (startNodes.length > 1) {
    startNodes.forEach((node) => {
      issues.push({
        nodeId: node.id,
        code: 'START_NODE_COUNT',
        message: 'Only one Start node is allowed.',
        severity: 'error',
      })
    })
  }

  if (endNodes.length === 0) {
    issues.push({
      nodeId: null,
      code: 'END_NODE_MISSING',
      message: 'Workflow must have at least 1 End node.',
      severity: 'error',
    })
  }

  return issues
}

function validateConnectivity(workflow: SerializedWorkflow) {
  const startNodes = workflow.nodes.filter((node) => node.type === 'start')

  if (startNodes.length !== 1) {
    return []
  }

  const reachableNodeIds = getReachableNodeIds(workflow, startNodes[0].id)

  return workflow.nodes
    .filter((node) => !reachableNodeIds.has(node.id))
    .map<WorkflowValidationIssue>((node) => ({
      nodeId: node.id,
      code: 'DISCONNECTED_NODE',
      message: 'Node is not connected from the Start node.',
      severity: 'error',
    }))
}

function validateRequiredFields(nodes: WorkflowNode[]) {
  return nodes.flatMap<WorkflowValidationIssue>((node) => {
    switch (node.type) {
      case 'start':
        return requiredTextIssue(node.id, node.data.title, 'Start title is required.')
      case 'task':
        return requiredTextIssue(node.id, node.data.title, 'Task title is required.')
      case 'approval':
        return [
          ...requiredTextIssue(
            node.id,
            node.data.title,
            'Approval title is required.',
          ),
          ...requiredTextIssue(
            node.id,
            node.data.approverRole,
            'Approver role is required.',
          ),
        ]
      case 'automated':
        return [
          ...requiredTextIssue(
            node.id,
            node.data.title,
            'Automated step title is required.',
          ),
          ...requiredTextIssue(
            node.id,
            node.data.actionId,
            'Automation action is required.',
          ),
          ...Object.entries(node.data.parameters).flatMap(([param, value]) =>
            requiredTextIssue(
              node.id,
              value,
              `Automation parameter "${param}" is required.`,
            ),
          ),
        ]
      case 'end':
        return requiredTextIssue(
          node.id,
          node.data.endMessage,
          'End message is required.',
        )
      default:
        return []
    }
  })
}

function requiredTextIssue(
  nodeId: string,
  value: string,
  message: string,
): WorkflowValidationIssue[] {
  return value.trim()
    ? []
    : [
        {
          nodeId,
          code: 'REQUIRED_FIELD_MISSING',
          message,
          severity: 'error',
        },
      ]
}

function getReachableNodeIds(workflow: SerializedWorkflow, startNodeId: string) {
  const outgoingEdges = groupOutgoingEdges(workflow.edges)
  const visited = new Set<string>()
  const queue = [startNodeId]

  while (queue.length > 0) {
    const nodeId = queue.shift()

    if (!nodeId || visited.has(nodeId)) {
      continue
    }

    visited.add(nodeId)
    outgoingEdges.get(nodeId)?.forEach((edge) => queue.push(edge.target))
  }

  return visited
}

function groupOutgoingEdges(edges: WorkflowEdge[]) {
  return edges.reduce<Map<string, WorkflowEdge[]>>((groups, edge) => {
    const group = groups.get(edge.source) ?? []

    group.push(edge)
    groups.set(edge.source, group)

    return groups
  }, new Map())
}
