import { Events } from './Events';
import { createLog } from '../utils/createLog';

export class LineModel extends Events {
  x = index => Math.round(this.viewBox.computed.spaceBetween * index - this.viewBox.computed.offsetWidth);
  y = index => {
    return Math.round(
      this.viewBox.state.height -
      (this.viewBox.state.height * (this.dataSet.data[index] - this.minValue)) / this.relativeMaxValue
    );
  };

  constructor({ viewBox, dataSet }) {
    super();
    this.viewBox = viewBox;
    this.dataSet = dataSet;
    this.update = this.update.bind(this);
    this.viewBox.on('change', this.update);
    this.dataSet.on('disabledChange', this.update);
    this.update();
  }

  update() {
    if (this.dataSet.disabled) return;
    const log = createLog('LineModel');
    const { firstIndex, lastIndex, initialXPosition } = this.viewBox.computed;

    const subset = this.dataSet.subset(firstIndex, lastIndex);

    this.maxValue = Math.max(...subset);
    this.minValue = Math.min(...subset);
    this.relativeMaxValue = this.maxValue - this.minValue;
    this.pathDeclarationsList = [`M${initialXPosition} ${this.y(firstIndex)}`];

    for (let index = firstIndex + 1; index <= lastIndex; index++) {
      this.pathDeclarationsList.push(`L ${this.viewBox.x(index)} ${this.y(index)}`);
    }
    this.pathDeclarationValue = this.pathDeclarationsList.join(' ');

    log.markSelf();
    this.emit('change');
    log.end();
  }
}
