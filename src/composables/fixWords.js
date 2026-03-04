import regexDictionary from "./regexDictionary"

// regex fixes for certain words formats
export const fixWords = (rawString) => {
  if (!rawString) return rawString;
  return rawString
    .replace(regexDictionary.word.fdr, 'FDR') // ensure FDR is all caps
    .replace(regexDictionary.word.mlk, 'MLK') // mlk to all caps
    .replace(regexDictionary.word.fifa, 'FIFA') // fifa to all caps
    .replace(regexDictionary.word.love, 'Love') // LOVE to Love
    .replace(regexDictionary.word.hvac, 'HVAC') // hvac to all caps
    .replace(regexDictionary.word.aarp, 'AARP') // aarp to all caps
    .replace(regexDictionary.word.ada, 'ADA') // ada to all caps
    .replace(regexDictionary.pattern.mtName, (match, p1, p2, p3) => `Mt. ` + `${p2}`.toUpperCase() + `${p3}`.toLowerCase()) // format names starting with 'Mt.'
    .replace(regexDictionary.pattern.twoPlusNoVowels, (c) => c.toUpperCase()) // make abbreviations (any word without any vowels) all caps
}
