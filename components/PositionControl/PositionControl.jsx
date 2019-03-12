import * as React from 'react';
import style from './PositionControl.scss';
import { cn } from '../../utils/dom';
import { useDragListener } from '../../hooks/useDragListener';

const CONTROL_SIZE = 8;
const BORDER_SIZE = 1;

export function PositionControl({ offset, visible, width, onChange }) {
  const left = React.useRef(null);
  const right = React.useRef(null);
  const group = React.useRef(null);

  const leftDrag = useDragListener({
    onChange({ last: x }) {
      const nextLeft = Math.min(
        Math.max(
          ((width * offset) / 100) + x,
          0
        ),
        (width * (offset + visible)) / 100 - (CONTROL_SIZE + BORDER_SIZE)
      );

      onChange({
        offset: (nextLeft * 100) / width
      });
    }
  });
  const rightDrag = useDragListener({
    onChange({ last: x }) {
      const nextWidth = Math.max(
        (width * visible) / 100 + x,
        0
      );

      onChange({
        visible: ((nextWidth * 100) / width)
      });
    }
  });
  return (
    <div className={style.Root}>
      <div
        className={cn(style.Backdrop, style.left)}
        style={{
          width: (width * offset) / 100
        }}
      />
      <div
        className={style.Group}
        style={{
          width: (width * visible) / 100,
          left: (width * offset) / 100,
          right: (width * (offset + visible)) / 100
        }}
        ref={group}
      >
        <div
          className={style.ResizeControl}
          ref={left}
          {...leftDrag.getProps()}
        />
        <div
          className={style.ResizeControl}
          onClick={() =>
            onChange({
              visible: visible + 5,
              offset
            })
          }
          ref={right}
          {...rightDrag.getProps()}
        />
      </div>
      <div
        className={cn(style.Backdrop, style.right)}
        style={{
          width: (width * (100 - (offset + visible))) / 100,
          left: (width * (offset + visible)) / 100
        }}
      />
    </div>
  );
}
