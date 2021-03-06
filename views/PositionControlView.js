import style from '../components/PositionControl/PositionControl.scss';
import { el } from '../utils/dom/createElement';

export class PositionControlView {
  constructor({ viewBox, draggable }) {
    this.viewBox = viewBox;
    this.draggable = draggable;
    this.leftBackdropElement = el('div', {
      class: style.Backdrop + ' ' + style.left
    });
    this.rightBackdropElement = el('div', {
      class: style.Backdrop + ' ' + style.right
    });
    this.leftControlElement = el('div', {
      class: style.ResizeControl
    });
    this.rightControlElement = el('div', {
      class: style.ResizeControl
    });
    this.controlsGroupElement = el(
      'div',
      {
        class: style.Group
      },
      [this.leftControlElement, this.rightControlElement]
    );
    this.element = el(
      'div',
      {
        class: style.Root
      },
      [this.leftBackdropElement, this.controlsGroupElement, this.rightBackdropElement]
    );

    this.viewBox.on('change', this.update.bind(this));
    this.draggable.subscribe(this.leftControlElement, this.handleLeft.bind(this));
    this.draggable.subscribe(this.rightControlElement, this.handleRight.bind(this));
    this.draggable.subscribe(this.controlsGroupElement, this.handleGroup.bind(this));
    this.update();
  }

  handleLeft(type, x) {
    if (type === 'end') return;
    if (type === 'start') {
      this.initialLeft = this.controlWidth;
      return;
    }
    const { width, visible, offset } = this.viewBox.state;
    const nextControlWidth = Math.min(Math.max(this.initialLeft - x, 48), (width * (offset + visible)) / 100);
    const diff = ((nextControlWidth - this.controlWidth) * 100) / width;

    this.viewBox.set({
      visible: visible + diff,
      offset: offset - diff
    });
  }

  handleRight(type, x) {
    if (type === 'end') return;
    if (type === 'start') {
      this.initialRight = this.controlWidth;
      return;
    }
    const { width } = this.viewBox.state;
    const nextWidth = Math.min(Math.max(this.initialRight + x, 48), width - this.offsetLeft);

    this.viewBox.set({
      visible: (nextWidth * 100) / width
    });
  }

  handleGroup(type, _, x) {
    if (type === 'end' || type === 'start') return;
    const { visible, width } = this.viewBox.state;
    const nextOffsetLeft = Math.max(Math.min(this.offsetLeft + x, (width * (100 - visible)) / 100), 0);

    this.viewBox.set({
      offset: (nextOffsetLeft * 100) / width
    });
  }

  update() {
    const { width, visible, offset } = this.viewBox.state;

    this.controlWidth = (width * visible) / 100;
    this.offsetLeft = (width * offset) / 100;
    this.offsetRight = width - (this.controlWidth + this.offsetLeft);

    this.leftBackdropElement.style.width = `${this.offsetLeft}px`;

    this.rightBackdropElement.style.width = `${this.offsetRight}px`;
    this.rightBackdropElement.style.left = `${this.offsetLeft + this.controlWidth}px`;

    this.controlsGroupElement.style.width = `${this.controlWidth}px`;
    this.controlsGroupElement.style.left = `${this.offsetLeft}px`;
  }

  renderTo(element) {
    element.appendChild(this.element);
  }
}
