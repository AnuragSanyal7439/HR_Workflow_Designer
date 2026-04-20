import type { ComponentType } from 'react'
import type { NodeProps, NodeTypes } from 'reactflow'
import { WorkflowNode } from './WorkflowNode'

const workflowNodeComponent = WorkflowNode as ComponentType<NodeProps>

export const workflowNodeTypes = {
  start: workflowNodeComponent,
  task: workflowNodeComponent,
  approval: workflowNodeComponent,
  automated: workflowNodeComponent,
  end: workflowNodeComponent,
} satisfies NodeTypes
