import { useDraftValue } from '../hooks/useDraftValue'
import type { WorkflowKeyValuePair } from '../types/workflow'

type KeyValuePairsInputProps = {
  label: string
  pairs: WorkflowKeyValuePair[]
  addLabel: string
  onChange: (pairs: WorkflowKeyValuePair[]) => void
}

function createEmptyPair(): WorkflowKeyValuePair {
  return {
    id: crypto.randomUUID(),
    key: '',
    value: '',
  }
}

export function KeyValuePairsInput({
  label,
  pairs,
  addLabel,
  onChange,
}: KeyValuePairsInputProps) {
  const [draftPairs, setDraftPairs] = useDraftValue(label, pairs)

  function updatePair(
    pairId: string,
    field: keyof Pick<WorkflowKeyValuePair, 'key' | 'value'>,
    value: string,
  ) {
    setDraftPairs((currentPairs) =>
      currentPairs.map((pair) =>
        pair.id === pairId
          ? {
              ...pair,
              [field]: value,
            }
          : pair,
      ),
    )
  }

  function commitPairs() {
    onChange(draftPairs)
  }

  function addPair() {
    const nextPairs = [...draftPairs, createEmptyPair()]

    setDraftPairs(nextPairs)
  }

  function removePair(pairId: string) {
    const nextPairs = draftPairs.filter((pair) => pair.id !== pairId)

    setDraftPairs(nextPairs)
    onChange(nextPairs)
  }

  return (
    <fieldset className="form-fieldset">
      <legend>{label}</legend>

      <div className="key-value-list">
        {draftPairs.map((pair) => (
          <div className="key-value-row" key={pair.id}>
            <input
              aria-label={`${label} key`}
              placeholder="Key"
              value={pair.key}
              onBlur={commitPairs}
              onChange={(event) => updatePair(pair.id, 'key', event.target.value)}
            />
            <input
              aria-label={`${label} value`}
              placeholder="Value"
              value={pair.value}
              onBlur={commitPairs}
              onChange={(event) =>
                updatePair(pair.id, 'value', event.target.value)
              }
            />
            <button
              type="button"
              onClick={() => removePair(pair.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        className="secondary-button"
        type="button"
        onClick={addPair}
      >
        {addLabel}
      </button>
    </fieldset>
  )
}
