import { Model } from './Model';
import { profile, profileEnd } from '../utils/profiler';
import { createArray, nextID } from '../utils';

export class ViewBoxModel extends Model {
  x = index => this.xList[index - (this.firstIndex + 1)];
  y = value =>
    this.paddingY + Math.round(this.innerHeight - (this.innerHeight * (value - this.min)) / (this.max - this.min));

  /**
   * @param {ScreenModel} screen
   * @param {Number} height
   * @param {Number?} visible
   * @param {Number?} offset
   * @param {DataSource} dataSource
   * @param {number} paddingX
   * @param {number} paddingY
   * @param {number} paddingBottom
   * @param transition
   * @param renderer
   */
  constructor({
                screen, height, visible = 30, offset = 60, dataSource, transition, paddingX, renderer,

                paddingBottom,
                paddingY
              }) {
    super([screen, dataSource]);
    this._id = nextID('view-box');
    this.height = height;
    this.offset = offset;
    this.visible = visible;
    this.renderer = renderer;
    this.dataSource = dataSource;
    this.transition = transition;
    this.paddingBottom = paddingBottom;
    this.paddingX = paddingX;
    this.paddingY = paddingY;
    this.screen = screen;
    this.innerHeight = height - (paddingBottom + paddingY * 2);
    this.prevMax = null;
    this.prevMin = null;
    this.update();
    // @TODO join subscriptions into one
    transition.subscribe(this._id + '-max', value => {
      this.max = value;
      renderer(this._id, this.emit);
    });
    transition.subscribe(this._id + '-min', value => {
      this.min = value;
      renderer(this._id, this.emit);
    });
  }

  set({ offset = this.offset, visible = this.visible }) {
    profile('ViewBoxModel.set');
    this.offset = offset;
    this.visible = visible;
    this.update();
    this.renderer(this._id, this.emit);
    profileEnd('ViewBoxModel.set');
  }

  update() {
    profile('ViewBoxModel - calculate subsets');
    const { offset, visible, screen } = this;
    const width = screen.width - this.paddingX;
    const firstIndex = Math.max(this.dataSource.indexAt(offset) - 1, 0);
    const lastIndex = this.dataSource.indexAt(offset + visible);
    const datas = Array.from(this.dataSource.dataSets.values())
      .filter(dataSet => !dataSet.disabled)
      .map(dataSet => {
        const subset = dataSet.data.subarray(firstIndex, lastIndex + 1);

        return [Math.min.apply(Math, subset), Math.max.apply(Math, subset), subset];
      });

    profileEnd('ViewBoxModel - calculate subsets');
    if (!datas.length) return;
    profile('ViewBoxModel.update');
    const scaledWidthRatio = 1 / (visible / 100);
    const scaledWidth = width * scaledWidthRatio;
    const offsetWidth = (scaledWidth * offset) / 100;
    const spaceBetween = scaledWidth / (this.dataSource.length - 1);
    const initialXPosition = Math.round(spaceBetween * firstIndex - offsetWidth);
    const maxValue = Math.max.apply(Math, datas.map(v => v[1]));
    const minValue = Math.min.apply(Math, datas.map(v => v[0]));

    this.offsetWidth = offsetWidth;
    this.firstIndex = firstIndex;
    this.lastIndex = lastIndex;
    this.initialX = initialXPosition;
    this.space = spaceBetween;
    this.xList = this.getXList(firstIndex, Math.min(lastIndex + 1, this.dataSource.length - 1));
    this.max = this.transition.get(this._id + '-max', this.prevMax || maxValue);
    this.min = this.transition.get(this._id + '-min', this.prevMin || minValue);
    if (maxValue !== this.prevMax) {
      if (this.prevMax !== null) {
        this.transition.set(this._id + '-max', this.max, maxValue);
      }
      this.prevMax = maxValue;
    }
    if (minValue !== this.prevMin) {
      if (this.prevMin !== null) {
        this.transition.set(this._id + '-min', this.min, minValue);
      }
      this.prevMin = minValue;
    }
    profileEnd('ViewBoxModel.update');
  }

  getXList(first, last) {
    return createArray(last - first).map((_, index) => this.getXValue(first + 1 + index));
  }

  getXValue(index) {
    return Math.round(this.space * index - this.offsetWidth);
  }
}
