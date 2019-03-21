import last from 'lodash/last';

const toCharsList = value => (Array.isArray(value) ? value : value.split(''));

export class Increment {
  constructor(getNextGroup) {
    this.maxIndex = -1;
    this.groups = [];
    this.length = [];
    this.index = 0;
    this.getNextGroup = getNextGroup;
    this.addGroup();
  }

  get nextGroup() {
    return toCharsList(this.getNextGroup(this.groups.length));
  }

  addGroup() {
    const group = this.nextGroup;
    const lastGroup = last(this.groups);
    const length = (last(this.length) || 0) + (lastGroup ? lastGroup.length : 1) * group.length;

    this.maxIndex = length;
    this.length.push(length);
    this.groups.push(group);
  }

  sync() {
    while (this.index >= this.maxIndex) {
      this.addGroup();
    }
    return this;
  }

  get() {
    let result = '';
    let value = this.index;

    this.groups.reverse().forEach((group, revIndex) => {
      const index = this.groups.length - revIndex - 1;
      const prevLength = this.length[index - 1] || 0;
      const freeValue = value - prevLength;
      const modulo = freeValue % group.length;
      const char = group[modulo];
      const nextValue = prevLength + (freeValue - modulo) / group.length;

      result = char + result;
      value = nextValue;
    });
    return result;
  }

  next() {
    const value = this.get();

    this.index++;
    this.sync();
    return value;
  }

  set(index) {
    if (index < this.index) {
      throw new Error('Not allowed decrease index');
    }
    this.index = index;
    return this.sync();
  }
}
