import style from './style.scss';
import { elNS } from '../utils/dom/createElement';
import { nextID } from '../utils';
import { withProfile } from '../utils/profiler';

export function createLineView(line, renderer, strokeWidth) {
  const id = nextID();
  const element = elNS('path', {
    stroke: line.dataSet.color,
    fill: 'transparent',
    'stroke-width': strokeWidth,
    class: style.Line
  });
  const paint = withProfile('LineView.pain', () => element.setAttributeNS(null, 'd', line.pathDeclarationValue));
  const update = withProfile('LineView.update', () => renderer(id, paint));

  line.subscribe(update);
  update();
  return element;
}
