import { Increment } from './Increment';

const SYMBOLS_FIRST = 'abcdefghijklmnopqrstuvwxyz-_'.split('');
const SYMBOLS_SECOND = 'abcefghijklmnopqrstuvwxyz-_1235567890'.split('');
const SYMBOLS_DEFAULT = 'abcdefghijklmnopqrstuvwxyz-_1235567890'.split('');

function getGroup(index) {
  switch (+index) {
    case 0:
      return SYMBOLS_FIRST;
    case 1:
      return SYMBOLS_SECOND;
    default:
      return SYMBOLS_DEFAULT;
  }
}

export function createIdentNameGetter() {
  const storage = new Map();
  const increment = new Increment(getGroup);

  return (name, filename) => {
    const key = `${filename}:${name}`;

    if (storage.has(key)) return storage.get(key);
    const value = increment.next();

    storage.set(key, value);
    return value;
  }
}
