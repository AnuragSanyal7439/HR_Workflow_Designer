# 🎨 HR Workflow Designer - Visual Project Overview

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    HR Workflow Designer                      │
│                     (React + TypeScript)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
        ┌──────▼────┐  ┌──────▼────┐  ┌──▼──────┐
        │    Sidebar │  │  Canvas   │  │  Toolbar │
        │            │  │ (React    │  │          │
        │ - Nodes    │  │  Flow)    │  │ - Run    │
        │ - Tips     │  │ - Nodes   │  │ - Export │
        │            │  │ - Edges   │  │ - Clear  │
        └──────┬────┘  └────┬──────┘  └──┬──────┘
               │             │             │
        ┌──────▼─────────────▼─────────────▼──────┐
        │   App Component (Main Layout)          │
        └──────┬──────────────────────────────────┘
               │
        ┌──────▼─────────────────────────┐
        │   Right Panel (Toggle)         │
        ├────────────────────────────────┤
        │ • Configuration Panel (Config) │
        │ • Execution Panel (Logs)       │
        └──────┬───────────────────┬─────┘
               │                   │
        ┌──────▼───┐        ┌──────▼──────┐
        │NodeForms │        │Execution    │
        │          │        │Logs Display │
        ├──────────┤        └─────────────┘
        │- TaskF.  │
        │- ApprovalF.
        │- AutomatedF.
        └──────────┘
```

## Data Flow

```
┌──────────────────────────────────────────────────────┐
│              Zustand Global Store                    │
│  (nodes[], edges[], selectedNodeId, executionLog)   │
└──────┬──────────────────────────────┬────────────────┘
       │                              │
    ┌──▼──────┐                  ┌────▼─────┐
    │ Component│◄───────────────►│  Service  │
    │  State   │  Subscribe/Act  │  Methods  │
    └──┬───────┘                  └────┬─────┘
       │                              │
    ┌──▼────────────┐          ┌──────▼──────┐
    │ Components    │          │ Mock API    │
    │ Read & Update │          │ Simulation  │
    │ Store State   │          │ Validation  │
    └──────────────┘          └─────────────┘
```

## Component Tree

```
App.tsx
├── Sidebar.tsx
│   └── Node Palette (5 types)
├── Canvas.tsx
│   ├── React Flow Instance
│   ├── Nodes (Start, Task, Approval, Automated, End)
│   └── Edges (Connections)
├── Toolbar.tsx
│   ├── Run Button
│   ├── Export/Download
│   ├── Clear Buttons
│   └── JSON Preview
└── Right Panel (Toggled)
    ├── ConfigurationPanel.tsx
    │   ├── NodeForm (Dynamic)
    │   │   ├── TaskForm
    │   │   ├── ApprovalForm
    │   │   └── AutomatedForm
    │   └── Delete Button
    └── ExecutionPanel.tsx
        └── Execution Logs Display
```

## Data Structure

```
Workflow Object
├── nodes[]
│   ├── StartNode
│   │   ├── id: "start-1"
│   │   ├── type: "start"
│   │   ├── label: "Start"
│   │   └── position: {x, y}
│   ├── TaskNode
│   │   ├── id: "task-1"
│   │   ├── type: "task"
│   │   ├── title: "Review"
│   │   ├── description: "..."
│   │   ├── assignee: "..."
│   │   ├── dueDate: "..."
│   │   └── position: {x, y}
│   ├── ApprovalNode
│   │   ├── id: "approval-1"
│   │   ├── type: "approval"
│   │   ├── title: "Approve"
│   │   ├── role: "Manager"
│   │   ├── threshold: 2
│   │   └── position: {x, y}
│   ├── AutomatedNode
│   │   ├── id: "automated-1"
│   │   ├── type: "automated"
│   │   ├── actionId: "send-email"
│   │   ├── actionName: "Send Email"
│   │   ├── params: {...}
│   │   └── position: {x, y}
│   └── EndNode
│       ├── id: "end-1"
│       ├── type: "end"
│       ├── label: "End"
│       └── position: {x, y}
├── edges[]
│   └── {id, source, target, animated}
└── metadata
    ├── workflowId
    ├── createdAt
    └── updatedAt
