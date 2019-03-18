export class Renderer {
  constructor() {
    this.actions = new Map();
    const run = () => {
      this.actions.forEach(exec);
      this.actions.clear();
      requestAnimationFrame(run);
    };

    run();
  }

  set(type, fn) {
    this.actions.set(type, fn);
  }
}

const exec = fn => fn();
