import { forEach } from '../../utils/fn';

const TIME = 175;

export function createTransition(renderer) {
  const items = new Map();
  const observers = new Map();
  const register = () => renderer('transition', tick);
  const tick = () => {
    forEach(items, (item, name) => {
      const value = calc(name, item);

      if (observers.has(name)) {
        forEach(observers.get(name), observer => observer(value));
      }
    });
    Promise.resolve().then(register);
  };
  const calc = (name, item = items.get(name)) => {
    const value = getCurrentValue(item);

    if (item[1] === value) items.delete(name);
    return value;
  };

  tick();
  return {
    calc,
    get(name, fallback) {
      if (!items.has(name)) return fallback;
      return calc(name);
    },
    set(name, from, to) {
      items.set(name, [from, to - from, Date.now()]);
    },
    subscribe(name, observer) {
      if (!observers.has(name)) {
        observers.set(name, new Set([observer]));
      } else {
        observers.get(name).add(observer);
      }
    }
  };
}

const getCurrentValue = ([from, diff, startedAt]) => from + (diff * Math.min(TIME, Date.now() - startedAt)) / TIME;
