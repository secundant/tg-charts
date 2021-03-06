import * as React from 'react';
import { LinePath, SVG } from '../svg';

export const Chart = React.memo(({ offset, height, width, visible = width, dataSets }) => {
  return (
    <SVG width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {dataSets.map(({ color, data, key }) => (
        <LinePath
          chunks={data}
          width={width}
          height={height}
          offset={offset}
          visible={visible}
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
});

Chart.displayName = `memo(Chart)`;
Chart.defaultProps = {
  offset: 0
};
