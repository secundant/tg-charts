import { LineModel } from '../models/LineModel';
import { LineView } from './LineView';
import { elNS } from '../utils/dom/createElement';
import styles from './style.scss';

export class SVGCanvasView {
  handleDisabledChange = () => {
    const dataSet = this.dataSource.last;
    const lineView = this.lineViews.get(dataSet.name);

    if (dataSet.disabled) {
      this.svg.removeChild(lineView.element);
    } else {
      lineView.renderTo(this.svg);
    }
  };
  update = () => {
    const { screen: { width }, height } = this.viewBox;

    if (width !== this.width) {
      this.width = width;
      this.viewBoxValue = `0 0 ${width} ${height}`;
      this.renderer.set(this._id, this.paint);
    }
  };
  paint = () => {
    this.svg.setAttributeNS(null, 'width', this.width);
    this.svg.setAttributeNS(null, 'viewBox', this.viewBoxValue);
  };

  /**
   * @param {DataSource} dataSource
   * @param {ViewBoxModel} viewBox
   * @param {number} strokeWidth
   * @param {Renderer} renderer
   */
  constructor({ dataSource, viewBox, renderer, strokeWidth = 2 }) {
    this.svg = elNS(['http://www.w3.org/2000/svg', 'svg'], {
      version: '1.1',
      baseProfile: 'full',
      width: viewBox.screen.width,
      height: viewBox.height,
      preserveAspectRatio: 'none',
      class: styles.SVG
    });
    this._id = `svg-canvas-view-${performance.now()}-${Math.random()}`;
    this.width = null;
    this.lineViews = new Map();
    this.viewBox = viewBox;
    this.renderer = renderer;
    this.dataSource = dataSource;
    this.dataSource.dataSets.forEach(dataSet => {
      const line = new LineModel({
        viewBox,
        dataSet
      });
      const lineView = new LineView({
        line,
        strokeWidth,
        renderer
      });

      if (!dataSet.disabled) {
        lineView.renderTo(this.svg);
      }
      this.lineViews.set(dataSet.name, lineView);
    });
    this.dataSource.subscribe(this.handleDisabledChange);
    this.viewBox.subscribe(this.update);
    this.update();
  }

  renderTo(element) {
    element.appendChild(this.svg);
  }
}
