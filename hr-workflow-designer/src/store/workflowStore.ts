import { create } from 'zustand'
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type XYPosition,
} from 'reactflow'
import { createWorkflowNode } from '../nodes/nodeFactory'
import type {
  NodeVersionHistoryEntry,
  WorkflowEdge,
  WorkflowNode,
  WorkflowNodeData,
  WorkflowNodeDataByType,
  WorkflowNodeType,
} from '../types/workflow'
import type { WorkflowTemplate } from '../types/workflowTemplate'
import {
  commitWorkflowChange,
  commitWorkflowSnapshot,
  createWorkflowSnapshot,
  redoWorkflowHistory,
  undoWorkflowHistory,
  type WorkflowSnapshot,
} from '../utils/workflowHistory'
import { autoLayoutWorkflow } from '../utils/workflowLayout'
import { insertWorkflowTemplate } from '../utils/workflowTemplateInsertion'

type WorkflowDesignerState = {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  nodeVersionHistory: Record<string, NodeVersionHistoryEntry[]>
  versionSequence: number
  past: WorkflowSnapshot[]
  future: WorkflowSnapshot[]
  pendingNodeDragSnapshot: WorkflowSnapshot | null
  nextNodeId: number
  dropNotice: string | null
  selectedNodeId: string | null
  addNode: (type: WorkflowNodeType, position: XYPosition) => void
  loadWorkflow: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => void
  insertTemplate: (template: WorkflowTemplate) => void
  autoLayout: () => void
  undo: () => void
  redo: () => void
  selectNode: (nodeId: string) => void
  clearSelection: () => void
  getSelectedNode: () => WorkflowNode | null
  getNodeVersionHistory: (nodeId: string) => NodeVersionHistoryEntry[]
  updateNodeData: <Type extends WorkflowNodeType>(
    nodeId: string,
    data: Partial<WorkflowNodeDataByType[Type]>,
  ) => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  setSelectedNodeId: (nodeId: string | null) => void
}

