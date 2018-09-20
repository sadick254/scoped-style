var sheet = document.head.appendChild(document.createElement("style")).sheet;
function scoped(h) {
  var _id = 1;
  return function(elem) {
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
        var pseudoSelectorRegex = /(::?|>.*)\w+\s\{\W+[a-z:;\s\w"'-]+\}/gm;
        var atRuleRegex = /@.*\W+[a-z:\s\w;-]+\}/gm;
        var matches = styles.match(pseudoSelectorRegex) || [];
        for (var index = 0; index < matches.length; index++) {
          var rule = ".i" + _id + matches[index];
          sheet.insertRule(rule, sheet.cssRules.length);
        }
        matches = styles.match(atRuleRegex) || [];
        for (var index = 0; index < matches.length; index++) {
          var rule = matches[index].match(/\{\W+[\w\s;:"'-]+\}+/gm);
          var style = matches[index].match(/@.*/) + "." + classID + rule + "}";
          sheet.insertRule(style, sheet.cssRules.length);
        }
        styles = styles.replace(pseudoSelectorRegex, "");
        styles = styles.replace(atRuleRegex, "");
        sheet.insertRule(
          "." + classID + "{" + styles + "}",
          sheet.cssRules.length
        );
        var attr = Object.assign({}, props);
        attr.class = classID + " " + props.class || props.className;
        if (h.name === "createElementWithValidation") {
          attr.className = attr.class;
          delete attr.class;
          return h(elem, attr, children);
        }
        return h(elem, attr, children);
      };
    };
  };
}

export default scoped;
