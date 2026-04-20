import { useState } from 'react';
import { useWorkflow } from '../hooks/useWorkflow';
import { useWorkflowSimulation } from '../hooks/useWorkflowSimulation';
import { useWorkflowStore } from '../store/workflowStore';
import './Toolbar.css';

export function Toolbar() {
  const { downloadWorkflow, clearWorkflow } = useWorkflow();
  const {
    isSimulating,
    simulationError,
    runSimulation,
    resetSimulation,
  } = useWorkflowSimulation();
  const nodes = useWorkflowStore((state: any) => state.nodes);
  const [showWorkflowJSON, setShowWorkflowJSON] = useState(false);
  const { getWorkflowJSON } = useWorkflow();

  const handleClear = () => {
    if (window.confirm('Clear entire workflow? This cannot be undone.')) {
      clearWorkflow();
    }
  };

  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <h3>Workflow</h3>
        <button
          className="btn-primary"
          onClick={runSimulation}
          disabled={isSimulating || nodes.length === 0}
          title={nodes.length === 0 ? 'Add nodes to run workflow' : ''}
        >
          {isSimulating ? '⟳ Running...' : '▶ Run Workflow'}
        </button>

        {simulationError && (
          <div className="error-message">{simulationError}</div>
        )}
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-section">
        <h3>Export</h3>
        <button
          className="btn-secondary"
          onClick={() => setShowWorkflowJSON(!showWorkflowJSON)}
        >
          {showWorkflowJSON ? '✓ Hide JSON' : '◊ Show JSON'}
        </button>
        <button
          className="btn-secondary"
          onClick={downloadWorkflow}
          disabled={nodes.length === 0}
        >
          ⬇ Download
        </button>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-section">
        <h3>Actions</h3>
        <button className="btn-secondary" onClick={resetSimulation}>
          Reset
        </button>
        <button className="btn-danger" onClick={handleClear}>
          Clear All
        </button>
      </div>

      {showWorkflowJSON && (
        <div className="json-display">
          <h4>Workflow JSON</h4>
          <pre>{getWorkflowJSON()}</pre>
        </div>
      )}
    </div>
  );
}
