import { ExtendedDate } from './ExtendedDate';
import { DataSet } from './DataSet';

export class DataSource {
  constructor({ columns, colors, types, names }) {
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
      this.names.push(name);
      this.dataSets.set(
        name,
        new DataSet({
          name,
          data: columnByName[name],
          title: names[name],
          color: colors[name],
          length: this.length
        })
      );
    }
  }
}

const toExtendedDate = value => new ExtendedDate(value);
const createColumnsDictionaryReducer = (dictionary, [name, ...items]) => {
  dictionary[name] = items;
  return dictionary;
};
const createColumnsDictionary = columns => columns.reduce(createColumnsDictionaryReducer, {});
