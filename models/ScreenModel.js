import { Model } from './Model';

export class ScreenModel extends Model {
  constructor() {
    super();
    window.addEventListener('resize', this.next, false);
    this.update();
  }

  update() {
    this.width = document.body.offsetWidth - 20;
  }
}
