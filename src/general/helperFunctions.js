// checks if the project's archive_date is in the past or if the project_status is complete but the actual_completion field is null
export const isArchiveProject = (project) => { return (project.project_status.toLowerCase() === 'complete' && !project.actual_completion) || (project.archive_date ? new Date(project.archive_date) < new Date() : false) }

// reformats the site and project names to Title Case
// uses regex to expand some abbreviations back to full words, e.g. bb => basketball
export const formatSiteOrProjectName = (rawString) => {
  rawString.split(' ').filter(Boolean).forEach((word, i, sentence) => {
    const andToAmp = /(?<=\W|\b)[Aa][Nn][Dd](?=\W|\b)/;
    const fdrToFDR = /(?<=\W|\b)[Ff][Dd][Rr](?=\W|\b)/;
    const bbToBasketball = /(?<=\W|\b)[Bb][Bb](?=\W|\b)/;
    const pgToPlayground = /(?<=\W|\b)([Pp][Gg])|([Pp]\/[Gg])(?=\W|\b)/;
    const rcOrRecToRecreationCenter = /(?<=\W|\b)R([Cc]|[Ee][Cc])(?=\W|\b)/;
    const ccOrcrcToCommunityCenter = /(?<=\W|\b)[Cc]([Cc]|[Rr][Cc])(?=\W|\b)/;
    const crtToCenter = /(?<=\W|\b)[Cc][Tt][Rr](?=\W|\b)/;
    const hortToHorticulture = /(?<=\W|\b)[Hh][Oo][Rr][Tt](?=\W|\b)/;
    const rdToRoad = /(?<=\W|\b)[Rr][Dd](?=\W|\b)/;
    const stToStreet = /(?<=\W|\b)[St][Tt](?=\W|\b)/;
    const bldgToBuilding = /(?<=\W|\b)[Bb][Ll][Dd][Gg](?=s|\W|\b)/
    word = word.length > 2 ? word.replace(/^[a-z]/, word.charAt(0).toUpperCase()) : word; // Capitalize first letter of all words longer than 2 letters
    switch (true) {
      case andToAmp.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(andToAmp, '&'))
        break;
      }
      case fdrToFDR.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(fdrToFDR, 'FDR'))
        break;
      }
      case bbToBasketball.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(bbToBasketball, 'Basketball'))
        break;
      }
      case pgToPlayground.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(pgToPlayground, 'Playground'))
        break;
      }
      case rcOrRecToRecreationCenter.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(rcOrRecToRecreationCenter, 'Recreation Center'))
        break;
      }
      case ccOrcrcToCommunityCenter.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(ccOrcrcToCommunityCenter, 'Community Center'))
        break;
      }
      case crtToCenter.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(crtToCenter, 'Center'))
        break;
      }
      case hortToHorticulture.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(hortToHorticulture, 'Horticulture'))
        break;
      }
      case rdToRoad.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(rdToRoad, 'Road'))
        break;
      }
      case stToStreet.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(stToStreet, 'Street'))
        break;
      }
      case bldgToBuilding.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(bldgToBuilding, 'Building'))
        break;
      }
      default: {
        rawString = rawString.replace(sentence[i], word)
        break;
      }
    }
  })
  return rawString.replace('Center Center', 'Center').trim()  // Fixes the specific case of "rec ctr" or "rc ctr" turning to "Recreation Center Center"
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
