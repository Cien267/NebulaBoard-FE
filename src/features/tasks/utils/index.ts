export const getPrioritySeverity = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'danger'
    case 'medium':
      return 'warn'
    case 'low':
      return 'success'
    default:
      return 'info'
  }
}

export const getStatusSeverity = (status: string) => {
  switch (status) {
    case 'todo':
      return 'secondary'
    case 'in_progress':
      return 'info'
    case 'done':
      return 'success'
    default:
      return 'info'
  }
}

export const formatStatus = (status: string) => {
  return status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
