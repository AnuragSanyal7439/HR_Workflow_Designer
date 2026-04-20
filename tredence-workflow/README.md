# HR Workflow Designer

A modern, modular React + TypeScript application for designing and simulating HR workflows using React Flow, Vite, and Zustand.

## Features

✨ **Drag-and-Drop Workflow Canvas**
- Intuitive drag-and-drop interface powered by React Flow
- 5 node types: Start, Task, Approval, Automated, End
- Real-time node connection with drag handles

🎯 **Node Types**
- **Start Node**: Entry point for workflows
- **Task Node**: Manual tasks with assignee and due dates
- **Approval Node**: Role-based approval gates with thresholds
- **Automated Node**: Integration with automation actions
- **End Node**: Workflow termination

⚙️ **Dynamic Configuration**
- Click any node to open configuration panel
- Type-specific forms for each node
- Real-time validation and updates
- Delete nodes with visual confirmation

🔌 **Automation Actions**
- Pre-built actions: Send Email, Create Task, Database Query, Webhook Call
- Dynamic parameter forms based on action type
- Support for multiple parameter types: text, number, select, boolean

🎬 **Workflow Simulation**
- Run complete workflow simulations with mock execution
- Real-time execution logs showing step-by-step progress
- Error handling and execution status tracking
- 80% success rate simulation for realistic testing

📊 **State Management**
- Zustand for lightweight, scalable global state
- Clean API for workflow operations
- Execution log persistence

💾 **Export & Download**
- View workflow as JSON
- Download workflows as JSON files
- Serializable workflow format

## Project Structure

```
src/
├── types/              # TypeScript type definitions
├── store/              # Zustand store (workflowStore.ts)
├── services/           # API services (workflowAPIService.ts)
├── hooks/              # Custom React hooks
│   ├── useWorkflow.ts
│   ├── useNodes.ts
│   └── useWorkflowSimulation.ts
├── components/         # Main UI components
│   ├── Sidebar.tsx      # Node palette
│   ├── Canvas.tsx       # React Flow canvas
│   ├── ConfigurationPanel.tsx
│   ├── ExecutionPanel.tsx
│   └── Toolbar.tsx
├── nodes/              # React Flow node components
│   ├── BaseNode.tsx
│   └── nodes.tsx
├── forms/              # Configuration forms
│   ├── TaskForm.tsx
│   ├── ApprovalForm.tsx
│   ├── AutomatedForm.tsx
│   └── index.tsx
└── App.tsx             # Main application component
```

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Install React Flow and Zustand (if not already installed)
npm install reactflow zustand
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

The application will be available at `http://localhost:5174/` (or another port if in use).

## Usage Guide

### Creating a Workflow

1. **Add Nodes**: Drag nodes from the left sidebar onto the canvas
2. **Connect Nodes**: Drag from output handle (bottom) to input handle (top)
3. **Configure**: Click nodes to open configuration panel
4. **Simulate**: Click "Run Workflow" to test execution
5. **Toggle Panels**: Use circle button to switch panels

### Node Configuration

#### Task Node
- **Title**: Task name (required)
- **Description**: Detailed description
- **Assignee**: Email or user ID (required)
- **Due Date**: Optional deadline

#### Approval Node
- **Title**: Approval step name (required)
- **Role**: Required role (required)
- **Threshold**: Number of approvals needed (required)

#### Automated Node
- **Action**: Select from available actions (required)
- **Parameters**: Dynamic fields based on action

### Workflow Validation

Auto-validates before simulation:
- ✓ At least one Start node
- ✓ At least one End node
- ✓ No disconnected nodes
- ✓ All nodes reachable from Start

## Architecture

### Folder Structure
- **types/**: TypeScript interfaces and types
- **store/**: Zustand store for global state
- **services/**: API and business logic services
- **hooks/**: Custom React hooks (useWorkflow, useNodes, useWorkflowSimulation)
- **components/**: React components (Canvas, Sidebar, etc.)
- **nodes/**: React Flow node components
- **forms/**: Dynamic configuration forms

### State Management

Uses Zustand for lightweight state:
- Store nodes and edges
- Track selected node
- Persist execution logs
- Provide mutation methods

### API Service

Mock API with:
- `getAutomationActions()`: List actions
- `simulateWorkflow()`: Run simulation
- `validateWorkflow()`: Validate structure

## Technology Stack

- **React 19**: UI framework
- **TypeScript 6**: Type safety
- **Vite 8**: Fast build tool
- **React Flow**: Workflow canvas
- **Zustand**: State management
- **ESLint**: Code quality

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Performance

- Bundle: ~350KB (gzipped ~110KB)
- Hot Module Replacement (HMR)
- Optimized for fast iteration

## License

MIT
