import { Model } from './Model';

export class GlobalStateModel extends Model {
  constructor() {
    super();
    this.theme = 'light';
  }

  setTheme(theme) {
    if (theme === this.theme) return;
    this.theme = theme;
    this.emit();
  }
}
