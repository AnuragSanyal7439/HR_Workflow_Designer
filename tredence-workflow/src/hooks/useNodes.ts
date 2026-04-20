import { useCallback } from 'react';
import { useWorkflowStore } from '../store/workflowStore';
import type {
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedNodeData,
  EndNodeData,
} from '../types';

export const useNodes = () => {
  const { nodes, addNode, updateNode, deleteNode, selectNode, getNode } =
    useWorkflowStore();

  const createStartNode = useCallback(
    (_x: number, _y: number) => {
      const node: StartNodeData = {
        id: `start-${Date.now()}`,
        label: 'Start',
        type: 'start',
        title: 'Workflow Start',
        metadata: {},
      };
      addNode(node);
      return node;
    },
    [addNode]
  );

  const createTaskNode = useCallback(
    (_x: number, _y: number) => {
      const node: TaskNodeData = {
        id: `task-${Date.now()}`,
        label: 'Task',
        type: 'task',
        title: 'New Task',
        description: '',
        assignee: '',
        dueDate: '',
      };
      addNode(node);
      return node;
    },
    [addNode]
  );

  const createApprovalNode = useCallback(
    (_x: number, _y: number) => {
      const node: ApprovalNodeData = {
        id: `approval-${Date.now()}`,
        label: 'Approval',
        type: 'approval',
        title: 'Approval Required',
        approverRole: '',
        threshold: 1,
      };
      addNode(node);
      return node;
    },
    [addNode]
  );

  const createAutomatedNode = useCallback(
    (_x: number, _y: number) => {
      const node: AutomatedNodeData = {
        id: `automated-${Date.now()}`,
        label: 'Automated',
        type: 'automated',
        actionId: '',
        actionName: '',
        params: {},
      };
      addNode(node);
      return node;
    },
    [addNode]
  );

  const createEndNode = useCallback(
    (_x: number, _y: number) => {
      const node: EndNodeData = {
        id: `end-${Date.now()}`,
        label: 'End',
        type: 'end',
        endMessage: 'Workflow Complete',
        showSummary: false,
      };
      addNode(node);
      return node;
    },
    [addNode]
  );

  return {
    nodes,
    createStartNode,
    createTaskNode,
    createApprovalNode,
    createAutomatedNode,
    createEndNode,
    updateNode,
    deleteNode,
    selectNode,
    getNode,
  };
};
