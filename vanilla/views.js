import style from '../components/Button/Button.scss';
import rootStyle from './style.scss';
import { el } from '../utils/dom/createElement';

export function createButtonsGroup(children) {
  return el(
    'div',
    {
      class: `${style.Group} ${rootStyle.ButtonsGroup}`
    },
    ...children
  );
}

export function createButton({ color, title }) {
  const label = el('div', {
    class: style.Label
  });
  const element = el(
    'button',
    {
      class: style.Button
    },
    el(
      'div',
      {
        class: style.Status,
        style: `background-color: ${color}`
      },
      el('div', {
        class: style.Circle
      }),
      el('div', {
        class: style.Check
      })
    ),
    label
  );

  label.textContent = title;

  return {
    element,
    setChecked: value => element.classList[value ? 'add' : 'remove'](style.checked)
  };
}
