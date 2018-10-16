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
        var pseudoSelectorRegex = /(::?|>.*)\w+\s\{\W+[a-z:;#%\(\),\s\w"'-]+\}/gm;
        var atRuleRegex = /@.*\{\W+([a-z:;#\(\),\s\w"'-]|(::?|>.*)\w+\s\{\W+[a-z:;#%\(\),\s\w"'-]+\})+\}/gm;
        sheet.insertRule(
          "." + classID + "{" + styles.replace(atRuleRegex, "").replace(pseudoSelectorRegex, "") + "}",
          sheet.cssRules.length
        );
        var matches = styles.replace(atRuleRegex, "").match(pseudoSelectorRegex) || [];
        for (var index = 0; index < matches.length; index++) {
          var rule = "." + classID + matches[index];
          sheet.insertRule(rule, sheet.cssRules.length);
        }
        matches = styles.match(atRuleRegex) || [];
        for (var index = 0; index < matches.length; index++) {
          var rules = "." + classID + matches[index].replace(pseudoSelectorRegex, '').match(/\{\W+[a-z:;#%\(\),\s\w"'-]+\}+/gm);
          var pseudoSelectorMatches = matches[index].match(pseudoSelectorRegex) || [];
          for (var j = 0; j < pseudoSelectorMatches.length; j++) {
              rules += "." + classID + pseudoSelectorMatches[index];
          }
          var style = matches[index].match(/@.*/) + rules + "}";
          console.log(style);
          sheet.insertRule(style, sheet.cssRules.length);
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
    var matches = styles.match(/[a-z*,\s]+\s\{\W+[a-z:;#%\(\),\s\w"'-]+\}/gm) || [];
    for (var j = 0; j < matches.length; j++) {
      sheet.insertRule(matches[j], sheet.cssRules.length);
    }
  };
  return styled;
}

export default scoped;
