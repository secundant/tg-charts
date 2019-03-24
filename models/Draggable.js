import { listen, subscribeToEvents } from '../utils/dom';
import { profile, profileEnd } from '../utils/profiler';

export function createDraggable() {
  let diff;
  let pageX;
  let lastPageX;
  let currentElement;
  let currentObserver;

  const end = event => {
    if (!currentElement) return;
    if (event.type === 'touchend' && event.touches.length > 0) {
      return;
    }
    currentObserver('end');
    lastPageX = null;
    currentElement = null;
    pageX = null;
    diff = null;
  };
  const change = event => {
    if (!currentElement) return;
    profile('Draggable.change');
    const nextPageX = getPageX(event);
    const relativeDiff = nextPageX - lastPageX;

    lastPageX = nextPageX;
    diff = nextPageX - pageX;
    currentObserver('change', diff, relativeDiff);
    profileEnd('Draggable.change');
  };

  subscribeToEvents(document, {
    'mouseup touchend resize blur': end,
    'mousemove touchmove': change
  });
  return (element, observer) => {
    listen(element, ['mousedown', 'touchstart'], event => {
      if (currentElement) return;
      event.stopImmediatePropagation();
      event.preventDefault();
      diff = 0;
      pageX = getPageX(event);
      lastPageX = pageX;
      currentElement = element;
      currentObserver = observer;
      observer('start');
    });
  }
}

export const getPageX = event => {
  switch (event.type) {
    case 'touchstart':
    case 'touchmove':
      return event.touches[0].pageX;
    case 'mousedown':
    case 'mousemove':
      return event.pageX;
  }
};
