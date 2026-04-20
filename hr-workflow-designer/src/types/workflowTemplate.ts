import type { XYPosition } from 'reactflow'
import type {
  WorkflowEdge,
  WorkflowNodeDataByType,
  WorkflowNodeType,
} from './workflow'

export type WorkflowTemplateNodeByType = {
  [Type in WorkflowNodeType]: {
    id: string
    type: Type
    position: XYPosition
    data: WorkflowNodeDataByType[Type]
  }
}

export type WorkflowTemplateNode =
  WorkflowTemplateNodeByType[WorkflowNodeType]

export type WorkflowTemplateEdge = Pick<
  WorkflowEdge,
  'id' | 'source' | 'target'
>

export type WorkflowTemplate = {
  id: string
  label: string
  description: string
  nodes: WorkflowTemplateNode[]
  edges: WorkflowTemplateEdge[]
}
