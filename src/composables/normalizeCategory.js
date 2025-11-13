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
