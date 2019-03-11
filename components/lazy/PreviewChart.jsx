import * as React from 'react';
import { useResizeState } from '../../hooks';
import { Chart } from '../Chart';

export default function PreviewChart({ dataSets, height }) {
  const width = useResizeState(() => document.body.offsetWidth);

  return (
    <Chart width={width} height={height} dataSets={dataSets} offset={0} visibleWidth={width}/>
  );
}
