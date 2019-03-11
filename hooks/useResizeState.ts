import { F0 } from '~/types';
import { useState } from 'react';
import { useResize } from '~/hooks';

export function useResizeState<T>(next: F0<T>) {
  const [state, setState] = useState(next());

  useResize(() => setState(next()));
  return state;
}
