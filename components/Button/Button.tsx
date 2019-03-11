import * as React from 'react';
import style from './Button.scss';
import { Props } from '~/types';
import { baseClassName } from '~/utils';

const withButtonClass = baseClassName(style.Button);
const withGroupClass = baseClassName(style.Group);

export function Button({ className, children, statusColor, checked, ...props }: ButtonProps) {
  return (
    <button className={withButtonClass(className, checked && style.checked)} {...props}>
      <div className={style.Status} style={{
        backgroundColor: statusColor
      }}>
        <div className={style.Circle}/>
        <div className={style.Check}/>
      </div>
      <div className={style.Label}>
        {children}
      </div>
    </button>
  )
}

export function ButtonsGroup({ className, ...props }: Props<'div'>) {
  return <div className={withGroupClass(className)} {...props} />;
}

Button.defaultProps = {
  statusColor: '#ddd'
};

export interface ButtonProps extends Props<'button'> {
  statusColor?: string;
  checked?: boolean;
}
