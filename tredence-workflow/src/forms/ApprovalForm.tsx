import type { ApprovalNodeData } from '../types';
import './TaskForm.css';

interface ApprovalFormProps {
  node: ApprovalNodeData;
  onUpdate: (node: ApprovalNodeData) => void;
}

export function ApprovalForm({ node, onUpdate }: ApprovalFormProps) {
  const handleChange = (field: keyof ApprovalNodeData, value: unknown) => {
    const updated = {
      ...node,
      [field]: value,
    };
    
    // Update label when title changes
    if (field === 'title' && typeof value === 'string') {
      updated.label = value || 'Approval';
    }
    
    onUpdate(updated);
  };

  return (
    <div className="form-container">
      <h3>Approval Configuration</h3>

      <div className="form-group">
        <label htmlFor="approval-title">Title *</label>
        <input
          id="approval-title"
          type="text"
          value={node.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter approval title"
        />
      </div>

      <div className="form-group">
        <label htmlFor="approval-role">Required Role *</label>
        <input
          id="approval-role"
          type="text"
          value={node.approverRole}
          onChange={(e) => handleChange('approverRole', e.target.value)}
          placeholder="e.g., Manager, Director"
        />
      </div>

      <div className="form-group">
        <label htmlFor="approval-threshold">Approval Threshold *</label>
        <input
          id="approval-threshold"
          type="number"
          value={node.threshold}
          onChange={(e) => handleChange('threshold', parseInt(e.target.value))}
          min="1"
          placeholder="Number of approvals required"
        />
      </div>
    </div>
  );
}
