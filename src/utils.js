var pseudoSelectorRegex = /(::?|>.*)\w+\s\{\W+[:;#%\/\.\(\)\+,\s\w"'-]+\}/gm;
var atRuleRegex = /@.*\{\W+([:;#%\/\.\(\)\+,\s\w"'-]|(::?|>.*)\w+\s\{\W+[:;#%\/\.\(\)\+,\s\w"'-]+\})+\}/gm;
var globalRuleRegex = /[a-z\*,\s]+\s\{\W+[:;#%\/\.\(\)\+,\s\w"'-]+\}/gm;

export function mainRule(styles, classID) {
  return "." + classID + "{" + styles.replace(atRuleRegex, "").replace(pseudoSelectorRegex, "") + "}";
};

export function pseudoSelectorRules(styles, classID) {
  var rules = [];
  var matches = styles.replace(atRuleRegex, "").match(pseudoSelectorRegex) || [];
  for (var index = 0; index < matches.length; index++) {
    rules.push("." + classID + matches[index]);
  }
  return rules;
};

export function atRules(styles, classID) {
  var atrules = [];
  var matches = styles.match(atRuleRegex) || [];
  for (var index = 0; index < matches.length; index++) {
    var rules = "." + classID + matches[index].replace(pseudoSelectorRegex, '').match(/\{\W+[:;#%\/\.\(\)\+,\s\w"'-]+\}+/gm);
    var pseudoSelectorMatches = matches[index].match(pseudoSelectorRegex) || [];
    for (var j = 0; j < pseudoSelectorMatches.length; j++) {
      rules += "." + classID + pseudoSelectorMatches[j];
    }
    atrules.push(matches[index].match(/@.*/) + rules + "}");
  }
  return atrules;
};

export function globalRules(styles) {
  return styles.match(globalRuleRegex) || []
};

export function generateID() {
  var ID = '';
  var randomChar = function () {
    var n = Math.floor(Math.random() * 62);
    if (n < 10) return n; //1-10
    if (n < 36) return String.fromCharCode(n + 55); //A-Z
    return String.fromCharCode(n + 61); //a-z
  }
  while (ID.length < 6) ID += randomChar();
  return ID;
}