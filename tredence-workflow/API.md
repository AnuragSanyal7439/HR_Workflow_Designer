# API Documentation - HR Workflow Designer

## Mock API Service

The application uses a mock API service to simulate real backend operations. All calls include simulated delays for realistic testing.

### AutomationAction Interface

```typescript
interface AutomationAction {
  id: string;                    // Unique action identifier
  name: string;                  // Display name
  description: string;           // What the action does
  params: AutomationParam[];     // Dynamic parameters
}

interface AutomationParam {
  name: string;                  // Parameter name
  type: 'string' | 'number' | 'boolean' | 'select';
  required: boolean;             // Is this required?
  options?: { label: string; value: string }[];  // For select type
}
```

### Available Automation Actions

#### 1. Send Email

**ID**: `send-email`

**Description**: Send email notifications

**Parameters**:
- `recipient` (string, required): Email address
- `subject` (string, required): Email subject
- `template` (select, required):
  - `approval-request`: Approval request template
  - `task-assignment`: Task assignment template
  - `workflow-complete`: Workflow completion template

**Example Usage**:
```typescript
{
  actionId: 'send-email',
  actionName: 'Send Email',
  params: {
    recipient: 'manager@company.com',
    subject: 'Approval Needed',
    template: 'approval-request'
  }
}
```

#### 2. Create Task

**ID**: `create-task`

**Description**: Create a new task in the system

**Parameters**:
- `title` (string, required): Task title
- `priority` (select, required):
  - `low`: Low priority
  - `medium`: Medium priority
  - `high`: High priority
- `assignTo` (string, required): Assignee email/ID

**Example Usage**:
```typescript
{
  actionId: 'create-task',
  actionName: 'Create Task',
  params: {
    title: 'Review Documents',
    priority: 'high',
    assignTo: 'reviewer@company.com'
  }
}
```

#### 3. Database Query

**ID**: `database-query`

**Description**: Execute a database query

**Parameters**:
- `query` (string, required): SQL query to execute
- `timeout` (number, optional): Query timeout in milliseconds (default: 30000)

**Example Usage**:
```typescript
{
  actionId: 'database-query',
  actionName: 'Database Query',
  params: {
    query: 'SELECT * FROM employees WHERE status = "active"',
    timeout: 5000
  }
}
```

#### 4. Webhook Call

**ID**: `webhook-call`

**Description**: Call an external webhook

**Parameters**:
- `url` (string, required): Webhook URL
- `method` (select, required):
  - `GET`: GET request
  - `POST`: POST request
  - `PUT`: PUT request

**Example Usage**:
```typescript
{
  actionId: 'webhook-call',
  actionName: 'Webhook Call',
  params: {
    url: 'https://api.example.com/webhook',
    method: 'POST'
  }
}
```

## WorkflowAPIService Methods

### getAutomationActions()

Returns all available automation actions.

```typescript
// Call
const actions = await WorkflowAPIService.getAutomationActions();

// Returns
AutomationAction[]

// Example response
[
  {
    id: 'send-email',
    name: 'Send Email',
    description: 'Send an email notification',
    params: [...]
  },
  // ... more actions
]

// Simulated delay: 500ms
```

### getAutomationAction(id)

Get details of a specific automation action.

```typescript
// Call
const action = await WorkflowAPIService.getAutomationAction('send-email');

// Returns
AutomationAction | null

// Simulated delay: 300ms
```

### simulateWorkflow(nodes, edges)

Simulate workflow execution with step-by-step progress.

```typescript
// Call
const executionLog = await WorkflowAPIService.simulateWorkflow(nodes, edges);

// Input
nodes: WorkflowNodeData[]  // Workflow nodes
edges: WorkflowEdge[]      // Node connections

// Returns
interface ExecutionLog {
  workflowId: string;
  startTime: string;         // ISO timestamp
  endTime?: string;          // ISO timestamp
  steps: ExecutionStep[];    // Array of execution steps
  status: 'running' | 'completed' | 'failed';
}

// ExecutionStep structure
interface ExecutionStep {
  nodeId: string;
  nodeType: NodeType;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  timestamp: string;         // ISO timestamp
  data?: Record<string, unknown>;  // Optional step data
  error?: string;            // Error message if failed
}

// Simulated delay: 1000ms + 700ms per node
// Success rate: 80% (20% nodes randomly fail)
```

### validateWorkflow(nodes, edges)

Validate workflow structure before execution.

```typescript
// Call
const result = await WorkflowAPIService.validateWorkflow(nodes, edges);

// Returns
interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// Example errors
{
  valid: false,
  errors: [
    'Workflow must have a Start node',
    'Workflow must have an End node',
    '2 disconnected node(s) found in workflow'
  ]
}

// Simulated delay: 300ms
```

## Execution Flow Example

