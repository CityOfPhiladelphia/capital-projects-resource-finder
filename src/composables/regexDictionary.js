export default {
  pattern: {
    projectPhase: /(?:(?:[,-:;|\\]|(?i:and))\s?)?(?:(?:\(?(?:[Bb][Pp]\W|[Pp](?i:hase)?|\((?=\d\)))\s?\d\)?\s?)|(?:\d\)))(?:[-:;|\\]?\s?)/g,
    twoPlusNoVowels: /(?i:\b[b-df-hj-np-tv-xz]{2,}\b)/g,
    everythingBeforeClosingCharAtEnd: /(.*)([)}\]]$)/g,
    firstLetterLowercase: /(^[a-z])/g,
    wordAfterBy: /(?<= by )\w(?=\w)/g,
    mtName: /(\b(?i:mt))(?:. )([A-Z-a-z])(\w{2,})/g,
    singleInitialNotMalcolm: /(?<!Malcolm )(?<=\W|\b)([A-Z])(?=\s)/g,
    firstLowerAndMinLength: /(\b[a-z](?=\w{3}|'\w{2}))/g,
    stringSeparators: /(?<!(?:\b\w)|(?:\b\w\w))(?<=\w)[.;]|(?:(?:,|(?<=[)}\]]))\s?[Aa]nd)(?=\s?\S)/g
  },
  whiteSpace: {
    leadingTrailingPunctAndWhite: /^\W*|\s*[,.]\s*$/g,
    whiteBeforePunct: /(?:\s)([^\\/[{()}\]])(?=\s)/g
  },
  contraction: {
    with: /(?<=\s)[Ww]\W(?=\s\w)/g,
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
    bldg: /(?<=\W|\b)[Bb][Ll][Dd][Gg]((s\.|\.)(?=[ ])|(?=s\W|\b))/g
  },
  word: {
    hvac: /\b[Hh]vac\b/g,
    aarp: /\b[Aa]arp\b/g,
    ada: /\b[Aa]da\b/g,
    pu: /\b[Pp][Uu]\b/g,
    and: /(?<=\W|\b)[Aa][Nn][Dd](?=\W|\b)/g,
    fdr: /(?<=\W|\b)[Ff][Dd][Rr](?=\W|\b)/g,
    mlk: /(?<=\W|\b)[Mm][Ll][Kk](?=\W|\b)/g,
    love: /(?<=\W|\b)[Ll][Oo][Vv][Ee](?=\W|\b)/g
  },
  character: {
    amp: /\s?&\s?/g,
    unenclosedComma: /(?<!\([^)}\]]*),(?![^({[)}\]]*[)}\]])/g,
    openingBrackParen: /[({[\]]/,
    slashOrOpening: /((?<=[[:alpha]])[\\/[{(])/g,
    slashOrClosing: /([\\/)}\]](?=[[:alpha]]))/g,
    slashDashOrOpening: /((?<=[[:alpha]])[\\/[{(-])/g,
    slashDashOrClosing: /([\\/)}\]-](?=[[:alpha]]))/g
  }
}
