import { Events } from './Events';

export class DataSet extends Events {
  constructor({ color, length, name, data, title, disabled }) {
    super();
    this.disabled = !!disabled;
    this.color = color;
    this.title = title;
    this.name = name;
    const maxValue = Math.max(...data);

    this.ArrayConstructor = getArrayConstructor(maxValue);
    this.data = fromArrayLike(this.ArrayConstructor, length, data);
  }

  setDisabled(disabled) {
    if (disabled === this.disabled) return;
    this.disabled = disabled;
    this.emit('disabledChange', disabled);
  }

  subset(from, to) {
    return this.data.subarray(from, to);
  }

  maxBetween(first, last) {
    return this.data.reduce((max, value, index) => (index >= first && index <= last && value > max ? value : max), -1);
  }
}

const fromArrayLike = (constructor, length, data) => constructor.from({ length }, (_, index) => data[index]);
const getArrayConstructor = value => {
  if (value <= 255) return Uint8Array;
  if (value <= 65535) return Uint16Array;
  return Uint32Array;
};
