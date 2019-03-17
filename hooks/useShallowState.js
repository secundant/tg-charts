import { useState } from 'react';

export function useShallowState(initialValue) {
  const [state, setState] = useState(initialValue);

  return [
    state,
    override => setState({
      ...state,
      ...override
    })
  ];
}
