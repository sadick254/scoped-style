import generateAlphabeticName from './generateAlphabeticName';
import { hash } from './hash';

export default str => {
  return generateAlphabeticName(hash(str) >>> 0);
};
