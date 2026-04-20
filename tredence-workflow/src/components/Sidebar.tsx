import './Sidebar.css';

interface SidebarProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

export function Sidebar({ onDragStart }: SidebarProps) {
  const nodeTypes = [
    { type: 'start', label: 'Start', icon: '▶' },
    { type: 'task', label: 'Task', icon: '✓' },
    { type: 'approval', label: 'Approval', icon: '👤' },
    { type: 'automated', label: 'Automated', icon: '⚙' },
    { type: 'end', label: 'End', icon: '◼' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Node Palette</h2>
      </div>

      <div className="nodes-grid">
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            className="node-item"
            draggable
            onDragStart={(e) => onDragStart(e, node.type)}
          >
            <div className="node-item-icon">{node.icon}</div>
            <div className="node-item-label">{node.label}</div>
          </div>
        ))}
      </div>

      <div className="sidebar-section">
        <h3>Tips</h3>
        <ul>
          <li>Drag nodes to the canvas</li>
          <li>Click nodes to configure</li>
          <li>Connect nodes by dragging handles</li>
          <li>Use Run Workflow to simulate</li>
        </ul>
      </div>
    </div>
  );
}
