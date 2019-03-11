import { useState } from 'react';
import { useResize } from './useResize';

export function useResizeState(next) {
  const [state, setState] = useState(next());

  useResize(() => setState(next()));
  return state;
}
