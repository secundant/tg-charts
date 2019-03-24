import { profile, profileEnd } from '../../utils/profiler';

export function createRenderer() {
  const actions = new Map();
  const run = () => {
    profile('Renderer');
    requestAnimationFrame(run);
    profile('Renderer.copy');
    const prevActions = new Map(actions);

    actions.clear();
    profileEnd('Renderer.copy');
    for (const [name, fn] of prevActions) {
      profile('Renderer.' + name);
      fn();
      profileEnd('Renderer.' + name);
    }
    profileEnd('Renderer');
  };

  run();
  return (type, fn) => actions.set(type, fn)
}

const exec = fn => fn();
