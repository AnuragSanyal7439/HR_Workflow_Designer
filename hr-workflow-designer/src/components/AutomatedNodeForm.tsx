import { useEffect, useState } from 'react'
import { getAutomations } from '../api/automationApi'
import { useDraftValue } from '../hooks/useDraftValue'
import { useWorkflowStore } from '../store/workflowStore'
import type { AutomationAction } from '../types/automation'
import type { WorkflowNodeByType } from '../types/workflow'

type AutomatedNodeFormProps = {
  node: WorkflowNodeByType['automated']
}

function createParameterValues(params: string[]) {
  return params.reduce<Record<string, string>>((values, param) => {
    values[param] = ''
    return values
  }, {})
}

export function AutomatedNodeForm({ node }: AutomatedNodeFormProps) {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData)
  const [actions, setActions] = useState<AutomationAction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [title, setTitle] = useDraftValue(node.id, node.data.title)
  const [actionId, setActionId] = useDraftValue(node.id, node.data.actionId)
  const [parameters, setParameters] = useDraftValue(
    node.id,
    node.data.parameters,
  )
  const selectedAction = actions.find((action) => action.id === actionId)

  useEffect(() => {
    let isMounted = true

    getAutomations().then((automationActions) => {
      if (!isMounted) {
        return
      }

      setActions(automationActions)
      setIsLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [])

  function updateAction(nextActionId: string) {
    const action = actions.find((currentAction) => currentAction.id === nextActionId)

    setActionId(nextActionId)
    setParameters(createParameterValues(action?.params ?? []))
  }

  function updateParameter(param: string, value: string) {
    setParameters((currentParameters) => ({
      ...currentParameters,
      [param]: value,
    }))
  }

  function commitTitle() {
    updateNodeData<'automated'>(node.id, { title })
  }

  function commitAction() {
    const action = actions.find((currentAction) => currentAction.id === actionId)

    updateNodeData<'automated'>(node.id, {
      actionId,
      actionLabel: action?.label ?? '',
      parameters,
    })
  }

  function commitParameters() {
    updateNodeData<'automated'>(node.id, {
      parameters,
    })
  }

  return (
    <form className="config-form">
      <section className="form-section" aria-label="Automated step details">
        <label className="form-field">
          <span>Title</span>
          <input
            value={title}
            onBlur={commitTitle}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Action</span>
          <select
            disabled={isLoading}
            value={actionId}
            onBlur={commitAction}
            onChange={(event) => updateAction(event.target.value)}
          >
            <option value="">
              {isLoading ? 'Loading automations...' : 'Select automation'}
            </option>
            {actions.map((action) => (
              <option key={action.id} value={action.id}>
                {action.label}
              </option>
            ))}
          </select>
        </label>
      </section>

      {selectedAction && (
        <section className="form-section" aria-label="Automation parameters">
          <div className="form-fieldset">
            <span className="fieldset-label">Parameters</span>
            {selectedAction.params.map((param) => (
              <label className="form-field" key={param}>
                <span>{param}</span>
                <input
                  value={parameters[param] ?? ''}
                  onBlur={commitParameters}
                  onChange={(event) => updateParameter(param, event.target.value)}
                />
              </label>
            ))}
          </div>
        </section>
      )}
    </form>
  )
}
