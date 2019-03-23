import { Model } from './Model';
import { withProfile } from '../utils/profiler';

export class LineModel extends Model {
  handleDisabledChange = () => {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.pending = true;
    this.timeoutId = setTimeout(() => {
      this.timeoutId = null;
      this.pending = false;
    }, 175);
  };

  /**
   * @param {ViewBoxModel} viewBox
   * @param {DataSet} dataSet
   */
  constructor({ viewBox, dataSet }) {
    super([viewBox]);
    this.viewBox = viewBox;
    this.dataSet = dataSet;
    this.timeoutId = null;
    this.update();
    dataSet.subscribe(this.handleDisabledChange);
    this.observers.clear();
    delete this.observers;
    delete this.emit;
    delete this.subscribe;
    this.subscribe = fn => {
      const observer = withProfile('LineModel.observer', fn);

      this.emit = observer;
      this.next = () => {
        this.update();
        observer();
      };
    };
  }

  update() {
    if (!this.viewBox || (this.dataSet.disabled && !this.pending)) return;
    const { firstIndex, lastIndex, initialX, xList } = this.viewBox;

    this.pathDeclarationsList = new Array(lastIndex - firstIndex);
    this.pathDeclarationsList[0] = [`M${initialX} ${this.viewBox.y(this.dataSet.data[firstIndex])}`];
    for (let index = firstIndex + 1; index <= lastIndex; index++) {
      this.pathDeclarationsList[index - firstIndex] = `L ${xList[index - (firstIndex + 1)]} ${this.viewBox.y(
        this.dataSet.data[index]
      )}`;
    }
    this.pathDeclarationValue = this.pathDeclarationsList.join(' ');
  }
}
