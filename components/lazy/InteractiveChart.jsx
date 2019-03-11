import * as React from 'react';
import { useResizeState } from '../../hooks';
import { Chart } from '../Chart';

export default function InteractiveChart({ dataSets, height, offset, visible }) {
  const documentWidth = useResizeState(() => document.body.offsetWidth);

  return (
    <Chart width={documentWidth} height={height} dataSets={dataSets} offset={offset} visible={visible}/>
  );
}
