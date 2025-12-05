import { expandContractions } from "./expandContractions"
import regexDictionary from "./regexDictionary"

// basic formatting for all strings
export const formatString = (rawString) => {
  if (!rawString) return rawString;
  return expandContractions(rawString)
    .replace(regexDictionary.whiteSpace.moreThanOneSpace, " ") // remove extra white space between characters and words
    .replace(regexDictionary.whiteSpace.unbalancedWhitespace, "$4$1$2$3$1$4") // balance whitespace around special chars
    .replace(regexDictionary.whiteSpace.whiteBeforePunct, "$1 ") // remove leading whitespace before punctuation
    .replace(regexDictionary.pattern.singleInitialNotMalcolm, "$1.") // period after initials e.g. "Cecil B" to "Cecil B." ignoring Malcolm X
    .replace(regexDictionary.whiteSpace.leadingTrailingPunctAndWhite, '') // remove leading or trailing punctuation
}
