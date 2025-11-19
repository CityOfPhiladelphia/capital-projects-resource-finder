import { formatStringTitleCase as formatSiteName } from './formatStringTitleCase'
import regexPat from './regexPats';

// when sites have multiple names, chooses the most concice
// also removes refrences to the project phase from the site name
export const getShortestSiteName = (siteNames) => {
  let shortestName = formatSiteName(trimPhase(siteNames[0]));
  for (let i = 1; i < siteNames.length; i++) {
    let nextName = formatSiteName(trimPhase(siteNames[i]));
    shortestName = nextName.length < shortestName.length ? nextName : shortestName;
  }
  return shortestName
}

// trim substrings  for projects phases from site names
const trimPhase = (siteName) => {
  // remove refrences to project phase
  return siteName
    .replace(regexPat.projectPhase, '')
    .trim();
}
