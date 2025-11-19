import regexPat from "./regexPats"

// uses regex to expand some abbreviations back to full words, e.g. bb => basketball
// will remove trailing periods from contractions, e.g. bldg. => building
export const expandContractions = (rawString) => {
  return rawString
  .replace(regexPat.contraction.cb, 'Cecil B') // cb to Cecil B
  .replace(regexPat.contraction.bb, 'basketball') // bb to basketball
  .replace(regexPat.contraction.pg, 'playground') // pg to playground
  .replace(regexPat.contraction.rcOrRec, 'recreation center') // rc or rec to recreation center
  .replace(regexPat.contraction.ccOrCrc, 'community center') // cc or crc to community center
  .replace(regexPat.contraction.ec, 'environmental center') // cc or crc to community center
  .replace(regexPat.contraction.oac, 'older adult center') // oac to older adult center
  .replace(regexPat.contraction.ctr, 'center') // ctr to center
  .replace(regexPat.contraction.hort, 'horticulture') // hort to horticulture
  .replace(regexPat.contraction.rd, 'road') // rd to road
  .replace(regexPat.contraction.st, 'street') // st to street
  .replace(regexPat.contraction.ave, 'avenue') // ave to avenue
  .replace(regexPat.contraction.bldg, (match, p1, p2) => `building${(p2 && p2.length > 1) ? 's' : ''}`) // bldg to building or bldgs to buildings
  .replace(regexPat.centerRepeated, 'center ') // Fixes the specific case of "rec ctr" or "rc ctr" turning to "Recreation Center Center"
  .trim()
}
