// Type definitions for scoped-style
// Definitions by: Marcin Kołodziejczak, kolodziejczak.mn@gmail.com

export as namespace scoped-style;
export = scoped;

/**
 *
 * @param createElement - Function responsible for creating (virtual) nodes
 * @param cssInserter - Function responsible for adding CSS rules
 */
declare function scoped(
  createElement: Function,
  cssInserter?: scoped.StylesheetRuleInserter
): scoped.Styled;

declare namespace scoped {
  interface StylesheetRuleInserter {
    (cssRule: string, rulePosition?: number): void;
  }

  interface Styled {
    /**
     * @param tagName - string which represents html tag e.g. 'section', 'label', 'button'
     * @returns StyledTagFunction - function used to attach styles to component
     */
    (tagName: string): StyledTagFunction;
    keyframes: KeyframesCreator;
    global: GlobalCreator;
  }

  /**
   * Tag function used to attach styles to a component.
   * Tag function - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
   *
   * @returns ComponentInstance - component that may be rendered
   */
  interface StyledTagFunction {
    (staticTexts: TemplateStringsArray, ...variables: any[]): ComponentInstance;
  }

  interface ComponentInstance {
    (props: any, children: any): GenericVirtualNode;
  }

  /**
   * Highly dependent on client's library vnode implementation
   */
  interface GenericVirtualNode {
    type: any;
    key: any;
    ref: any;
    props: any;
  }

  /**
   * Tag function - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
   *
   * @returns generated class name identifier
   */
  interface KeyframesCreator {
    (staticTexts: TemplateStringsArray, ...variables: any[]): string;
  }

  /**
   * Tag function used to attach global styles
   * Tag function - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
   */
  interface GlobalCreator {
    (staticTexts: TemplateStringsArray, ...variables: any[]): void;
  }

  /**
   * Function responsible for attaching new CSS style rules to document's head
   */
  export const defaultCallback: StylesheetRuleInserter;

  /**
   * Function responsible for generating unique class names identifiers
   */
  export const generateID: () => string;
}
