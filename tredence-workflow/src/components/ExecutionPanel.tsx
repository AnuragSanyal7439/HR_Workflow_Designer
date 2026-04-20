import { useWorkflowStore } from '../store/workflowStore';
import './ExecutionPanel.css';

export function ExecutionPanel() {
  const executionLog = useWorkflowStore((state: any) => state.executionLog);

  if (!executionLog) {
    return null;
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'failed':
        return '#F44336';
      case 'executing':
        return '#FF9800';
      case 'pending':
        return '#9E9E9E';
      default:
        return '#757575';
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'failed':
        return '✕';
      case 'executing':
        return '⟳';
      case 'pending':
        return '○';
      default:
        return '?';
    }
  };

  return (
    <div className="execution-panel">
      <div className="execution-header">
        <h3>Execution Log</h3>
        <span className={`status-badge ${executionLog.status}`}>
          {executionLog.status.toUpperCase()}
        </span>
      </div>

      <div className="execution-info">
        <div className="info-row">
          <span className="info-label">Started:</span>
          <span className="info-value">
            {new Date(executionLog.startTime).toLocaleTimeString()}
          </span>
        </div>
        {executionLog.endTime && (
          <div className="info-row">
            <span className="info-label">Ended:</span>
            <span className="info-value">
              {new Date(executionLog.endTime).toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>

      <div className="execution-steps">
        <h4>Execution Steps</h4>
        <div className="steps-list">
          {executionLog.steps.map((step: any, index: any) => (
            <div key={index} className="step-item">
              <div
                className="step-icon"
                style={{ backgroundColor: getStatusColor(step.status) }}
              >
                {getStatusIcon(step.status)}
              </div>
              <div className="step-content">
                <div className="step-title">
                  {step.nodeType} - {step.nodeId}
                </div>
                <div className="step-status">
                  {step.status.toUpperCase()}
                </div>
                {step.error && (
                  <div className="step-error">Error: {step.error}</div>
                )}
                <div className="step-time">
                  {new Date(step.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
