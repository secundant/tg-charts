export class ExtendedDate {
  constructor(value) {
    this.date = new Date(value);
    this.label = formatDate(this.date);
  }
}

const formatDate = date => `${MONTHS[date.getMonth()]} ${date.getDate()}`;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
