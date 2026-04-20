import type { XYPosition } from 'reactflow'
import type {
  WorkflowNodeByType,
  WorkflowNodeDataByType,
  WorkflowNodeType,
} from '../types/workflow'

const defaultNodeData = {
  start: {
    title: 'Start',
    metadata: [],
  },
  task: {
    title: 'Task',
    description: 'Assign an HR action',
    assignee: '',
    dueDate: '',
    customFields: [],
  },
  approval: {
    title: 'Approval',
    approverRole: 'Manager',
    autoApproveThreshold: 0,
  },
  automated: {
    title: 'Automated Step',
    actionId: '',
    actionLabel: '',
    parameters: {},
  },
  end: {
    title: 'End',
    endMessage: 'Workflow completed',
    includeSummary: false,
  },
} satisfies WorkflowNodeDataByType

export function createDefaultNodeData<Type extends WorkflowNodeType>(
  type: Type,
): WorkflowNodeDataByType[Type] {
  return { ...defaultNodeData[type] } as WorkflowNodeDataByType[Type]
}

export function createWorkflowNode<Type extends WorkflowNodeType>(
  type: Type,
  position: XYPosition,
  id: string,
): WorkflowNodeByType[Type] {
  return {
    id,
    type,
    position,
    data: createDefaultNodeData(type),
  } as unknown as WorkflowNodeByType[Type]
}
