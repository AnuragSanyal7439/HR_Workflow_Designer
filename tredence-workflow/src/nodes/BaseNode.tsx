import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { useWorkflowStore } from '../store/workflowStore';
import type { WorkflowNodeData } from '../types';
import './BaseNode.css';

interface GenericNodeProps {
  data: WorkflowNodeData;
  isConnecting?: boolean;
  selected?: boolean;
}

export const GenericNode = memo(function GenericNode({
  data,
}: GenericNodeProps) {
  const selectNode = useWorkflowStore((state: any) => state.selectNode);

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectNode(data.id);
  };

  const getNodeColor = (type: string): string => {
    switch (type) {
      case 'start':
        return '#4CAF50';
      case 'end':
        return '#F44336';
      case 'task':
        return '#2196F3';
      case 'approval':
        return '#FF9800';
      case 'automated':
        return '#9C27B0';
      default:
        return '#757575';
    }
  };

  return (
    <div
      className="base-node"
      style={{ borderColor: getNodeColor(data.type) }}
      onClick={handleNodeClick}
    >
      <Handle type="target" position={Position.Top} />
      <div className="node-content">
        <div className="node-label">{data.label}</div>
        {data.type === 'task' && 'title' in data && (
          <div className="node-info">{data.title}</div>
        )}
        {data.type === 'approval' && 'title' in data && (
          <div className="node-info">{data.title}</div>
        )}
        {data.type === 'automated' && 'actionName' in data && (
          <div className="node-info">{data.actionName || 'No action'}</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});