export const useWorkflowStore = create<WorkflowDesignerState>((set, get) => ({
  nodes: [],
  edges: [],
  nodeVersionHistory: {},
  versionSequence: 1,
  past: [],
  future: [],
  pendingNodeDragSnapshot: null,
  nextNodeId: 1,
  dropNotice: null,
  selectedNodeId: null,
  addNode: (type, position) =>
    set((state) => {
      const hasStartNode = state.nodes.some((node) => node.type === 'start')

      if (type === 'start' && hasStartNode) {
        return {
          dropNotice: 'Start node already exists',
        }
      }

      const id = `${type}-${state.nextNodeId}`

      return {
        ...commitWorkflowChange(state, {
          nodes: [...state.nodes, createWorkflowNode(type, position, id)],
          nextNodeId: state.nextNodeId + 1,
        }),
        nodeVersionHistory: ensureNodeVersionHistory(
          state.nodeVersionHistory,
          [id],
        ),
        dropNotice: null,
      }
    }),
  loadWorkflow: (nodes, edges) =>
    set((state) => {
      const loadedNodes = nodes.map((node) => ({
        ...node,
        selected: false,
      }))

      return {
        ...commitWorkflowChange(state, {
          nodes: loadedNodes,
          edges,
          nextNodeId: getNextNodeId(nodes),
          selectedNodeId: null,
        }),
        nodeVersionHistory: createEmptyNodeVersionHistory(loadedNodes),
        pendingNodeDragSnapshot: null,
        dropNotice: null,
      }
    }),
  insertTemplate: (template) =>
    set((state) => {
      const result = insertWorkflowTemplate(
        template,
        state.nodes,
        state.edges,
        state.nextNodeId,
      )

      return {
        ...commitWorkflowChange(state, {
          nodes: result.nodes,
          edges: result.edges,
          nextNodeId: result.nextNodeId,
          selectedNodeId: null,
        }),
        nodeVersionHistory: ensureNodeVersionHistory(
          state.nodeVersionHistory,
          result.nodes.map((node) => node.id),
        ),
        pendingNodeDragSnapshot: null,
        dropNotice: null,
      }
    }),
  autoLayout: () =>
    set((state) => ({
      ...commitWorkflowChange(state, {
        nodes: autoLayoutWorkflow(state.nodes, state.edges),
      }),
      pendingNodeDragSnapshot: null,
    })),
  undo: () =>
    set((state) => ({
      ...undoWorkflowHistory(state),
      pendingNodeDragSnapshot: null,
      dropNotice: null,
    })),
  redo: () =>
    set((state) => ({
      ...redoWorkflowHistory(state),
      pendingNodeDragSnapshot: null,
      dropNotice: null,
    })),
  selectNode: (nodeId) =>
    set((state) => ({
      selectedNodeId: nodeId,
      nodes: state.nodes.map((node) => ({
        ...node,
        selected: node.id === nodeId,
      })),
    })),
  clearSelection: () =>
    set((state) => ({
      selectedNodeId: null,
      nodes: state.nodes.map((node) => ({
        ...node,
        selected: false,
      })),
    })),
  getSelectedNode: () => {
    const { nodes, selectedNodeId } = get()

    return nodes.find((node) => node.id === selectedNodeId) ?? null
  },
  getNodeVersionHistory: (nodeId) => get().nodeVersionHistory[nodeId] ?? [],
  updateNodeData: (nodeId, data) =>
    set((state) => {
      const node = state.nodes.find((currentNode) => currentNode.id === nodeId)

      if (!node) {
        return {}
      }

      const historyEntries = createVersionHistoryEntries(
        node.data,
        data,
        state.versionSequence,
      )

      if (historyEntries.length === 0) {
        return {}
      }

      return {
        ...commitWorkflowChange(state, {
          nodes: state.nodes.map((currentNode) =>
            currentNode.id === nodeId
              ? ({
                  ...currentNode,
                  data: {
                    ...currentNode.data,
                    ...data,
                  },
                } as WorkflowNode)
              : currentNode,
          ),
        }),
        nodeVersionHistory: appendNodeVersionHistory(
          state.nodeVersionHistory,
          nodeId,
          historyEntries,
        ),
        versionSequence: state.versionSequence + historyEntries.length,
      }
    }),
  onNodesChange: (changes) =>
    set((state) => {
      const nodes = applyNodeChanges<WorkflowNodeData>(
        changes,
        state.nodes,
      ) as WorkflowNode[]
      const selectedNodeId = nodes.find((node) => node.selected)?.id ?? null
      const nextState = {
        nodes,
        selectedNodeId,
      }

      if (hasActivePositionChange(changes)) {
        return {
          ...nextState,
          pendingNodeDragSnapshot:
            state.pendingNodeDragSnapshot ?? createWorkflowSnapshot(state),
        }
      }

      if (hasFinalPositionChange(changes) && state.pendingNodeDragSnapshot) {
        return {
          ...commitWorkflowSnapshot(
            state,
            state.pendingNodeDragSnapshot,
            nextState,
          ),
          pendingNodeDragSnapshot: null,
        }
      }

      if (shouldTrackNodeChanges(changes)) {
        return commitWorkflowChange(state, nextState)
      }

      return nextState
    }),
  onEdgesChange: (changes) =>
    set((state) => {
      const edges = applyEdgeChanges(changes, state.edges)

      if (!shouldTrackEdgeChanges(changes)) {
        return {
          edges,
        }
      }

      return commitWorkflowChange(state, {
        edges,
      })
    }),
  onConnect: (connection) =>
    set((state) =>
      commitWorkflowChange(state, {
        edges: addEdge(connection, state.edges),
      }),
    ),
  setSelectedNodeId: (nodeId) =>
    set((state) => ({
      selectedNodeId: nodeId,
      nodes: state.nodes.map((node) => ({
        ...node,
        selected: node.id === nodeId,
      })),
    })),
}))

