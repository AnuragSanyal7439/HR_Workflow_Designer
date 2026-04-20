import { useState } from 'react';
import { Sidebar, Canvas, ConfigurationPanel, ExecutionPanel, Toolbar } from './components';
import './App.css';

function App() {
  const [showExecution, setShowExecution] = useState(false);

  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/reactflow', nodeType);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>HR Workflow Designer</h1>
        <div className="header-info">
          <p>Design and simulate HR workflows using drag-and-drop interface</p>
        </div>
      </header>

      <div className="app-container">
        <aside className="sidebar-wrapper">
          <Sidebar onDragStart={handleDragStart} />
        </aside>

        <div className="main-area">
          <Canvas />
        </div>

        <aside className="right-panel">
          {showExecution ? (
            <ExecutionPanel />
          ) : (
            <ConfigurationPanel />
          )}
        </aside>

        <div className="left-toolbar">
          <Toolbar />
          <button
            className="panel-toggle"
            onClick={() => setShowExecution(!showExecution)}
            title={showExecution ? 'Show Configuration' : 'Show Execution'}
          >
            {showExecution ? '⚙' : '📋'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
