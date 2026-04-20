# Node Selection System - Developer Reference

## 🎯 Core Files & Their Purposes

### State Management
| File | Purpose | Key Exports |
|------|---------|-------------|
| `src/store/workflowStore.ts` | Zustand global state | `selectNode()`, `updateNode()`, `deleteNode()`, `getNode()` |

### Type Definitions
| File | Purpose | Key Types |
|------|---------|-----------|
| `src/types/index.ts` | TypeScript types | `WorkflowNodeData`, node-specific types |

### Components
| File | Purpose | Props |
|------|---------|-------|
| `src/components/ConfigurationPanel.tsx` | Panel UI | `selectedNodeId`, forms |
| `src/components/Canvas.tsx` | React Flow canvas | `onNodeClick` handler |

### Forms (5 Node Types)
| File | Node Type | Fields |
|------|-----------|--------|
| `src/forms/StartForm.tsx` | Start | title, metadata |
| `src/forms/TaskForm.tsx` | Task | title, description, assignee, dueDate |
| `src/forms/ApprovalForm.tsx` | Approval | title, approverRole, threshold |
| `src/forms/AutomatedForm.tsx` | Automated | actionId, actionName, params |
| `src/forms/EndForm.tsx` | End | endMessage, showSummary |
| `src/forms/index.tsx` | Router | Routes to correct form |

### Hooks
| File | Purpose | Return |
|------|---------|--------|
| `src/hooks/useNodes.ts` | Node creators | createStartNode(), createTaskNode(), etc. |

---

## 🔧 Common Tasks

### Select a Node Programmatically
```typescript
import { useWorkflowStore } from '@/store/workflowStore';

const { selectNode } = useWorkflowStore();

// Select node by ID
selectNode('node-id');

// Deselect
selectNode(null);
```

### Get Selected Node Data
```typescript
const { selectedNodeId, getNode } = useWorkflowStore();

const node = getNode(selectedNodeId);
console.log(node); // Full node object
```

### Update Node Data
```typescript
const { updateNode } = useWorkflowStore();

updateNode('node-id', {
  title: 'New Title',
  description: 'New Description'
});
```

### Delete a Node
```typescript
const { deleteNode } = useWorkflowStore();

deleteNode('node-id'); // Also removes related edges
```

### Create a New Node with Selection
```typescript
const { addNode, selectNode } = useWorkflowStore();

const newNode = {
  id: 'task-123',
  label: 'Task',
  type: 'task',
  title: 'New Task',
  description: '',
  assignee: '',
  dueDate: ''
};

addNode(newNode);
selectNode(newNode.id); // Auto-select after creation
```

---

## 📝 Form Pattern Template

When adding a new form or updating existing:

```typescript
import { TaskNodeData } from '@/types';

interface TaskFormProps {
  node: TaskNodeData;
  onUpdate: (node: TaskNodeData) => void;
}

export function TaskForm({ node, onUpdate }: TaskFormProps) {
  const handleChange = (field: keyof TaskNodeData, value: any) => {
    onUpdate({
      ...node,
      [field]: value
    });
  };

  return (
    <div className="form-container">
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={node.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>
    </div>
  );
}
```

---

## 🔗 Data Flow Quick Reference

### User Clicks Node
```
Canvas.tsx onNodeClick → selectNode(id) → store update → 
ConfigurationPanel re-renders → getNode(id) → NodeForm shows
```

### User Edits Form
```
Form.tsx handleChange → onUpdate() → ConfigurationPanel 
updateNode() → store update → Canvas re-renders with new data
```

### User Deletes Node
```
ConfigurationPanel delete button → deleteNode(id) → 
store removes node and edges → selectNode(null) → 
ConfigurationPanel shows empty state
```

---

## 🎨 Styling Reference

### Configuration Panel Classes
```css
.config-panel          /* Main container */
.config-header         /* Title + close button */
.config-empty          /* Empty state message */
.config-content        /* Forms area */
.config-actions        /* Delete button */
.form-container        /* Form wrapper */
.form-group            /* Field group */
```

