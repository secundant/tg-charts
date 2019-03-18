import { elNS } from '../utils/dom/createElement';

export class LineView {
  update = () => {
    this.renderer.set(this._id, this.paint);
  };
  paint = () => {
    this.element.setAttributeNS(null, 'd', this.line.pathDeclarationValue);
  };

  /**
   * @param {LineModel} line
   * @param {number} strokeWidth
   * @param {Renderer} renderer
   */
  constructor({ line, strokeWidth, renderer }) {
    this._id = `line-${line.dataSet.name}-${performance.now()}-${Math.random()}`;
    this.element = elNS(['http://www.w3.org/2000/svg', 'path'], {
      stroke: line.dataSet.color,
      fill: 'transparent',
      'stroke-width': strokeWidth
    });
    this.prevMax = line.viewBox.max;
    this.renderer = renderer;
    this.line = line;
    this.line.subscribe(this.update);
    this.update();
  }

  renderTo(element) {
    element.appendChild(this.element);
  }
}
