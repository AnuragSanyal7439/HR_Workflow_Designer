import { useDraftValue } from '../hooks/useDraftValue'
import { useWorkflowStore } from '../store/workflowStore'
import type { WorkflowKeyValuePair, WorkflowNodeByType } from '../types/workflow'
import { KeyValuePairsInput } from './KeyValuePairsInput'

type TaskNodeFormProps = {
  node: WorkflowNodeByType['task']
}

export function TaskNodeForm({ node }: TaskNodeFormProps) {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData)
  const [title, setTitle] = useDraftValue(node.id, node.data.title)
  const [description, setDescription] = useDraftValue(
    node.id,
    node.data.description,
  )
  const [assignee, setAssignee] = useDraftValue(node.id, node.data.assignee)
  const [dueDate, setDueDate] = useDraftValue(node.id, node.data.dueDate)
  const isTitleInvalid = title.trim().length === 0

  function updateCustomFields(customFields: WorkflowKeyValuePair[]) {
    updateNodeData<'task'>(node.id, { customFields })
  }

  function commitTitle() {
    updateNodeData<'task'>(node.id, { title })
  }

  function commitDescription() {
    updateNodeData<'task'>(node.id, { description })
  }

  function commitAssignee() {
    updateNodeData<'task'>(node.id, { assignee })
  }

  function commitDueDate() {
    updateNodeData<'task'>(node.id, { dueDate })
  }

  return (
    <form className="config-form">
      <section className="form-section" aria-label="Task details">
        <label className="form-field">
          <span>Title</span>
          <input
            aria-describedby={isTitleInvalid ? 'task-title-error' : undefined}
            aria-invalid={isTitleInvalid}
            className={isTitleInvalid ? 'is-invalid' : undefined}
            required
            value={title}
            onBlur={commitTitle}
            onChange={(event) => setTitle(event.target.value)}
          />
          {isTitleInvalid && (
            <p className="form-error" id="task-title-error">
              Title is required.
            </p>
          )}
        </label>

        <label className="form-field">
          <span>Description</span>
          <textarea
            rows={3}
            value={description}
            onBlur={commitDescription}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
      </section>

      <section className="form-section" aria-label="Task assignment">
        <label className="form-field">
          <span>Assignee</span>
          <input
            value={assignee}
            onBlur={commitAssignee}
            onChange={(event) => setAssignee(event.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Due date</span>
          <input
            type="date"
            value={dueDate}
            onBlur={commitDueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </label>
      </section>

      <section className="form-section" aria-label="Task custom fields">
        <KeyValuePairsInput
          addLabel="Add custom field"
          label="Custom fields"
          pairs={node.data.customFields}
          onChange={updateCustomFields}
        />
      </section>
    </form>
  )
}
