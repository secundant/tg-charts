import * as React from 'react';
import style from './Heading.scss';
import { baseClassName } from '../../utils/dom';

const withHeadingClass = baseClassName(style.Heading);
const withTitleClass = baseClassName(style.Title);

export function Heading({ className, ...props }) {
  return <div className={withHeadingClass(className)} {...props} />;
}

export function Title({ className, ...props }) {
  return <h1 className={withTitleClass(className)} {...props} />;
}
