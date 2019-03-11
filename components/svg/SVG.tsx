import * as React from 'react';
import { SVGAttributes } from 'react';

export function SVG(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg {...props} />
  )
}

SVG.defaultProps = {
  width: 200,
  height: 200,
  baseProfile: 'full',
  version: '1.1',
  xmlns: 'http://www.w3.org/2000/svg'
};
