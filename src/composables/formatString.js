import { expandContractions } from "./expandContractions"

// reformats the site and project names to Title Case
// uses regex to expand some abbreviations back to full words, e.g. bb => basketball
export const formatString = (rawString) => {
  // expand contractions
  rawString = expandContractions(rawString);

  // add white space around some special characters
  rawString = rawString.replace(/((?<=\w)[\\/[{(-])/g, " $1"); // instert space before '\', '/', '[', '{', '(', '-' if character is preceded by a word character
  rawString = rawString.replace(/([\\/)}\]-](?=\w))/g, "$1 "); // instert space after '\', '/', ']', '}', ')', '-' if character is followed by a letter

  // capitalize the first letter of words
  rawString = rawString.replace(/(\b[a-z](?!\s))/g, (c) => c.toUpperCase()); // capitalize every first letter

  // replace 'and' with '&'
  rawString = rawString.replace(/(?<=\W|\b)[Aa][Nn][Dd](?=\W|\b)/g, '&'); // and to &

  // fix proper names
  rawString = rawString.replace(/(?<=\W|\b)[Ff][Dd][Rr](?=\W|\b)/g, 'FDR'); // ensure FDR is all caps
  rawString = rawString.replace(/(?<=\W|\b)[Cc][Bb](?=\W|\b)/g, 'Cecil B'); // cb to Cecil B.
  rawString = rawString.replace(/(?<=\W|\b)[Mm][Ll][Kk](?=\W|\b)/g, 'MLK'); // mlk to all caps

  // period after initials
  rawString = rawString.replace(/(?<!Malcolm )(?<=\W|\b)([A-Z])(?=\s)/g, "$1."); // "Cecil B" to "Cecil B." ignoring Malcolm X

  // fix repeated word
  rawString = rawString.replace('Center Center', 'Center'); // Fixes the specific case of "rec ctr" or "rc ctr" turning to "Recreation Center Center"
  return rawString.trim()
}
