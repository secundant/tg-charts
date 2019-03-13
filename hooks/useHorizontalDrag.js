import { withDefaults } from '../utils/fn';
import { noop } from 'lodash';
import { useEffect, useCallback, useMemo } from 'react';
import { useEvents } from './useEvents';
import { useShallowState } from './useShallowState';

export function useHorizontalDrag(options) {
  const {
    disabled,
    onChange,
    onStart,
    onEnd
  } = getOptions(options);
  const [{
    initial,
    current
  }, setState] = useShallowState(getInitialState());
  const reset = useCallback(() => {
    setState(getInitialState());
  }, [setState]);
  const initialPageX = useMemo(() => initial ? getPageX(initial) : null, [initial]);
  const currentPageX = useMemo(() => current ? getPageX(current) : null, [current]);
  const handleStart = useCallback(event => {
    if (initial || disabled) return;
    event.persist();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    setState(getStartedState(event));
    onStart(event);
  }, [initial, disabled, onStart]);
  const handleChange = useCallback(event => {
    if (!initial || disabled || initialPageX === null || currentPageX === null) return;
    const pageX = getPageX(event);

    setState({
      current: event
    });
    onChange(pageX - initialPageX, pageX - currentPageX);
  }, [initial, disabled, current, initialPageX, currentPageX]);
  const handleEnd = useCallback(event => {
    if (!initial) return;
    if (event.type === 'touchend' && event.targetTouches.length > 0) {
      return;
    }
    reset();
    onEnd(event);
  }, [initial, disabled, onEnd, reset]);

  useEffect(() => {
    if (!initial || !disabled) return;
    reset();
  }, [initial, current, disabled]);
  useEvents(document, () => disabled ? null : ({
    resize: handleEnd,
    blur: handleEnd,
    touchmove: handleChange,
    mousemove: handleChange,
    touchend: handleEnd,
    mouseup: handleEnd
  }), [disabled, handleEnd, handleChange]);

  return useMemo(() => () => ({
    onMouseDown: handleStart,
    onTouchStart: handleStart
  }), [handleStart]);
}

const getPageX = event => {
  switch (event.type) {
    case 'touchstart':
    case 'touchmove':
      return event.targetTouches[0].pageX;
    case 'mousedown':
    case 'mousemove':
      return event.pageX;
    default:
      console.error('Wrong event:', event);
      throw new Error(`Event type "${event.type}" is not supported.`)
  }
};
const getStartedState = initial => ({
  initial,
  current: initial
});
const getInitialState = () => ({
  initial: null,
  current: null
});
const getOptions = withDefaults({
  disabled: false,
  onChange: noop,
  onStart: noop,
  onEnd: noop
});
