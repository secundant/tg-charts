import style from './style.scss';
import { flatten, forEach, memoize } from '../utils/fn';
import { nextID, prepend, removeChildren } from '../utils';
import { elNS } from '../utils/dom/createElement';
import { profile, profileEnd, withProfile } from '../utils/profiler';

export function withAxisY(svg, renderer, transition, viewBox) {
  let currentMax = viewBox.prevMax;
  let currentMin = viewBox.prevMin;
  let currentList;
  let previouslist;
  let currentFactor = 0;
  let prevWidth = viewBox.screen.width;
  let currentID;
  const axisID = nextID('withAxisY');
  const itemHeight = (viewBox.height - viewBox.paddingBottom) / (FREE_LINES_COUNT + 1);
  const animation = new Set();
  const getY = memoize(index => (FREE_LINES_COUNT - index) * itemHeight);

  const repaint = withProfile('withAxisY.repaint', () => {
    if (!animation.size) return;
    let value = transition.get(axisID + 'repaint', null);

    forEach(animation, withProfile('withAxisY.animate', item => {
      const { list, factor, hasInit, isCurrent } = item;

      if (value === null || (value === 1 && hasInit)) {
        animation.delete(item);
        value = 1;
        if (!isCurrent) {
          return removeChildren(svg, list);
        }
      }
      profile('withAxisY.setTransform');
      setTransform(list, factor * itemHeight * (isCurrent ? 1 - value : Math.min(value * 1.2, 1)), isCurrent ? value : 1 - (value * 2));
      profileEnd('withAxisY.setTransform');
      item.hasInit = true;
    }));
  });
  const paint = withProfile('withAxisY.paint', () => {
    if (currentList) {
      if (animation.size < 2) {
        animation.add({
          list: currentList,
          factor: currentFactor * -1
        });
      } else {
        removeChildren(svg, currentList);
      }
    }
    const fragment = document.createDocumentFragment();

    currentID = nextID('axis-x');
    profile('withAxisY.createNextLines');
    currentList = flatten(
      Array.from({ length: FREE_LINES_COUNT }).map((_, index) => {
        const cleanMax = currentMax - currentMin - (currentMax % 10);
        const item = createLine(
          prevWidth,
          getY(index),
          Math.round(cleanMax / ((FREE_LINES_COUNT - index) / FREE_LINES_COUNT))
        );

        setTransform(item, currentFactor * itemHeight, 0);
        prepend(fragment, ...item);
        return item;
      })
    );
    profileEnd('withAxisY.createNextLines');
    animation.add({
      list: currentList,
      factor: currentFactor,
      isCurrent: true
    });
    transition.set(axisID + 'repaint', 0, 1);
    prepend(svg, fragment);
  });
  const update = () => {
    const { prevMin, prevMax, screen } = viewBox;

    if (prevWidth !== screen) prevWidth = screen.width;
    if (prevMax === currentMax) return;
    currentFactor = prevMax > currentMax ? -1 : 1;
    currentMax = prevMax;
    currentMin = prevMin;
    renderer(axisID, paint);
  };

  transition.subscribe(axisID + 'repaint', repaint);
  viewBox.subscribe(update);
  prepend(svg, ...createLine(prevWidth, getY(-1), 0));
  paint();
}

const setTransform = (elements, value, opacity) =>
  forEach(elements, element => {
    element.style.transform = `translateY(${value}px)`;
    element.style.opacity = opacity;
  });
const createLine = (x, y, text) => {
  const textElement = elNS('text', {
    y: y - TEXT_OFFSET,
    x: 10,
    class: style.SVGText
  });

  textElement.textContent = text;
  return [
    textElement,
    elNS('line', {
      y1: y,
      y2: y,
      x1: 10,
      x2: x - 10,
      class: style.SVGLine,
      'stroke-width': 1
    })
  ];
};
const FREE_LINES_COUNT = 5;
const TEXT_OFFSET = 6;
