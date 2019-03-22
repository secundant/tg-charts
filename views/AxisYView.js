import { nextID } from '../utils';
import styles from './style.scss';
import { createElementWithClassName } from '../utils/dom/createElement';
import { appendChildren } from '../utils/dom/append';

/**
 * @param {Transition} transition
 * @param {Renderer} renderer
 * @param {ViewBoxModel} viewBox
 * @param {HTMLElement} element
 */
export function createAxisY({ transition, renderer, viewBox, element }) {
  const id = nextID();
  let currentMax = 0;
  let currentMin = 0;
  let prev;

  const render = shouldDown => {
    const className = shouldDown ? styles.down : styles.up;
    const nextElements = createAxisList(currentMax, currentMin, prev ? className : null);

    console.log('RENDER NEXT');
    appendChildren(element, nextElements);
    if (prev) {
      renderer.set(id, () => {
        setTimeout(() => {
          nextElements.forEach(el => el.classList.remove(className))
        }, 0);
      });
      const prevRef = prev;

      prev.forEach(el => el.classList.add(shouldDown ? styles.up : styles.down));
      setTimeout(() => {
        prevRef.forEach(el => element.removeChild(el));
      }, 175);
    }
    prev = nextElements;
  };
  viewBox.subscribe(() => {
    const { prevMax, prevMin } = viewBox;

    if (prevMax === currentMax && prevMin === currentMin) return;
    const shouldDown = prevMax > currentMax || prevMin > currentMin;

    currentMin = prevMin;
    currentMax = prevMax;
    render(shouldDown);
  });
  appendChildren(element, [createAxisElement(0, 0)]);
  render();
}

const createAxisList = (max, min, className) => {
  const length = (max - min + '').length - 1;
  const cleanValue = 10;
  const cleanMax = max - min - (max % cleanValue);

  return elementsBaseArray.map((_, index) =>
    createAxisElement(Math.round(cleanMax / ((5 - index) / 5)), index + 1, className)
  );
};
const elementsBaseArray = new Array(5).fill(0);
const createAxisElement = (textContent, top, className) => {
  const element = createElementWithClassName(`${styles.AxisY}${className ? ' ' + className : ''}`);

  element.style = `bottom:${90 * (top / 5)}%`;
  element.textContent = textContent;
  return element;
};
