import { Model } from '../Model';

export class DataSet extends Model {
  /**
   * @param {String} color
   * @param {Number} length
   * @param {String} name
   * @param {Number[]} data
   * @param {String} title
   */
  constructor({ color, length, name, data, title }) {
    super();
    this.disabled = false;
    this.color = color;
    this.title = title;
    this.name = name;
    this.max = Math.max(...data);
    this.data = getArrayConstructor(this.max).from({ length }, (_, index) => data[index]);
  }

  /**
   * @param {Boolean} disabled
   */
  set(disabled) {
    if (this.disabled === disabled) return;
    this.disabled = disabled;
    this.next();
  }

  /**
   * @param {Number} from
   * @param {Number} to
   * @returns {Uint8Array | Uint16Array | Uint32Array}
   */
  subset(from, to) {
    return this.data.subarray(from, to);
  }
}

const getArrayConstructor = value => {
  if (value <= 255) return Uint8Array;
  if (value <= 65535) return Uint16Array;
  return Uint32Array;
};
