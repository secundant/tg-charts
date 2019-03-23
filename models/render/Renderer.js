import { forEach } from '../../utils/fn';

export function createRenderer() {
  const actions = new Map();
  const run = () => {
    requestAnimationFrame(run);
    const prevActions = new Map(actions);

    actions.clear();
    forEach(prevActions, exec);
  };

  run();
  return (type, fn) => {
    Object.defineProperty(fn, 'name', {
      value: `renderer__${type}`
    });
    actions.set(type, fn);
  };
}

const exec = fn => fn();
