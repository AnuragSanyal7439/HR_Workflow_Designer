import { useState, type Dispatch, type SetStateAction } from 'react'

type DraftValueState<TValue> = {
  resetKey: string
  sourceValue: TValue
  value: TValue
}

export function useDraftValue<TValue>(
  resetKey: string,
  sourceValue: TValue,
): [TValue, Dispatch<SetStateAction<TValue>>] {
  const [draftState, setDraftState] = useState<DraftValueState<TValue>>(() => ({
    resetKey,
    sourceValue,
    value: sourceValue,
  }))
  const shouldReset =
    draftState.resetKey !== resetKey || !Object.is(draftState.sourceValue, sourceValue)
  const currentDraftState = shouldReset
    ? {
        resetKey,
        sourceValue,
        value: sourceValue,
      }
    : draftState

  if (shouldReset) {
    setDraftState(currentDraftState)
  }

  function setDraftValue(value: SetStateAction<TValue>) {
    setDraftState((currentState) => ({
      ...currentState,
      value:
        typeof value === 'function'
          ? (value as (currentValue: TValue) => TValue)(currentState.value)
          : value,
    }))
  }

  return [currentDraftState.value, setDraftValue]
}
