import { expandContractions } from "./expandContractions"
import regexDictionary from "./regexDictionary"

// Format strings to Sentence Case
export const formatStringSentenceCase = (rawString) => {
  return expandContractions(rawString)
    .replace(regexDictionary.character.amp, ' and ') // & to and
    .replace(regexDictionary.whiteSpace.whiteBeforePunct, "$1 ") // remove leading whitespace before punctuation
    .replace(regexDictionary.whiteSpace.unbalancedWhitespace, "$4$1$2$3$1$4") // balance whitespace around special chars
    .replace(regexDictionary.character.charThenSlashOrOpening, " $1") // insert space before '\', '/', '[', '{', '(' if preceded by a word character
    .replace(regexDictionary.character.charThenSlashOrClosing, "$1 ") // insert space after '\', '/', ']', '}', ')' if followed by a word character
    .replace(regexDictionary.pattern.everythingBeforeClosingCharAtEnd, (match, p1, p2) => `${p1}${match.match(regexDictionary.character.openingBrackParen) ? p2 : ''}`) // remove trailing )}] if not paired with opening
    .replace(regexDictionary.pattern.initialUpperNotStreetOrAllCaps, (c) => c.toLowerCase()) // check if word beginning with an uppercase character
    .replace(regexDictionary.pattern.twoPlusNoVowels, (c) => c.toUpperCase()) // make abbreviations (any word without any vowels) all caps
    .replace(regexDictionary.pattern.firstLetterLowercase, (c) => c.toUpperCase()) // capitalize first letter
    .replace(regexDictionary.pattern.wordAfterBy, (c) => c.toUpperCase()) // capitalize Proper Noun
    .replace(regexDictionary.word.hvac, 'HVAC') // hvac to all caps
    .replace(regexDictionary.word.aarp, 'AARP') // aarp to all caps
    .replace(regexDictionary.word.ada, 'ADA') // ada to all caps
    .replace(regexDictionary.pattern.mtName, (match, p1, p2, p3) => `Mt. ` + `${p2}`.toUpperCase() + `${p3}`.toLowerCase()) // format names starting with 'Mt.'
    .replace(regexDictionary.whiteSpace.leadingTrailingPunctAndWhite, '') // remove leading punctuation and any following white space, and any trailing punctuation
}
