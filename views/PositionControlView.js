import style from './style.scss';
import { createElementWithClassName } from '../utils/dom/createElement';
import { nextID } from '../utils';

export function createPositionControlView(viewBox, draggable, renderer) {
  let offsetLeft;
  let offsetRight;
  let controlWidth;
  let initial;

  const id = nextID();
  const { screen } = viewBox;
  const backdropLeft = createElementWithClassName(style.Backdrop + ' ' + style.left);
  const backdropRight = createElementWithClassName(style.Backdrop + ' ' + style.right);
  const controlLeft = createElementWithClassName(style.ResizeControl);
  const controlRight = createElementWithClassName(style.ResizeControl);
  const group = createElementWithClassName(style.Group, [controlLeft, controlRight]);
  const element = createElementWithClassName(style.PositionControl, [backdropLeft, group, backdropRight]);
  const paint = () => {
    backdropLeft.style.width = `${offsetLeft}px`;
    group.style.width = `${controlWidth}px`;
    group.style.left = `${offsetLeft}px`;
    backdropRight.style.width = `${offsetRight}px`;
    backdropRight.style.left = `${offsetLeft + controlWidth}px`;
  };
  const update = () => {
    controlWidth = (screen.width * viewBox.visible) / 100;
    offsetLeft = (screen.width * viewBox.offset) / 100;
    offsetRight = screen.width - (controlWidth + offsetLeft);
    renderer(id, paint);
  };
  const createHandler = exec => (type, abs, rel) => {
    if (type === 'end') return;
    if (type === 'start') {
      initial = controlWidth;
      return;
    }
    const [offset, visible] = exec(abs, rel);

    viewBox.set({
      offset,
      visible
    });
  };

  viewBox.subscribe(update);
  draggable(
    controlLeft,
    createHandler(x => {
      const { visible, offset } = viewBox;
      const { width } = screen;
      const nextControlWidth = Math.min(Math.max(initial - x, 48), (width * (offset + visible)) / 100);
      const diff = ((nextControlWidth - controlWidth) * 100) / width;

      return [offset - diff, visible + diff];
    })
  );
  draggable(
    controlRight,
    createHandler(x => {
      const { width } = screen;
      const nextWidth = Math.min(Math.max(initial + x, 48), width - offsetLeft);

      return [void 0, (nextWidth * 100) / width];
    })
  );
  draggable(
    group,
    createHandler((_, x) => {
      const { visible } = viewBox;
      const { width } = screen;
      const nextOffsetLeft = Math.max(Math.min(offsetLeft + x, (width * (100 - visible)) / 100), 0);

      return [(nextOffsetLeft * 100) / width];
    })
  );
  update();
  return element;
}
