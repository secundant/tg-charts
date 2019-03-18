import { Events } from './Events';
import { createLog } from '../utils/createLog';

export class ViewBoxModel extends Events {
  x = index => Math.round(this.computed.spaceBetween * index - this.computed.offsetWidth);

  constructor({ screen, height, visible = 30, offset = 60, dataSource }) {
    super();
    this.state = {
      visible,
      offset,
      height,
      width: screen.width
    };
    this.dataSource = dataSource;
    this.screen = screen;
    this.screen.on('change', width => {
      this.state.width = screen.width;
      this.update();
    });
    this.update();
  }

  set({ offset = this.state.offset, visible = this.state.visible }) {
    if (offset === this.state.offset && visible === this.state.visible) return;
    this.state.offset = offset;
    this.state.visible = visible;
    this.update();
  }

  update() {
    const log = createLog('ViewBoxModel');
    const { width, offset, visible } = this.state;
    const scaledWidthRatio = 1 / (visible / 100);
    const scaledWidth = width * scaledWidthRatio;
    const offsetWidth = (scaledWidth * offset) / 100;
    const firstIndex = Math.max(this.dataSource.indexAt(offset) - 1, 0);
    const lastIndex = this.dataSource.indexAt(offset + visible);
    const visibleCount = lastIndex - firstIndex;
    const spaceBetween = scaledWidth / (this.dataSource.length - 1);
    const initialXPosition = Math.round(spaceBetween * firstIndex - offsetWidth);

    this.computed = {
      scaledWidthRatio,
      initialXPosition,
      spaceBetween,
      visibleCount,
      scaledWidth,
      offsetWidth,
      firstIndex,
      lastIndex
    };

    log.markSelf();
    this.emit('change', this.computed, this.screen);
    log.end();
  }
}
