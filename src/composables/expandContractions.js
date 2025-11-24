import regexDictionary from "./regexDictionary"

// uses regex to expand some abbreviations back to full words, e.g. bb => basketball
// will remove trailing periods from contractions, e.g. bldg. => building
export const expandContractions = (rawString) => {
  return rawString
  .replace(regexDictionary.contraction.with, 'with') // 'w.' to 'with'
  .replace(regexDictionary.contraction.cb, 'Cecil B') // cb to Cecil B
  .replace(regexDictionary.contraction.bb, 'basketball') // bb to basketball
  .replace(regexDictionary.contraction.pg, 'playground') // pg to playground
  .replace(regexDictionary.contraction.rcOrRec, 'recreation center') // rc or rec to recreation center
  .replace(regexDictionary.contraction.ccOrCrc, 'community center') // cc or crc to community center
  .replace(regexDictionary.contraction.ec, 'environmental center') // cc or crc to community center
  .replace(regexDictionary.contraction.oac, 'older adult center') // oac to older adult center
  .replace(regexDictionary.contraction.ctr, 'center') // ctr to center
  .replace(regexDictionary.contraction.hort, 'horticulture') // hort to horticulture
  .replace(regexDictionary.contraction.rd, 'road') // rd to road
  .replace(regexDictionary.contraction.st, 'street') // st to street
  .replace(regexDictionary.contraction.ave, 'avenue') // ave to avenue
  .replace(regexDictionary.contraction.bldg, (match, p1, p2) => `building${(p2 && p2.length > 1) ? 's' : ''}`) // bldg to building or bldgs to buildings
  .replace(regexDictionary.pattern.centerRepeated, 'center ') // Fixes the specific case of "rec ctr" or "rc ctr" turning to "Recreation Center Center"
  .trim()



  
}
