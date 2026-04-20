import type { WorkflowValidationIssue } from '../utils/workflowValidation'

type ValidationSummaryProps = {
  issues: WorkflowValidationIssue[]
}

export function ValidationSummary({ issues }: ValidationSummaryProps) {
  const errorCount = issues.filter((issue) => issue.severity === 'error').length
  const warningCount = issues.filter(
    (issue) => issue.severity === 'warning',
  ).length

  if (issues.length === 0) {
    return <span className="validation-summary is-clean">Validation clean</span>
  }

  return (
    <span className="validation-summary is-invalid" title={issues[0]?.message}>
      {errorCount} errors
      {warningCount > 0 ? ` / ${warningCount} warnings` : ''}
    </span>
  )
}
