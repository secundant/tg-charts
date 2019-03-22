import { forEach } from '../../utils/fn';

export function createRenderer() {
  const actions = new Map();
  const run = () => {
    forEach(actions, exec);
    actions.clear();
    requestAnimationFrame(run);
  };

  run();
  return (type, fn) => actions.set(type, fn);
}

const exec = fn => fn();
