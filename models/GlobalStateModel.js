import { Model } from './Model';

export class GlobalStateModel extends Model {
  constructor() {
    super();
    this.state = {
      isDragging: false
    };
  }

  set(state) {
    this.state = {
      ...this.state,
      ...state
    };
    this.emit();
  }
}
