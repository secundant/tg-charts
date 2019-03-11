import * as React from 'react';
import { LinePath, LinePathChunk, SVG } from '~/components';

export function Chart({ offset, height, width, visibleWidth = width, dataSets }: ChartProps) {
  return (
    <SVG width={width} height={height} viewBox={`${offset} 0 ${visibleWidth} ${height}`}>
      {dataSets.map(({ color, data, key }) => (
        <LinePath
          chunks={data}
          width={width}
          height={height}
          offset={offset!}
          visibleWidth={visibleWidth}
          key={key}
          pathProps={{
            stroke: color,
            strokeWidth: 2
          }}
        />
      ))}
    </SVG>
  );
}

Chart.defaultProps = {
  offset: 0
} as Partial<ChartProps>;

export interface ChartProps {
  width: number;
  height: number;
  visibleWidth?: number;
  offset?: number;
  dataSets: ChartDataSet[];
}

export interface ChartDataSet {
  key: string;
  data: LinePathChunk[];
  color: string;
}
