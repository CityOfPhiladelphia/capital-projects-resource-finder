import { formatStringTitleCase as formatSiteName } from './formatStringTitleCase'
import regexDictionary from './regexDictionary';

// when sites have multiple names, chooses the most concice
// also removes refrences to the project phase from the site name
export const getShortestSiteName = (siteNames) => {
  let shortestName = formatSiteName(siteNames[0].replace(regexDictionary.pattern.projectPhase, '').trim());
  for (let i = 1; i < siteNames.length; i++) {
    let nextName = formatSiteName(siteNames[i].replace(regexDictionary.pattern.projectPhase, '').trim());
    shortestName = nextName.length < shortestName.length ? nextName : shortestName;
  }
  return shortestName.replace('Nicetown - Tioga Library', 'Nicetown-Tioga Library') // fixes format for library
}
