import { Model } from './Model';

export class LineModel extends Model {
  /**
   * @param {ViewBoxModel} viewBox
   * @param {DataSet} dataSet
   */
  constructor({ viewBox, dataSet }) {
    super([viewBox, dataSet]);
    this.viewBox = viewBox;
    this.dataSet = dataSet;
    this.update();
  }

  update() {
    if (!this.viewBox || this.dataSet.disabled) return;
    const { firstIndex, lastIndex, initialXPosition } = this.viewBox.computed;

    this.pathDeclarationsList = [`M${initialXPosition} ${this.viewBox.y(this.dataSet.data[firstIndex])}`];
    for (let index = firstIndex + 1; index <= lastIndex; index++) {
      this.pathDeclarationsList.push(`L ${this.viewBox.x(index)} ${this.viewBox.y(this.dataSet.data[index])}`);
    }
    this.pathDeclarationValue = this.pathDeclarationsList.join(' ');
  }
}
