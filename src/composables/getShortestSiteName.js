import { formatString as formatSiteName } from './formatString'

// gives app the best chance of displaying a site name, rather than a site name with the project description
// ignores text that follows key terms to cut off project description text that is erroneously included as part of the site name
export const getShortestSiteName = (siteNames) => {
  const siteNameTerminators = /^.*?((?<=Center|Playground|Library|Building|Launch|Tower|Foerd)|.*?(?<=\)))/;
  let shortestName = formatSiteName(siteNames[0]);
  // let shortestName = formatSiteName(siteNames[0]).split(',')[0];
  // const shortestNameTrimmed = shortestName.match(siteNameTerminators);
  // shortestName = shortestNameTrimmed ? shortestNameTrimmed[0] : shortestName;

  for (let i = 1; i < siteNames.length; i++) {
    let nextName = formatSiteName(siteNames[i]);
    // let nextName = formatSiteName(siteNames[i]).split(',')[0];
    // const nextNameTrimmed = shortestName.match(siteNameTerminators);
    // nextName = nextNameTrimmed ? nextNameTrimmed[0] : nextName;
    shortestName = nextName.length < shortestName.length ? nextName : shortestName;
  }
  return shortestName
}
