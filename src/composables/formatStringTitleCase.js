import { expandContractions } from "./expandContractions"

// reformats the site and project names to Title Case
// uses regex to expand some abbreviations back to full words, e.g. bb => basketball
export const formatString = (rawString) => {
  return expandContractions(rawString) // expand contractions
    .replace(/((?<=\D)[\\/[{(-])/g, " $1") // instert space before '\', '/', '[', '{', '(' if character is preceded by a letter
    .replace(/([\\/)}\]-](?=\D))/g, "$1 ") // instert space after '\', '/', ']', '}', ')' if character is followed by a letter
    .replace(/(\b[a-z](?=\w{3}|'\w{2}))/g, (c) => c.toUpperCase()) // capitalize every first letter
    .replace(/(?<=\W|\b)[Aa][Nn][Dd](?=\W|\b)/g, '&') // and to &
    .replace(/(?<=\W|\b)[Ff][Dd][Rr](?=\W|\b)/g, 'FDR') // ensure FDR is all caps
    .replace(/(?<=\W|\b)[Mm][Ll][Kk](?=\W|\b)/g, 'MLK') // mlk to all caps
    .replace(/(?<!Malcolm )(?<=\W|\b)([A-Z])(?=\s)/g, "$1.") // period after initials e.g. "Cecil B" to "Cecil B." ignoring Malcolm X
    .replace(/(?<=\s)\(\d\)(?=\s|$)/g, '') // remove (#)
    .trim()
}
