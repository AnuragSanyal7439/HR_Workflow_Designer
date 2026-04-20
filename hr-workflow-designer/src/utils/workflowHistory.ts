import type { WorkflowEdge, WorkflowNode } from '../types/workflow'

const HISTORY_LIMIT = 20

export type WorkflowSnapshot = {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  nextNodeId: number
  selectedNodeId: string | null
}

export type WorkflowHistoryState = WorkflowSnapshot & {
  past: WorkflowSnapshot[]
  future: WorkflowSnapshot[]
}

export function createWorkflowSnapshot(
  state: WorkflowSnapshot,
): WorkflowSnapshot {
  return {
    nodes: cloneNodes(state.nodes),
    edges: cloneEdges(state.edges),
    nextNodeId: state.nextNodeId,
    selectedNodeId: state.selectedNodeId,
  }
}

export function commitWorkflowChange<TChanges extends Partial<WorkflowSnapshot>>(
  state: WorkflowHistoryState,
  changes: TChanges,
) {
  return commitWorkflowSnapshot(state, createWorkflowSnapshot(state), changes)
}

export function commitWorkflowSnapshot<TChanges extends Partial<WorkflowSnapshot>>(
  state: WorkflowHistoryState,
  snapshot: WorkflowSnapshot,
  changes: TChanges,
) {
  const nextSnapshot = createWorkflowSnapshot({
    ...state,
    ...changes,
  })

  if (areWorkflowSnapshotsEqual(snapshot, nextSnapshot)) {
    return changes
  }

  return {
    ...changes,
    past: pushSnapshot(state.past, snapshot),
    future: [],
  }
}

export function undoWorkflowHistory(state: WorkflowHistoryState) {
  const previousSnapshot = state.past.at(-1)

  if (!previousSnapshot) {
    return {}
  }

  return {
    ...restoreWorkflowSnapshot(previousSnapshot),
    past: state.past.slice(0, -1),
    future: pushSnapshot(state.future, createWorkflowSnapshot(state)),
  }
}

export function redoWorkflowHistory(state: WorkflowHistoryState) {
  const nextSnapshot = state.future.at(-1)

  if (!nextSnapshot) {
    return {}
  }

  return {
    ...restoreWorkflowSnapshot(nextSnapshot),
    past: pushSnapshot(state.past, createWorkflowSnapshot(state)),
    future: state.future.slice(0, -1),
  }
}

function restoreWorkflowSnapshot(snapshot: WorkflowSnapshot): WorkflowSnapshot {
  const selectedNodeExists = snapshot.nodes.some(
    (node) => node.id === snapshot.selectedNodeId,
  )
  const selectedNodeId = selectedNodeExists ? snapshot.selectedNodeId : null

  return {
    nodes: cloneNodes(snapshot.nodes).map((node) => ({
      ...node,
      selected: node.id === selectedNodeId,
    })),
    edges: cloneEdges(snapshot.edges),
    nextNodeId: snapshot.nextNodeId,
    selectedNodeId,
  }
}

function pushSnapshot(history: WorkflowSnapshot[], snapshot: WorkflowSnapshot) {
  const lastSnapshot = history.at(-1)

  if (lastSnapshot && areWorkflowSnapshotsEqual(lastSnapshot, snapshot)) {
    return history
  }

  return [...history, snapshot].slice(-HISTORY_LIMIT)
}

function areWorkflowSnapshotsEqual(
  left: WorkflowSnapshot,
  right: WorkflowSnapshot,
) {
  return (
    JSON.stringify(getComparableSnapshot(left)) ===
    JSON.stringify(getComparableSnapshot(right))
  )
}

function getComparableSnapshot(snapshot: WorkflowSnapshot) {
  return {
    nodes: snapshot.nodes,
    edges: snapshot.edges,
    nextNodeId: snapshot.nextNodeId,
  }
}

function cloneNodes(nodes: WorkflowNode[]) {
  return nodes.map((node) => {
    const clonedNode = cloneJson(node)

    delete clonedNode.selected
    delete clonedNode.dragging

    if (isRecord(clonedNode.data)) {
      delete (clonedNode.data as Record<string, unknown>).validationIssues
    }

    return clonedNode
  })
}

function cloneEdges(edges: WorkflowEdge[]) {
  return edges.map((edge) => {
    const clonedEdge = cloneJson(edge)

    delete clonedEdge.selected

    return clonedEdge
  })
}

function cloneJson<TValue>(value: TValue): TValue {
  return JSON.parse(JSON.stringify(value)) as TValue
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
