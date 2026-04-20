import { useDraftValue } from '../hooks/useDraftValue'
import { useWorkflowStore } from '../store/workflowStore'
import type { WorkflowKeyValuePair, WorkflowNodeByType } from '../types/workflow'
import { KeyValuePairsInput } from './KeyValuePairsInput'

type StartNodeFormProps = {
  node: WorkflowNodeByType['start']
}

export function StartNodeForm({ node }: StartNodeFormProps) {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData)
  const [title, setTitle] = useDraftValue(node.id, node.data.title)

  function updateMetadata(metadata: WorkflowKeyValuePair[]) {
    updateNodeData<'start'>(node.id, { metadata })
  }

  function commitTitle() {
    updateNodeData<'start'>(node.id, { title })
  }

  return (
    <form className="config-form">
      <label className="form-field">
        <span>Title</span>
        <input
          value={title}
          onBlur={commitTitle}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>

      <KeyValuePairsInput
        addLabel="Add metadata"
        label="Metadata"
        pairs={node.data.metadata}
        onChange={updateMetadata}
      />
    </form>
  )
}
