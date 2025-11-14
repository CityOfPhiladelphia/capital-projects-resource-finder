// uses regex to expand some abbreviations back to full words, e.g. bb => basketball
export const expandContractions = (rawString) => {
  rawString = rawString.replace(/(?<=\W|\b)[Bb][Bb](\.(?=[ ])|(?=\W|\b))/g, 'basketball') // bb to basketball
  rawString = rawString.replace(/(?<=\W|\b)([Pp][Gg])|([Pp]\/[Gg])(\.(?=[ ])|(?=\W|\b))/g, 'playground') // pg to playground
  rawString = rawString.replace(/(?<=\W|\b)R([Cc]|[Ee][Cc])(\.(?=[ ])|(?=\W|\b))/g, 'recreation center') // rc or rec to recreation center
  rawString = rawString.replace(/(?<=\W|\b)[Cc]([Cc]|[Rr][Cc])(\.(?=[ ])|(?=\W|\b))/g, 'community center') // cc or crc to community center
  rawString = rawString.replace(/(?<=\W|\b)[Ee][Cc](\.(?=[ ])|(?=\W|\b))/g, 'environmental center') // cc or crc to community center
  rawString = rawString.replace(/(?<=\W|\b)[Oo][Aa][Cc](\.(?=[ ])|(?=\W|\b))/g, 'older adult center') // cc or crc to community center
  rawString = rawString.replace(/(?<=\W|\b)[Cc][Tt][Rr](\.(?=[ ])|(?=\W|\b))/g, 'center') // ctr to center
  rawString = rawString.replace(/(?<=\W|\b)[Hh][Oo][Rr][Tt](\.(?=[ ])|(?=\W|\b))/g, 'horticulture') // hort to horticulture
  rawString = rawString.replace(/(?<=\W|\b)[Rr][Dd](\.(?=[ ])|(?=\W|\b))/g, 'road') // rd to road
  rawString = rawString.replace(/(?<=\W|\b)[Ss][Tt](\.(?=[ ])|(?=\W|\b))/g, 'street') // st to street
  rawString = rawString.replace(/(?<=\W|\b)[Bb][Ll][Dd][Gg]((s\.|\.)(?=[ ])|(?=s\W|\b))/g, (match, p1, p2) => {
    return `building${(p2 && p2.length > 1) ? 's' : ''}`}) // bldg to building
  return rawString.trim()
}