```

## Automation Action Structure

```
AutomationAction {
  id: "send-email"
  name: "Send Email"
  description: "Send email notification"
  params: [
    {
      name: "recipient"
      type: "string"
      required: true
    },
    {
      name: "subject"
      type: "string"
      required: true
    },
    {
      name: "template"
      type: "select"
      required: true
      options: [
        {label: "Approval Request", value: "approval-request"},
        {label: "Task Assignment", value: "task-assignment"}
      ]
    }
  ]
}
```

## Folder Structure Tree

```
tredence-workflow/
│
├── src/
│   ├── types/
│   │   └── index.ts
│   │       ├── WorkflowNodeData (union type)
│   │       ├── TaskNodeData
│   │       ├── ApprovalNodeData
│   │       ├── AutomatedNodeData
│   │       ├── ExecutionLog
│   │       ├── ExecutionStep
│   │       └── AutomationAction
│   │
│   ├── store/
│   │   └── workflowStore.ts
│   │       ├── State: nodes, edges, selectedNodeId, executionLog
│   │       ├── Actions: addNode, updateNode, deleteNode
│   │       ├── Actions: addEdge, deleteEdge
│   │       └── Actions: setExecutionLog, clearWorkflow
│   │
│   ├── services/
│   │   └── workflowAPIService.ts
│   │       ├── getAutomationActions()
│   │       ├── simulateWorkflow()
│   │       ├── validateWorkflow()
│   │       └── automationActions[] (4 actions)
│   │
│   ├── hooks/
│   │   ├── useWorkflow.ts
│   │   │   ├── getWorkflowJSON()
│   │   │   ├── downloadWorkflow()
│   │   │   └── exportWorkflow()
│   │   ├── useNodes.ts
│   │   │   ├── createStartNode()
│   │   │   ├── createTaskNode()
│   │   │   ├── createApprovalNode()
│   │   │   ├── createAutomatedNode()
│   │   │   └── createEndNode()
│   │   ├── useWorkflowSimulation.ts
│   │   │   ├── runSimulation()
│   │   │   ├── validateWorkflow()
│   │   │   └── resetSimulation()
│   │   └── index.ts (export all)
│   │
│   ├── components/
│   │   ├── Sidebar.tsx + Sidebar.css
│   │   │   └── Draggable node palette
│   │   ├── Canvas.tsx + Canvas.css
│   │   │   └── React Flow canvas
│   │   ├── ConfigurationPanel.tsx + CSS
│   │   │   └── Node configuration UI
│   │   ├── ExecutionPanel.tsx + CSS
│   │   │   └── Execution logs display
│   │   ├── Toolbar.tsx + Toolbar.css
│   │   │   └── Workflow controls
│   │   └── index.ts (export all)
│   │
│   ├── nodes/
│   │   ├── BaseNode.tsx + BaseNode.css
│   │   │   ├── StartNode
│   │   │   ├── TaskNode
│   │   │   ├── ApprovalNode
│   │   │   ├── AutomatedNode
│   │   │   └── EndNode
│   │   └── nodes.tsx
│   │       └── nodeTypes export
│   │
│   ├── forms/
│   │   ├── TaskForm.tsx
│   │   ├── ApprovalForm.tsx
│   │   ├── AutomatedForm.tsx
│   │   ├── TaskForm.css
│   │   └── index.tsx (form router)
│   │
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── index.css
│
├── dist/ (build output)
│   ├── index.html
│   └── assets/
│
├── public/
│
├── Configuration Files
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── eslint.config.js
│
└── Documentation
    ├── README.md
    ├── DEVELOPMENT.md
    ├── API.md
    ├── IMPLEMENTATION.md
    ├── QUICKSTART.md
    ├── FILES.md
    └── COMPLETION.md (this file)
```

## Execution Flow

```
User Actions                  Application Response
─────────────                 ────────────────────

1. Drag Node from Sidebar  → Canvas accepts drop
                           → createNode() called
                           → Node added to store
                           → Canvas re-renders

2. Click Node             → selectNode() called
                         → Store updates selectedNodeId
                         → ConfigurationPanel shows form
                         → Form displays node config

3. Edit Node Config       → handleChange() triggered
                         → updateNode() called
                         → Store updates node data
                         → Canvas updates in real-time

