import { ChartLine } from './ChartLine';

export class ChartCanvas {
  constructor({ dataSource, disabled }) {
    this.width = null;
    this.height = null;
    this.dataSource = dataSource;
    this.disabled = disabled;
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttributeNS(null, 'version', '1.1');
    this.svg.setAttributeNS(null, 'baseProfile', 'full');
    this.paths = dataSource.names.reduce((paths, name) => {
      paths.set(name, new ChartLine(dataSource.get(name)));
      return paths;
    }, new Map());
  }

  sync(options) {
    const { width, height, offset, visible } = options;
    const scaledWidthRatio = 1 / (visible / 100);
    const scaledWidth = width * scaledWidthRatio;
    const offsetWidth = (scaledWidth * offset) / 100;
    const firstIndex = Math.max(this.dataSource.indexAt(offset) - 1, 0);
    const lastIndex = this.dataSource.indexAt(offset + visible);
    const visibleCount = lastIndex - firstIndex;
    const spaceBetween = scaledWidth / (this.dataSource.length - 1);
    const initialXPosition = Math.round(spaceBetween * firstIndex - offsetWidth);
    const context = {
      ...options,
      scaledWidthRatio,
      initialXPosition,
      spaceBetween,
      visibleCount,
      scaledWidth,
      offsetWidth,
      firstIndex,
      lastIndex
    };

    if (width !== this.width || height !== this.height) {
      this.svg.setAttributeNS(null, 'viewBox', `0 0 ${width} ${height}`);
    }
    if (width !== this.width) {
      this.width = width;
      this.svg.setAttributeNS(null, 'width', width);
    }
    if (height !== this.height) {
      this.height = height;
      this.svg.setAttributeNS(null, 'height', height);
    }
    this.paths.forEach(path => {
      path.sync(context);
    });
    this.paths.forEach(path => {
      this.svg.appendChild(path.element);
    });
  }
}
