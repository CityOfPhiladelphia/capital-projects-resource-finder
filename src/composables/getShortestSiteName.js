import { formatString as formatSiteName } from './formatString'

// gives app the best chance of displaying a site name, rather than a site name with the project description
// ignores text that follows key terms to cut off project description text that is erroneously included as part of the site name
export const getShortestSiteName = (siteNames) => {
  let shortestName = formatSiteName(siteNames[0]).split(' - ')[0];
  const shortestNameTrimmed = shortestName.match(/^.*?((?<=Community Center|Recreation Center|Playground)|.*?(?<=\)))/);
  shortestName = shortestNameTrimmed ? shortestNameTrimmed[0] : shortestName
  let shortestLength = /[a-zA-Z][/\\][a-zA-Z]/.test(shortestName) ? Infinity : shortestName.length

  for (let i = 1; i < siteNames.length; i++) {
    let nextName = formatSiteName(siteNames[i]).split(' - ')[0]
    const nextNameTrimmed = shortestName.match(/^.*?((?<=Community Center|Recreation Center|Playground)|.*?(?<=\)))/);
    nextName = nextNameTrimmed ? nextNameTrimmed[0] : nextName
    const nextLength = /[a-zA-Z][/\\][a-zA-Z]/.test(nextName) ? Infinity : shortestName.length
    shortestName = nextLength < shortestLength ? nextName : shortestName;
  }
  return shortestName
}
