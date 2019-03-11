import * as React from 'react';
import style from './Heading.scss';
import { Props } from '~/types';
import { baseClassName } from '~/utils';

const withHeadingClass = baseClassName(style.Heading);
const withTitleClass = baseClassName(style.Title);

export function Heading({ className, ...props }: Props<'div'>) {
  return <div className={withHeadingClass(className)} {...props} />;
}

export function Title({ className, ...props }: Props<'h1'>) {
  return <h1 className={withTitleClass(className)} {...props} />;
}
