import React, { useCallback, useMemo } from 'react';
import style from './PositionControl.scss';
import { useHorizontalDrag } from '../../hooks/useHorizontalDrag';

export function PositionControl({ offset, visible, width, onChange }) {
  const [initial, setInitial] = React.useState(null);
  const reset = useCallback(() => setInitial(null), [setInitial]);
  const controlWidth = useMemo(() => (width * visible) / 100, [width, visible]);
  const offsetLeft = useMemo(() => (width * offset) / 100, [width, offset]);
  const offsetRight = useMemo(() => width - (controlWidth + offsetLeft), [width, controlWidth, offsetLeft]);

  const leftDrag = useHorizontalDrag({
    onStart: React.useCallback(() => setInitial(controlWidth), [controlWidth]),
    onChange: React.useCallback(
      x => {
        const nextControlWidth = Math.min(Math.max(initial - x, 48), (width * (offset + visible)) / 100);
        const diff = ((nextControlWidth - controlWidth) * 100) / width;

        onChange({
          visible: visible + diff,
          offset: offset - diff
        });
      },
      [initial, width, visible, offset]
    ),
    onEnd: reset
  });
  const rightDrag = useHorizontalDrag({
    onStart: React.useCallback(() => setInitial(controlWidth), [controlWidth]),
    onChange: React.useCallback(
      x => {
        const nextWidth = Math.min(Math.max(initial + x, 48), width - offsetLeft);

        onChange({
          visible: (nextWidth * 100) / width
        });
      },
      [initial, width, visible]
    ),
    onEnd: reset
  });
  const groupDrag = useHorizontalDrag({
    onStart: React.useCallback(() => setInitial(offsetLeft), [offsetLeft]),
    onChange: React.useCallback(
      x => {
        const nextOffsetLeft = Math.max(Math.min(offsetLeft + x, (width * (100 - visible)) / 100), 0);

        onChange({
          offset: (nextOffsetLeft * 100) / width
        });
      },
      [initial, width, visible]
    ),
    onEnd: reset
  });

  console.log('UPDATE');
  return (
    <div className={style.Root}>
      <div
        className={`${style.Backdrop} ${style.left}`}
        style={{
          width: offsetLeft
        }}
      />
      <div
        className={style.Group}
        style={{
          width: controlWidth,
          left: offsetLeft
        }}
        {...groupDrag()}
      >
        <div className={style.ResizeControl} {...leftDrag()} />
        <div className={style.ResizeControl} {...rightDrag()} />
      </div>
      <div
        className={`${style.Backdrop} ${style.right}`}
        style={{
          width: offsetRight,
          left: offsetLeft + controlWidth
        }}
      />
    </div>
  );
}
