import { elNS } from '../utils/dom/createElement';

export class ChartLine {
  constructor(dataSet) {
    this.dataSet = dataSet;
    this.element = elNS(['http://www.w3.org/2000/svg', 'path'], {
      stroke: dataSet.color,
      fill: 'transparent',
      'stroke-width': 2
    });
    this.isPending = false;
    this.lastNextValue = null;
  }

  sync({
         offset,
         visible,
         width,
         height,
         scaledWidthRatio,
         initialXPosition,
         spaceBetween,
         visibleCount,
         scaledWidth,
         offsetWidth,
         firstIndex,
         lastIndex
       }) {
    const subset = this.dataSet.subset(firstIndex, lastIndex);
    const max = Math.max(...subset);
    const getX = index => Math.round(spaceBetween * index - offsetWidth);
    const getY = index => Math.round(height * this.dataSet.data[index] / max);
    const value = [`M${initialXPosition} ${getY(firstIndex)}`];

    subset.forEach((_, index) => {
      value.push(`L ${getX(firstIndex + index)} ${getY(firstIndex + index)}`);
    });
    this.lastNextValue = value.join(' ');

    console.log('[ChartLine]:', {
      firstIndex,
      lastIndex,
      scaledWidth,
      scaledWidthRatio,
      offsetWidth,
      visible,
      value,
      width
    });
    if (!this.isPending) {
      this.isPending = true;
      requestAnimationFrame(() => this.render());
    }
  }

  render() {
    this.isPending = false;
    this.element.setAttributeNS(null, 'd', this.lastNextValue);
  }
}
