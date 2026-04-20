export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface BaseNodeData {
  id: string;
  label: string;
  type: NodeType;
}

export interface StartNodeData extends BaseNodeData {
  type: 'start';
  title: string;
  metadata?: Record<string, string>;
}

export interface TaskNodeData extends BaseNodeData {
  type: 'task';
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
}

export interface ApprovalNodeData extends BaseNodeData {
  type: 'approval';
  title: string;
  approverRole: string;
  threshold: number;
}

export interface AutomatedNodeData extends BaseNodeData {
  type: 'automated';
  actionId: string;
  actionName: string;
  params: Record<string, unknown>;
}

export interface EndNodeData extends BaseNodeData {
  type: 'end';
  endMessage: string;
  showSummary: boolean;
}

export type WorkflowNodeData = 
  | StartNodeData 
  | TaskNodeData 
  | ApprovalNodeData 
  | AutomatedNodeData 
  | EndNodeData;

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNodeData[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
}

export interface ExecutionStep {
  nodeId: string;
  nodeType: NodeType;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  timestamp: string;
  data?: Record<string, unknown>;
  error?: string;
}

export interface ExecutionLog {
  workflowId: string;
  startTime: string;
  endTime?: string;
  steps: ExecutionStep[];
  status: 'running' | 'completed' | 'failed';
}

export interface AutomationAction {
  id: string;
  name: string;
  description: string;
  params: AutomationParam[];
}

export interface AutomationParam {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  required: boolean;
  options?: { label: string; value: string }[];
}
