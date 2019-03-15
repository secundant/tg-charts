import { Events } from './Events';

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
    this.viewBox.on('change', this.update.bind(this));
    this.dataSet.on('disabledChange', this.update.bind(this));
    this.update();
  }

  update() {
    console.group('[LineModel.update()]');
    const t = performance.now();
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
    const end = performance.now();

    console.debug('Self time:', end - t);
    this.emit('change');
    console.debug('Children time:', performance.now() - t);
    console.groupEnd();
  }
}
