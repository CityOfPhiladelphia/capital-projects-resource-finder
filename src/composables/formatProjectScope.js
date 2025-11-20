import { expandContractions } from "./expandContractions"
import { formatStringSentenceCase } from "./formatStringSentenceCase"
import regexDictionary from "./regexDictionary";

// Standardize format of project_scope so it can be rendered more easily in Template
export const formatProjectScope = (projectScope) => {
  projectScope = expandContractions(projectScope);
  projectScope = formatStringToCommaSeperated(projectScope);
  return Array.from(projectScope.split(regexDictionary.character.unenclosedComma), (item) => formatStringSentenceCase(item.trim())).toString() // each item to Sentence case
}

const formatStringToCommaSeperated = (rawString) => {
  return rawString
    .replace(regexDictionary.pattern.projectPhase, ',') // turns refrences to project phases into ','
    .replace(regexDictionary.pattern.stringSeparators, ',') // turn ';', '.', ', and' into ',' to make lists all coma seperated. Ignores '.' after one or two letter words
    .replace(regexDictionary.whiteSpace.leadingTrailingPunctAndWhite, '') // remove leading or trailing punctuation
}
