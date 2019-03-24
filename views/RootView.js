import style from './style.scss';
import { DataSource, ViewBoxModel } from '../models';
import { createElementWithClassName } from '../utils/dom/createElement';
import { createButton } from './createButton';
import { createSVGCanvasView } from './SVGCanvasView';
import { createPositionControlView } from './PositionControlView';
import { createTooltip } from './createTooltip';
import { appendChildren } from '../utils/dom';

export function createRootView(input, renderer, transition, screen, draggable, title) {
  const dataSource = new DataSource(input);
  const viewBox = new ViewBoxModel({
    dataSource,
    screen,
    height: 280,
    paddingBottom: 25,
    paddingY: 10,
    paddingX: 10,
    transition,
    renderer
  });
  const previewViewBox = new ViewBoxModel({
    dataSource,
    screen,
    height: 60,
    offset: 0,
    visible: 100,
    paddingBottom: 0,
    paddingY: 5,
    paddingX: 20,
    transition,
    renderer
  });
  const svg = createSVGCanvasView(dataSource, viewBox, renderer, transition);
  const titleElement = createElementWithClassName(style.Title, [], 'h1');
  const headerElement = createElementWithClassName(style.Heading, [titleElement]);

  titleElement.textContent = title;
  const fragment = document.createDocumentFragment();

  appendChildren(fragment, [
    headerElement,
    createElementWithClassName(style.Root, [
      createElementWithClassName(style.Graph, [
        svg,
        createTooltip(svg, viewBox, renderer)
      ]),
      createElementWithClassName(style.Preview, [
        createSVGCanvasView(dataSource, previewViewBox, renderer),
        createPositionControlView(viewBox, draggable, renderer)
      ]),
      createElementWithClassName(
        style.ButtonsGroup,
        Array.from(dataSource.dataSets.values()).map(dataSet => createButton(dataSet, renderer))
      )
    ])
  ]);
  return fragment;
}
