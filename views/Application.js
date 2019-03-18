import { Draggable, Renderer, ScreenModel } from '../models';

export class Application {
  constructor() {
    this.screen = new ScreenModel();
    this.renderer = new Renderer();
    this.draggable = new Draggable();
  }
}
