import type { EndNodeData } from '../types';
import './TaskForm.css';

interface EndFormProps {
  node: EndNodeData;
  onUpdate: (node: EndNodeData) => void;
}

export function EndForm({ node, onUpdate }: EndFormProps) {
  const handleChange = (field: keyof EndNodeData, value: unknown) => {
    const updated = {
      ...node,
      [field]: value,
    };
    
    // Update label when endMessage changes
    if (field === 'endMessage' && typeof value === 'string') {
      // Use first 20 chars of message as label
      updated.label = value.substring(0, 20) || 'End';
    }
    
    onUpdate(updated);
  };

  return (
    <div className="form-container">
      <h3>End Node Configuration</h3>

      <div className="form-group">
        <label htmlFor="end-message">End Message *</label>
        <textarea
          id="end-message"
          value={node.endMessage}
          onChange={(e) => handleChange('endMessage', e.target.value)}
          placeholder="Enter completion message"
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="show-summary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            id="show-summary"
            type="checkbox"
            checked={node.showSummary}
            onChange={(e) => handleChange('showSummary', e.target.checked)}
            style={{ margin: 0 }}
          />
          Show Summary
        </label>
        <p style={{ color: '#999', fontSize: '12px', marginTop: '4px' }}>
          Display workflow execution summary when complete
        </p>
      </div>
    </div>
  );
}
