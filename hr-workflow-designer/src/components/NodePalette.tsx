import type { DragEvent } from 'react'
import { useWorkflowStore } from '../store/workflowStore'
import { workflowTemplates } from '../templates/workflowTemplates'
import { WORKFLOW_NODE_DRAG_TYPE } from '../types/workflow'
import type { PaletteNode } from '../types/workflow'

const paletteNodes: PaletteNode[] = [
  {
    type: 'start',
    label: 'Start',
    description: 'Begin a workflow from a single entry point.',
  },
  {
    type: 'task',
    label: 'Task',
    description: 'Assign a follow-up action to a responsible owner.',
  },
  {
    type: 'approval',
    label: 'Approval',
    description: 'Route a decision to a role before continuing.',
  },
  {
    type: 'automated',
    label: 'Automated Step',
    description: 'Run a configured system action in the workflow.',
  },
  {
    type: 'end',
    label: 'End',
    description: 'Mark a workflow path as complete.',
  },
]

function handleDragStart(event: DragEvent<HTMLElement>, node: PaletteNode) {
  event.dataTransfer.setData(WORKFLOW_NODE_DRAG_TYPE, node.type)
  event.dataTransfer.effectAllowed = 'move'
}

export function NodePalette() {
  const insertTemplate = useWorkflowStore((state) => state.insertTemplate)

  return (
    <aside className="designer-sidebar" aria-label="Node palette">
      <div>
        <p className="panel-eyebrow">Palette</p>
        <h1>HR Workflow Designer</h1>
      </div>

      <p className="panel-copy">
        Drag a card onto the canvas to create a workflow node.
      </p>

      <section className="palette-section" aria-label="Nodes">
        <h2>Nodes</h2>
        <div className="palette-list">
          {paletteNodes.map((node) => (
            <article
              className="palette-card"
              draggable
              key={node.type}
              onDragStart={(event) => handleDragStart(event, node)}
            >
              <h3>{node.label}</h3>
              <p>{node.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="palette-section" aria-label="Templates">
        <h2>Templates</h2>
        <div className="palette-list">
          {workflowTemplates.map((template) => (
            <button
              className="palette-card palette-card--template"
              key={template.id}
              type="button"
              onClick={() => insertTemplate(template)}
            >
              <h3>{template.label}</h3>
              <p>{template.description}</p>
            </button>
          ))}
        </div>
      </section>
    </aside>
  )
}
