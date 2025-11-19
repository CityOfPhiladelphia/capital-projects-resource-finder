import { expandContractions } from "./expandContractions"
import regexPat from "./regexPats"

// reformats the site and project names to Title Case
// uses regex to expand some abbreviations back to full words, e.g. bb => basketball
export const formatStringTitleCase = (rawString) => {
  return expandContractions(rawString) // expand contractions
    .replace(regexPat.slashDashOrOpening, " $1") // instert space before '\', '/', -, '[', '{', '(' if character is preceded by a letter
    .replace(regexPat.slashDashOrClosing, "$1 ") // instert space after '\', '/', -, ']', '}', ')' if character is followed by a letter
    .replace(/(\b[a-z]{1,2}(?=\w{2}|'\w{2}))/g, (c) => c.toUpperCase()) // capitalize every first letter
    .replace(regexPat.word.and, '&') // and to &
    .replace(regexPat.word.fdr, 'FDR') // ensure FDR is all caps
    .replace(regexPat.word.mlk, 'MLK') // mlk to all caps
    .replace(regexPat.word.love, 'Love') // LOVE to Love
    .replace(regexPat.singleInitialNotMalcolm, "$1.") // period after initials e.g. "Cecil B" to "Cecil B." ignoring Malcolm X
    .replace(regexPat.leadingTrailingPunctAndWhite, '') // remove leading or trailing punctuation
}
