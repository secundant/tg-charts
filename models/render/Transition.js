import { forEach } from '../../utils/fn';
import { profile, profileEnd } from '../../utils/profiler';

const TIME = 175;

export function createTransition(renderer) {
  let now = Date.now();

  const items = new Map();
  const cache = new Map();
  const observers = new Map();
  const register = () => renderer('transition', tick);
  const tick = () => {
    now = Date.now();
    profile('Transition.tick');
    for (const [name, item] of items) {
      profile('Transition.tick.' + name);
      const value = item[0] + item[1] * getCurrentValue(item[2], now);
      const observersList = observers.get(name);

      cache.set(name, value);
      if (item[0] + item[1] === value) items.delete(name);
      if (observersList) forEach(observersList, observer => observer(value));
      profileEnd('Transition.tick.' + name);
    }
    profileEnd('Transition.tick');
    Promise.resolve().then(register);
  };

  tick();
  return {
    get(name, fallback) {
      if (!items.has(name)) return fallback;
      return cache.get(name) || items.get(name)[0];
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

const getCurrentValue = (startedAt, now) => {
  const current = now - startedAt;
  let value = (current > TIME ? TIME : current) / TIME - 1;

  return value ** 3 + 1;
};
