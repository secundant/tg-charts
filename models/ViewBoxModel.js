import { Model } from './Model';

export class ViewBoxModel extends Model {
  x = index => Math.round(this.space * index - this.offsetWidth);
  y = value => this.padding + Math.round(this.innerHeight - (this.innerHeight * value) / this.max);

  /**
   * @param {ScreenModel} screen
   * @param {Number} height
   * @param {Number?} visible
   * @param {Number?} offset
   * @param {DataSource} dataSource
   * @param {number} padding
   * @param {Transition} transition
   */
  constructor({ screen, height, visible = 30, offset = 60, dataSource, padding, transition }) {
    super([screen, dataSource]);
    this._id = `view-box-${performance.now()}-${Math.random()}`;
    this.height = height;
    this.offset = offset;
    this.visible = visible;
    this.dataSource = dataSource;
    this.transition = transition;
    this.screen = screen;
    this.padding = padding;
    this.innerHeight = height - padding * 2;
    this.prevMax = null;
    this.update();
    transition.subscribe(this._id, value => {
      this.max = value;
      this.emit();
    });
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
    const spaceBetween = scaledWidth / (this.dataSource.length - 1);
    const initialXPosition = Math.round(spaceBetween * firstIndex - offsetWidth);
    const maxValue = Math.max(
      ...Array.from(this.dataSource.dataSets.values()).map(dataSet =>
        dataSet.disabled ? 0 : Math.max(...dataSet.subset(firstIndex, lastIndex + 1))
      )
    );

    this.offsetWidth = offsetWidth;
    this.firstIndex = firstIndex;
    this.lastIndex = lastIndex;
    this.initialX = initialXPosition;
    this.space = spaceBetween;
    this.max = this.transition.get(this._id, maxValue);
    if (maxValue !== this.prevMax) {
      if (this.prevMax !== null) {
        this.transition.set(this._id, this.max, maxValue);
      }
      this.prevMax = maxValue;
    }
  }
}
