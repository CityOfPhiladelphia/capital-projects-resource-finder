export default {
  pattern: {
    projectPhase: /(?:(?:[,-:;|\\]|(?:[Aa][Nn][Dd]))\s?)?(?:(?:\(?(?:[Bb][Pp]\W|[Pp](?:[Hh][Aa][Ss][Ee])?|\((?=\d\)))\s?\d\)?\s?)|(?:\d\)))(?:[-:;|\\]?\s?)/g,
    twoPlusNoVowels: /(?:\b[b-df-hj-np-tv-xz]{2,}\b)/gi,
    everythingBeforeClosingCharAtEnd: /(.*)([)}\]]$)/g,
    firstLetterLowercase: /(^[a-z])/g,
    mtName: /(\b(?:[Mm][Tt]))(?:. )([A-Z-a-z])(\w{2,})/g,
    singleInitialNotMalcolm: /(?<!Malcolm )(?<=\W|\b)([A-Z])(?=\s)/g,
    centerRepeated: /(?:[Cc][Ee][Nn][Tt][Ee][Rr](?:\s|\b)){2,}/g,
    firstLowerAndMinLength: /(\b[a-z](?=\w{3}|'\w{2}))/g,
    stringSeparators: /(?<!\b\w{1,2})(?:[,.;]\s?(?:[Aa]nd)?)(?=\s)/g,
    initialUpperNotStreetOrAllCaps: /(?<!(?:(?:\d[Tt][Hh])(?:\s(?:[Aa][Nn][Dd]|&))?\s)|(?:\.\s)|^)(?<=\s)(?:[A-Z])(?!\.|(?:[A-Z]+)|(?:[a-z]{1,2}[A-Z.])|(?:'[A-Z]))/g,
    engineSingleDigit: /(engine )(\d)(?=\b)/gi
  },
  whiteSpace: {
    leadingTrailingPunctAndWhite: /(?<=^)\W*|\s*(?:[,./?;:[{(!@#$%&*^_=+\\\-]+|\s*)+(?=$)/g,
    whiteBeforePunct: /(?:\s+)([,.?;:!]\s?)/g,
    unbalancedWhitespace: /(\s(?=[\\\/-]\w))([\\\/-])|([\\\/-])((?<=\w[\\\/-])\s)/g,
    moreThanOneSpace: /\s+/g
  },
  character: {
    amp: /\s?&\s?/g,
    unenclosedComma: /(?<!\([^)}\]]*),(?![^({[)}\]]*[)}\]])/g,
    openingBrackParen: /[({[\]]/,
    charThenSlashOrOpening: /((?<=[A-Za-z])[\\/[{(])/g,
    charThenSlashOrClosing: /([\\/)}\]](?=[A-Za-z]))/g,
    charThenSlashDashOrOpening: /((?<=[A-Za-z])[\\/[{(-])/g,
    charThenSlashDashOrClosing: /([\\/)}\]-](?=[A-Za-z]))/g
  },
  contraction: {
    with: /(?<=\s)w[./\\](?=\s\w)/g,
    cb: /(?<=\W|\b)[Cc][Bb](?=\W|\b)/g,
    bb: /(?<=\W|\b)[Bb][Bb](\.(?=[ ])|(?=\W|\b))/g,
    pg: /(?<=\W|\b)([Pp][\\/]?[Gg])(\.(?=[ ])|(?=\W|\b))/g,
    rcOrRec: /(?<=\W|\b)[Rr][Ee]?[Cc](\.(?=[ ])|(?=\W|\b))/g,
    ccOrCrc: /(?<=\W|\b)[Cc][Rr]?[Cc](\.(?=[ ])|(?=\W|\b))/g,
    ec: /(?<=\W|\b)[Ee][Cc](\.(?=[ ])|(?=\W|\b))/g,
    oac: /(?<=\W|\b)[Oo][Aa][Cc](\.(?=[ ])|(?=\W|\b))/g,
    ctr: /(?<=\W|\b)[Cc][Tt][Rr](\.(?=[ ])|(?=\W|\b))/g,
    hort: /(?<=\W|\b)[Hh][Oo][Rr][Tt](\.(?=[ ])|(?=\W|\b))/g,
    rd: /(?<=\W|\b)[Rr][Dd](\.(?=[ ])|(?=\W|\b))/g,
    st: /(?<=\W|\b)[Ss][Tt](\.(?=[ ])|(?=\W|\b))/g,
    ave: /(?<=\W|\b)[Aa][Vv][Ee](\.(?=[ ])|(?=\W|\b))/g,
    bldg: /(?<=\W|\b)[Bb][Ll][Dd][Gg]((s\.|\.)(?=[ ])|(?=s\W|\b))/g,
    phila: /(?<=\W|\b)[Pp][Hh][Ii][Ll][Aa]((s\.|\.)(?=[ ])|(?=s\W|\b))/g
  },
  word: {
    ada: /\b[Aa][Dd][Aa]\b/g,
    aarp: /\b[Aa]{2}[Rr][Pp]\b/g,
    hvac: /\b[Hh][Vv][Aa][Cc]\b/g,
    and: /(?<=\W|\b)[Aa][Nn][Dd](?=\W|\b)/g,
    fdr: /(?<=\W|\b)[Ff][Dd][Rr](?=\W|\b)/g,
    mlk: /(?<=\W|\b)[Mm][Ll][Kk](?=\W|\b)/g,
    fifa: /(?<=\W|\b)[Ff][Ii][Ff][Aa](?=\W|\b)/g,
    love: /(?<=\W|\b)[Ll][Oo][Vv][Ee](?=\W|\b)/g
  }
}
