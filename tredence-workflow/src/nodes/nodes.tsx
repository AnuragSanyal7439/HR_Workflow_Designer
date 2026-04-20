import type {
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedNodeData,
  EndNodeData,
} from '../types';
import { GenericNode } from './BaseNode';

// Single custom node component handles all node types
export const nodeTypes = {
  custom: GenericNode,
};
