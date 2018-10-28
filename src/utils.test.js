import test from 'ava';
import { mainRule, pseudoSelectorRules, atRules, globalRules } from './utils';

function assertStyle(t, expected, result) {
  t.is(expected.replace(/[\r\n\s]/gm, ''), result.replace(/[\r\n\s]/gm, ''));
}

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
  const result = mainRule(scopedcss, className);
  const expected = `
    .i1 {
      width: 100%;
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