import style from './style.scss';
import { elNS } from '../utils/dom/createElement';
import { nextID } from '../utils';

/**
 * @param {LineModel} line
 * @param {Renderer} renderer
 * @param {number} strokeWidth
 */
export function createLineView(line, renderer, strokeWidth) {
  const id = nextID();
  const element = elNS(['http://www.w3.org/2000/svg', 'path'], {
    stroke: line.dataSet.color,
    fill: 'transparent',
    'stroke-width': strokeWidth,
    class: style.Line
  });
  const paint = () => element.setAttributeNS(null, 'd', line.pathDeclarationValue);
  const update = () => renderer.set(id, paint);

  line.subscribe(update);
  update();
  return element;
}
