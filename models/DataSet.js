export class DataSet {
  constructor({ color, length, name, data, title }) {
    this.color = color;
    this.title = title;
    this.name = name;
    this.data = new Uint32Array(length);

    for (let i = 0; i < length; i++) {
      this.data[i] = +data[i];
    }
  }
}
