import * as React from 'react';
import styles from './Page.scss';
import { Props } from '~/types';
import { baseClassName } from '~/utils';

const withRootClass = baseClassName(styles.Root);

export const Page = React.memo(({ className, ...props }: Props<'div'>) => {
  return (
    <div className={withRootClass(className)} {...props} />
  );
});
