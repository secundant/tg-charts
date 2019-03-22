import { Model } from './Model';

export class ViewBoxModel extends Model {
  x = index => Math.round(this.space * index - this.offsetWidth);
  y = value => this.padding + Math.round(this.innerHeight - (this.innerHeight * (value - this.min)) / (this.max - this.min));

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
    this.prevMin = null;
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
    console.groupEnd();
    console.group(`ViewBox.update()`);
    console.time(`ViewBox`);
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
    console.time(`Math`);
    const datas = Array.from(this.dataSource.dataSets.values()).filter(dataSet => !dataSet.disabled).map(dataSet => {
        const subset = dataSet.subset(firstIndex, lastIndex + 1);

      return [Math.min.apply(Math, subset), Math.max.apply(Math, subset), subset];
      }
    );
    const maxValue = Math.max.apply(Math, datas.map(v => v[1]));
    const minValue = Math.min.apply(Math, datas.map(v => v[0]));

    console.timeEnd(`Math`);
    console.time(`Dynamic`);
    this.offsetWidth = offsetWidth;
    this.firstIndex = firstIndex;
    this.lastIndex = lastIndex;
    this.initialX = initialXPosition;
    this.space = spaceBetween;
    this.max = this.transition.get(this._id, maxValue);
    this.min = this.transition.get(this._id + '-min', minValue);
    if (maxValue !== this.prevMax) {
      if (this.prevMax !== null) {
        this.transition.set(this._id, this.max, maxValue);
      }
      this.prevMax = maxValue;
    }
    if (minValue !== this.prevMin) {
      if (this.prevMin !== null) {
        this.transition.set(this._id + '-min', this.min, minValue);
      }
      this.prevMin = minValue;
    }
    console.timeEnd(`Dynamic`);
    console.timeEnd(`ViewBox`);
  }
}
