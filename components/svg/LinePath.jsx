import React, { useMemo, useRef } from 'react';

/*
  width - ширина svg элемента
  visible - ширина (0-100)
 */
export const LinePath = React.memo(({ chunks, height, width, offset, pathProps, visible }) => {
  const n = performance.now();
  const scaleWidthRatio = 1 / (visible / 100);
  const scaledWidth = width * scaleWidthRatio;
  const offsetWidth = scaledWidth * offset / 100;

  const skipAfter = offset + visible;
  const firstChunkIndex = Math.max(chunks.findIndex(({ x }) => x > offset) - 1, 0);
  const lastChunkIndex =
    skipAfter >= 100 ? chunks.length - 1 : Math.min(chunks.findIndex(({ x }) => x >= skipAfter), chunks.length - 1);

  const _x = v => Math.round(scaledWidth * v / 100);
  const _y = v => Math.round(height * v / 100);

  const absoluteSkewX = _x(chunks[firstChunkIndex].x) - offsetWidth;

  let index = 0;
  let value = [`M${absoluteSkewX} ${_y(chunks[firstChunkIndex].y)}`];

  for (const { x, y } of chunks) {
    if (index <= firstChunkIndex) {
      index++;
      continue;
    }
    if (index > lastChunkIndex) break;
    value.push(`L ${_x(x) - offsetWidth} ${_y(y)}`);
    index++;
  }
  const path = useRef(null);
  const nextD = value.join(' ');
  const initialD = useMemo(() => nextD, [width, chunks]);

  if (path.current) {
    path.current.setAttribute('d', nextD);
  }
  /*console.log('[LinePath]:', {
    firstChunkIndex,
    lastChunkIndex,
    scaledWidth,
    scaleWidthRatio,
    skipAfter,
    offsetWidth,
    visible,
    chunks,
    value,
    width,
    border: [offset, skipAfter],
    firstElementX: _x(chunks[firstChunkIndex].x)
  });*/
  console.log('path:', performance.now() - n);
  return <path ref={path} d={initialD} fill="transparent" {...pathProps} />;
});

LinePath.displayName = `memo(LinePath)`;
