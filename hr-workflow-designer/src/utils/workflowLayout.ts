import type { WorkflowEdge, WorkflowNode, WorkflowNodeType } from '../types/workflow'

const LAYOUT_X = 120
const LAYOUT_START_Y = 60
const LAYOUT_VERTICAL_GAP = 170

const nodeTypeRank = {
  start: 0,
  task: 1,
  approval: 2,
  automated: 3,
  end: 4,
} satisfies Record<WorkflowNodeType, number>

export function autoLayoutWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): WorkflowNode[] {
  return getLayoutOrder(nodes, edges).map((node, index) => ({
    ...node,
    position: {
      x: LAYOUT_X,
      y: LAYOUT_START_Y + index * LAYOUT_VERTICAL_GAP,
    },
  }))
}

function getLayoutOrder(nodes: WorkflowNode[], edges: WorkflowEdge[]) {
  const primaryPathIndex = getPrimaryPathIndex(nodes, edges)
  const startNodes = nodes
    .filter((node) => node.type === 'start')
    .sort((left, right) => compareNodesForLayout(left, right, primaryPathIndex))
  const middleNodes = nodes
    .filter((node) => node.type !== 'start' && node.type !== 'end')
    .sort((left, right) => compareNodesForLayout(left, right, primaryPathIndex))
  const endNodes = nodes
    .filter((node) => node.type === 'end')
    .sort((left, right) => compareNodesForLayout(left, right, primaryPathIndex))

  return [...startNodes, ...middleNodes, ...endNodes]
}

function getPrimaryPathIndex(nodes: WorkflowNode[], edges: WorkflowEdge[]) {
  const nodeById = new Map(nodes.map((node) => [node.id, node]))
  const outgoingEdges = groupOutgoingEdges(edges)
  const primaryPathIndex = new Map<string, number>()
  const startNode = nodes.find((node) => node.type === 'start')
  let currentNode = startNode

  while (currentNode && !primaryPathIndex.has(currentNode.id)) {
    primaryPathIndex.set(currentNode.id, primaryPathIndex.size)

    const nextEdge = outgoingEdges.get(currentNode.id)?.[0]

    currentNode = nextEdge ? nodeById.get(nextEdge.target) : undefined
  }

  return primaryPathIndex
}

function compareNodesForLayout(
  left: WorkflowNode,
  right: WorkflowNode,
  primaryPathIndex: Map<string, number>,
) {
  const leftPathIndex = primaryPathIndex.get(left.id)
  const rightPathIndex = primaryPathIndex.get(right.id)

  if (leftPathIndex !== undefined && rightPathIndex !== undefined) {
    return leftPathIndex - rightPathIndex
  }

  if (leftPathIndex !== undefined) {
    return -1
  }

  if (rightPathIndex !== undefined) {
    return 1
  }

  const leftRank = nodeTypeRank[left.type ?? 'task']
  const rightRank = nodeTypeRank[right.type ?? 'task']

  if (leftRank !== rightRank) {
    return leftRank - rightRank
  }

  return left.id.localeCompare(right.id)
}

function groupOutgoingEdges(edges: WorkflowEdge[]) {
  return edges.reduce<Map<string, WorkflowEdge[]>>((groups, edge) => {
    const group = groups.get(edge.source) ?? []

    group.push(edge)
    groups.set(edge.source, group)

    return groups
  }, new Map())
}
