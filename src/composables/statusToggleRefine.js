import { filterArchived } from './filterArchived'

// filterLocationProjects function gets passed to Pinboard to refine the projects at sites according to their archived status, or (inclusive) based on their project status
export const statusToggleRefine = (locations, selectedServicesArray) => {
  // entries from the selectedServicesArray are split into their refine group and value
  const refineGroups = new Set(); // set ensures that all refine group entries are unique
  const selectedStatusesArray = Array.from(selectedServicesArray, (service) => {
    const splitService = service.split('_');
    refineGroups.add(splitService[0])
    return splitService[1];
  })

  // check if the selectedStatusesArray includes 'archive'
  // if so return only sites with archive projects, otherwise only sites with active projects
  const archiveFilteredLocations = filterArchived(locations, selectedStatusesArray.includes('archive'))

  // if refineGroups does not include 'status' or if selectedStatusesArray includes 'archive', returns because no further refining is necessary
  if (![...refineGroups].includes('status') || selectedStatusesArray.includes('archive')) { return archiveFilteredLocations }

  // filter sites' projects based on the status checkboxes that are selected
  // does largely the same thing as filterArchived, but for the other project statuses instead
  const filteredSites = [];
  archiveFilteredLocations.forEach((location) => {
    const filteredProjects = location.properties.projects.filter((project) => selectedStatusesArray.includes(project.project_status.toLowerCase()))
    if (filteredProjects.length) {
      const locationCopy = JSON.parse(JSON.stringify(location));
      locationCopy.properties.projects = filteredProjects;
      filteredSites.push(locationCopy);
    }
  })
  return filteredSites;
}
