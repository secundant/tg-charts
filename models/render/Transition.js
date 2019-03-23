import { forEach } from '../../utils/fn';
import { profile, profileEnd } from '../../utils/profiler';

const TIME = 175;

export function createTransition(renderer) {
  let now = Date.now();

  const items = new Map();
  const observers = new Map();
  const register = () => renderer('transition', tick);
  const tick = () => {
    now = Date.now();
    profile('Transition.tick');
    forEach(items, (item, name) => {
      profile('Transition.tick.' + name);
      const value = calc(name, item);

      if (observers.has(name)) {
        forEach(observers.get(name), observer => observer(value));
      }
      profileEnd('Transition.tick.' + name);
    });
    profileEnd('Transition.tick');
    Promise.resolve().then(register);
  };
  const calc = (name, item = items.get(name)) => {
    profile('Transition.calc');
    const value = getCurrentValue(item, now);

    if (item[0] + item[1] === value) items.delete(name);
    profileEnd('Transition.calc');
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
      items.set(name, [from, to - from, now]);
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

const getCurrentValue = ([from, diff, startedAt], now) => from + (diff * Math.min(TIME, now - startedAt)) / TIME;
