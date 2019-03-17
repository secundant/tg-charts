import { ExtendedDate } from './ExtendedDate';
import { DataSet } from './DataSet';
import { Events } from './Events';

export class DataSource extends Events {
  constructor({ columns, colors, types, names }) {
    super();
    const columnByName = createColumnsDictionary(columns);
    const dataNames = Object.keys(types);

    this.names = [];
    this.dataSets = new Map();
    for (const name of dataNames) {
      if (types[name] !== 'x') continue;
      this.length = columnByName[name].length;
      this.legend = columnByName[name].map(toExtendedDate);
      break;
    }
    for (const name of dataNames) {
      if (types[name] !== 'line') continue;
      const dataSet = new DataSet({
        name,
        data: columnByName[name],
        title: names[name],
        color: colors[name],
        length: this.length
      });

      this.names.push(name);
      this.dataSets.set(name, dataSet);
      dataSet.on('disabledChange', value => this.emit('disabledChange', name, value));
    }
  }

  get(name) {
    return this.dataSets.get(name);
  }

  indexAt(relative) {
    if (relative <= 0) return 0;
    if (relative >= 100) return this.length - 1;
    return Math.ceil((relative * this.length) / 100) - 1;
  }
}

const toExtendedDate = value => new ExtendedDate(value);
const createColumnsDictionaryReducer = (dictionary, [name, ...items]) => {
  dictionary[name] = items;
  return dictionary;
};
const createColumnsDictionary = columns => columns.reduce(createColumnsDictionaryReducer, {});
