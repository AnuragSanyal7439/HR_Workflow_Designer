import { useCallback } from 'react';
import ReactFlow, {
  type Node,
  type Edge,
  addEdge,
  type Connection,
  Background,
  Controls,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '../store/workflowStore';
import { nodeTypes } from '../nodes/nodes';
import type { WorkflowNodeData, WorkflowEdge } from '../types';
import './Canvas.css';

export function WorkflowCanvas() {
  // Get state from Zustand (single source of truth)
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const setNodes = useWorkflowStore((state) => state.setNodes);
  const setEdges = useWorkflowStore((state) => state.setEdges);
  const addNode = useWorkflowStore((state) => state.addNode);
  const addEdge = useWorkflowStore((state) => state.addEdge);
  const setSelectedNode = useWorkflowStore((state) => state.setSelectedNode);

  // Convert Zustand nodes to React Flow nodes
  const rfNodes: Node[] = nodes.map((node, index) => ({
    id: node.id,
    data: node,
    position: {
      x: 100 + index * 50,
      y: 100 + index * 50,
    },
    type: 'custom',
  }));

  // Convert Zustand edges to React Flow edges
  const rfEdges: Edge[] = edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
  }));

  const onNodesChange = useCallback(
    (changes: any[]) => {
      // Update node positions in Zustand
      const updatedNodes = nodes.map((node) => {
        const change = changes.find((c) => c.id === node.id);
        if (change?.type === 'position' && change.position) {
          return node; // Node data stays the same, position is handled by RF
        }
        return node;
      });
      setNodes(updatedNodes);
    },
    [nodes, setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: any[]) => {
      // Handle edge removals
      const updatedEdges = edges.filter((edge) => {
        const isRemoved = changes.some(
          (c) => c.id === edge.id && c.type === 'remove'
        );
        return !isRemoved;
      });
      setEdges(updatedEdges);
    },
    [edges, setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: WorkflowEdge = {
        id: `edge-${Date.now()}`,
        source: connection.source!,
        target: connection.target!,
      };
      addEdge(newEdge);
    },
    [addEdge]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNode(node.id);
    },
    [setSelectedNode]
  );

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const nodeType = event.dataTransfer.getData('application/reactflow');

    if (!nodeType) return;

    const position = {
      x: event.clientX - 100,
      y: event.clientY - 100,
    };

    let newNode: WorkflowNodeData;

    if (nodeType === 'start') {
      newNode = {
        id: `start-${Date.now()}`,
        label: 'Start',
        type: 'start',
        title: 'Workflow Start',
        metadata: {},
      };
    } else if (nodeType === 'task') {
      newNode = {
        id: `task-${Date.now()}`,
        label: 'Task',
        type: 'task',
        title: '',
        description: '',
        assignee: '',
        dueDate: '',
      };
    } else if (nodeType === 'approval') {
      newNode = {
        id: `approval-${Date.now()}`,
        label: 'Approval',
        type: 'approval',
        title: '',
        approverRole: '',
        threshold: 1,
      };
    } else if (nodeType === 'automated') {
      newNode = {
        id: `automated-${Date.now()}`,
        label: 'Automated',
        type: 'automated',
        actionId: '',
        actionName: '',
        params: {},
      };
    } else if (nodeType === 'end') {
      newNode = {
        id: `end-${Date.now()}`,
        label: 'End',
        type: 'end',
        endMessage: 'Workflow Complete',
        showSummary: false,
      };
    } else {
      return;
    }

    addNode(newNode);
  };

  return (
    <div
      className="canvas-container"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes as any}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
