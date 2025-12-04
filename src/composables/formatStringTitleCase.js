import { expandContractions } from "./expandContractions"
import regexDictionary from "./regexDictionary"

// reformats the site and project names to Title Case
// uses regex to expand some abbreviations back to full words, e.g. bb => basketball
export const formatStringTitleCase = (rawString) => {
  return expandContractions(rawString) // expand contractions
    .replace(regexDictionary.whiteSpace.unbalancedWhitespace, "$4$1$2$3$1$4") // balance whitespace around special chars
    .replace(regexDictionary.character.charThenSlashDashOrOpening, " $1") // insert space before '\', '/', -, '[', '{', '(' if character is preceded by a letter
    .replace(regexDictionary.character.charThenSlashDashOrClosing, "$1 ") // insert space after '\', '/', -, ']', '}', ')' if character is followed by a letter
    .replace(regexDictionary.pattern.firstLowerAndMinLength, (c) => c.toUpperCase()) // capitalize every first letter
    .replace(regexDictionary.word.and, '&') // and to &
    .replace(regexDictionary.word.fdr, 'FDR') // ensure FDR is all caps
    .replace(regexDictionary.word.mlk, 'MLK') // mlk to all caps
    .replace(regexDictionary.word.fifa, 'FIFA') // fifa to all caps
    .replace(regexDictionary.word.love, 'Love') // LOVE to Love
    .replace(regexDictionary.pattern.singleInitialNotMalcolm, "$1.") // period after initials e.g. "Cecil B" to "Cecil B." ignoring Malcolm X
    .replace(regexDictionary.pattern.engineSingleDigit, "$10$2") // make single digit two digits by adding leading 0
    .replace(regexDictionary.whiteSpace.leadingTrailingPunctAndWhite, '') // remove leading or trailing punctuation
}
