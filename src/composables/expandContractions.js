// uses regex to expand some abbreviations back to full words, e.g. bb => basketball
// will remove trailing periods from contractions, e.g. bldg. => building
export const expandContractions = (rawString) => {
  return rawString
  .replace(/(?<=\W|\b)[Cc][Bb](?=\W|\b)/g, 'Cecil B') // cb to Cecil B
  .replace(/(?<=\W|\b)[Bb][Bb](\.(?=[ ])|(?=\W|\b))/g, 'basketball') // bb to basketball
  .replace(/(?<=\W|\b)([Pp][\\/]{0,1}[Gg])(\.(?=[ ])|(?=\W|\b))/g, 'playground') // pg to playground
  .replace(/(?<=\W|\b)[Rr][Ee]{0,1}[Cc](\.(?=[ ])|(?=\W|\b))/g, 'recreation center') // rc or rec to recreation center
  .replace(/(?<=\W|\b)[Cc][Rr]{0,1}[Cc](\.(?=[ ])|(?=\W|\b))/g, 'community center') // cc or crc to community center
  .replace(/(?<=\W|\b)[Ee][Cc](\.(?=[ ])|(?=\W|\b))/g, 'environmental center') // cc or crc to community center
  .replace(/(?<=\W|\b)[Oo][Aa][Cc](\.(?=[ ])|(?=\W|\b))/g, 'older adult center') // oac to older adult center
  .replace(/(?<=\W|\b)[Cc][Tt][Rr](\.(?=[ ])|(?=\W|\b))/g, 'center') // ctr to center
  .replace(/(?<=\W|\b)[Hh][Oo][Rr][Tt](\.(?=[ ])|(?=\W|\b))/g, 'horticulture') // hort to horticulture
  .replace(/(?<=\W|\b)[Rr][Dd](\.(?=[ ])|(?=\W|\b))/g, 'road') // rd to road
  .replace(/(?<=\W|\b)[Ss][Tt](\.(?=[ ])|(?=\W|\b))/g, 'street') // st to street
  .replace(/(?<=\W|\b)[Aa][Vv][Ee](\.(?=[ ])|(?=\W|\b))/g, 'avenue') // st to street
  .replace(/(?:[Cc]enter(?:\s|\b)){2,}/, 'center ') // Fixes the specific case of "rec ctr" or "rc ctr" turning to "Recreation Center Center"
  .replace(/(?<=\W|\b)[Bb][Ll][Dd][Gg]((s\.|\.)(?=[ ])|(?=s\W|\b))/g, (match, p1, p2) => {
    return `building${(p2 && p2.length > 1) ? 's' : ''}`}) // bldg to building or bldgs to buildings
  .trim()
}
