import { Events } from './Events';
import { subscribeToEvents } from '../utils/dom';

export class Draggable extends Events {
  change = event => {
    if (!this.element) return;
    const nextPageX = getPageX(event);
    const lastDiff = nextPageX - this.lastPageX;

    this.lastPageX = nextPageX;
    this.diff = nextPageX - this.pageX;
    this.emit('change', this.element, this.diff, lastDiff);
    this.elementObservers.get(this.element)('change', this.diff, lastDiff);
  };
  end = event => {
    if (!this.element) return;
    if (event.type === 'touchend' && event.targetTouches.length > 0) {
      return;
    }
    this.emit('end', this.element);
    this.elementObservers.get(this.element)('end');
    this.reset();
  };

  constructor() {
    super();
    subscribeToEvents(document, {
      resize: this.end,
      blur: this.end,
      touchmove: this.change,
      mousemove: this.change,
      touchend: this.end,
      mouseup: this.end
    });
    this.elementObservers = new WeakMap();
    this.reset();
  }

  subscribe(element, observer) {
    const handleStart = this.createStart(element);

    this.elementObservers.set(element, observer);
    subscribeToEvents(element, {
      mousedown: handleStart,
      touchstart: handleStart
    });
  }

  createStart(element) {
    return event => {
      if (this.initial) return;
      event.stopImmediatePropagation();
      this.element = element;
      this.pageX = getPageX(event);
      this.lastPageX = this.pageX;
      this.diff = 0;
      this.emit('start', element);
      this.elementObservers.get(this.element)('start');
    };
  }

  reset() {
    this.element = null;
    this.pageX = null;
    this.diff = null;
  }
}

const getPageX = event => {
  switch (event.type) {
    case 'touchstart':
    case 'touchmove':
      return event.targetTouches[0].pageX;
    case 'mousedown':
    case 'mousemove':
      return event.pageX;
    default:
      console.error('Wrong event:', event);
      throw new Error(`Event type "${event.type}" is not supported.`);
  }
};
