import type { StartNodeData } from '../types';
import './TaskForm.css';

interface StartFormProps {
  node: StartNodeData;
  onUpdate: (node: StartNodeData) => void;
}

export function StartForm({ node, onUpdate }: StartFormProps) {
  const handleChange = (field: keyof StartNodeData, value: unknown) => {
    const updated = {
      ...node,
      [field]: value,
    };
    
    // Update label when title changes
    if (field === 'title' && typeof value === 'string') {
      updated.label = value || 'Start';
    }
    
    onUpdate(updated);
  };

  const handleMetadataChange = (key: string, value: string) => {
    const metadata = node.metadata || {};
    if (value === '') {
      const newMetadata = { ...metadata };
      delete newMetadata[key];
      onUpdate({
        ...node,
        metadata: Object.keys(newMetadata).length > 0 ? newMetadata : undefined,
      });
    } else {
      onUpdate({
        ...node,
        metadata: {
          ...metadata,
          [key]: value,
        },
      });
    }
  };

  const handleAddMetadata = () => {
    const newKey = `key${Object.keys(node.metadata || {}).length + 1}`;
    onUpdate({
      ...node,
      metadata: {
        ...(node.metadata || {}),
        [newKey]: '',
      },
    });
  };

  const metadataEntries = Object.entries(node.metadata || {});

  return (
    <div className="form-container">
      <h3>Start Node Configuration</h3>

      <div className="form-group">
        <label htmlFor="start-title">Title *</label>
        <input
          id="start-title"
          type="text"
          value={node.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g., Workflow Started"
        />
      </div>

      <div className="form-group">
        <label>Metadata (Key-Value Pairs)</label>
        {metadataEntries.length === 0 ? (
          <p style={{ color: '#999', fontSize: '12px' }}>No metadata added</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {metadataEntries.map(([key, value]) => (
              <div key={key} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={key}
                  placeholder="Key"
                  disabled
                  style={{
                    flex: 0.5,
                    padding: '6px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: '#f5f5f5',
                  }}
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleMetadataChange(key, e.target.value)}
                  placeholder="Value"
                  style={{
                    flex: 1,
                    padding: '6px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                />
              </div>
            ))}
          </div>
        )}
        <button
          onClick={handleAddMetadata}
          style={{
            marginTop: '8px',
            padding: '6px 12px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          + Add Metadata
        </button>
      </div>
    </div>
  );
}