### Form Field Template
```tsx
<div className="form-group">
  <label htmlFor="field-id">Field Label</label>
  <input
    id="field-id"
    type="text|number|date|etc"
    value={node.field}
    onChange={(e) => handleChange('field', e.target.value)}
  />
</div>
```

---

## 🧪 Testing Helpers

### Get Store State
```typescript
import { useWorkflowStore } from '@/store/workflowStore';

// In browser console:
useWorkflowStore.getState().selectedNodeId
useWorkflowStore.getState().nodes
useWorkflowStore.getState().getNode('id')
```

### Simulate Selection
```typescript
// In browser console:
useWorkflowStore.getState().selectNode('task-123')
```

### Verify Form Update
```typescript
// In browser console after editing form:
useWorkflowStore.getState().getNode('task-123')
// Check properties match form values
```

---

## 🚨 Common Errors & Fixes

### Error: Node won't select
**Cause**: Missing node ID or type  
**Fix**: Check Canvas.tsx createNode has `id` and `type`

### Error: Form fields blank
**Cause**: Node missing required fields  
**Fix**: Update node with all required fields in useNodes.ts

### Error: "Cannot read property 'title' of undefined"
**Cause**: Accessing node fields before node exists  
**Fix**: Add null checks or use getNode() which handles undefined

### Error: Changes don't persist
**Cause**: updateNode called with wrong node format  
**Fix**: Ensure updateNode receives complete node object

### Error: TypeScript errors on build
**Cause**: Form component prop types don't match node type  
**Fix**: Update form props interface to match NodeData type

---

## 📊 Node Type Reference

### Start Node
```typescript
type: 'start'
title: string
metadata: Record<string, string>
```

### Task Node
```typescript
type: 'task'
title: string
description: string
assignee: string
dueDate: string (YYYY-MM-DD)
```

### Approval Node
```typescript
type: 'approval'
title: string
approverRole: string
threshold: number (min: 1)
```

### Automated Node
```typescript
type: 'automated'
actionId: string
actionName: string
params: Record<string, any>
```

### End Node
```typescript
type: 'end'
endMessage: string
showSummary: boolean
```

---

## 🔌 Hook Examples

### Use Store Selection
```typescript
import { useWorkflowStore } from '@/store/workflowStore';

function MyComponent() {
  const selectedNodeId = useWorkflowStore(
    (state) => state.selectedNodeId
  );
  
  return <div>Selected: {selectedNodeId}</div>;
}
```

### Use Store Mutations
```typescript
import { useWorkflowStore } from '@/store/workflowStore';

function MyComponent() {
  const { selectNode, updateNode, deleteNode } = useWorkflowStore();
  
  return (
    <button onClick={() => selectNode('id')}>
      Select
    </button>
  );
}
```

### Combine Multiple Selectors
```typescript
import { useWorkflowStore } from '@/store/workflowStore';

function MyComponent() {
  const selectedNodeId = useWorkflowStore(
    (state) => state.selectedNodeId
  );
  const node = useWorkflowStore(
    (state) => state.getNode(selectedNodeId)
  );
  
  return <div>{node?.title}</div>;
}
```

---

## 🏗️ Adding New Node Type

Steps to add a 6th node type:

### 1. Add Type Definition
```typescript
// src/types/index.ts
export interface CustomNodeData extends BaseNodeData {
  type: 'custom';
  field1: string;
  field2: number;
}

// Update union
type WorkflowNodeData = 
  | StartNodeData 
  | TaskNodeData 
  | ApprovalNodeData 
  | AutomatedNodeData 
  | EndNodeData
  | CustomNodeData;  // Add here
```

### 2. Create Form
```typescript
// src/forms/CustomForm.tsx
export function CustomForm({ node, onUpdate }: CustomFormProps) {
  // Implement form
}
```

### 3. Add to Router
```typescript
// src/forms/index.tsx
case 'custom':
  return <CustomForm node={node} onUpdate={onUpdate} />;
```