function getNextNodeId(nodes: WorkflowNode[]) {
  const numericSuffixes = nodes
    .map((node) => Number(node.id.split('-').at(-1)))
    .filter((value) => Number.isFinite(value))

  return numericSuffixes.length > 0 ? Math.max(...numericSuffixes) + 1 : 1
}

function createEmptyNodeVersionHistory(nodes: WorkflowNode[]) {
  return nodes.reduce<Record<string, NodeVersionHistoryEntry[]>>(
    (history, node) => {
      history[node.id] = []
      return history
    },
    {},
  )
}

function ensureNodeVersionHistory(
  history: Record<string, NodeVersionHistoryEntry[]>,
  nodeIds: string[],
) {
  return nodeIds.reduce<Record<string, NodeVersionHistoryEntry[]>>(
    (nextHistory, nodeId) => {
      nextHistory[nodeId] = nextHistory[nodeId] ?? []
      return nextHistory
    },
    { ...history },
  )
}

function createVersionHistoryEntries(
  currentData: WorkflowNodeData,
  updates: Partial<WorkflowNodeData>,
  startSequence: number,
) {
  let sequence = startSequence

  return Object.entries(updates).flatMap<NodeVersionHistoryEntry>(
    ([fieldName, newValue]) => {
      const previousValue = getFieldValue(currentData, fieldName)

      if (areValuesEqual(previousValue, newValue)) {
        return []
      }

      const entry = {
        fieldName,
        previousValue: cloneValue(previousValue),
        newValue: cloneValue(newValue),
        sequence,
      }

      sequence += 1

      return [entry]
    },
  )
}

function appendNodeVersionHistory(
  history: Record<string, NodeVersionHistoryEntry[]>,
  nodeId: string,
  entries: NodeVersionHistoryEntry[],
) {
  const currentEntries = history[nodeId] ?? []
  const dedupedEntries = entries.filter(
    (entry) => !isDuplicateHistoryEntry(currentEntries.at(-1), entry),
  )

  if (dedupedEntries.length === 0) {
    return history
  }

  return {
    ...history,
    [nodeId]: [...currentEntries, ...dedupedEntries].slice(-10),
  }
}

function isDuplicateHistoryEntry(
  previousEntry: NodeVersionHistoryEntry | undefined,
  nextEntry: NodeVersionHistoryEntry,
) {
  return (
    previousEntry?.fieldName === nextEntry.fieldName &&
    areValuesEqual(previousEntry.previousValue, nextEntry.previousValue) &&
    areValuesEqual(previousEntry.newValue, nextEntry.newValue)
  )
}

function getFieldValue(data: WorkflowNodeData, fieldName: string) {
  return (data as Record<string, unknown>)[fieldName]
}

function areValuesEqual(left: unknown, right: unknown) {
  return JSON.stringify(left) === JSON.stringify(right)
}

function cloneValue<TValue>(value: TValue): TValue {
  if (value === undefined) {
    return value
  }

  return JSON.parse(JSON.stringify(value)) as TValue
}

function hasActivePositionChange(changes: NodeChange[]) {
  return changes.some(
    (change) => change.type === 'position' && change.dragging === true,
  )
}

function hasFinalPositionChange(changes: NodeChange[]) {
  return changes.some(
    (change) => change.type === 'position' && change.dragging === false,
  )
}

function shouldTrackNodeChanges(changes: NodeChange[]) {
  return changes.some((change) => {
    if (change.type === 'position') {
      return change.dragging !== true
    }

    return change.type === 'add' || change.type === 'remove' || change.type === 'reset'
  })
}

function shouldTrackEdgeChanges(changes: EdgeChange[]) {
  return changes.some(
    (change) =>
      change.type === 'add' || change.type === 'remove' || change.type === 'reset',
  )
}
