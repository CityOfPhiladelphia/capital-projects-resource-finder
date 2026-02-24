import { formatStringTitleCase as formatSiteName } from './text formatting/formatStringTitleCase'
import regexDictionary from './text formatting/regexDictionary';

// when sites have multiple names, chooses the most concice
// also removes refrences to the project phase from the site name
export const getShortestSiteName = (siteNames) => {
  let shortestName = formatSiteName(siteNames.replace(regexDictionary.pattern.projectPhase, '').trim());
  return shortestName.replace('Nicetown - Tioga Library', 'Nicetown-Tioga Library') // fixes format for library
}
