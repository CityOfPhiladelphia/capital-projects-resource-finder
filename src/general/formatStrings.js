
// reformats the site and project names to Title Case
// uses regex to expand some abbreviations back to full words, e.g. bb => basketball
export const formatSiteOrProjectName = (rawString) => {
  //rawString = rawString.includes(' - ') ? isSiteName ? rawString.split(' - ')[0] : rawString.split(' - ')[1] : rawString;
  rawString.split(' ').filter(Boolean).forEach((word, i, sentence) => {
    word = word.length > 2 ? word.replace(/(?<=\W|\b)[a-z]/, word.charAt(0).toUpperCase()) : word;
    switch (true) {
      case /(?<=\W|\b)A[Nn][Dd](?<=\W|\b)/.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(/(?<=\W|\b)A[Nn][Dd](?<=\W|\b)/, '&'))
        break;
      }
      case /(?<=\W|\b)F[Dd][Rr](?<=\W|\b)/.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(/(?<=\W|\b)F[Dd][Rr](?<=\W|\b)/, 'FDR'))
        break;
      }
      case /(?<=\W|\b)B[Bb](?<=\W|\b)/.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(/(?<=\W|\b)B[Bb](?<=\W|\b)/, 'Basketball'))
        break;
      }
      case /(?<=\W|\b)P[Gg]|P\/[Gg](?<=\W|\b)/.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(/(?<=\W|\b)P[Gg]|P\/[Gg](?<=\W|\b)/, 'Playground'))
        break;
      }
      case /(?<=\W|\b)R[Cc](?<=\W|\b)/.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(/(?<=\W|\b)R[Cc](?<=\W|\b)/, 'Recreation Center'))
        break;
      }
      case /(?<=\W|\b)R[Ee][Cc](?<=\W|\b)/.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(/(?<=\W|\b)R[Ee][Cc](?<=\W|\b)/, 'Recreation'))
        break;
      }
      case /(?<=\W|\b)C[Rr][Cc](?<=\W|\b)/.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(/(?<=\W|\b)C[Rr][Cc](?<=\W|\b)/, 'Community Center'))
        break;
      }
      case /(?<=\W|\b)C[Tt][Rr](?<=\W|\b)/.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(/(?<=\W|\b)C[Tt][Rr](?<=\W|\b)/, 'Center'))
        break;
      }
      case /(?<=\W|\b)[Hh][Oo][Rr][Tt](?=\W|\b)/.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(/(?<=\W|\b)[Hh][Oo][Rr][Tt](?=\W|\b)/, 'Horticulture'))
        break;
      }
      case /(?<=\W|\b)[Rr][Dd](?=\W|\b)/.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(/(?<=\W|\b)[Rr][Dd](?=\W|\b)/, 'Road'))
        break;
      }
      case /(?<=\W|\b)[St][Tt](?=\W|\b)/.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(/(?<=\W|\b)[St][Tt](?=\W|\b)/, 'HorticultStreetuStreetre'))
        break;
      }
      default: {
        rawString = rawString.replace(sentence[i], word)
        break;
      }
    }
  })
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
