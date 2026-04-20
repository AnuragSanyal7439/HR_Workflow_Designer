import type { WorkflowNodeData } from '../types';
import { TaskForm } from './TaskForm';
import { ApprovalForm } from './ApprovalForm';
import { AutomatedForm } from './AutomatedForm';
import { StartForm } from './StartForm';
import { EndForm } from './EndForm';
import './TaskForm.css';

interface NodeFormProps {
  node: WorkflowNodeData;
  onUpdate: (node: WorkflowNodeData) => void;
}

export function NodeForm({ node, onUpdate }: NodeFormProps) {
  switch (node.type) {
    case 'start':
      return <StartForm node={node as any} onUpdate={onUpdate as any} />;
    case 'task':
      return <TaskForm node={node as any} onUpdate={onUpdate as any} />;
    case 'approval':
      return <ApprovalForm node={node as any} onUpdate={onUpdate as any} />;
    case 'automated':
      return <AutomatedForm node={node as any} onUpdate={onUpdate as any} />;
    case 'end':
      return <EndForm node={node as any} onUpdate={onUpdate as any} />;
    default:
      return null;
  }
}
