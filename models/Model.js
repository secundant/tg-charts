export class Model {
  /**
   * @param {Model[]} dependencies
   */
  constructor(dependencies = []) {
    this.change = this.change.bind(this);
    this.observers = new Set();
    for (const dependency of dependencies) {
      dependency.subscribe(this.change);
    }
    this.value = this.update();
  }

  change() {
    this.value = this.update();
    this.observers.forEach(observer => observer(this.value));
  }

  update() {
  }

  subscribe(observer) {
    this.observers.add(observer);
  }
}
