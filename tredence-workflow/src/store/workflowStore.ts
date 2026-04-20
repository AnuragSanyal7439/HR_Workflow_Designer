import { create } from 'zustand';
import type { WorkflowNodeData, WorkflowEdge, ExecutionLog } from '../types';

interface WorkflowStore {
  // State
  nodes: WorkflowNodeData[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  executionLog: ExecutionLog | null;

  // Setters (Zustand source of truth)
  setNodes: (nodes: WorkflowNodeData[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  setSelectedNode: (nodeId: string | null) => void;

  // Node operations
  addNode: (node: WorkflowNodeData) => void;
  updateNodeData: (id: string, partialData: Partial<WorkflowNodeData>) => void;
  deleteNode: (id: string) => void;
  
  // Getters
  getNode: (id: string) => WorkflowNodeData | undefined;
  getSelectedNode: () => WorkflowNodeData | undefined;

  // Edge operations
  addEdge: (edge: WorkflowEdge) => void;
  deleteEdge: (edgeId: string) => void;

  // Execution operations
  setExecutionLog: (log: ExecutionLog) => void;
  clearExecutionLog: () => void;

  // Workflow operations
  clearWorkflow: () => void;
  exportWorkflow: () => { nodes: WorkflowNodeData[]; edges: WorkflowEdge[] };
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  // Initial state
  nodes: [],
  edges: [],
  selectedNodeId: null,
  executionLog: null,

  // Setters
  setNodes: (nodes: WorkflowNodeData[]) =>
    set(() => ({ nodes })),

  setEdges: (edges: WorkflowEdge[]) =>
    set(() => ({ edges })),

  setSelectedNode: (nodeId: string | null) =>
    set(() => ({ selectedNodeId: nodeId })),

  // Node operations
  addNode: (node: WorkflowNodeData) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),

  updateNodeData: (id: string, partialData: Partial<WorkflowNodeData>) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, ...partialData } : node
      ),
    })),

  deleteNode: (id: string) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      ),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    })),

  getNode: (id: string) => {
    const state = get();
    return state.nodes.find((node) => node.id === id);
  },

  getSelectedNode: () => {
    const state = get();
    if (!state.selectedNodeId) return undefined;
    return state.nodes.find((node) => node.id === state.selectedNodeId);
  },

  // Edge operations
  addEdge: (edge: WorkflowEdge) =>
    set((state) => ({
      edges: [...state.edges, edge],
    })),

  deleteEdge: (edgeId: string) =>
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== edgeId),
    })),

  // Execution operations
  setExecutionLog: (log: ExecutionLog) =>
    set(() => ({
      executionLog: log,
    })),

  clearExecutionLog: () =>
    set(() => ({
      executionLog: null,
    })),

  // Workflow operations
  clearWorkflow: () =>
    set(() => ({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      executionLog: null,
    })),

  exportWorkflow: () => {
    const state = get();
    return {
      nodes: state.nodes,
      edges: state.edges,
    };
  },
}));
