import type { WorkflowEdge, WorkflowNode } from '../types/workflow'
import type { WorkflowTemplate } from '../types/workflowTemplate'

const TEMPLATE_X_GAP = 360

export type TemplateInsertionResult = {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  nextNodeId: number
}

export function insertWorkflowTemplate(
  template: WorkflowTemplate,
  currentNodes: WorkflowNode[],
  currentEdges: WorkflowEdge[],
  nextNodeId: number,
): TemplateInsertionResult {
  const offset = getTemplateOffset(currentNodes)
  const templateIdByNodeId = new Map<string, string>()
  let currentNodeId = nextNodeId

  const insertedNodes = template.nodes.map((templateNode) => {
    const nodeId = `${templateNode.type}-${currentNodeId}`

    currentNodeId += 1
    templateIdByNodeId.set(templateNode.id, nodeId)

    return {
      id: nodeId,
      type: templateNode.type,
      position: {
        x: templateNode.position.x + offset.x,
        y: templateNode.position.y + offset.y,
      },
      data: cloneJson(templateNode.data),
    } as WorkflowNode
  })

  const insertedEdges = template.edges.flatMap<WorkflowEdge>((templateEdge) => {
    const source = templateIdByNodeId.get(templateEdge.source)
    const target = templateIdByNodeId.get(templateEdge.target)

    if (!source || !target) {
      return []
    }

    return [
      {
        id: `${template.id}-${source}-${target}`,
        source,
        target,
      },
    ]
  })

  return {
    nodes: [...currentNodes, ...insertedNodes],
    edges: [...currentEdges, ...insertedEdges],
    nextNodeId: currentNodeId,
  }
}

function getTemplateOffset(nodes: WorkflowNode[]) {
  if (nodes.length === 0) {
    return { x: 0, y: 0 }
  }

  const maxX = Math.max(...nodes.map((node) => node.position.x))

  return {
    x: maxX + TEMPLATE_X_GAP,
    y: 0,
  }
}

function cloneJson<TValue>(value: TValue): TValue {
  return JSON.parse(JSON.stringify(value)) as TValue
}
