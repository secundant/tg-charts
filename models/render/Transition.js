const TIME = 125;

export class Transition {
  constructor() {
    this.items = new Map();
    this.observers = new Map();
    const tick = () => {
      this.items.forEach((item, name) => {
        const value = this.calc(name, item);

        if (this.observers.has(name)) {
          this.observers.get(name).forEach(observer => observer(value));
        }
      });
      requestAnimationFrame(tick);
    };

    tick();
  }

  subscribe(name, observer) {
    if (!this.observers.has(name)) {
      this.observers.set(name, new Set([observer]));
    } else {
      this.observers.get(name).add(observer);
    }
  }

  calc(name, item = this.items.get(name)) {
    const value = getCurrentValue(item);

    if (item[1] === value) this.items.delete(name);
    return value;
  }

  get(name, fallback) {
    if (!this.items.has(name)) return fallback;
    return this.calc(name);
  }

  /**
   * @param {string} name
   * @param {number} from
   * @param {number} to
   */
  set(name, from, to) {
    this.items.set(name, [from, to - from, Date.now()]);
  }
}

const getCurrentValue = ([from, diff, startedAt]) => from + (diff * Math.min(TIME, Date.now() - startedAt)) / TIME;
