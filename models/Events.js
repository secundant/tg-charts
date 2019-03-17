export class Events {
  constructor() {
    this.listeners = new Map();
  }

  on(type, listener) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set([listener]));
      return;
    }
    this.listeners.get(type).add(listener);
  }

  off(type, listener) {
    if (!this.listeners.has(type)) return;
    const listeners = this.listeners.get(type);

    if (listeners.delete(listener) && listeners.size === 0) {
      this.listeners.delete(type);
    }
  }

  emit(type, ...args) {
    if (!this.listeners.has(type)) return;
    this.listeners.get(type).forEach(listener => listener(...args));
  }
}