### 1. Get Available Actions

```typescript
const actions = await WorkflowAPIService.getAutomationActions();
// Returns list of 4 built-in actions
```

### 2. Build Workflow

```typescript
// User drags and configures nodes
const nodes = [
  { id: 'start-1', type: 'start', label: 'Start' },
  { id: 'task-1', type: 'task', title: 'Review', ... },
  { id: 'approval-1', type: 'approval', ... },
  { id: 'automated-1', type: 'automated', actionId: 'send-email', ... },
  { id: 'end-1', type: 'end', label: 'End' }
];

const edges = [
  { id: 'e1', source: 'start-1', target: 'task-1' },
  { id: 'e2', source: 'task-1', target: 'approval-1' },
  { id: 'e3', source: 'approval-1', target: 'automated-1' },
  { id: 'e4', source: 'automated-1', target: 'end-1' }
];
```

### 3. Validate Workflow

```typescript
const validation = await WorkflowAPIService.validateWorkflow(nodes, edges);
if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
  return;
}
```

### 4. Simulate Execution

```typescript
const log = await WorkflowAPIService.simulateWorkflow(nodes, edges);

// log.steps contains:
// - Each step shows progression (pending → executing → completed/failed)
// - Timestamps for performance tracking
// - Error details if failures occur
```

### 5. Display Results

```typescript
// View in ExecutionPanel
log.steps.forEach(step => {
  console.log(`${step.nodeType}: ${step.status}`);
  if (step.error) {
    console.error(`Error: ${step.error}`);
  }
});
```

## Adding Custom Automation Actions

### Step 1: Define Action

```typescript
// In workflowAPIService.ts
const automationActions: AutomationAction[] = [
  // ... existing actions ...
  {
    id: 'custom-action',
    name: 'My Custom Action',
    description: 'Does something custom',
    params: [
      {
        name: 'customParam',
        type: 'string',
        required: true,
      },
    ],
  },
];
```

### Step 2: Implement Logic

If creating a real backend:

```typescript
// Server-side endpoint
POST /api/automations/{actionId}/execute
Body: {
  workflowId: string,
  nodeId: string,
  params: Record<string, unknown>
}

Response: {
  success: boolean,
  result?: any,
  error?: string
}
```

### Step 3: Update Service

```typescript
static async executeCustomAction(params: any) {
  // Call real API
  const response = await fetch('/api/automations/custom-action/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  return response.json();
}
```

## Error Handling

The mock API simulates errors realistically:

```typescript
// 80% success rate means:
// - Most workflows complete successfully
// - Some nodes randomly fail (random: () > 0.8)
// - Errors have descriptive messages
// - Failed nodes stop propagation
```

### Handling Errors in UI

```typescript
if (log.status === 'failed') {
  const failedSteps = log.steps.filter(s => s.status === 'failed');
  failedSteps.forEach(step => {
    console.error(`Node ${step.nodeId} failed: ${step.error}`);
  });
}
```

## Performance Considerations

### Simulated Delays

- `getAutomationActions()`: 500ms
- `getAutomationAction()`: 300ms
- `simulateWorkflow()`: 1000ms base + 700ms per node
- `validateWorkflow()`: 300ms

### Recommendation

For real backends:
- Cache automation actions on client
- Implement request cancellation
- Use WebSockets for long-running simulations
- Add progress indicators for slow operations

## Response Formats

### Success Response

```json
{
  "workflowId": "workflow-123",
  "startTime": "2025-04-19T22:00:00.000Z",
  "endTime": "2025-04-19T22:00:05.000Z",
  "steps": [
    {
      "nodeId": "start-1",
      "nodeType": "start",
      "status": "completed",
      "timestamp": "2025-04-19T22:00:00.000Z"
    }
  ],
  "status": "completed"
}
```

### Error Response

```json
{
  "workflowId": "workflow-123",
  "steps": [
    {
      "nodeId": "automated-1",
      "nodeType": "automated",
      "status": "failed",
      "error": "Simulated error during execution",
      "timestamp": "2025-04-19T22:00:02.000Z"
    }
  ],
  "status": "failed"
}
```

## Testing the API

```typescript
// Direct testing
import { WorkflowAPIService } from '../services/workflowAPIService';

// Test getAutomationActions
const actions = await WorkflowAPIService.getAutomationActions();
console.assert(actions.length === 4, 'Should have 4 actions');

// Test validation
const validation = await WorkflowAPIService.validateWorkflow([], []);
console.assert(!validation.valid, 'Empty workflow should be invalid');

// Test simulation
const log = await WorkflowAPIService.simulateWorkflow(nodes, edges);
console.assert(log.steps.length > 0, 'Should have execution steps');
```

---

**Note**: This is a mock API for demonstration. For production use, replace with real backend endpoints.
