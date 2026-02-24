import regexDictionary from "./regexDictionary"
import { format } from 'date-fns';

// Format numerical dates to "Month(word) Day(number), Year(number)""
export const formatDate = (numericalDate) => {
  return regexDictionary.pattern.isDate.test(numericalDate) ? format(numericalDate, 'MMMM d, yyyy') : 'No date provided';
}
