import test from 'ava';
import { mainRule } from './utils';

function assertStyle(t, expected, result) {
  t.is(expected.replace(/[\r\n\s]/gm, ''), result.replace(/[\r\n\s]/gm, ''));
}

test('main rules only', t => {
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