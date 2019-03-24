export function createModelFactory() {

}

export function createModel(dependencies, update) {
  let value = update();
  const observers = new Set();
  const send = observer => observer();
  const emit = () => observers.forEach(send);
  const next = () => {
    update();
    emit();
  };

  dependencies.forEach(dependency => dependency.subscribe(next));
  return {
    next,
    emit,
    subscribe(observer) {
      observers.add(observer);
    }
  };
}
