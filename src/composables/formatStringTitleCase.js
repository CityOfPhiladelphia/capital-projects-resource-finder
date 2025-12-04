import regexDictionary from "./regexDictionary"
import { expandContractions } from "./expandContractions"
import { formatString } from "./formatString"
import { fixWords } from "./fixWords"

// reformats the site and project names to Title Case
// uses regex to expand some abbreviations back to full words, e.g. bb => basketball
export const formatStringTitleCase = (rawString) => {
  if (!rawString) return rawString;
  rawString = formatString(rawString) // expand contractions
    .replace(regexDictionary.word.and, '&') // and to &
    .replace(regexDictionary.character.charThenSlashDashOrOpening, " $1") // insert space before '\', '/', -, '[', '{', '(' if character is preceded by a letter
    .replace(regexDictionary.character.charThenSlashDashOrClosing, "$1 ") // insert space after '\', '/', -, ']', '}', ')' if character is followed by a letter
    .replace(regexDictionary.pattern.firstLowerAndMinLength, (c) => c.toUpperCase()) // capitalize every first letter
    .replace(regexDictionary.pattern.engineSingleDigit, "$10$2") // make single digit two digits by adding leading 0
  return fixWords(rawString);
}