4. Connect Nodes          → onConnect() triggered
                         → addEdge() called
                         → Store adds edge
                         → Canvas shows line

5. Click "Run Workflow"   → validateWorkflow() called
                         → If valid: simulateWorkflow()
                         → setExecutionLog() updates store
                         → ExecutionPanel displays results

6. View Execution         → ExecutionPanel reads logs
                         → Displays step-by-step progress
                         → Shows success/failure status
```

## State Management Flow

```
┌─────────────────────────────────────┐
│   Zustand Store (workflowStore)    │
└──────────────┬──────────────────────┘
               │
     ┌─────────┴──────────┐
     │                    │
┌────▼─────┐        ┌─────▼────┐
│ Subscribe │        │  Dispatch │
│  (Read)   │        │  (Write)  │
└────┬─────┘        └─────┬────┘
     │                    │
  Consumers          Producers
  ├─ Components      ├─ Hooks
  ├─ Hooks           ├─ Components
  └─ Services        └─ Services
     
  Data Updated        Action Called
     │                    │
     └────────┬───────────┘
              │
      All Subscribers
      Re-render with
      New State
```

## Styling Architecture

```
Global Styles (index.css, App.css)
├── CSS Variables
│   ├── --primary
│   ├── --success
│   ├── --error
│   ├── --bg-primary
│   ├── --bg-secondary
│   └── --border-color
└── Base Styles
    ├── Box sizing
    ├── HTML/Body resets
    └── Global button/input styles

Component Styles
├── Sidebar.css
├── Canvas.css
├── ConfigurationPanel.css
├── ExecutionPanel.css
├── Toolbar.css
├── BaseNode.css (node styling)
└── TaskForm.css (form styling)
```

## Automation Flow

```
Automation Action Selection
      │
      ▼
┌─────────────────────┐
│ Select Action       │
│ from Dropdown       │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Load Parameters     │
│ from Action         │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Render Dynamic      │
│ Form Fields         │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ User Fills Values   │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Save to Node        │
│ in Store            │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ During Simulation   │
│ Execute Action      │
└─────────────────────┘
```

## Deployment Architecture

```
Development                    Production
┌──────────────┐              ┌──────────────┐
│ npm run dev  │              │ npm run build│
│ Port 5174    │              │ dist/ output │
│ HMR Enabled  │              │ Optimized    │
│ Source Maps  │              │ Minified     │
└──────────────┘              └──────┬───────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
              ┌─────▼────┐     ┌─────▼────┐   ┌──────▼─────┐
              │  Vercel  │     │ Netlify  │   │  AWS S3    │
              │(auto git)│     │  (static)│   │+ CloudFront│
              └──────────┘     └──────────┘   └────────────┘
```

## Network Request Flow

```
User Action
    │
    ▼
Component Handler
    │
    ▼
Service Method Call
(e.g., simulateWorkflow)
    │
    ▼
Mock API Simulation
(with delay)
    │
    ▼
Response Returned
    │
    ▼
Store Updated
(setExecutionLog)
    │
    ▼
Component Re-renders
with New Data
    │
    ▼
UI Shows Results
```

## Feature Highlight Map

```
Drag-and-Drop      Configuration       Simulation
├─ Sidebar         ├─ TaskForm        ├─ Run Button
├─ Canvas          ├─ ApprovalForm    ├─ Validation
└─ Nodes           ├─ AutomatedForm   ├─ 80% Success
                   └─ Dynamic Params  └─ Error Handling

Export             Execution Logs     State Management
├─ JSON View       ├─ Step Display    ├─ Zustand Store
├─ Download        ├─ Status Icons    ├─ Hooks
└─ Copy            ├─ Error Details   └─ Persistence
                   └─ Timing Info
```

## Performance Optimization Map

```
Loading
├─ Vite lazy loading
├─ Code splitting
└─ ~110KB gzipped

Runtime
├─ React.memo on nodes
├─ useCallback for handlers
├─ Zustand selectors
└─ Efficient re-renders

Bundle
├─ Tree shaking
├─ CSS minification
├─ JS minification
└─ 350KB → 110KB gzipped
```

---

**This visual overview shows the complete architecture and flow of the HR Workflow Designer application.**
