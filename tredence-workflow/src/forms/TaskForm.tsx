import type { TaskNodeData } from '../types';
import './TaskForm.css';

interface TaskFormProps {
  node: TaskNodeData;
  onUpdate: (node: TaskNodeData) => void;
}

export function TaskForm({ node, onUpdate }: TaskFormProps) {
  const handleChange = (field: keyof TaskNodeData, value: unknown) => {
    const updated = {
      ...node,
      [field]: value,
    };
    
    // Update label when title changes
    if (field === 'title' && typeof value === 'string') {
      updated.label = value || 'Task';
    }
    
    onUpdate(updated);
  };

  return (
    <div className="form-container">
      <h3>Task Configuration</h3>

      <div className="form-group">
        <label htmlFor="task-title">Title *</label>
        <input
          id="task-title"
          type="text"
          value={node.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter task title"
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          value={node.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter task description"
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-assignee">Assignee *</label>
        <input
          id="task-assignee"
          type="text"
          value={node.assignee}
          onChange={(e) => handleChange('assignee', e.target.value)}
          placeholder="e.g., john@example.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-dueDate">Due Date</label>
        <input
          id="task-dueDate"
          type="date"
          value={node.dueDate}
          onChange={(e) => handleChange('dueDate', e.target.value)}
        />
      </div>
    </div>
  );
}
