export class Model {
  /**
   * @param {Model[]?} dependencies
   */
  constructor(dependencies = []) {
    const send = observer => observer();
    const next = () => {
      this.update();
      this.observers.forEach(send);
    };

    this.observers = new Set();
    this.next = next;
    dependencies.forEach(dependency => dependency.subscribe(next));
  }

  update() {
  }

  subscribe(observer) {
    this.observers.add(observer);
  }
}
