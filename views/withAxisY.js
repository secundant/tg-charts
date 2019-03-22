import style from './style.scss';
import { addClassName, forEach, nextID, removeClassName } from '../utils';
import { createElementWithClassName } from '../utils/dom/createElement';
import { appendChildren } from '../utils/dom/append';

const getDirectionClassName = down => down ? style.down : style.up;

export function withAxisY(element, { transition, renderer, viewBox }) {
  const id = nextID();
  let currentMax = 0;
  let currentMin = 0;
  let prev;

  const render = shouldDown => {
    const className = getDirectionClassName(shouldDown);
    const nextElements = createAxisList(currentMax, currentMin, prev ? className : null);

    appendChildren(element, nextElements);
    if (prev) {
      renderer(id, () => setTimeout(() => {
        forEach(nextElements, el => removeClassName(el, className))
      }, 0));
      const prevRef = prev;
      const classNameToAdd = getDirectionClassName(!shouldDown);

      forEach(prev, el => addClassName(el, classNameToAdd));
      setTimeout(() => {
        forEach(prevRef, el => element.removeChild(el));
      }, 175);
    }
    prev = nextElements;
  };
  viewBox.subscribe(() => {
    const { prevMax, prevMin } = viewBox;

    if (prevMax === currentMax) return;
    const shouldDown = prevMax > currentMax;

    currentMin = prevMin;
    currentMax = prevMax;
    render(shouldDown);
  });
  appendChildren(element, [createAxisElement(0, 0)]);
  render();
  return element;
}

const createAxisList = (max, min, className) => {
  const cleanMax = max - min - (max % 10);

  return elementsBaseArray.map((_, index) =>
    createAxisElement(Math.round(cleanMax / ((5 - index) / 5)), index + 1, className)
  );
};
const elementsBaseArray = new Array(5).fill(0);
const createAxisElement = (textContent, top, className) => {
  const element = createElementWithClassName(`${style.AxisY}${className ? ' ' + className : ''}`);

  element.style = `bottom:${90 * (top / 5)}%`;
  element.textContent = textContent;
  return element;
};
