import { useCallback } from 'react';
import { useEvents } from './useEvents';
import { useShallowState } from './useShallowState';

export function useDragListener({ onChange }) {
  const [{ active, x, y, last }, setState] = useShallowState({
    active: false,
    x: 0,
    y: 0,
    last: 0
  });
  const reset = useCallback(
    () =>
      setState({
        active: false
      }),
    [setState]
  );
  const init = useCallback(
    e => {
      e.stopPropagation();
      const p = getPosition(e);

      setState({
        active: true,
        last: p.x,
        ...p
      });
    },
    [setState]
  );
  const move = useCallback(
    e => {
      if (!active) return;
      const p = getPosition(e);
      onChange({
        x: p.x - x,
        y: p.y - y,
        last: p.x - last
      });
      setState({
        last: p.x
      });
    },
    [onChange, active, x, y]
  );

  useEvents(window, () => ({
    blur: reset,
    resize: reset,
    mouseup: reset,
    mousemove: move,
    touchmove: move
  }), [move, reset, active]);

  return {
    init,
    getProps: () => ({
      onMouseDown: init,
      onTouchStart: init
    })
  };
}

const getPosition = e => e.touches ? {
  x: e.touches[0].pageX,
  y: e.touches[0].pageY
} : {
  x: e.pageX,
  y: e.pageY
};
