# Development Guide - HR Workflow Designer

## Quick Start for Developers

### Understanding the Architecture

The application follows a clean, modular architecture with clear separation of concerns:

```
Data Flow:
User Actions → Components → Hooks → Store (Zustand) → UI Update
         ↓
      Forms → Services → API Mock
```

### Key Files to Understand

1. **src/types/index.ts** - All TypeScript interfaces
   - `WorkflowNodeData` - Node data structure
   - `NodeType` - Union of all node types
   - `ExecutionLog` - Simulation results

2. **src/store/workflowStore.ts** - Global state
   - Uses Zustand for lightweight state management
   - Methods for adding/updating/deleting nodes and edges
   - Methods for managing selected node and execution logs

3. **src/services/workflowAPIService.ts** - Business logic
   - Mock API calls with simulated delays
   - Workflow validation logic
   - Simulation execution engine

### Component Hierarchy

```
App (Layout Manager)
├── Sidebar (Node Palette)
├── Canvas (React Flow)
│   ├── Nodes
│   │   ├── StartNode
│   │   ├── TaskNode
│   │   ├── ApprovalNode
│   │   ├── AutomatedNode
│   │   └── EndNode
│   └── Edges
├── ConfigurationPanel
│   └── NodeForm
│       ├── TaskForm
│       ├── ApprovalForm
│       └── AutomatedForm
├── ExecutionPanel
│   └── ExecutionStep List
└── Toolbar
    └── Workflow Controls
```

### Adding a New Node Type

1. **Add Type Definition** (src/types/index.ts)
```typescript
export interface MyNodeData extends BaseNodeData {
  type: 'mynode';
  customField: string;
}
```

2. **Create Component** (src/nodes/nodes.tsx)
```typescript
export function MyNode({ data }: { data: MyNodeData }) {
  return <BaseNode data={data} isConnecting={false} selected={false} />;
}
```

3. **Add to nodeTypes Export**
```typescript
export const nodeTypes = {
  // ...existing
  mynode: MyNode,
};
```

4. **Create Form** (src/forms/MyNodeForm.tsx)
```typescript
export function MyNodeForm({ node, onUpdate }: MyNodeFormProps) {
  // Form implementation
}
```

5. **Update NodeForm** (src/forms/index.tsx)
```typescript
case 'mynode':
  return <MyNodeForm node={node as any} onUpdate={onUpdate as any} />;
```

6. **Add Hook Method** (src/hooks/useNodes.ts)
```typescript
const createMyNode = useCallback((_x: number, _y: number) => {
  const node: MyNodeData = {
    id: `mynode-${Date.now()}`,
    label: 'My Node',
    type: 'mynode',
    customField: '',
  };
  addNode(node);
  return node;
}, [addNode]);
```

### Adding Automation Actions

Edit **src/services/workflowAPIService.ts**:

```typescript
const automationActions: AutomationAction[] = [
  {
    id: 'my-action',
    name: 'My Action',
    description: 'What it does',
    params: [
      {
        name: 'param1',
        type: 'string',
        required: true,
      },
    ],
  },
  // ...
];
```

### Workflow Validation

Current validation checks (src/services/workflowAPIService.ts):
- At least one Start node
- At least one End node
- No disconnected nodes (BFS traversal)

To add more validation:
```typescript
if (!hasRequiredField) {
  errors.push('Custom error message');
}
```

### Styling

Component styles use:
- CSS modules (e.g., `Canvas.css`)
- Component-specific styling
- CSS variables in `App.css` for theming:
  - `--primary`: Main color
  - `--success`, `--warning`, `--error`: Status colors
  - `--bg-primary`, `--bg-secondary`: Background colors

### State Management Patterns

**Reading State:**
```typescript
const nodes = useWorkflowStore((state) => state.nodes);
```

**Updating State:**
```typescript
const { addNode, updateNode, deleteNode } = useWorkflowStore();
```

**Selector Pattern for Performance:**
```typescript
// Use direct selectors instead of full store
const selectedNodeId = useWorkflowStore(s => s.selectedNodeId);
```

### Hook Usage Examples

**useWorkflow** - High-level workflow operations:
```typescript
const { nodes, edges, downloadWorkflow, exportWorkflow } = useWorkflow();
```

**useNodes** - Node creation and management:
```typescript
const { createTaskNode, updateNode, deleteNode } = useNodes();
```

**useWorkflowSimulation** - Simulation operations:
```typescript
const { runSimulation, validateWorkflow } = useWorkflowSimulation();
```

### Testing Patterns

**Mock API Calls:**
```typescript
// Already built in - WorkflowAPIService includes simulated delays
await WorkflowAPIService.simulateWorkflow(nodes, edges);
```

**Type Safety:**
```typescript
// Use type-only imports to keep bundle small
import type { WorkflowNodeData } from '../types';
```

### Common Issues & Solutions

**Issue**: Type errors with Zustand
- **Solution**: Use `any` type annotations on state selectors when needed

**Issue**: React Flow nodes not displaying
- **Solution**: Ensure nodeTypes object matches the `type` field in node data

**Issue**: Forms not updating
- **Solution**: Use `onUpdate` callback - it updates Zustand store

**Issue**: Performance issues with many nodes
- **Solution**: Consider using React Flow's `useViewport` for optimization

### Performance Tips

1. **Memoize Components**: Use `React.memo()` for expensive components
2. **Selector Optimization**: Use granular selectors instead of full store
3. **Lazy Loading**: Consider lazy loading forms and panels
4. **Event Delegation**: Use React Flow's built-in event handlers
5. **Debounce Updates**: Consider debouncing frequent updates

### Debugging

**Redux DevTools Alternative:**
Zustand state is accessible in console:
```javascript
// In browser console
import { useWorkflowStore } from './store/workflowStore';
const state = useWorkflowStore.getState();
console.log(state.nodes);
```

**Component Props Debugging:**
```typescript
// Add in component
useEffect(() => {
  console.log('Node updated:', node);
}, [node]);
```

### Building for Production

```bash
npm run build  # TypeScript check + Vite build
npm run preview  # Preview production build
```

Output goes to `dist/` folder - optimized and minified.

### Code Style Guidelines

- **TypeScript**: Always use type annotations
- **Components**: Keep components under 300 lines
- **Hooks**: Extract complex logic into custom hooks
- **Naming**: Use descriptive names (useWorkflow, not useWf)
- **Comments**: Document complex logic and WHY, not WHAT

### File Organization

```
Feature/Component Structure:
- Component (.tsx file)
- Styles (.css file)
- Types (in shared types/ folder)
- Hooks (in shared hooks/ folder)
```

### Future Enhancements

Priority features:
1. Undo/Redo with state snapshots
2. Workflow templates
3. Real-time collaboration
4. Custom validation rules
5. Advanced node types (conditions, loops)

### References

- [React Flow Documentation](https://reactflow.dev/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)

---

Happy coding! 🚀
