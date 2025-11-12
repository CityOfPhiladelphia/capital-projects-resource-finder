// checks if the project's archive_date is in the past or if the project_status is complete but the actual_completion field is null
export const isArchiveProject = (project) => { return (project.project_status.toLowerCase() === 'complete' && project.archive_date ? new Date(project.archive_date) < new Date() : false) }

// reformats the site and project names to Title Case
// uses regex to expand some abbreviations back to full words, e.g. bb => basketball
export const formatSiteOrProjectName = (rawString) => {
  rawString = rawString.replace(/((?<=\w)[\\/[{(])/g, " $1") // instert space before '\', '/', '[', '{', '(' if character is preceded by a word character
  rawString = rawString.replace(/([\\/)}\]](?=\w))/g, "$1 ") // instert space after '\', '/', ']', '}', ')' if character is followed by a letter
  rawString = rawString.replace(/(\b[a-z](?!\s))/g, (c) => c.toUpperCase()) // capitalize every first letter
  rawString = rawString.replace(/(?<=\W|\b)[Aa][Nn][Dd](?=\W|\b)/g, '&') // and to &
  rawString = rawString.replace(/(?<=\W|\b)[Ff][Dd][Rr](?=\W|\b)/g, 'FDR') // ensure FDR is all caps
  rawString = rawString.replace(/(?<=\W|\b)[Cc][Bb](?=\W|\b)/g, 'Cecil B.') // cb to Cecil B.
  rawString = rawString.replace(/(?<=\W|\b)[Bb][Bb](?=\W|\b)/g, 'Basketball') // bb to basketball
  rawString = rawString.replace(/(?<=\W|\b)([Pp][Gg])|([Pp]\/[Gg])(?=\W|\b)/g, 'Playground') // pg to playground
  rawString = rawString.replace(/(?<=\W|\b)R([Cc]|[Ee][Cc])(?=\W|\b)/g, 'Recreation Center') // rc or rec to recreation center
  rawString = rawString.replace(/(?<=\W|\b)[Cc]([Cc]|[Rr][Cc])(?=\W|\b)/g, 'Community Center') // cc or crc to community center
  rawString = rawString.replace(/(?<=\W|\b)[Cc][Tt][Rr](?=\W|\b)/g, 'Center') // ctr to center
  rawString = rawString.replace(/(?<=\W|\b)[Hh][Oo][Rr][Tt](?=\W|\b)/g, 'Horticulture') // hort to horticulture
  rawString = rawString.replace(/(?<=\W|\b)[Rr][Dd](?=\W|\b)/g, 'Road') // rd to road
  rawString = rawString.replace(/(?<=\W|\b)[St][Tt](?=\W|\b)/g, 'Street') // st to street
  rawString = rawString.replace(/(?<=\W|\b)[Bb][Ll][Dd][Gg](?=s|\W|\b)/g, 'Building') // bldg to building
  rawString = rawString.replace('Center Center', 'Center') // Fixes the specific case of "rec ctr" or "rc ctr" turning to "Recreation Center Center"
  return rawString.trim()
}

// gives each site a standard category value
// goes through each project at a site and checks for a department title's keyword after shifting the project's client_category to lowercase
// keyword checks and lowercase will allow for some amount of variation of formatting and spelling in the data still being recognized as the same department
// eg. 'parks & rec' and 'Parks and Recreation' will both reduce to 'parks'
// matched keywords are added to a Set to ensure no duplicates
// client_categories that do no match a keyword are stipped of all special characters and added to the set in all lowercase to give the best chance of matching other non-keyword departments
// if the size of the Set is greater than 1, returns 'multiple' for multiple client_categories having projects at the site
// otherwise if the item in the set is the keyword categories, it returns that item
// unreccognized client_categories get returned as 'other'
export const normalizeCategory = (projectCategories) => {
  projectCategories = Array.isArray(projectCategories) ? projectCategories : [projectCategories];
  const categories = new Set();
  const normalizedCategories = ['parks', 'health', 'library', 'fire', 'police', 'property'];
  projectCategories.forEach((projectCategory) => {
    let matchedAny = false;
    normalizedCategories.forEach((normalizedCategory) => {
      const matchedThis = projectCategory.toLowerCase().includes(normalizedCategory);
      if (matchedThis) { categories.add(normalizedCategory) }
      matchedAny |= matchedThis;
    })
    if (!matchedAny) { categories.add(projectCategory.toLowerCase().replace(/[(?<=\W|\b)a-zA-Z0-9 ]/g, '')) }
  })
  if (categories.size > 1) { return 'multiple' }
  return normalizedCategories.includes([...categories][0]) ? [...categories][0] : 'other';
}
