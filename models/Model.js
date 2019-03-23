import { profile, profileEnd, withProfile } from '../utils/profiler';

export class Model {
  /**
   * @param {Model[]?} dependencies
   */
  constructor(dependencies = []) {
    const emit = () => {
      profile(`Model(${this.constructor.name}).emit (${this.observers.size} observers)`);
      this.observers.forEach(send);
      profileEnd(`Model(${this.constructor.name}).emit (${this.observers.size} observers)`);
    };
    const next = withProfile(`Model(${this.constructor.name}).next`, () => {
      this.update();
      this.emit();
    });

    this.observers = new Set();
    this.next = next;
    this.emit = emit;
    this.update = withProfile(`Model(${this.constructor.name}).update`, this.update.bind(this));
    dependencies.forEach(dependency => dependency.subscribe(next));
  }

  update() {
  }

  subscribe(observer) {
    this.observers.add(observer);
  }
}

const send = observer => observer();
