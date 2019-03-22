import style from './style.scss';
import { LineModel } from '../models/LineModel';
import { createLineView } from './LineView';
import { attributesNS, elNS } from '../utils/dom/createElement';
import { appendChild, nextID, setClassName } from '../utils';

/**
 * @param {DataSource} dataSource
 * @param {ViewBoxModel} viewBoxModel
 * @param {Renderer} renderer
 * @param {number} [strokeWidth=2]
 */
export function createSVGCanvasView(dataSource, viewBoxModel, renderer, strokeWidth = 2) {
  let width = null;
  let viewBox = null;

  const id = nextID();
  const svg = elNS(['http://www.w3.org/2000/svg', 'svg'], {
    version: '1.1',
    baseProfile: 'full',
    width: viewBoxModel.screen.width,
    height: viewBoxModel.height,
    preserveAspectRatio: 'none',
    class: style.SVG
  });
  const lineViews = new Map();
  const paint = () => {
    attributesNS(svg, {
      width,
      viewBox
    });
  };
  const update = () => {
    if (viewBoxModel.screen.width === width) return;
    width = viewBoxModel.screen.width;
    viewBox = `0 0 ${width} ${height}`;
    renderer.set(id, paint);
  };
  const handleDisabledChange = () => {
    const dataSet = dataSource.last;
    const lineView = lineViews.get(dataSet.name);

    setClassName(lineView, style.hidden, dataSet.disabled);
  };

  dataSource.dataSets.forEach(dataSet => {
    const line = new LineModel({
      viewBox: viewBoxModel,
      dataSet
    });
    const lineView = createLineView(line, renderer, strokeWidth);

    appendChild(svg, lineView);
    lineViews.set(dataSet.name, lineView);
  });
  dataSource.subscribe(handleDisabledChange);
  viewBoxModel.subscribe(update);
  update();

  return svg;
}
