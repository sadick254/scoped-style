import {
  mainRule,
  pseudoSelectorRules,
  atRules,
  globalRules,
  generateID,
  generateIDForTests,
  insertStyleAndSetclassIDs,
  isTestEnvironment,
} from './utils';

var sheet =
  typeof document === 'undefined'
    ? { insertRule: function() {} }
    : document.head.appendChild(document.createElement('style')).sheet;

function defaultcb(css) {
  sheet.insertRule(css, sheet.cssRules ? sheet.cssRules.length : 0);
}

function scoped(h, cb) {
  cb = cb || defaultcb;
  function styled(elem) {
    return function(tags) {
      var fns = [].slice.call(arguments);
      fns.shift();
      var rulesForComponent = {};
      return function(props, children) {
        var classID = scoped.generateID();
        rulesForComponent[classID] = [];
        var classIDs = [];
        children = Array.isArray(children) ? children : props.children;
        var styles = '';
        for (var index = 0; index < tags.length; index++) {
          styles += tags[index] + (fns[index] ? fns[index](props) : '');
        }
        insertStyleAndSetclassIDs(
          classID,
          mainRule(styles, classID),
          rulesForComponent,
          classIDs,
          cb
        );
        var rulesPseudoSelector = pseudoSelectorRules(styles, classID);
        for (var index = 0; index < rulesPseudoSelector.length; index++) {
          insertStyleAndSetclassIDs(
            classID,
            rulesPseudoSelector[index],
            rulesForComponent,
            classIDs,
            cb
          );
        }
        var rulesAt = atRules(styles, classID);
        for (var index = 0; index < rulesAt.length; index++) {
          insertStyleAndSetclassIDs(classID, rulesAt[index], rulesForComponent, classIDs, cb);
        }
        if (rulesForComponent[classID].length === 0) {
          delete rulesForComponent[classID];
        }
        var attr = Object.assign({}, props);
        attr.class = classIDs.join(' ') + ' ' + (props.class || props.className || '');
        if (h.name === 'createElementWithValidation') {
          attr.className = attr.class;
          delete attr.class;
          return h(elem, attr, children);
        }
        return h(elem, attr, children);
      };
    };
  }
  styled.keyframes = function(tags) {
    var args = [].slice.call(arguments);
    args.shift();
    var styles = '';
    for (var i = 0; i < tags.length; i++) {
      styles += tags[i] + (args[i] || '');
    }
    var name = scoped.generateID();
    cb('@keyframes ' + name + ' { ' + styles + ' }');
    return name;
  };
  styled.global = function(tags) {
    var args = [].slice.call(arguments);
    args.shift();
    var styles = '';
    for (var i = 0; i < tags.length; i++) {
      styles += tags[i] + (args[i] || '');
    }
    var matches = globalRules(styles);
    for (var j = 0; j < matches.length; j++) {
      cb(matches[j]);
    }
  };
  return styled;
}

scoped.generateID = isTestEnvironment() ? generateIDForTests : generateID;

scoped.defaultCallback = defaultcb;

export default scoped;
