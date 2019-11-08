import test from 'ava';
import {
  mainRule,
  pseudoSelectorRules,
  atRules,
  globalRules,
  generateID,
  isTestEnvironment,
  generateIDForTests,
} from '../utils';

function assertStyle(t, expected, result) {
  t.is(expected.replace(/[\r\n\s]/gm, ''), result.replace(/[\r\n\s]/gm, ''));
}

test("isTestEnvironment returns TRUE when process.env.NODE_ENV is equal to 'test'", t => {
  process.env.NODE_ENV = 'test';
  t.is(isTestEnvironment(), true);
});

test("isTestEnvironment returns FALSE when process.env.NODE_ENV is not equal to 'test'", t => {
  process.env.NODE_ENV = 'development';
  t.is(isTestEnvironment(), false);
});

test('generateIDForTests returns incremental, predictable classNames', t => {
  const [first, second, third] = [generateIDForTests(), generateIDForTests(), generateIDForTests()];

  t.deepEqual([first, second, third], ['c0', 'c1', 'c2']);
});

test('generateID can handle 6000 DOM nodes', t => {
  const nbDomNodes = 6000;
  const nbTimes = 100;
  t.plan(nbTimes);
  Array(nbTimes)
    .fill(undefined)
    .forEach(() => {
      const ids = Array(nbDomNodes)
        .fill(undefined)
        .map(() => generateID());
      t.true(ids.filter((v, i, a) => a.indexOf(v) === i).length === nbDomNodes);
    });
});

test('extract main rules from main rules only', t => {
  const scopedcss = `
    width: 100%;
  `;
  const className = 'i1';
  const result = mainRule(scopedcss, className);
  const expected = `
    .i1 {
      width: 100%;
    }
  `;
  assertStyle(t, expected, result);
});

test('extract main rules from full rules', t => {
  const scopedcss = `
    width: 100%;
    color: green;
    :hover {
      width: 80%;
    }
    > span {
        color: blue;
    }
    :hover > span {
      color: black;
    }
    ::placeholder, > div {
      color: blue;
    }
    @media screen and (max-width: 992px) {
      width: 60%;
      :hover {
        width: 40%;
      }
      > span {
        color: red;
      }
      :hover > span {
        color: white;
      }
      ::placeholder, > div {
        color: red;
      }
    }
  `;
  const className = 'i1';
  const result = mainRule(scopedcss, className);
  const expected = `
    .i1 {
      width: 100%;
      color: green;
    }
  `;
  assertStyle(t, expected, result);
});

test('extract pseudo selector rules from pseudo selector rules only', t => {
  const scopedcss = `
    :hover {
      width: 80%;
    }
  `;
  const className = 'i1';
  const result = pseudoSelectorRules(scopedcss, className);
  const expected = `
    .i1:hover {
      width: 80%;
    }
  `;
  assertStyle(t, expected, result.join(''));
});

test('extract pseudo selector rules rules from full rules', t => {
  const scopedcss = `
    width: 100%;
    :hover {
      width: 80%;
    }
    @media screen and (max-width: 992px) {
      width: 60%;
      :hover {
        width: 40%;
      }
    }
  `;
  const className = 'i1';
  const result = pseudoSelectorRules(scopedcss, className);
  const expected = `
    .i1:hover {
      width: 80%;
    }
  `;
  assertStyle(t, expected, result.join(''));
});

test('extract at rules from at rules only', t => {
  const scopedcss = `
    @media screen and (max-width: 992px) {
      width: 60%;
      :hover {
        width: 40%;
      }
    }
  `;
  const className = 'i1';
  const result = atRules(scopedcss, className);
  const expected = `
    @media screen and (max-width: 992px) {
      .i1 {
        width: 60%;
      }
      .i1:hover {
        width: 40%;
      }
    }
  `;
  assertStyle(t, expected, result.join(''));
});

