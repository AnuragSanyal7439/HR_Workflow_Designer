# Node Selection & Configuration System - Visual Guide

## 🎯 System Architecture

### Component Hierarchy
```
App.tsx (Layout Manager)
│
├── Sidebar (Node Palette)
│   └── Draggable Nodes (5 types)
│
├── Canvas (React Flow)
│   ├── Nodes (with click handlers)
│   └── Edges (connections)
│
├── Toolbar (Controls)
│   └── Run, Export, Clear
│
└── Right Panel (Toggleable)
    ├── ConfigurationPanel
    │   └── NodeForm (Dynamic)
    │       ├── StartForm
    │       ├── TaskForm
    │       ├── ApprovalForm
    │       ├── AutomatedForm
    │       └── EndForm
    │
    └── ExecutionPanel (Logs)
```

## 📊 State Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│              Zustand Global Store                        │
│  (nodes[], edges[], selectedNodeId, executionLog)       │
└──────────────────┬──────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
   Components          Selectors
   Subscribe to        (read state)
   Updates             │
                       └─→ ConfigurationPanel
                           reads selectedNodeId
                           reads getNode()
                           reads updateNode()

   User Action              Update Flow
   ─────────────            ────────────
   Click Node       ──→  selectNode(id)
                        updateNode(id, data)
                        deleteNode(id)
                        
   Edit Form        ──→  onUpdate callback
                        updateNode triggered
                        
   Store Change    ──→  All subscribers
                        notified & re-render
```

## 🔄 User Interaction Flow

### 1. Node Selection
```
User clicks on canvas node
    ↓
React Flow onNodeClick fired with node.id
    ↓
selectNode(nodeId) called in store
    ↓
selectedNodeId updated in Zustand
    ↓
ConfigurationPanel reads new selectedNodeId
    ↓
getNode(selectedNodeId) retrieves node data
    ↓
NodeForm router renders appropriate form
    ↓
Form displays node properties
```

### 2. Node Configuration
```
User edits form field
    ↓
handleChange(fieldName, value) called
    ↓
onUpdate({ ...node, [fieldName]: value }) called
    ↓
updateNode(nodeId, updatedData) in store
    ↓
Store merges changes: node = {...node, ...updatedData}
    ↓
Canvas re-renders with new node data
    ↓
UI displays updated values
```

### 3. Node Deletion
```
User clicks Delete Node button
    ↓
Confirmation dialog shown
    ↓
deleteNode(nodeId) called if confirmed
    ↓
Store removes node and related edges
    ↓
selectedNodeId set to null
    ↓
ConfigurationPanel shows empty state
```

## 📋 Data Structure

### Node Types and Data

#### Start Node
```typescript
{
  id: "start-1704067200000",
  label: "Start",
  type: "start",
  title: "Workflow Start",          ← User edits
  metadata: {                        ← Dynamic key-value pairs
    "department": "HR",
    "version": "1.0"
  }
}
```

#### Task Node
```typescript
{
  id: "task-1704067200000",
  label: "Task",
  type: "task",
  title: "Review Application",      ← User edits
  description: "Review submitted documents",
  assignee: "john@example.com",
  dueDate: "2024-05-01"
}
```

#### Approval Node
```typescript
{
  id: "approval-1704067200000",
  label: "Approval",
  type: "approval",
  title: "Manager Approval",        ← User edits
  approverRole: "Manager",          ← User edits (was 'role')
  threshold: 2                       ← User edits
}
```

#### Automated Node
```typescript
{
  id: "automated-1704067200000",
  label: "Automated",
  type: "automated",
  actionId: "send-email",           ← User selects
  actionName: "Send Email",
  params: {                          ← User fills dynamically
    recipient: "manager@example.com",
    subject: "Approval Request",
    template: "approval-request"
  }
}
```

#### End Node
```typescript
{
  id: "end-1704067200000",
  label: "End",
  type: "end",
  endMessage: "Process Complete",   ← User edits
  showSummary: true                  ← User toggles
}
```

## 🎨 Form Component Structure

### Base Pattern (All Forms)
```
Form Component
├── Props:
│   ├── node: [NodeType]Data
│   └── onUpdate: (node) => void
├── State: None (controlled by parent)
├── Handlers:
│   ├── handleChange(field, value)
│   └── onUpdate({...node, [field]: value})
└── Render:
    ├── Form container
    ├── Form groups with labels
    ├── Controlled input fields
    └── Mapped dynamic fields
```

### Form Routing Logic
```
NodeForm Component
├── Input: node (WorkflowNodeData)
├── Switch on node.type:
│   ├── case 'start': <StartForm />
│   ├── case 'task': <TaskForm />
│   ├── case 'approval': <ApprovalForm />
│   ├── case 'automated': <AutomatedForm />
│   └── case 'end': <EndForm />
└── Output: Rendered form component
```

## 🔧 Configuration Panel Lifecycle

```
Mounted
    │
    ├─→ Subscribe to selectedNodeId
    │
    ├─→ User clicks node
    │   ├─→ selectedNodeId changes
    │   ├─→ Panel updates
    │   └─→ NodeForm renders
    │
    ├─→ User edits form
    │   ├─→ handleChange fires
    │   ├─→ onUpdate calls updateNode
    │   ├─→ Store updates
    │   └─→ Form re-renders
    │
    ├─→ User deletes node
    │   ├─→ Confirmation dialog
    │   ├─→ deleteNode called
    │   ├─→ selectedNodeId set to null
    │   └─→ Empty state shown
    │
    └─→ User closes/deselects
        ├─→ selectNode(null)
        └─→ Empty state shown
