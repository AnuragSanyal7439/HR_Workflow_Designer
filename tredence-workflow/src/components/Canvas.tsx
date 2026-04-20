import { useCallback, useEffect } from 'react';
import ReactFlow, {
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
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

export function Canvas() {
  const {
    nodes: storeNodes,
    edges: storeEdges,
    addNode,
    addEdge: addEdgeToStore,
    selectNode,
  } = useWorkflowStore();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Sync store nodes with React Flow nodes when store updates
  useEffect(() => {
    const rfNodes: Node[] = storeNodes.map((node) => ({
      id: node.id,
      data: node,
      position: {
        x: 100 + (storeNodes.indexOf(node) * 50),
        y: 100 + (storeNodes.indexOf(node) * 50),
      },
      type: 'custom',
    }));
    setNodes(rfNodes);
  }, [storeNodes, setNodes]);

  // Sync store edges with React Flow edges when store updates
  useEffect(() => {
    const rfEdges: Edge[] = storeEdges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
    }));
    setEdges(rfEdges);
  }, [storeEdges, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: WorkflowEdge = {
        id: `edge-${Date.now()}`,
        source: connection.source!,
        target: connection.target!,
      };
      addEdgeToStore(newEdge);
      const edge = addEdge(connection, edges);
      setEdges(edge);
    },
    [edges, setEdges, addEdgeToStore]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      selectNode(node.id);
    },
    [selectNode]
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

    // Create new node based on type
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

    // All nodes use type: "custom" - actual type is in data.type
    const newRFNode: Node = {
      id: newNode.id,
      data: newNode,
      position,
      type: 'custom',
    };
    setNodes((nds) => [...nds, newRFNode]);
  };

  return (
    <div
      className="canvas-container"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
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
