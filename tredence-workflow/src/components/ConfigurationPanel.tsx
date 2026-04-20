import { useWorkflowStore } from '../store/workflowStore';
import { NodeForm } from '../forms';
import './ConfigurationPanel.css';

export function ConfigurationPanel() {
  const selectedNodeId = useWorkflowStore((state: any) => state.selectedNodeId);
  const getSelectedNode = useWorkflowStore((state: any) => state.getSelectedNode);
  const updateNodeData = useWorkflowStore((state: any) => state.updateNodeData);
  const deleteNode = useWorkflowStore((state: any) => state.deleteNode);
  const setSelectedNode = useWorkflowStore((state: any) => state.setSelectedNode);

  const selectedNode = getSelectedNode();

  if (!selectedNodeId || !selectedNode) {
    return (
      <div className="config-panel">
        <div className="config-empty">
          <p>No node selected</p>
          <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
            Click on a node to view its configuration
          </p>
        </div>
      </div>
    );
  }

  const handleUpdate = (updatedNode: any) => {
    // Pass the complete updated node data to store
    updateNodeData(selectedNode.id, updatedNode);
  };

  const handleDelete = () => {
    if (window.confirm('Delete this node?')) {
      deleteNode(selectedNode.id);
      setSelectedNode(null);
    }
  };

  return (
    <div className="config-panel">
      <div className="config-header">
        <h3>Node Configuration</h3>
        <button
          className="close-btn"
          onClick={() => setSelectedNode(null)}
          title="Close"
        >
          ✕
        </button>
      </div>

      <div className="config-content">
        <NodeForm node={selectedNode} onUpdate={handleUpdate} />

        <div className="config-actions">
          <button className="btn-danger" onClick={handleDelete}>
            Delete Node
          </button>
        </div>
      </div>
    </div>
  );
}
