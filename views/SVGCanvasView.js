import { LineModel } from '../models/LineModel';
import { LineView } from './LineView';
import { elNS } from '../utils/dom/createElement';

export class SVGCanvasView {
  handleDisabledChange = (name, disabled) => {
    const lineView = this.lineViews.get(name);

    if (disabled) {
      this.svg.removeChild(lineView.element);
    } else {
      lineView.renderTo(this.svg);
    }
  };
  update = () => {
    const { width, height } = this.viewBox.state;

    if (width !== this.width) {
      this.width = width;
      this.svg.setAttributeNS(null, 'width', width);
      this.svg.setAttributeNS(null, 'viewBox', `0 0 ${width} ${height}`);
    }
  };

  constructor({ dataSource, viewBox, strokeWidth = 2 }) {
    this.svg = elNS(['http://www.w3.org/2000/svg', 'svg'], {
      version: '1.1',
      baseProfile: 'full',
      width: viewBox.state.width,
      height: viewBox.state.height,
      preserveAspectRatio: 'none'
    });
    this.width = null;
    this.lineViews = new Map();
    this.viewBox = viewBox;
    this.dataSource = dataSource;
    this.dataSource.dataSets.forEach(dataSet => {
      const line = new LineModel({
        viewBox,
        dataSet
      });
      const lineView = new LineView({
        line,
        strokeWidth
      });

      if (!dataSet.disabled) {
        lineView.renderTo(this.svg);
      }
      this.lineViews.set(dataSet.name, lineView);
    });
    this.dataSource.on('disabledChange', this.handleDisabledChange);
    this.viewBox.on('change', this.update);
    this.update();
  }

  renderTo(element) {
    element.appendChild(this.svg);
  }
}
