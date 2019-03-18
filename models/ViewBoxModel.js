import { Model } from './Model';

export class ViewBoxModel extends Model {
  x = index => Math.round(this.computed.spaceBetween * index - this.computed.offsetWidth);
  y = value => this.padding + Math.round(this.innerHeight - (this.innerHeight * value) / this.computed.maxValue);

  /**
   * @param {ScreenModel} screen
   * @param {Number} height
   * @param {Number?} visible
   * @param {Number?} offset
   * @param {DataSource} dataSource
   * @param {number} padding
   */
  constructor({ screen, height, visible = 30, offset = 60, dataSource, padding }) {
    super([screen, dataSource]);
    this.height = height;
    this.offset = offset;
    this.visible = visible;
    this.dataSource = dataSource;
    this.screen = screen;
    this.padding = padding;
    this.innerHeight = height - padding * 2;
    this.update();
  }

  set({ offset = this.offset, visible = this.visible }) {
    this.offset = offset;
    this.visible = visible;
    this.next();
  }

  update() {
    const {
      offset,
      visible,
      screen: { width }
    } = this;
    const scaledWidthRatio = 1 / (visible / 100);
    const scaledWidth = width * scaledWidthRatio;
    const offsetWidth = (scaledWidth * offset) / 100;
    const firstIndex = Math.max(this.dataSource.indexAt(offset) - 1, 0);
    const lastIndex = this.dataSource.indexAt(offset + visible);
    const visibleCount = lastIndex - firstIndex;
    const spaceBetween = scaledWidth / (this.dataSource.length - 1);
    const initialXPosition = Math.round(spaceBetween * firstIndex - offsetWidth);
    const maxValue = Math.max(
      ...Array.from(this.dataSource.dataSets.values()).map(dataSet =>
        dataSet.disabled ? 0 : Math.max(...dataSet.subset(firstIndex, lastIndex + 1))
      )
    );

    this.computed = {
      scaledWidthRatio,
      initialXPosition,
      spaceBetween,
      visibleCount,
      scaledWidth,
      offsetWidth,
      firstIndex,
      lastIndex,
      maxValue
    };
  }
}
