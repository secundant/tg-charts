import * as React from 'react';
import styles from './Page.scss';
import { baseClassName } from '../../../utils/dom';

const withRootClass = baseClassName(styles.Root);

export const Page = React.memo(({ className, ...props }) => {
  return (
    <div className={withRootClass(className)} {...props} />
  );
});
