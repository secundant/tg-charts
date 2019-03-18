import { el } from '../utils/dom/createElement';
import style from '../components/Button/Button.scss';
import rootStyle from '../vanilla/style.scss';

export function createButtonsGroupElement() {
  return el('div', {
    class: rootStyle.ButtonsGroup
  });
}

/**
 * @param {DataSet} dataSet
 */
export function createButton(dataSet) {
  const { color, title } = dataSet;

  const label = el('div', {
    class: style.Label
  });
  const element = el(
    'button',
    {
      class: `${style.Button} ${style.checked}`
    },
    [
      el(
        'div',
        {
          class: style.Status,
          style: `background-color: ${color}`
        },
        [
          el('div', {
            class: style.Circle
          }),
          el('div', {
            class: style.Check
          })
        ]
      ),
      label
    ]
  );

  label.textContent = title;
  dataSet.subscribe(() => element.classList[!dataSet.disabled ? 'add' : 'remove'](style.checked));
  element.addEventListener('click', () => dataSet.set(!dataSet.disabled), false);
  return element;
}
