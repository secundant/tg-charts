import style from './style.scss';
import { elNS, setAttributeNS } from '../utils/dom/createElement';
import { createArray, forEach } from '../utils/fn';
import { appendChild } from '../utils/dom';
import { withProfile } from '../utils/profiler';
import { nextID } from '../utils';

/**
 * @param svg
 * @param {ViewBoxModel} viewBox
 * @param renderer
 * @param transition
 */
export function withAxisX(svg, renderer, transition, viewBox) {
  let prevFirst;
  let prevLast;
  let prevWidth;
  let prevVisible;
  let currentIndexes;
  let multiplicity;
  let maxVisibleCount;
  let visibleCount;
  let elementsState = new Map();

  const id = nextID(`withAxisX`);
  const group = elNS('g');
  const element = viewBox.dataSource.legend.map(({ label }) => {
    const textElement = elNS('text', {
      y: viewBox.innerHeight + viewBox.paddingY + 30,
      'text-anchor': 'middle',
      class: style.SVGText
    });

    textElement.style.opacity = 0;
    textElement.textContent = label;
    appendChild(group, textElement);
    return textElement;
  });

  const getNextMultiplicity = count => {
    return Math.max(Math.floor(count / (maxVisibleCount - 1)), 1);
  };
  const getNextVisibleCount = (count, nextMultiplicity) =>
    Math.min(maxVisibleCount, Math.floor(count / nextMultiplicity));
  const getNextIndexes = (last, first, fromLast) => {
    const offset = last - first - multiplicity * visibleCount;

    if (fromLast) {
      return createArray(visibleCount - 1).map((_, i) => last - ((visibleCount - 1 - i) * multiplicity)).concat(last);
    }
    return [first].concat(createArray(visibleCount - 1).map((_, i) => first + ((i + 1) * multiplicity)));
  };

  const paintFull = () => {
    if (currentIndexes) {
      forEach(currentIndexes, index => (element[index].style.opacity = 0));
    }
    prevLast = viewBox.lastIndex;
    prevFirst = viewBox.firstIndex;
    prevWidth = viewBox.screen.width;
    prevVisible = viewBox.visible;
    maxVisibleCount = Math.floor((prevWidth - viewBox.paddingX * 2) / (ELEMENT_SIZE + ELEMENT_MARGIN));
    multiplicity = getNextMultiplicity(prevLast - prevFirst);
    visibleCount = getNextVisibleCount(prevLast - prevFirst, multiplicity);
    currentIndexes = getNextIndexes(prevLast, prevFirst);
    const offsetValue =
      (prevWidth - viewBox.paddingX - ELEMENT_MARGIN - currentIndexes.length * ELEMENT_SIZE) /
      (currentIndexes.length - 1);

    forEach(currentIndexes, (index, i) => {
      element[index].style.opacity = 1;
      setAttributeNS(
        element[index],
        'x',
        viewBox.paddingX + ELEMENT_MARGIN * 2 + i * (ELEMENT_SIZE + offsetValue)
      );
    });
  };

  const paintSkew = () => {
  };
  const paintTranslate = () => {
  };

  const updateSkew = withProfile('withAxisX.updateSkew', (first, last) => {
    paintFull();
    const nextMultiplicity = getNextMultiplicity(last - first);

    if (nextMultiplicity === multiplicity) {
      return;
    }
    const nextVisibleCount = getNextVisibleCount(last - first, nextMultiplicity);

    multiplicity = nextMultiplicity;
    visibleCount = nextVisibleCount;
    getNextIndexes(last, first);
  });

  paintFull();
  viewBox.subscribe(() => {
    if (viewBox.screen.width !== prevWidth) return renderer(id + '-full', paintFull);
    if (viewBox.firstIndex === prevFirst && viewBox.lastIndex === prevLast) return;
    if (prevVisible !== viewBox.visible) {
      updateSkew(viewBox.firstIndex, viewBox.lastIndex);
    }
    prevLast = viewBox.lastIndex;
    prevFirst = viewBox.firstIndex;
  });
  appendChild(svg, group);
}

const ELEMENT_SIZE = 45;
const ELEMENT_MARGIN = 15;
