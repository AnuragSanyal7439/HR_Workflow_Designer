import type { AutomationAction, ExecutionLog, ExecutionStep } from '../types';

// Mock data for automation actions
const automationActions: AutomationAction[] = [
  {
    id: 'send-email',
    name: 'Send Email',
    description: 'Send an email notification',
    params: [
      {
        name: 'recipient',
        type: 'string',
        required: true,
      },
      {
        name: 'subject',
        type: 'string',
        required: true,
      },
      {
        name: 'template',
        type: 'select',
        required: true,
        options: [
          { label: 'Approval Request', value: 'approval-request' },
          { label: 'Task Assignment', value: 'task-assignment' },
          { label: 'Workflow Complete', value: 'workflow-complete' },
        ],
      },
    ],
  },
  {
    id: 'create-task',
    name: 'Create Task',
    description: 'Create a new task in the system',
    params: [
      {
        name: 'title',
        type: 'string',
        required: true,
      },
      {
        name: 'priority',
        type: 'select',
        required: true,
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
        ],
      },
      {
        name: 'assignTo',
        type: 'string',
        required: true,
      },
    ],
  },
  {
    id: 'database-query',
    name: 'Database Query',
    description: 'Execute a database query',
    params: [
      {
        name: 'query',
        type: 'string',
        required: true,
      },
      {
        name: 'timeout',
        type: 'number',
        required: false,
      },
    ],
  },
  {
    id: 'webhook-call',
    name: 'Webhook Call',
    description: 'Call an external webhook',
    params: [
      {
        name: 'url',
        type: 'string',
        required: true,
      },
      {
        name: 'method',
        type: 'select',
        required: true,
        options: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
        ],
      },
    ],
  },
];

// API Service class
export class WorkflowAPIService {
  // Simulate network delay
  private static delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // GET /automations
  static async getAutomationActions(): Promise<AutomationAction[]> {
    await this.delay(500);
    return automationActions;
  }

  // Get single automation action
  static async getAutomationAction(id: string): Promise<AutomationAction | null> {
    await this.delay(300);
    return automationActions.find((action) => action.id === id) || null;
  }

  // POST /simulate - Simulate workflow execution
  static async simulateWorkflow(
    nodes: any[],
    _edges: any[]
  ): Promise<ExecutionLog> {
    await this.delay(1000);

    const steps: ExecutionStep[] = [];
    const startTime = new Date().toISOString();

    // Simulate execution of each node
    for (const node of nodes) {
      steps.push({
        nodeId: node.id,
        nodeType: node.type,
        status: 'pending',
        timestamp: new Date().toISOString(),
      });

      // Simulate execution delay
      await this.delay(300);

      steps[steps.length - 1].status = 'executing';

      await this.delay(400);

      // Randomly succeed or fail for demo purposes (80% success rate)
      const shouldFail = Math.random() > 0.8;

      steps[steps.length - 1].status = shouldFail ? 'failed' : 'completed';
      steps[steps.length - 1].timestamp = new Date().toISOString();

      if (shouldFail) {
        steps[steps.length - 1].error = 'Simulated error during execution';
      }
    }

    const executionLog: ExecutionLog = {
      workflowId: `workflow-${Date.now()}`,
      startTime,
      endTime: new Date().toISOString(),
      steps,
      status: steps.every((step) => step.status === 'completed')
        ? 'completed'
        : 'failed',
    };

    return executionLog;
  }

  // Validate workflow
  static async validateWorkflow(nodes: any[], _edges: any[]): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    await this.delay(300);

    const errors: string[] = [];

    // Check for at least one start node
    const hasStart = nodes.some((node) => node.type === 'start');
    if (!hasStart) {
      errors.push('Workflow must have a Start node');
    }

    // Check for at least one end node
    const hasEnd = nodes.some((node) => node.type === 'end');
    if (!hasEnd) {
      errors.push('Workflow must have an End node');
    }

    // Check for disconnected nodes
    const connectedNodes = new Set<string>();
    const queue: string[] = [];

    // Find start nodes
    const startNodes = nodes.filter((node) => node.type === 'start');
    startNodes.forEach((node) => {
      connectedNodes.add(node.id);
      queue.push(node.id);
    });

    // BFS to find all connected nodes
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      const outgoingEdges = _edges.filter((edge: any) => edge.source === nodeId);

      outgoingEdges.forEach((edge: any) => {
        if (!connectedNodes.has(edge.target)) {
          connectedNodes.add(edge.target);
          queue.push(edge.target);
        }
      });
    }

    const disconnectedNodes = nodes.filter(
      (node) => !connectedNodes.has(node.id)
    );
    if (disconnectedNodes.length > 0) {
      errors.push(
        `${disconnectedNodes.length} disconnected node(s) found in workflow`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
