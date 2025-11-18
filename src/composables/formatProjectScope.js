import { expandContractions } from "./expandContractions"

// Standardize format of project_scope so it can be rendered more easily in Template
export const formatProjectScope = (projectScope) => {
  projectScope = expandContractions(projectScope);
  projectScope = formatStringToCommaSeperated(projectScope);
  return Array.from(projectScope.split(','), (item) => toSentenceCase(item.trim())).toString() // each item to Sentence case
}

const formatStringToCommaSeperated = (rawString) => {
  return rawString
    .replace(/((?<=[A-Za-z])[\\/[{(])/g, " $1") // instert space before '\', '/', '[', '{', '(' if character is preceded by a word character
    .replace(/([\\/)}\]](?=[A-Za-z]))/g, "$1 ") // instert space after '\', '/', ']', '}', ')' if character is followed by a letter
    .replace(/(?:(?:[,-:;|\\]|(?i:and))\s{0,1}){0,1}(?:(?:\({0,1}(?:[Bb][Pp]#|[Pp](?i:hase){0,1})\s{0,1}\d{1}\){0,1}\s{0,1})|(?:\d\)))(?:[-:;|\\]{0,1}\s{0,1})/g, ',') // turns refrences to project phases into ','
    .replace(/^\W|[,.]$/, '') // remove leading or trailing punctuation
    .replace(/(?<!(?i:mt|\s\w))(?<=\w)[.;]|(?:,\s{0,1}[Aa]nd)(?=\s{0,1}\S)/g, ','); // turn ';', '.', ', and' into ',' to make lists all coma seperated
}

const toSentenceCase = (rawString) => {
  return rawString.toLowerCase()
    .replace(/^\W\s{0,}|[,.]$/g, '') // remove leading punctuation and any following white space, and any trailing punctuation
    .replace(/(.*)([)}\]]$)/g, (match, p1, p2) => `${p1}${match.match(/[({[\]]/) ? p2 : ''}`) // remove trailing )}] if not paired with opening
    .replace(/(^[a-z])/g, (c) => c.toUpperCase()) // capitalize first letter
    .replace(/\b[b-df-hj-np-tv-xz]{1,}\b/g, (c) => c.toUpperCase()) // make abbreviations all caps
    .replace(/(?<= by )\w(?=\w)/g,  (c) => c.toUpperCase()) // capitalize Proper Noun
    .replace(/\b[Hh]vac\b/g, 'HVAC') // hvac to all caps
    .replace(/\b[Aa]arp\b/g, 'AARP') // aarp to all caps
    .replace(/\b[Aa]da\b/g, 'ADA') // aarp to all caps
    .replace(/\b[Pp][Uu]\b/g, 'PU') // aarp to all caps
    .replace(/(?<=\s)[Ww]\W(?=\s\w)/g, 'with') // 'w.' to 'with'
    .replace(/(\b(?i:mt))(?:. )([A-Z-a-z])(\w{2,})/g, (match, p1, p2, p3) => `Mt. ` + `${p2}`.toUpperCase() + `${p3}`.toLowerCase())
}
