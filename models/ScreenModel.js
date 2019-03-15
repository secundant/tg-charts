import { Events } from './Events';

export class ScreenModel extends Events {
  constructor() {
    super();
    this.update();
    window.addEventListener('resize', this.update.bind(this), false);
  }

  update() {
    this.width = document.body.offsetWidth;
    this.emit('change', this.width);
  }
}
