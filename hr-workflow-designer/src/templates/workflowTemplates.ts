import type { WorkflowTemplate } from '../types/workflowTemplate'

export const workflowTemplates = [
  {
    id: 'onboarding-flow',
    label: 'Onboarding Flow',
    description: 'Collect documents, get manager approval, and send a welcome email.',
    nodes: [
      {
        id: 'start',
        type: 'start',
        position: { x: 120, y: 60 },
        data: {
          title: 'New Hire Start',
          metadata: [
            {
              id: 'employee-type',
              key: 'employeeType',
              value: 'New Hire',
            },
          ],
        },
      },
      {
        id: 'collect-documents',
        type: 'task',
        position: { x: 120, y: 230 },
        data: {
          title: 'Collect Documents',
          description: 'Collect identity, tax, and bank documents',
          assignee: 'HR Coordinator',
          dueDate: '',
          customFields: [
            {
              id: 'document-checklist',
              key: 'checklist',
              value: 'ID, tax forms, bank details',
            },
          ],
        },
      },
      {
        id: 'manager-approval',
        type: 'approval',
        position: { x: 120, y: 400 },
        data: {
          title: 'Manager Approval',
          approverRole: 'Hiring Manager',
          autoApproveThreshold: 0,
        },
      },
      {
        id: 'send-welcome-email',
        type: 'automated',
        position: { x: 120, y: 570 },
        data: {
          title: 'Send Welcome Email',
          actionId: 'send_email',
          actionLabel: 'Send Email',
          parameters: {
            to: 'new.hire@company.com',
            subject: 'Welcome to the team',
          },
        },
      },
      {
        id: 'end',
        type: 'end',
        position: { x: 120, y: 740 },
        data: {
          title: 'Onboarding Complete',
          endMessage: 'Employee onboarding completed',
          includeSummary: true,
        },
      },
    ],
    edges: [
      {
        id: 'start-to-documents',
        source: 'start',
        target: 'collect-documents',
      },
      {
        id: 'documents-to-approval',
        source: 'collect-documents',
        target: 'manager-approval',
      },
      {
        id: 'approval-to-email',
        source: 'manager-approval',
        target: 'send-welcome-email',
      },
      {
        id: 'email-to-end',
        source: 'send-welcome-email',
        target: 'end',
      },
    ],
  },
  {
    id: 'leave-approval-flow',
    label: 'Leave Approval Flow',
    description: 'Review leave balance, route approval, and generate confirmation.',
    nodes: [
      {
        id: 'start',
        type: 'start',
        position: { x: 120, y: 60 },
        data: {
          title: 'Leave Request Start',
          metadata: [
            {
              id: 'request-type',
              key: 'requestType',
              value: 'Leave',
            },
          ],
        },
      },
      {
        id: 'review-balance',
        type: 'task',
        position: { x: 120, y: 230 },
        data: {
          title: 'Review Leave Balance',
          description: 'Check leave balance and policy eligibility',
          assignee: 'HR Operations',
          dueDate: '',
          customFields: [
            {
              id: 'policy',
              key: 'policy',
              value: 'Annual leave',
            },
          ],
        },
      },
      {
        id: 'manager-approval',
        type: 'approval',
        position: { x: 120, y: 400 },
        data: {
          title: 'Approve Leave',
          approverRole: 'Reporting Manager',
          autoApproveThreshold: 2,
        },
      },
      {
        id: 'generate-confirmation',
        type: 'automated',
        position: { x: 120, y: 570 },
        data: {
          title: 'Generate Leave Confirmation',
          actionId: 'generate_doc',
          actionLabel: 'Generate Document',
          parameters: {
            template: 'leave_confirmation',
            recipient: 'employee',
          },
        },
      },
      {
        id: 'end',
        type: 'end',
        position: { x: 120, y: 740 },
        data: {
          title: 'Leave Flow Complete',
          endMessage: 'Leave request processed',
          includeSummary: true,
        },
      },
    ],
    edges: [
      {
        id: 'start-to-review',
        source: 'start',
        target: 'review-balance',
      },
      {
        id: 'review-to-approval',
        source: 'review-balance',
        target: 'manager-approval',
      },
      {
        id: 'approval-to-confirmation',
        source: 'manager-approval',
        target: 'generate-confirmation',
      },
      {
        id: 'confirmation-to-end',
        source: 'generate-confirmation',
        target: 'end',
      },
    ],
  },
] satisfies WorkflowTemplate[]
