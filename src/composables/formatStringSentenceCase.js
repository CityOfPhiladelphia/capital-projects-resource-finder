import { expandContractions } from "./expandContractions"
import regexPat from "./regexPats"

// Format strings to Sentence Case
export const formatStringSentenceCase = (rawString) => {
  return expandContractions(rawString.toLowerCase())
    .replace(regexPat.character.amp, ' and ') // & to and
    .replace(regexPat.whiteBeforePunct, "$1 ") // remove leading whitespace before punctuation
    .replace(regexPat.slashOrOpening, " $1") // insert space before '\', '/', '[', '{', '(' if preceded by a word character
    .replace(regexPat.slashOrClosing, "$1 ") // insert space after '\', '/', ']', '}', ')' if followed by a word character
    .replace(regexPat.everythingBeforeClosingCharAtEnd, (match, p1, p2) => `${p1}${match.match(regexPat.openingChar) ? p2 : ''}`) // remove trailing )}] if not paired with opening
    .replace(regexPat.twoPlusNoVowels, (c) => c.toUpperCase()) // make abbreviations (any word without any vowels) all caps
    .replace(regexPat.firstLetterLowercase, (c) => c.toUpperCase()) // capitalize first letter
    .replace(regexPat.wordAfterBy, (c) => c.toUpperCase()) // capitalize Proper Noun
    .replace(regexPat.contraction.with, 'with') // 'w.' to 'with'
    .replace(regexPat.word.hvac, 'HVAC') // hvac to all caps
    .replace(regexPat.word.aarp, 'AARP') // aarp to all caps
    .replace(regexPat.word.ada, 'ADA') // ada to all caps
    .replace(regexPat.word.pu, 'PU') // pu to all caps
    .replace(regexPat.MtName, (match, p1, p2, p3) => `Mt. ` + `${p2}`.toUpperCase() + `${p3}`.toLowerCase()) // format names starting with 'Mt.'
    .replace(regexPat.leadingTrailingPunctAndWhite, '') // remove leading punctuation and any following white space, and any trailing punctuation
}
