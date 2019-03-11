import * as React from 'react';
import { LinePath, SVG } from '../svg';

export function Chart({ offset, height, width, visibleWidth = width, dataSets }) {
  return (
    <SVG width={width} height={height} viewBox={`${offset} 0 ${visibleWidth} ${height}`}>
      {dataSets.map(({ color, data, key }) => (
        <LinePath
          chunks={data}
          width={width}
          height={height}
          offset={offset}
          visibleWidth={visibleWidth}
          key={key}
          pathProps={{
            stroke: color,
            strokeWidth: 2
            // TODO remove ts/fix types
          }}
        />
      ))}
    </SVG>
  );
}

Chart.defaultProps = {
  offset: 0
};
