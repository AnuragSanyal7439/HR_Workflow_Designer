import { useCallback } from 'react';
import { useWorkflowStore } from '../store/workflowStore';

export const useWorkflow = () => {
  const {
    nodes,
    edges,
    addNode,
    updateNode,
    deleteNode,
    addEdge,
    deleteEdge,
    exportWorkflow,
    clearWorkflow,
  } = useWorkflowStore();

  const getWorkflowJSON = useCallback(() => {
    return JSON.stringify(
      {
        nodes,
        edges,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  }, [nodes, edges]);

  const downloadWorkflow = useCallback(() => {
    const json = getWorkflowJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [getWorkflowJSON]);

  return {
    nodes,
    edges,
    addNode,
    updateNode,
    deleteNode,
    addEdge,
    deleteEdge,
    exportWorkflow,
    clearWorkflow,
    getWorkflowJSON,
    downloadWorkflow,
  };
};
