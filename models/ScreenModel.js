import { Events } from './Events';

export class ScreenModel extends Events {
  constructor() {
    super();
    this.width = document.body.offsetWidth;
    window.addEventListener('resize', this.update.bind(this), false);
  }

  update() {
    this.width = document.body.offsetWidth;
    this.emit('change', this.width);
  }
}
