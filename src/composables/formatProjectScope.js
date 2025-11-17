import { expandContractions } from "./expandContractions"

// Standardize format of project_scope so it can be rendered more easily in Template
export const formatProjectScope = (projectScope) => {
  console.log(projectScope)
  projectScope = expandContractions(projectScope);
  // turn ; into , to make list all coma seperated
  projectScope = projectScope.replace(/;/g, ',');
  // turn non-comma list characters to ;
  // standardize space around them
  projectScope = projectScope.replace(/(\W\s{0,1}){0,1}(\({0,1}([Pp](hase){0,1}\s{0,1}){0,1}\d{1}\){0,1}\s{0,1})[-:;/|\\](?=[\w\s])/gi, ',')
  // projectScope = projectScope.replace(/,(?=\s{0,1}\w+;)/g, '');
  console.log(projectScope.trim())
  return projectScope.trim()
}

const toSentenceCaseNoEnclosing = (rawString) => {
  // strips enclosing (), {}, or [], then converts result into sentence case
  return rawString.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '').replace(/\.\s+([a-z])[^.]|^(\s*[a-z])[^.]/g, str => str.replace(/([a-z])/, str => str.toUpperCase())).replace(/\btbd|Tbd\b/, 'TBD').replace(/\bhvac|Hvac\b/, 'HVAC');
}

// // Standardize format of project_scope so it can be rendered more easily in Template
// export const formatProjectScope = (projectScope) => {
//   // Is list with headings? change heading marker standard character splitting on headings
//   if (projectScope.includes(';')) {
//     const projectScopeSplit = projectScope.split(';');
//     const splitChars = Array.from(projectScopeSplit, (item) => getSplitChar(item)).filter(Boolean);
//     if (splitChars.length === projectScopeSplit.length && splitChars.every((chr) => chr === splitChars[0])) {
//       projectScope = projectScope.replaceAll(splitChars[0], headingSplitCharacter.value).replaceAll(`${headingSplitCharacter.value}`, headingSplitCharacter.value);
//     }
//   }

//   // turn '.', ', and', ' /' into ',' so they act as regular list items, turn 'bb' and 'pg' into 'basketball' and 'playground', remove leading/trailing whitespace
//   projectScope = projectScope.replace(/\bbb|Bb|BB\b/, 'basketball').replace(/\bpg|Pg|PG\b/, 'playground').replace(/\.|, and| \//g, ',').trim()
//   return projectScope.endsWith(',') ? projectScope.substr(0, projectScope.length - 1) : projectScope; // remove trailing comma is it exists
// }
