import { useEffect, useState } from 'react';
import type { AutomatedNodeData, AutomationAction } from '../types';
import { WorkflowAPIService } from '../services/workflowAPIService';
import './TaskForm.css';

interface AutomatedFormProps {
  node: AutomatedNodeData;
  onUpdate: (node: AutomatedNodeData) => void;
}

export function AutomatedForm({ node, onUpdate }: AutomatedFormProps) {
  const [actions, setActions] = useState<AutomationAction[]>([]);
  const [selectedAction, setSelectedAction] = useState<AutomationAction | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActions = async () => {
      try {
        const data = await WorkflowAPIService.getAutomationActions();
        setActions(data);
        if (node.actionId) {
          const action = data.find((a: any) => a.id === node.actionId);
          setSelectedAction(action || null);
        }
      } catch (error) {
        console.error('Failed to load actions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadActions();
  }, [node.actionId]);

  const handleActionChange = (actionId: string) => {
    const action = actions.find((a) => a.id === actionId);
    if (action) {
      setSelectedAction(action);
      onUpdate({
        ...node,
        actionId: action.id,
        actionName: action.name,
        label: action.name, // Update label to match action name
        params: {},
      });
    }
  };

  const handleParamChange = (paramName: string, value: unknown) => {
    onUpdate({
      ...node,
      params: {
        ...node.params,
        [paramName]: value,
      },
    });
  };

  if (loading) {
    return (
      <div className="form-container">
        <p>Loading automation actions...</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h3>Automated Action Configuration</h3>

      <div className="form-group">
        <label htmlFor="auto-action">Select Action *</label>
        <select
          id="auto-action"
          value={node.actionId}
          onChange={(e) => handleActionChange(e.target.value)}
        >
          <option value="">-- Select an action --</option>
          {actions.map((action) => (
            <option key={action.id} value={action.id}>
              {action.name}
            </option>
          ))}
        </select>
      </div>

      {selectedAction && selectedAction.description && (
        <div
          style={{
            padding: '8px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#666',
            marginBottom: '12px',
          }}
        >
          {selectedAction.description}
        </div>
      )}

      {selectedAction && selectedAction.params.length > 0 && (
        <div>
          <h4 style={{ margin: '12px 0 8px 0', fontSize: '13px' }}>
            Parameters
          </h4>
          {selectedAction.params.map((param: any) => (
            <div key={param.name} className="form-group">
              <label htmlFor={`param-${param.name}`}>
                {param.name}
                {param.required && ' *'}
              </label>

              {param.type === 'select' && param.options ? (
                <select
                  id={`param-${param.name}`}
                  value={(node.params[param.name] as string) || ''}
                  onChange={(e) => handleParamChange(param.name, e.target.value)}
                >
                  <option value="">-- Select {param.name} --</option>
                  {param.options.map((opt: any) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : param.type === 'number' ? (
                <input
                  id={`param-${param.name}`}
                  type="number"
                  value={(node.params[param.name] as number) || ''}
                  onChange={(e) =>
                    handleParamChange(param.name, parseInt(e.target.value))
                  }
                  placeholder={`Enter ${param.name}`}
                />
              ) : param.type === 'boolean' ? (
                <input
                  id={`param-${param.name}`}
                  type="checkbox"
                  checked={(node.params[param.name] as boolean) || false}
                  onChange={(e) => handleParamChange(param.name, e.target.checked)}
                />
              ) : (
                <input
                  id={`param-${param.name}`}
                  type="text"
                  value={(node.params[param.name] as string) || ''}
                  onChange={(e) => handleParamChange(param.name, e.target.value)}
                  placeholder={`Enter ${param.name}`}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
