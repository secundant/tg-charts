import { ExtendedDate } from './ExtendedDate';
import { DataSet } from './DataSet';
import { Model } from '../Model';

export class DataSource extends Model {
  constructor({ columns, colors, types, names }) {
    super();
    /**
     * @type {Map<string, DataSet>}
     */
    this.dataSets = new Map();

    columns.forEach(([name, ...data]) => {
      if (types[name] === 'x') {
        this.legend = data.map(toExtendedDate);
        this.length = data.length;
        return;
      }
      const dataSet = new DataSet({
        name,
        data,
        title: names[name],
        color: colors[name],
        length: data.length
      });

      this.dataSets.set(name, dataSet);
      dataSet.subscribe(() => {
        this.last = dataSet;
        this.next();
      });
    });
  }

  /**
   * @param {number} relative
   * @returns {number}
   */
  indexAt(relative) {
    if (relative <= 0) return 0;
    if (relative >= 100) return this.length - 1;
    return Math.ceil((relative * this.length) / 100) - 1;
  }
}

const toExtendedDate = value => new ExtendedDate(value);