```

## 📌 Type Safety Implementation

### Union Type Pattern
```typescript
export type WorkflowNodeData = 
  | StartNodeData 
  | TaskNodeData 
  | ApprovalNodeData 
  | AutomatedNodeData 
  | EndNodeData;

// Discriminated union - type is always present
// TypeScript narrows type based on type field
switch(node.type) {
  case 'start': // TypeScript knows it's StartNodeData
  case 'task':  // TypeScript knows it's TaskNodeData
  // ...
}
```

## 🎯 Event Handlers Map

### Canvas Handlers
```
Canvas Component
├── onDragOver: Allows drop
├── onDrop: Creates new node
│   ├── Retrieves nodeType from drag data
│   ├── Creates node with all required fields
│   ├── Calls addNode(newNode)
│   └── Updates React Flow nodes
└── onNodeClick: Selects node
    ├── Receives node.id
    └── Calls selectNode(nodeId)
```

### Form Handlers
```
Form Component
├── handleChange(field, value)
│   ├── Validates input
│   ├── Updates field value
│   └── Calls onUpdate()
└── onUpdate()
    ├── Creates updated node object
    ├── Calls props.onUpdate(updatedNode)
    └── ConfigurationPanel receives update
        └── Calls updateNode(id, updatedData)
```

## ⚙️ Store Operations

```
Zustand Store (workflowStore)
├── State:
│   ├── nodes: WorkflowNodeData[]
│   ├── edges: WorkflowEdge[]
│   ├── selectedNodeId: string | null
│   └── executionLog: ExecutionLog | null
│
├── Node Operations:
│   ├── addNode(node)
│   │   └── Adds to nodes array
│   ├── updateNode(id, data)
│   │   └── Merges data into matching node
│   ├── deleteNode(id)
│   │   ├── Removes node from array
│   │   └── Removes related edges
│   ├── selectNode(id | null)
│   │   └── Updates selectedNodeId
│   └── getNode(id)
│       └── Returns node or undefined
│
└── Selectors:
    ├── useWorkflowStore(state => state.nodes)
    ├── useWorkflowStore(state => state.selectedNodeId)
    └── useWorkflowStore(state => state.getNode)
```

## 🚀 Controlled Component Pattern

### Example: Task Form
```typescript
// Component receives node data from parent
function TaskForm({ node, onUpdate }) {
  // No local state - reads from props
  
  // Handler creates new complete node object
  const handleChange = (field, value) => {
    onUpdate({
      ...node,
      [field]: value
    });
  };

  // Input is always controlled - value from props
  return (
    <input
      value={node.title}
      onChange={(e) => handleChange('title', e.target.value)}
    />
  );
}

// Parent (ConfigurationPanel) manages updates
const node = getNode(selectedNodeId);
<NodeForm 
  node={node}
  onUpdate={(updatedNode) => updateNode(node.id, updatedNode)}
/>
```

## 🎨 Styling Architecture

### CSS Classes
```
.config-panel            // Main container
  ├── .config-header     // Title + close button
  ├── .config-empty      // No node selected state
  ├── .config-content    // Form area
  │   └── .form-container
  │       └── .form-group
  │           ├── label
  │           └── input/textarea/select
  └── .config-actions    // Delete button area

.form-group              // Field wrapper
  ├── label              // Field label
  └── input/select/textarea // Form control
```

## 🔄 Re-render Optimization

### What Triggers Re-render
- ✅ selectedNodeId changes
- ✅ Node data changes (updateNode)
- ✅ Store subscription updates

### What Doesn't Trigger Unnecessary Renders
- ❌ Other nodes' changes (subscribers only)
- ❌ Edges changes (separate concern)
- ❌ Execution logs (separate panel)

---

## Summary Diagram

```
              ┌──────────────────┐
              │    User Clicks   │
              │   Node on Canvas │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │  onNodeClick()   │
              │ selectNode(id)   │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │  Zustand Store   │
              │ selectedNodeId=id│
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │ConfigurationPanel│
              │ subscribes & re- │
              │ renders with form│
              └────────┬─────────┘
                       │
      ┌────────────────┼────────────────┐
      │                │                │
      ▼                ▼                ▼
  User edits      Sees values      Can delete
  form fields     in real-time     node
      │                │                │
      └────────────────┼────────────────┘
                       │
                       ▼
              ┌──────────────────┐
              │  updateNode()    │
              │  deleteNode()    │
              │   selectNode()   │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │ Canvas updates   │
              │ with new data    │
              └──────────────────┘
```

This architecture ensures:
✅ Single source of truth (Zustand store)
✅ Unidirectional data flow
✅ Type-safe operations
✅ Real-time updates
✅ Clean separation of concerns
✅ Reusable components
