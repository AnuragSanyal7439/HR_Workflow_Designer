import { useState, type DragEvent } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useReactFlow,
} from 'reactflow'
import { workflowNodeTypes } from '../nodes'
import { useWorkflowStore } from '../store/workflowStore'
import {
  isWorkflowNodeType,
  WORKFLOW_NODE_DRAG_TYPE,
} from '../types/workflow'
import {
  exportWorkflowAsJson,
  importWorkflowFromJson,
} from '../utils/workflowJson'
import { runWorkflowSimulation, type WorkflowSimulationResult } from '../utils/workflowSimulation'
import {
  groupValidationIssuesByNode,
  validateWorkflowGraph,
} from '../utils/workflowValidation'
import { SimulationPanel } from './SimulationPanel'
import { ValidationSummary } from './ValidationSummary'
import { WorkflowJsonPanel } from './WorkflowJsonPanel'

type WorkflowJsonPanelMode = 'export' | 'import'

export function WorkflowCanvas() {
  const { screenToFlowPosition } = useReactFlow()
  const [simulationResult, setSimulationResult] =
    useState<WorkflowSimulationResult | null>(null)
  const [jsonPanelMode, setJsonPanelMode] =
    useState<WorkflowJsonPanelMode | null>(null)
  const [workflowJson, setWorkflowJson] = useState('')
  const [importError, setImportError] = useState<string | null>(null)
  const nodes = useWorkflowStore((state) => state.nodes)
  const edges = useWorkflowStore((state) => state.edges)
  const dropNotice = useWorkflowStore((state) => state.dropNotice)
  const addNode = useWorkflowStore((state) => state.addNode)
  const loadWorkflow = useWorkflowStore((state) => state.loadWorkflow)
  const autoLayout = useWorkflowStore((state) => state.autoLayout)
  const undo = useWorkflowStore((state) => state.undo)
  const redo = useWorkflowStore((state) => state.redo)
  const canUndo = useWorkflowStore((state) => state.past.length > 0)
  const canRedo = useWorkflowStore((state) => state.future.length > 0)
  const selectNode = useWorkflowStore((state) => state.selectNode)
  const clearSelection = useWorkflowStore((state) => state.clearSelection)
  const onNodesChange = useWorkflowStore((state) => state.onNodesChange)
  const onEdgesChange = useWorkflowStore((state) => state.onEdgesChange)
  const onConnect = useWorkflowStore((state) => state.onConnect)
  const validationResult = validateWorkflowGraph({ nodes, edges })
  const validationIssuesByNode = groupValidationIssuesByNode(
    validationResult.issues,
  )
  const validatedNodes = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      validationIssues: validationIssuesByNode.get(node.id) ?? [],
    },
  }))

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()

    const nodeType = event.dataTransfer.getData(WORKFLOW_NODE_DRAG_TYPE)

    if (!isWorkflowNodeType(nodeType)) {
      return
    }

    addNode(
      nodeType,
      screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      }),
    )
  }

  function handleRunSimulation() {
    setSimulationResult(runWorkflowSimulation(nodes, edges))
  }

  function handleExportJson() {
    setWorkflowJson(exportWorkflowAsJson(nodes, edges))
    setImportError(null)
    setJsonPanelMode('export')
  }

  function handleOpenImport() {
    setWorkflowJson('')
    setImportError(null)
    setJsonPanelMode('import')
  }

  function handleImportJson() {
    const result = importWorkflowFromJson(workflowJson)

    if (!result.success) {
      setImportError(result.error)
      return
    }

    loadWorkflow(result.workflow.nodes, result.workflow.edges)
    setImportError(null)
    setJsonPanelMode(null)
    setSimulationResult(null)
  }

  return (
    <section className="canvas-panel" aria-label="Workflow canvas">
      <header className="canvas-header">
        <div>
          <p className="panel-eyebrow">Canvas</p>
          <h2>Design Surface</h2>
        </div>
        <div className="canvas-actions">
          <ValidationSummary issues={validationResult.issues} />
          <span
            className={`canvas-status${dropNotice ? ' canvas-status--warning' : ''}`}
          >
            {dropNotice ?? `${nodes.length} nodes / ${edges.length} edges`}
          </span>
          <button
            className="run-simulation-button"
            type="button"
            onClick={handleRunSimulation}
          >
            Run Simulation
          </button>
          <button
            className="secondary-action-button"
            disabled={!canUndo}
            type="button"
            onClick={undo}
          >
            Undo
          </button>
          <button
            className="secondary-action-button"
            disabled={!canRedo}
            type="button"
            onClick={redo}
          >
            Redo
          </button>
          <button
            className="secondary-action-button"
            type="button"
            onClick={autoLayout}
          >
            Auto Layout
          </button>
          <button
            className="secondary-action-button"
            type="button"
            onClick={handleExportJson}
          >
            Export JSON
          </button>
          <button
            className="secondary-action-button"
            type="button"
            onClick={handleOpenImport}
          >
            Import JSON
          </button>
        </div>
      </header>

      <div className="canvas-surface">
        <ReactFlow
          className="workflow-canvas"
          nodes={validatedNodes}
          edges={edges}
          nodeTypes={workflowNodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_, node) => selectNode(node.id)}
          onPaneClick={clearSelection}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          fitView
        >
          <Background gap={24} size={1.4} />
          <MiniMap
            className="workflow-minimap"
            maskColor="rgba(31, 43, 36, 0.08)"
            nodeBorderRadius={10}
            nodeStrokeWidth={3}
            pannable
            position="top-right"
            zoomable
          />
          <Controls position="bottom-right" />
        </ReactFlow>
      </div>

      {jsonPanelMode && (
        <WorkflowJsonPanel
          error={importError}
          json={workflowJson}
          mode={jsonPanelMode}
          onClose={() => setJsonPanelMode(null)}
          onImport={handleImportJson}
          onJsonChange={setWorkflowJson}
        />
      )}

      {simulationResult && <SimulationPanel result={simulationResult} />}
    </section>
  )
}
