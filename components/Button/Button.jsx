import * as React from 'react';
import style from './Button.scss';
import { baseClassName } from '../../utils/dom';

const withButtonClass = baseClassName(style.Button);
const withGroupClass = baseClassName(style.Group);

export function Button({ className, children, statusColor, checked, ...props }) {
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

export function ButtonsGroup({ className, ...props }) {
  return <div className={withGroupClass(className)} {...props} />;
}

Button.defaultProps = {
  statusColor: '#ddd'
};
