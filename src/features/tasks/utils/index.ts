export const getPriorityClasses = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-600'
    case 'medium':
      return 'bg-amber-100 text-amber-600'
    case 'low':
      return 'bg-emerald-100 text-emerald-600'
    default:
      return ''
  }
}

export const getStatusClasses = (status: string) => {
  switch (status) {
    case 'todo':
      return 'bg-slate-400'
    case 'in_progress':
      return 'bg-blue-500'
    case 'done':
      return 'bg-green-500'
    default:
      return ''
  }
}

export const formatStatus = (status: string) => {
  return status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
