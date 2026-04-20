import { useCallback, useState } from 'react';
import { useWorkflowStore } from '../store/workflowStore';
import { WorkflowAPIService } from '../services/workflowAPIService';
import type { ExecutionLog } from '../types';

export const useWorkflowSimulation = () => {
  const { nodes, edges, setExecutionLog, clearExecutionLog } = useWorkflowStore();
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationError, setSimulationError] = useState<string | null>(null);

  const validateWorkflow = useCallback(async () => {
    const result = await WorkflowAPIService.validateWorkflow(nodes, edges);
    return result;
  }, [nodes, edges]);

  const runSimulation = useCallback(async () => {
    try {
      setIsSimulating(true);
      setSimulationError(null);

      // Validate first
      const validation = await validateWorkflow();
      if (!validation.valid) {
        setSimulationError(
          `Validation failed: ${validation.errors.join(', ')}`
        );
        setIsSimulating(false);
        return;
      }

      // Run simulation
      const log: ExecutionLog =
        await WorkflowAPIService.simulateWorkflow(nodes, edges);
      setExecutionLog(log);
    } catch (error) {
      setSimulationError(
        error instanceof Error ? error.message : 'Simulation failed'
      );
    } finally {
      setIsSimulating(false);
    }
  }, [nodes, edges, validateWorkflow, setExecutionLog]);

  const resetSimulation = useCallback(() => {
    clearExecutionLog();
    setSimulationError(null);
  }, [clearExecutionLog]);

  return {
    isSimulating,
    simulationError,
    runSimulation,
    resetSimulation,
    validateWorkflow,
  };
};
