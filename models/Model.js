export class Model {
  /**
   * @param {Model[]?} dependencies
   */
  constructor(dependencies = []) {
    const send = observer => observer();
    const emit = () => this.observers.forEach(send);
    const next = () => {
      this.update();
      emit();
    };

    this.observers = new Set();
    this.next = next;
    this.emit = emit;
    dependencies.forEach(dependency => dependency.subscribe(next));
  }

  update() {
  }

  subscribe(observer) {
    this.observers.add(observer);
  }
}
