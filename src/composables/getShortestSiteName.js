import { formatString as formatSiteName } from './formatStringTitleCase'

// when sites have multiple names, chooses the most concice
// also removes refrences to the project phase from the site name
export const getShortestSiteName = (siteNames) => {
  let shortestName = trimPhase(formatSiteName(siteNames[0]));
  for (let i = 1; i < siteNames.length; i++) {
    let nextName = trimPhase(formatSiteName(siteNames[i]));
    shortestName = nextName.length < shortestName.length ? nextName : shortestName;
  }
  return shortestName
}

// trim substrings  for projects phases from site names
const trimPhase = (siteName) => {
  // remove "Phase x", "Px" "x", whether enclosed in () or not
  // only matches from the end of the site name
  siteName = siteName.replace(/\({0,1}[Pp](?i:hase){0,1}\s{0,1}\d{1}\){0,1}/g, '');
  return siteName;
}
