import { elNS } from '../utils/dom/createElement';

export class LineView {
  update = () => {
    this.isPending = false;
    this.element.setAttributeNS(null, 'd', this.line.pathDeclarationValue);
  };

  constructor({ line, strokeWidth }) {
    this.element = elNS(['http://www.w3.org/2000/svg', 'path'], {
      stroke: line.dataSet.color,
      fill: 'transparent',
      'stroke-width': strokeWidth
    });
    this.isPending = false;
    this.line = line;
    this.line.subscribe(() => {
      if (this.isPending) return;
      this.isPending = true;
      requestAnimationFrame(this.update);
    });
    this.update();
  }

  renderTo(element) {
    element.appendChild(this.element);
  }
}
