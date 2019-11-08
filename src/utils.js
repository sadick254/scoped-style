var pseudoSelectorRegex = /((,\s*)?(\s?(::?|>\s?|~\s?|\+\s?)(\w|-|\.|#|\*|\[([^(\[\])])*\]|\(([^(\(\))])+\))+)+\s*)+\{\W+[:;#%\/\\\.\(\)\+,\s\w"'-]+\}/gm;
var atRuleRegex = /@.*\{\W+([:;#%\/\.\(\)\+,\s\w"'-]|(::?|>.*)\w+\s\{\W+[:;#%\/\\\.\(\)\+,\s\w"'-]+\})+\}/gm;
var globalRuleRegex = /[a-z\*,\s]+\s\{\W+[:;#%\/\\\.\(\)\+,\s\w"'-]+\}/gm;
var bodyRuleRegex = /\{\W+[:;#%\/\\\.\(\)\+,\s\w"'-]+\}/gm;
var testClassNamesIDCount = 0;

export function mainRule(styles, classID) {
  return (
    '.' + classID + '{' + styles.replace(atRuleRegex, '').replace(pseudoSelectorRegex, '') + '}'
  );
}

export function pseudoSelectorRules(styles, classID) {
  var rules = [];
  var matches = styles.replace(atRuleRegex, '').match(pseudoSelectorRegex) || [];
  for (var index = 0; index < matches.length; index++) {
    var ruleBody = matches[index].match(bodyRuleRegex)[0];
    var pseudoSelectors = matches[index].replace(bodyRuleRegex, '').split(',');
    for (var j = 0; j < pseudoSelectors.length; j++) {
      rules.push('.' + classID + pseudoSelectors[j].trim() + ruleBody);
    }
  }
  return rules;
}

export function atRules(styles, classID) {
  var atrules = [];
  var matches = styles.match(atRuleRegex) || [];
  for (var index = 0; index < matches.length; index++) {
    var rules =
      '.' + classID + matches[index].replace(pseudoSelectorRegex, '').match(bodyRuleRegex);
    var pseudoSelectorMatches = matches[index].match(pseudoSelectorRegex) || [];
    for (var j = 0; j < pseudoSelectorMatches.length; j++) {
      rules += '.' + classID + pseudoSelectorMatches[j];
    }
    atrules.push(matches[index].match(/@.*/) + rules + '}');
  }
  return atrules;
}

export function globalRules(styles) {
  return styles.match(globalRuleRegex) || [];
}

export function generateID() {
  var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var randomString = '';
  for (var i = 0; i < 7; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}

function ruleAlreadyExist(classID, rule, rulesForComponent) {
  var objkeysRulesForComponent = Object.keys(rulesForComponent);
  for (var index = 0; index < objkeysRulesForComponent.length; index++) {
    for (var j = 0; j < rulesForComponent[objkeysRulesForComponent[index]].length; j++) {
      if (
        rulesForComponent[objkeysRulesForComponent[index]][j].replace(
          objkeysRulesForComponent[index],
          classID
        ) === rule
      ) {
        return objkeysRulesForComponent[index];
      }
    }
  }
  return undefined;
}

export function insertStyleAndSetclassIDs(classID, rule, rulesForComponent, classIDs, cb) {
  var nameRuleAlreadyExist = ruleAlreadyExist(classID, rule, rulesForComponent);
  if (!nameRuleAlreadyExist) {
    cb(rule);
    if (!rulesForComponent[classID]) {
      rulesForComponent[classID] = [];
    }
    rulesForComponent[classID].push(rule);
    if (classIDs.indexOf(classID) === -1) {
      classIDs.push(classID);
    }
  } else {
    if (classIDs.indexOf(nameRuleAlreadyExist) === -1) {
      classIDs.push(nameRuleAlreadyExist);
    }
  }
}

export function isTestEnvironment() {
  if (typeof process !== 'undefined') {
    return process.env.NODE_ENV === 'test';
  } else {
    return false;
  }
}

export function generateIDForTests() {
  return 'c' + testClassNamesIDCount++;
}
