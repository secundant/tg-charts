import style from './style.scss';
import { flatten, forEach } from '../utils/fn';
import { nextID, prepend, removeChildren } from '../utils';
import { attributesNS, elNS } from '../utils/dom/createElement';

export function withAxisY(svg, renderer, transition, viewBox) {
  let currentMax = viewBox.prevMax;
  let currentMin = viewBox.prevMin;
  let currentList;
  let currentFactor = 0;
  let prevWidth = viewBox.screen.width;
  let currentID;
  const axisID = nextID('withAxisY');
  const itemHeight = (viewBox.height - 0) / (FREE_LINES_COUNT + 1);
  const animation = new Set();
  const y = (index, value) => {
    const selfOffset = (1 + FREE_LINES_COUNT - index) * itemHeight;

    return selfOffset + value * itemHeight;
  };
  const repaint = () => {
    if (!animation.size) return;
    const value = transition.get(axisID + 'repaint', null);

    forEach(animation, item => {
      const { list, factor, hasInit, isCurrent } = item;

      if (value === null || ((value === 1 || value === 0) && hasInit)) {
        animation.delete(item);
        if (!isCurrent) {
          return removeChildren(svg, flatten(list));
        }
      }
      item.hasInit = true;
      forEach(list, ([text, line], index) => {
        const realValue = value === null ? 0 : value;
        const size = y(index + 1, realValue * factor);
        const style = `opacity:${realValue < 0 ? 1 + realValue : 1 - realValue}`;

        attributesNS(text, {
          y: size - TEXT_OFFSET,
          style
        });
        attributesNS(line, {
          y1: size,
          y2: size,
          style
        });
      });
    });
  };
  const paint = () => {
    if (currentList) {
      animation.add({
        list: currentList,
        factor: currentFactor
      });
    }
    currentID = nextID('axis-x');
    currentList = Array.from({ length: FREE_LINES_COUNT }).map((_, index) => {
      const cleanMax = currentMax - currentMin - (currentMax % 10);
      const item = createLine(
        prevWidth,
        y(index, currentFactor),
        Math.round(cleanMax / ((FREE_LINES_COUNT - index) / FREE_LINES_COUNT))
      );

      prepend(svg, ...item);
      return item;
    });
    animation.add({
      list: currentList,
      factor: currentFactor,
      isCurrent: true
    });
    transition.set(axisID + 'repaint', 0, 1);
  };
  const update = () => {
    const { prevMin, prevMax } = viewBox;

    if (prevMax === currentMax) return;
    currentFactor = prevMax > currentMax ? -1 : 1;
    currentMax = prevMax;
    currentMin = prevMin;
    renderer(axisID, paint);
  };

  transition.subscribe(axisID + 'repaint', repaint);
  viewBox.subscribe(update);
  prepend(svg, ...createLine(prevWidth, y(0, 0), 0));
  paint();
}

const createLine = (x, y, text) => {
  const textElement = elNS(['http://www.w3.org/2000/svg', 'text'], {
    y: y - TEXT_OFFSET,
    x: 10,
    class: style.AxisYText
  });

  textElement.textContent = text;
  return [
    textElement,
    elNS(['http://www.w3.org/2000/svg', 'line'], {
      y1: y,
      y2: y,
      x1: 10,
      x2: x,
      class: style.AxisYLine
    })
  ];
};
const FREE_LINES_COUNT = 5;
const TEXT_OFFSET = 6;
