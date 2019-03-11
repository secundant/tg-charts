import * as React from 'react';
import { useMemo } from 'react';

export function LinePath({ chunks, height, width, offset, pathProps, visibleWidth }) {
  const skipBefore = (100 * (width - offset)) / width;
  const skipAfter = skipBefore + (100 * visibleWidth) / width;
  const firstChunkIndex = Math.max(chunks.findIndex(({ x }) => x > skipBefore) - 1, 0);
  const lastChunkIndex =
    skipAfter >= 100 ? chunks.length - 1 : Math.min(chunks.findIndex(({ x }) => x >= skipAfter), chunks.length - 1);
  const getValue = useMemo(() => (value, isHeight) => (value * (isHeight ? height : width)) / 100, [
    width,
    height
  ]);

  let index = 0;
  let value = [`M${getValue(chunks[firstChunkIndex].x, false)} ${getValue(chunks[firstChunkIndex].y, true)}`];

  for (const { x, y } of chunks) {
    if (index <= firstChunkIndex) {
      index++;
      continue;
    }
    if (index > lastChunkIndex) break;
    value.push(`L ${getValue(x)} ${getValue(y, true)}`);
    index++;
  }

  return <path d={value.join(' ')} fill="transparent" {...pathProps} />;
}
