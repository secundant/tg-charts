import { createElementWithClassName } from '../utils/dom/createElement';
import style from './style.scss';
import { addListener, appendChildren, forEach, nextID } from '../utils';

const STATUS_IDLE = 'IDLE';
const STATUS_ACTIVE = 'ACTIVE';

export function createAxisY({ renderer, transition, viewBox }) {
  let currentId;
  let currentMax = viewBox.prevMax;
  let currentMin = viewBox.prevMin;
  let currentList;
  let currentTranslate;

  const id = nextID('axis-y');
  const container = createElementWithClassName(style.AxisYContainer, [
    createAxisYElement(0, 0, 0, 1)
  ]);
  const drop = (list, translate) => {
    console.log('DROP:', list);
    for (const element of list) {
      if (element.__status === STATUS_IDLE) {
        container.removeChild(element);
        continue;
      }
      element.style.opacity = 0;
      element.style.transform = getTransform(translate);
      element.__status = STATUS_ACTIVE;
      addListener(element, 'transitionend', () => {
        console.log('END', element.__id);
        renderer(id + '_' + element.__id, () => {
          console.log('REMOVE', element.__id);
          container.removeChild(element);
        });
      });
    }
  };
  const move = list => {
    console.log('MOVE:', list);
    if (list !== currentList) {
      forEach(list, element => container.removeChild(element));
      return;
    }
    renderer(id + '_' + currentId, () => {
      for (const element of list) {
        element.style.opacity = 1;
        element.style.transform = getTransform(0);
        element.__status = STATUS_ACTIVE;
      }
    });
  };
  const paint = () => {
    if (currentList) {
      drop(currentList, currentTranslate * -1);
      currentList = null;
    }
    currentList = createAxisYList(currentMin, currentMax, currentTranslate);
    appendChildren(container, currentList);
    console.log('ADD:', currentList);
    renderer(id + '-move-' + currentId, move.bind(null, currentList))
  };
  viewBox.subscribe(() => {
    const { prevMax, prevMin } = viewBox;

    if (prevMax === currentMax) return;
    currentTranslate = prevMax > currentMax ? -100 : 100;
    currentMin = prevMin;
    currentMax = prevMax;
    currentId = prevMin + '-' + prevMax;
    renderer(id, paint);
  });
  paint();
  return container;
}

const createAxisYList = (max, min, translate) => {
  const cleanMax = max - min - (max % 10);

  return elementsBaseArray.map((_, index) =>
    createAxisYElement(Math.round(cleanMax / ((5 - index) / 5)), index + 1, translate)
  );
};
const elementsBaseArray = new Array(5).fill(0);
const createAxisYElement = (textContent, top, translate, opacity = 0) => {
  const element = createElementWithClassName(style.AxisY);

  element.style = `bottom:${90 * (top / 5)}%;opacity:${opacity};transform:${getTransform(translate)}`;
  element.textContent = textContent;
  element.__status = STATUS_IDLE;
  element.__id = nextID();
  return element;
};
const getTransform = translate => `translateY(${translate}%)`;
