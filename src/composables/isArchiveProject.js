// checks if the project's archive_date is in the past or if the project_status is complete but the actual_completion field is null
export const isArchiveProject = (project) => { return (project.project_status.toLowerCase() === 'complete' && project.archive_date ? new Date(project.archive_date) < new Date() : false) }
