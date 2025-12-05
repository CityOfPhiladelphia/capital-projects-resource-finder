import regexDictionary from "./regexDictionary"
import { formatString } from "./formatString"
import { fixWords } from "./fixWords"

// Format strings to Sentence Case
export const formatStringSentenceCase = (rawString) => {
  if (!rawString) return rawString;
  rawString = formatString(rawString)
    .replace(regexDictionary.character.amp, ' and ') // & to and
    .replace(regexDictionary.character.charThenSlashOrOpening, " $1") // insert space before '\', '/', '[', '{', '(' if preceded by a word character
    .replace(regexDictionary.character.charThenSlashOrClosing, "$1 ") // insert space after '\', '/', ']', '}', ')' if followed by a word character
    .replace(regexDictionary.pattern.everythingBeforeClosingCharAtEnd, (match, p1, p2) => `${p1}${match.match(regexDictionary.character.openingBrackParen) ? p2 : ''}`) // remove trailing )}] if not paired with opening
    .replace(regexDictionary.pattern.initialUpperNotStreetOrAllCaps, (c) => c.toLowerCase()) // check if word beginning with an uppercase character
    .replace(regexDictionary.pattern.firstLetterLowercase, (c) => c.toUpperCase()) // capitalize first letter
  return fixWords(rawString)
}
