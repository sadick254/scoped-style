var pseudoSelectorRegex = /((::?|>\s?)(\w|-?)+\s*)+(,\s*((::?|>\s?)(\w|-?)+\s*)+)*\{\W+[:;#%\/\.\(\)\+,\s\w"'-]+\}/gm;
var atRuleRegex = /@.*\{\W+([:;#%\/\.\(\)\+,\s\w"'-]|(::?|>.*)\w+\s\{\W+[:;#%\/\.\(\)\+,\s\w"'-]+\})+\}/gm;
var globalRuleRegex = /[a-z\*,\s]+\s\{\W+[:;#%\/\.\(\)\+,\s\w"'-]+\}/gm;

export function mainRule(styles, classID) {
  return "." + classID + "{" + styles.replace(atRuleRegex, "").replace(pseudoSelectorRegex, "") + "}";
};

export function pseudoSelectorRules(styles, classID) {
  var rules = [];
  var matches = styles.replace(atRuleRegex, "").match(pseudoSelectorRegex) || [];
  for (var index = 0; index < matches.length; index++) {
    var ruleBody = matches[index].match(/\{\W+[:;#%\/\.\(\)\+,\s\w"'-]+\}/gm)[0];
    var pseudoSelectors = matches[index].replace(/\{\W+[:;#%\/\.\(\)\+,\s\w"'-]+\}/gm, "").split(",");
    for (var j = 0; j < pseudoSelectors.length; j++) {
      rules.push("." + classID + pseudoSelectors[j].trim() + ruleBody);
    }
  }
  return rules;
};

export function atRules(styles, classID) {
  var atrules = [];
  var matches = styles.match(atRuleRegex) || [];
  for (var index = 0; index < matches.length; index++) {
    var rules = "." + classID + matches[index].replace(pseudoSelectorRegex, '').match(/\{\W+[:;#%\/\.\(\)\+,\s\w"'-]+\}/gm);
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
  var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var randomString = '';
  for (var i = 0; i < 7; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}
