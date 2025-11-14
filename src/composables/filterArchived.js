import { isArchiveProject } from './isArchiveProject'

// called by statusToggleRefine
// takes in locations and archive flag
// filters each site's projects based on the if the result of isArchiveProject function matches the flag
// if filteredProjects is not empty, a copy of the site is made and the projects are replaced with the filtered projects
// site is then push or filtered sites array, which the ultimately function returns
export const filterArchived = (locations, archiveToggle) => {
  const filteredSites = [];
  locations.forEach((location) => {
    const filteredProjects = location.properties.projects.filter((project) => isArchiveProject(project) === archiveToggle)
    if (filteredProjects.length) {
      const locationCopy = JSON.parse(JSON.stringify(location));
      locationCopy.properties.projects = filteredProjects;
      filteredSites.push(locationCopy);
    }
  })
  return filteredSites;
}