### 4. Create Hook
```typescript
// src/hooks/useNodes.ts
export const createCustomNode = () => ({
  id: `custom-${Date.now()}`,
  label: 'Custom',
  type: 'custom',
  field1: '',
  field2: 0
});
```

### 5. Update Canvas
```typescript
// src/components/Canvas.tsx
case 'custom':
  createCustomNode();
  break;
```

---

## 🧬 TypeScript Tips

### Narrowing Node Type
```typescript
// Good - TypeScript narrows type
if (node.type === 'task') {
  console.log(node.title); // ✅ Known property
  console.log(node.approverRole); // ❌ Not available
}

// Good - Switch statement
switch (node.type) {
  case 'approval':
    return node.approverRole; // ✅ Type narrowed
}

// Avoid - Casting
const task = node as TaskNodeData; // ⚠️ Bypasses type safety
```

### Form Component Props
```typescript
interface FormProps {
  node: TaskNodeData;  // Specific type
  onUpdate: (node: TaskNodeData) => void;  // Correct signature
}

// vs avoid
interface FormProps {
  node: WorkflowNodeData;  // Too broad
  onUpdate: (node: any) => void;  // Loses type info
}
```

---

## 🔍 Debugging Tips

### Check Selection State
```typescript
// In component
useEffect(() => {
  console.log('Selected ID:', selectedNodeId);
}, [selectedNodeId]);
```

### Verify Store Updates
```typescript
// Subscribe to store changes
const unsubscribe = useWorkflowStore.subscribe(
  (state) => console.log('Store updated:', state)
);
```

### Inspect Component Props
```typescript
// In form component
console.log('Node data:', node);
console.log('Node type:', node.type);
```

---

## 📦 Dependency Notes

### Required
- `zustand` - State management
- `react-flow-renderer` - Canvas
- `react` - UI framework
- `typescript` - Type checking

### Optional (Pre-installed)
- `vite` - Build tool
- `eslint` - Linting
- `tailwindcss` - Styling (if using)

---

## 🚀 Performance Tips

### Optimize Re-renders
```typescript
// Use specific selectors instead of full state
const selectedId = useWorkflowStore(
  (state) => state.selectedNodeId
); // Only re-renders if selectedNodeId changes

// vs
const store = useWorkflowStore(); // Re-renders on any store change
```

### Memoize Callbacks
```typescript
// Already done in Canvas.tsx
const onNodeClick = useCallback(
  (_event, node) => {
    selectNode(node.id);
  },
  [selectNode]
);
```

### Lazy Load Forms
```typescript
// Future optimization
const TaskForm = lazy(() => import('./TaskForm'));
const Fallback = <div>Loading...</div>;

// In router
case 'task':
  return <Suspense fallback={Fallback}><TaskForm /></Suspense>;
```

---

## 📱 Browser DevTools

### Redux DevTools (Future)
When adding Redux DevTools integration:
```bash
npm install redux-devtools-extension
```

### Console Commands
```javascript
// Quick access
const store = useWorkflowStore.getState();
store.nodes               // All nodes
store.selectedNodeId      // Currently selected
store.getNode(id)         // Get specific node
store.selectNode(id)      // Select node
store.updateNode(id, data) // Update node
```

---

## ✅ Checklist for Modifications

Before modifying the system:
- [ ] Understand the current flow
- [ ] Check type definitions match
- [ ] Update forms if types change
- [ ] Test in browser
- [ ] Run build to check errors
- [ ] Verify no console warnings
- [ ] Update documentation

---

## 📞 Quick Links

- [TypeScript Types](src/types/index.ts) - All type definitions
- [Store Logic](src/store/workflowStore.ts) - State management
- [Canvas Component](src/components/Canvas.tsx) - Selection trigger
- [Configuration Panel](src/components/ConfigurationPanel.tsx) - Form display
- [Forms Directory](src/forms/) - All form implementations

---

**Last Updated**: When node selection was implemented  
**Status**: ✅ Production Ready  
**Maintenance**: Stable - Minimal changes needed
