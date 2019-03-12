import * as React from 'react';
import { useResizeState } from '../../hooks';
import { Chart } from '../Chart';
import { PositionControl } from '../PositionControl/PositionControl';

export default function PreviewChart({ dataSets, height, offset, visible, onChange }) {
  const width = useResizeState(() => document.body.offsetWidth);

  return (
    <>
      <Chart width={width} height={height} dataSets={dataSets} offset={0} visible={100}/>
      <PositionControl
        width={width}
        offset={offset}
        visible={visible}
        onChange={onChange}
      />
    </>
  );
}
