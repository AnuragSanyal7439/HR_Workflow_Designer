import type { WorkflowEdge, WorkflowNode } from '../types/workflow'
import { validateWorkflowGraph } from './workflowValidation'

export type SerializedWorkflow = {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

export type WorkflowSimulationResult =
  | {
      success: true
      workflow: SerializedWorkflow
      orderedNodes: WorkflowNode[]
      log: string[]
    }
  | {
      success: false
      workflow: SerializedWorkflow
      error: string
    }

export function serializeWorkflowGraph(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): SerializedWorkflow {
  return {
    nodes,
    edges,
  }
}

export function runWorkflowSimulation(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): WorkflowSimulationResult {
  const workflow = serializeWorkflowGraph(nodes, edges)
  const validationResult = validateWorkflowGraph(workflow)

  if (validationResult.hasErrors) {
    return {
      success: false,
      workflow,
      error: validationResult.issues[0]?.message ?? 'Workflow is invalid.',
    }
  }

  const traversal = traversePrimaryFlow(workflow)

  if (typeof traversal === 'string') {
    return {
      success: false,
      workflow,
      error: traversal,
    }
  }

  return {
    success: true,
    workflow,
    orderedNodes: traversal,
    log: traversal.map(
      (node, index) => `Step ${index + 1}: ${formatSimulationStep(node)}`,
    ),
  }
}

function traversePrimaryFlow(
  workflow: SerializedWorkflow,
): WorkflowNode[] | string {
  const nodeById = new Map(workflow.nodes.map((node) => [node.id, node]))
  const outgoingEdges = groupOutgoingEdges(workflow.edges)
  const startNode = workflow.nodes.find((node) => node.type === 'start')
  const orderedNodes: WorkflowNode[] = []
  const visited = new Set<string>()
  let currentNode = startNode

  while (currentNode) {
    if (visited.has(currentNode.id)) {
      return 'Simulation stopped because the workflow has a cycle.'
    }

    visited.add(currentNode.id)
    orderedNodes.push(currentNode)

    if (currentNode.type === 'end') {
      return orderedNodes
    }

    const nextEdge = outgoingEdges.get(currentNode.id)?.[0]

    if (!nextEdge) {
      return `Node "${formatNodeTitle(currentNode)}" is not connected to a next step.`
    }

    currentNode = nodeById.get(nextEdge.target)

    if (!currentNode) {
      return 'Simulation stopped because an edge points to a missing node.'
    }
  }

  return 'Simulation could not find a path from Start to End.'
}

function groupOutgoingEdges(edges: WorkflowEdge[]) {
  return edges.reduce<Map<string, WorkflowEdge[]>>((groups, edge) => {
    const group = groups.get(edge.source) ?? []

    group.push(edge)
    groups.set(edge.source, group)

    return groups
  }, new Map())
}

function formatSimulationStep(node: WorkflowNode) {
  switch (node.type) {
    case 'start':
      return formatNodeTitle(node)
    case 'task':
      return `Task (${node.data.description || 'No description'})`
    case 'approval':
      return `Approval (${node.data.approverRole || 'No approver role'})`
    case 'automated':
      return `Automated Step (${node.data.actionLabel || 'No action selected'})`
    case 'end':
      return 'End'
    default:
      return formatNodeTitle(node)
  }
}

function formatNodeTitle(node: WorkflowNode) {
  return 'title' in node.data && node.data.title.trim()
    ? node.data.title
    : node.type ?? 'Unknown node'
}
