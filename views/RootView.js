import style from './style.scss';
import { DataSource, ViewBoxModel } from '../models';
import { createElementWithClassName } from '../utils/dom/createElement';
import { createButton } from './createButton';
import { createSVGCanvasView } from './SVGCanvasView';
import { createPositionControlView } from './PositionControlView';
import { createAxisX } from './createAxisX';

export function createRootView(input, renderer, transition, screen, draggable, globalState) {
  const dataSource = new DataSource(input);
  const viewBox = new ViewBoxModel({
    dataSource,
    screen,
    height: 280,
    padding: 10,
    paddingX: 10,
    transition
  });
  const previewViewBox = new ViewBoxModel({
    dataSource,
    screen,
    height: 60,
    offset: 0,
    visible: 100,
    padding: 5,
    paddingX: 20,
    transition
  });

  return createElementWithClassName(style.Root, [
    createElementWithClassName(style.Graph, [
      createSVGCanvasView(dataSource, viewBox, renderer, transition)
    ]),
    createAxisX({
      viewBox,
      renderer,
      transition,
      globalState
    }),
    createElementWithClassName(style.Preview, [
      createSVGCanvasView(dataSource, previewViewBox, renderer),
      createPositionControlView(viewBox, draggable, renderer)
    ]),
    createElementWithClassName(
      style.ButtonsGroup,
      Array.from(dataSource.dataSets.values()).map(dataSet => createButton(dataSet, renderer))
    )
  ]);
}
