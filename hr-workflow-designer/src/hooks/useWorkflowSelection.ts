import { useWorkflowStore } from '../store/workflowStore'

export function useWorkflowSelection() {
  return useWorkflowStore((state) => ({
    selectedNodeId: state.selectedNodeId,
    setSelectedNodeId: state.setSelectedNodeId,
  }))
}
