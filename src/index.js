const scoped = function scoped(h) {
  let index = 1;
  return elem => (tags, ...fns) => (props, args) => {
    let children = Array.isArray(args) ? args : props.children;
    const className = `i${index++}`;
    var sheet = document.head.appendChild(document.createElement("style"))
      .sheet;

    let styles = tags.reduce((style, tag, i) => {
      return (style += tag + (fns[i] ? fns[i](props) : ""));
    }, "");

    const pseudoSelectorRegex = /(::?|>.*)\w+\s\{\W+[a-z:;\s\w"'-]+\}/gm;
    const atRuleRegex = /@.*\W+[a-z:\s\w;-]+\}/gm;

    const pseudoSelectors = styles.match(pseudoSelectorRegex) || [];
    pseudoSelectors.forEach(pseudoSelector => {
      let rule = "." + className + pseudoSelector;
      sheet.insertRule(rule, sheet.cssRules.length);
    });
    styles = styles.replace(pseudoSelectorRegex, "");

    const atRules = styles.match(atRuleRegex) || [];
    styles = styles.replace(atRuleRegex, "");
    sheet.insertRule(`.${className} {${styles}}`, sheet.cssRules.length);

    atRules.forEach(atRule => {
      let rule = atRule.match(/\{\W+[\w\s;:"'-]+\}+/gm);
      let style = atRule.match(/@.*/) + "." + className + rule + "}";
      sheet.insertRule(style, sheet.cssRules.length);
    });
    let attr = Object.assign({}, props);
    if ("class" in props) {
      attr.className = `${className} ${props.class}`;
    }
    if (h.name === "createElementWithValidation") {
      delete attr.class;
      return h(elem, attr, children);
    }
    return h(elem, attr, children);
  };
};

export default scoped;
