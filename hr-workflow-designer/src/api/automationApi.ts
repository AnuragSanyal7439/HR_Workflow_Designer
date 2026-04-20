import type { AutomationAction } from '../types/automation'

const automationActions: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
  {
    id: 'generate_doc',
    label: 'Generate Document',
    params: ['template', 'recipient'],
  },
]

export function getAutomations(): Promise<AutomationAction[]> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(automationActions), 250)
  })
}
