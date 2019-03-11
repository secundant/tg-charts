import * as React from 'react';
import { Chart, ChartProps } from '~/components';
import { useResizeState } from '~/hooks';

export default function PreviewChart({ dataSets, height }: PreviewChartProps) {
  const width = useResizeState(() => document.body.offsetWidth);

  return (
    <Chart width={width} height={height} dataSets={dataSets} offset={0} visibleWidth={width}/>
  );
}

export interface PreviewChartProps extends Pick<ChartProps, 'dataSets' | 'height'> {
}