test('extract at rules rules from full rules', t => {
  const scopedcss = `
    width: 100%;
    :hover {
      width: 80%;
    }
    @media screen and (max-width: 992px) {
      width: 60%;
      :hover {
        width: 40%;
      }
    }
  `;
  const className = 'i1';
  const result = atRules(scopedcss, className);
  const expected = `
    @media screen and (max-width: 992px) {
      .i1 {
        width: 60%;
      }
      .i1:hover {
        width: 40%;
      }
    }
  `;
  assertStyle(t, expected, result.join(''));
});

test('0 global rules equals array of lenth 0', t => {
  const globalcss = ``;
  const result = globalRules(globalcss);
  const expectedLength = 0;
  t.is(result.length, expectedLength);
});

test('3 global rules equals array of lenth 3', t => {
  const globalcss = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html,
    body {
      width: 100%;
      height: 100%;
    }

    body {
      font-family: calibri, helvetica, arial, sans-serif;
      font-size: 1em;
      color: rgba(102, 102, 102);
    }
  `;
  const result = globalRules(globalcss);
  const expectedLength = 3;
  t.is(result.length, expectedLength);
});

test('extract pseudo selector rules where pseudo selector has dash (-webkit-slider-thumb for example)', t => {
  const scopedcss = `
    ::-webkit-slider-thumb {
      color: blue;
    }
  `;
  const className = 'i1';
  const result = pseudoSelectorRules(scopedcss, className);
  const expected = `
    .i1::-webkit-slider-thumb {
      color: blue;
    }
  `;
  assertStyle(t, expected, result.join(''));
});

test('extract pseudo selector rules where pseudo selector is a function', t => {
  const scopedcss = `
    :nth-child(4n) {
      color: lime;
    }
  `;
  const className = 'i1';
  const result = pseudoSelectorRules(scopedcss, className);
  const expected = `
    .i1:nth-child(4n) {
      color: lime;
    }
  `;
  assertStyle(t, expected, result.join(''));
});

test('multiple comma separated values and whitespace for selector', t => {
  const scopedcss = `
    :hover,:focus,
    :active {
      color: red;
    }
  `;
  const className = 'i1';
  const result = pseudoSelectorRules(scopedcss, className);
  const expected = `
    .i1:hover {
      color: red;
    }
    .i1:focus {
      color: red;
    }
    .i1:active {
      color: red;
    }
  `;
  assertStyle(t, expected, result.join(''));
});

// https://developer.mozilla.org/en-US/docs/Web/CSS/Type_selectors
test('Type selectors in combinator', t => {
  const scopedcss = `
    > div {
      color: lime;
    }
  `;
  const className = 'i1';
  const result = pseudoSelectorRules(scopedcss, className);
  const expected = `
    .i1 > div {
      color: lime;
    }
  `;
  assertStyle(t, expected, result.join(''));
});

/**
 * Selectors
 */
// https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors
test('Class selectors in combinator', t => {
  const scopedcss = `
    > .content {
      color: lime;
    }
  `;
  const className = 'i1';
  const result = pseudoSelectorRules(scopedcss, className);
  const expected = `
    .i1 > .content {
      color: lime;
    }
  `;
  assertStyle(t, expected, result.join(''));
});

// https://developer.mozilla.org/en-US/docs/Web/CSS/ID_selectors
test('ID selectors in combinator', t => {
  const scopedcss = `
    > #main-button {
      color: lime;
    }
  `;
  const className = 'i1';
  const result = pseudoSelectorRules(scopedcss, className);
  const expected = `
    .i1 > #main-button {
      color: lime;
    }
  `;
  assertStyle(t, expected, result.join(''));
});

// https://developer.mozilla.org/en-US/docs/Web/CSS/Universal_selectors
test('Universal selectors in combinator', t => {
  const scopedcss = `
    > * {
      color: lime;
    }
  `;
  const className = 'i1';
  const result = pseudoSelectorRules(scopedcss, className);
  const expected = `
    .i1 > * {
      color: lime;
    }
  `;
  assertStyle(t, expected, result.join(''));
});

// https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors
test('Attribute selectors in combinator', t => {
  const scopedcss = `
    /* <a> elements with a title attribute */
    > a[title] {
      color: purple;
    }

    /* <a> elements with an href matching "https://example.org" */
    > a[href="https://example.org"] {
      color: green;
    }

    /* <a> elements with an href containing "example" */
    > a[href*="example"] {
      font-size: 2em;
    }

    /* <a> elements with an href ending ".org" */
    > a[href$=".org"] {
      font-style: italic;
    }

    /* <a> elements whose class attribute contains the word "logo", same as a.logo */
    > a[class~="logo"] {
      padding: 2px;
    }
  `;
  const className = 'i1';
  const result = pseudoSelectorRules(scopedcss, className);
  const expected = `
    .i1 > a[title] {
      color: purple;
    }

    .i1 > a[href="https://example.org"] {
      color: green;
    }

    .i1 > a[href*="example"] {
      font-size: 2em;
    }

    .i1 > a[href$=".org"] {
      font-style: italic;
    }

    .i1 > a[class~="logo"] {
      padding: 2px;
    }
  `;
  assertStyle(t, expected, result.join(''));
});

/**
 * Combinators
 */
// https://developer.mozilla.org/en-US/docs/Web/CSS/Adjacent_sibling_combinator
test('Adjacent sibling combinator', t => {
  const scopedcss = `
    + div {
      color: lime;
    }
  `;
  const className = 'i1';
  const result = pseudoSelectorRules(scopedcss, className);
  const expected = `
    .i1 + div {
      color: lime;
    }
  `;
  assertStyle(t, expected, result.join(''));
});

// https://developer.mozilla.org/en-US/docs/Web/CSS/General_sibling_combinator
test('General sibling combinator', t => {
  const scopedcss = `
    ~ div {
      color: lime;
    }
  `;
  const className = 'i1';
  const result = pseudoSelectorRules(scopedcss, className);
  const expected = `
    .i1 ~ div {
      color: lime;
    }
  `;
  assertStyle(t, expected, result.join(''));
});

// https://developer.mozilla.org/en-US/docs/Web/CSS/Child_combinator
test('Child combinator', t => {
  const scopedcss = `
    > div {
      color: lime;
    }
  `;
  const className = 'i1';
  const result = pseudoSelectorRules(scopedcss, className);
  const expected = `
    .i1 > div {
      color: lime;
    }
  `;
  assertStyle(t, expected, result.join(''));
});

test('checkbox or radio button', t => {
  t.plan(2);
  const scopedcss = `
    position: relative;
    padding-left: 2rem;
    padding-right: 0.75rem;
    margin-bottom: 0.75rem;
    cursor: pointer;
    font-size: 1rem;
    user-select: none;

    > input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    > input[type="checkbox"] ~ span {
      position: absolute;
      top: 0.2rem;
      left: 0;
      height: 1rem;
      width: 1rem;
      background-color: #eee;
    }

    > input[type="radio"] ~ span {
      position: absolute;
      top: 0.2rem;
      left: 0;
      height: 1rem;
      width: 1rem;
      background-color: #eee;
      border-radius: 50%;
    }

    :hover > input ~ span {
      background-color: #ccc;
      transition: .2s;
    }

    > input:checked ~ span {
      background-color: #0080b3;
    }

    :active > span {
      transform: scale(0);
    }

    > span:after {
      content: "";
      position: absolute;
      display: none;
    }

    > input:checked ~ span:after {
      display: block;
    }

    > input[type="checkbox"] ~ span:after {
      left: 0.25rem;
      top: 0.05rem;
      width: 0.25rem;
      height: 0.6rem;
      border: solid white;
      border-width: 0 0.2rem 0.2rem 0;
      transform: rotate(45deg);
    }

    > input[type="radio"] ~ span:after {
      left: 0.3rem;
      top: 0.3rem;
      width: 0.4rem;
      height: 0.4rem;
      border-radius: 50%;
      background: white;
    }
  `;
  const className = 'i1';
  const result = mainRule(scopedcss, className);
  const expected = `
    .i1 {
      position: relative;
      padding-left: 2rem;
      padding-right: 0.75rem;
      margin-bottom: 0.75rem;
      cursor: pointer;
      font-size: 1rem;
      user-select: none;
    }
  `;
  assertStyle(t, expected, result);
  const pseudoSelectorRulesResult = pseudoSelectorRules(scopedcss, className);
  const pseudoSelectorRulesExpected = `
    .i1 > input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    .i1 > input[type="checkbox"] ~ span {
      position: absolute;
      top: 0.2rem;
      left: 0;
      height: 1rem;
      width: 1rem;
      background-color: #eee;
    }

    .i1 > input[type="radio"] ~ span {
      position: absolute;
      top: 0.2rem;
      left: 0;
      height: 1rem;
      width: 1rem;
      background-color: #eee;
      border-radius: 50%;
    }

    .i1:hover > input ~ span {
      background-color: #ccc;
      transition: .2s;
    }

    .i1 > input:checked ~ span {
      background-color: #0080b3;
    }

    .i1:active > span {
      transform: scale(0);
    }

    .i1 > span:after {
      content: "";
      position: absolute;
      display: none;
    }

    .i1 > input:checked ~ span:after {
      display: block;
    }

    .i1 > input[type="checkbox"] ~ span:after {
      left: 0.25rem;
      top: 0.05rem;
      width: 0.25rem;
      height: 0.6rem;
      border: solid white;
      border-width: 0 0.2rem 0.2rem 0;
      transform: rotate(45deg);
    }

    .i1 > input[type="radio"] ~ span:after {
      left: 0.3rem;
      top: 0.3rem;
      width: 0.4rem;
      height: 0.4rem;
      border-radius: 50%;
      background: white;
    }
  `;
  assertStyle(t, pseudoSelectorRulesExpected, pseudoSelectorRulesResult.join(''));
});

/**
 * css property values tests
 * https://developer.mozilla.org/en-US/docs/Web/CSS/Value_definition_syntax
 */
test('css property value : keywords > one word (here: inherit)', t => {
  t.plan(3);
  const scopedcss = `
    width: inherit;
    :hover {
      width: inherit;
    }
    @media screen and (max-width: 992px) {
      width: inherit;
      :hover {
        width: inherit;
      }
    }
  `;
  const className = 'i1';
  const result = mainRule(scopedcss, className);
  const expected = `
    .i1 {
      width: inherit;
    }
  `;
  assertStyle(t, expected, result);
  const pseudoSelectorRulesResult = pseudoSelectorRules(scopedcss, className);
  const pseudoSelectorRulesExpected = `
    .i1:hover {
      width: inherit;
    }
  `;
  assertStyle(t, pseudoSelectorRulesExpected, pseudoSelectorRulesResult.join(''));
  const atRulesResult = atRules(scopedcss, className);
  const atRulesExpected = `
    @media screen and (max-width: 992px) {
      .i1 {
        width: inherit;
      }
      .i1:hover {
        width: inherit;
      }
    }
  `;
  assertStyle(t, atRulesExpected, atRulesResult.join(''));
});

test('css property value : keywords > words with "-" (here: ease-in)', t => {
  t.plan(3);
  const scopedcss = `
    transition-timing-function: ease-in;
    :hover {
      transition-timing-function: ease-in;
    }
    @media screen and (max-width: 992px) {
      transition-timing-function: ease-in;
      :hover {
        transition-timing-function: ease-in;
      }
    }
  `;
  const className = 'i1';
  const result = mainRule(scopedcss, className);
  const expected = `
    .i1 {
      transition-timing-function: ease-in;
    }
  `;
  assertStyle(t, expected, result);
  const pseudoSelectorRulesResult = pseudoSelectorRules(scopedcss, className);
  const pseudoSelectorRulesExpected = `
    .i1:hover {
      transition-timing-function: ease-in;
    }
  `;
  assertStyle(t, pseudoSelectorRulesExpected, pseudoSelectorRulesResult.join(''));
  const atRulesResult = atRules(scopedcss, className);
  const atRulesExpected = `
    @media screen and (max-width: 992px) {
      .i1 {
        transition-timing-function: ease-in;
      }
      .i1:hover {
        transition-timing-function: ease-in;
      }
    }
  `;
  assertStyle(t, atRulesExpected, atRulesResult.join(''));
});

test('css property value : literals > "/"', t => {
  t.plan(3);
  const scopedcss = `
    font: 12px/18px;
    :hover {
      font: 12px/18px;
    }
    @media screen and (max-width: 992px) {
      font: 12px/18px;
      :hover {
        font: 12px/18px;
      }
    }
  `;
  const className = 'i1';
  const result = mainRule(scopedcss, className);
  const expected = `
    .i1 {
      font: 12px/18px;
    }
  `;
  assertStyle(t, expected, result);
  const pseudoSelectorRulesResult = pseudoSelectorRules(scopedcss, className);
  const pseudoSelectorRulesExpected = `
    .i1:hover {
      font: 12px/18px;
    }
  `;
  assertStyle(t, pseudoSelectorRulesExpected, pseudoSelectorRulesResult.join(''));
  const atRulesResult = atRules(scopedcss, className);
  const atRulesExpected = `
    @media screen and (max-width: 992px) {
      .i1 {
        font: 12px/18px;
      }
      .i1:hover {
        font: 12px/18px;
      }
    }
  `;
  assertStyle(t, atRulesExpected, atRulesResult.join(''));
});

test('css property value : functions call', t => {
  t.plan(3);
  const scopedcss = `
    color: rgb(20, 20, 20);
    :hover {
      color: rgb(20, 20, 20);
    }
    @media screen and (max-width: 992px) {
      color: rgb(20, 20, 20);
      :hover {
        color: rgb(20, 20, 20);
      }
    }
  `;
  const className = 'i1';
  const result = mainRule(scopedcss, className);
  const expected = `
    .i1 {
      color: rgb(20, 20, 20);
    }
  `;
  assertStyle(t, expected, result);
  const pseudoSelectorRulesResult = pseudoSelectorRules(scopedcss, className);
  const pseudoSelectorRulesExpected = `
    .i1:hover {
      color: rgb(20, 20, 20);
    }
  `;
  assertStyle(t, pseudoSelectorRulesExpected, pseudoSelectorRulesResult.join(''));
  const atRulesResult = atRules(scopedcss, className);
  const atRulesExpected = `
    @media screen and (max-width: 992px) {
      .i1 {
        color: rgb(20, 20, 20);
      }
      .i1:hover {
        color: rgb(20, 20, 20);
      }
    }
  `;
  assertStyle(t, atRulesExpected, atRulesResult.join(''));
});

test('css property value : data types > ","', t => {
  t.plan(3);
  const scopedcss = `
    color: rgb(20, 20, 20);
    :hover {
      color: rgb(20, 20, 20);
    }
    @media screen and (max-width: 992px) {
      color: rgb(20, 20, 20);
      :hover {
        color: rgb(20, 20, 20);
      }
    }
  `;
  const className = 'i1';
  const result = mainRule(scopedcss, className);
  const expected = `
    .i1 {
      color: rgb(20, 20, 20);
    }
  `;
  assertStyle(t, expected, result);
  const pseudoSelectorRulesResult = pseudoSelectorRules(scopedcss, className);
  const pseudoSelectorRulesExpected = `
    .i1:hover {
      color: rgb(20, 20, 20);
    }
  `;
  assertStyle(t, pseudoSelectorRulesExpected, pseudoSelectorRulesResult.join(''));
  const atRulesResult = atRules(scopedcss, className);
  const atRulesExpected = `
    @media screen and (max-width: 992px) {
      .i1 {
        color: rgb(20, 20, 20);
      }
      .i1:hover {
        color: rgb(20, 20, 20);
      }
    }
  `;
  assertStyle(t, atRulesExpected, atRulesResult.join(''));
});

test('css property value : numbers with decimal point', t => {
  t.plan(3);
  const scopedcss = `
    font-size: 1.2rem;
    :hover {
      font-size: 1.2rem;
    }
    @media screen and (max-width: 992px) {
      font-size: 1.2rem;
      :hover {
        font-size: 1.2rem;
      }
    }
  `;
  const className = 'i1';
  const result = mainRule(scopedcss, className);
  const expected = `
    .i1 {
      font-size: 1.2rem;
    }
  `;
  assertStyle(t, expected, result);
  const pseudoSelectorRulesResult = pseudoSelectorRules(scopedcss, className);
  const pseudoSelectorRulesExpected = `
    .i1:hover {
      font-size: 1.2rem;
    }
  `;
  assertStyle(t, pseudoSelectorRulesExpected, pseudoSelectorRulesResult.join(''));
  const atRulesResult = atRules(scopedcss, className);
  const atRulesExpected = `
    @media screen and (max-width: 992px) {
      .i1 {
        font-size: 1.2rem;
      }
      .i1:hover {
        font-size: 1.2rem;
      }
    }
  `;
  assertStyle(t, atRulesExpected, atRulesResult.join(''));
});

test('css property value : negative numbers', t => {
  t.plan(3);
  const scopedcss = `
    top: -12px;
    :hover {
      top: -12px;
    }
    @media screen and (max-width: 992px) {
      top: -12px;
      :hover {
        top: -12px;
      }
    }
  `;
  const className = 'i1';
  const result = mainRule(scopedcss, className);
  const expected = `
    .i1 {
      top: -12px;
    }
  `;
  assertStyle(t, expected, result);
  const pseudoSelectorRulesResult = pseudoSelectorRules(scopedcss, className);
  const pseudoSelectorRulesExpected = `
    .i1:hover {
      top: -12px;
    }
  `;
  assertStyle(t, pseudoSelectorRulesExpected, pseudoSelectorRulesResult.join(''));
  const atRulesResult = atRules(scopedcss, className);
  const atRulesExpected = `
    @media screen and (max-width: 992px) {
      .i1 {
        top: -12px;
      }
      .i1:hover {
        top: -12px;
      }
    }
  `;
  assertStyle(t, atRulesExpected, atRulesResult.join(''));
});

test('css property value : explicitly positive numbers', t => {
  t.plan(3);
  const scopedcss = `
    top: +12px;
    :hover {
      top: +12px;
    }
    @media screen and (max-width: 992px) {
      top: +12px;
      :hover {
        top: +12px;
      }
    }
  `;
  const className = 'i1';
  const result = mainRule(scopedcss, className);
  const expected = `
    .i1 {
      top: +12px;
    }
  `;
  assertStyle(t, expected, result);
  const pseudoSelectorRulesResult = pseudoSelectorRules(scopedcss, className);
  const pseudoSelectorRulesExpected = `
    .i1:hover {
      top: +12px;
    }
  `;
  assertStyle(t, pseudoSelectorRulesExpected, pseudoSelectorRulesResult.join(''));
  const atRulesResult = atRules(scopedcss, className);
  const atRulesExpected = `
    @media screen and (max-width: 992px) {
      .i1 {
        top: +12px;
      }
      .i1:hover {
        top: +12px;
      }
    }
  `;
  assertStyle(t, atRulesExpected, atRulesResult.join(''));
});

test('css property value : special characters in content property', t => {
  const scopedcss = `
    ::before {
      content: "\\25C0";
    }
  `;
  const className = 'i1';
  const result = pseudoSelectorRules(scopedcss, className);
  const expected = `
    .i1::before {
      content: "\\25C0";
    }
  `;
  assertStyle(t, expected, result.join(''));
});
