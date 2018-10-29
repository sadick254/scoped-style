import { mainRule, pseudoSelectorRules, atRules, globalRules } from "./utils";

var sheet = document.head.appendChild(document.createElement("style")).sheet;
function scoped(h) {
  var _id = 1;
  function styled(elem) {
    return function(tags) {
      var fns = [].slice.call(arguments);
      fns.shift();
      return function(props, children) {
        var classID = "i" + _id;
        children = Array.isArray(children) ? children : props.children;
        var styles = "";
        for (var index = 0; index < tags.length; index++) {
          styles += tags[index] + (fns[index] ? fns[index](props) : "");
        }
        sheet.insertRule(mainRule(styles, classID), sheet.cssRules.length);
        var rulesPseudoSelector = pseudoSelectorRules(styles, classID);
        for (var index = 0; index < rulesPseudoSelector.length; index++) {
          sheet.insertRule(rulesPseudoSelector[index], sheet.cssRules.length);
        }
        var rulesAt = atRules(styles, classID);
        for (var index = 0; index < rulesAt.length; index++) {
          sheet.insertRule(rulesAt[index], sheet.cssRules.length);
        }
        _id++;
        var attr = Object.assign({}, props);
        attr.class = classID + " " + (props.class || props.className || "");
        if (h.name === "createElementWithValidation") {
          attr.className = attr.class;
          delete attr.class;
          return h(elem, attr, children);
        }
        return h(elem, attr, children);
      };
    };
  }
  styled.global = function(tags) {
    var args = [].slice.call(arguments);
    args.shift();
    var styles = "";
    for (var i = 0; i < tags.length; i++) {
      styles += tags[i] + (args[i] || "");
    }
    var matches = globalRules(styles);
    for (var j = 0; j < matches.length; j++) {
      sheet.insertRule(matches[j], sheet.cssRules.length);
    }
  };
  return styled;
}

export default scoped;
