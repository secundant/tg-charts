import * as React from 'react';
import { useMemo } from 'react';

export function LinePath({ chunks, height, width, offset, pathProps, visible }) {
  const skipAfter = offset + visible;
  const firstChunkIndex = Math.max(chunks.findIndex(({ x }) => x > offset) - 1, 0);
  const lastChunkIndex =
    skipAfter >= 100 ? chunks.length - 1 : Math.min(chunks.findIndex(({ x }) => x >= skipAfter), chunks.length - 1);
  const getValue = useMemo(() => (value, isHeight) => (value * (isHeight ? height : width)) / 100, [
    width,
    height
  ]);
  const relativeWidth = chunks[lastChunkIndex].x - chunks[firstChunkIndex].x;
  const absoluteWidth = (width / (relativeWidth / 100)) / 100;
  const offsetWidth = offset * absoluteWidth;

  let index = 0;
  let value = [`M${offsetWidth - getValue(chunks[firstChunkIndex].x, false)} ${getValue(chunks[firstChunkIndex].y, true)}`];

  for (const { x, y } of chunks) {
    if (index <= firstChunkIndex) {
      index++;
      continue;
    }
    if (index > lastChunkIndex) break;
    value.push(`L ${(x * absoluteWidth) - offsetWidth} ${getValue(y, true)}`);
    index++;
  }

  console.log('[LinePath]:', {
    firstChunkIndex,
    lastChunkIndex,
    absoluteWidth,
    relativeWidth,
    skipAfter,
    offsetWidth,
    chunks,
    value,
    width,
    border: [offset, skipAfter]
  });
  return <path d={value.join(' ')} fill="transparent" {...pathProps} />;
}
