import { listen, subscribeToEvents, toggleWithAppend, toggleWithPrepend } from '../utils/dom';
import style from './style.scss';
import { attributesNS, createElementWithClassName, elNS } from '../utils/dom/createElement';
import { arrayFrom, forEach } from '../utils/fn';
import { nextID } from '../utils';
import { getPageX } from '../models';
import { withProfile } from '../utils/profiler';

export function createTooltip(svg, viewBox, renderer) {
  let currentIndex;
  let isCurrentlyVisible = false;
  let prevVisibility;

  const id = nextID();
  const lineElement = elNS('line', {
    class: style.SVGLine,
    y1: 10,
    y2: viewBox.height - 50
  });
  const groups = new Map(
    arrayFrom(viewBox.dataSource.dataSets.values()).map(({ title, name, color }) => {
      const titleElement = createElementWithClassName(style.TooltipName);
      const valueElement = createElementWithClassName(style.TooltipValue);
      const groupElement = createElementWithClassName(style.TooltipValueGroup, [valueElement, titleElement], 'div', {
        style: `color:${color}`
      });
      const circle = elNS('circle', {
        class: style.SVGCircle,
        r: 4,
        'stroke-width': 2,
        stroke: color
      });

      titleElement.textContent = title;
      return [
        name,
        {
          valueElement,
          groupElement,
          circle
        }
      ];
    })
  );
  const titleElement = createElementWithClassName(style.TooltipTitle);
  const element = createElementWithClassName(style.Tooltip, [
    titleElement,
    createElementWithClassName(style.TooltipContent, arrayFrom(groups.values()).map(({ groupElement }) => groupElement))
  ], 'div', {
    style: 'display:none'
  });
  const applyVisibility = ({ circle, groupElement }, name) => {
    const hidden = !isCurrentlyVisible || viewBox.dataSource.dataSets.get(name).disabled;

    toggleWithAppend(svg, circle, !hidden);
    groupElement.style.display = hidden ? 'none' : 'block';
  };
  const paintVisibility = withProfile('Tooltip.paintVisibility', () => {
    element.style.display = isCurrentlyVisible ? 'block' : 'none';
    toggleWithPrepend(svg, lineElement, isCurrentlyVisible);
    forEach(groups, applyVisibility);
  });
  const paintPosition = withProfile('Tooltip.paintPosition', () => {
    if (!isCurrentlyVisible) return;
    const { width } = element.getBoundingClientRect();
    const index = viewBox.firstIndex + currentIndex;
    const left = Math.floor(
      Math.max(
        10,
        Math.min(
          viewBox.screen.width - width - 10,
          currentIndex * viewBox.space - (Math.max(width, 60) / 2) - 10
        )
      )
    ) + 'px';

    titleElement.textContent = viewBox.dataSource.legend[index].label;
    element.style.left = left;
    const positionX = viewBox.x(index) || 0;

    attributesNS(lineElement, {
      x1: positionX,
      x2: positionX
    });
    forEach(groups, ({ circle, valueElement }, name) => {
      const dataSet = viewBox.dataSource.dataSets.get(name);

      if (dataSet.disabled) return;
      valueElement.textContent = dataSet.data[index];
      attributesNS(circle, {
        cx: positionX,
        cy: viewBox.y(dataSet.data[index])
      });
    });
  });
  const reset = () => {
    if (!isCurrentlyVisible) return;
    isCurrentlyVisible = false;
    renderer(id + '-visibility', paintVisibility);
  };

  listen(document, ['resize blur'], reset);
  subscribeToEvents(svg, {
    'mouseenter touchstart mousemove touchmove': withProfile('Tooltip.handleMove', event => {
      const pageX = getPageX(event);
      const visible = viewBox.lastIndex - viewBox.firstIndex;

      currentIndex = Math.floor(visible * (pageX / (viewBox.screen.width - 10)));
      if (event.type === 'touchstart') {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
      if (!isCurrentlyVisible) {
        isCurrentlyVisible = true;
        renderer(id + '-visibility', paintVisibility);
      }
      renderer(id, paintPosition);
    }),
    'mouseleave touchend': reset
  });
  return element;
}
